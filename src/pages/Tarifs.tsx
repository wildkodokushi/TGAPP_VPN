import { useEffect, useMemo, useRef, useState } from 'react';
import { BsCreditCard, BsCurrencyBitcoin, BsQrCode, BsStars } from 'react-icons/bs';
import {
  activateSubscription,
  checkCryptoInvoice,
  createCryptoInvoice,
  getCachedPlans,
  getCachedUserStatus,
  readCachedPlans,
  createPlategaPayment,
  createStarsInvoice,
  type PlanCode,
  type PlansResponse,
} from '../lib/api';
import { getTelegramProfile } from '../lib/telegram';

type TariffOption = {
  plan: PlanCode;
  days: number;
  prices: Record<string, number>;
};

type PendingCryptoPayment = {
  invoiceId: number;
  tgChatId: number;
  plan: PlanCode;
  devices: number;
  createdAt: number;
};

const PLAN_PERIOD_LABEL: Record<PlanCode, string> = {
  '1m': '1 месяц',
  '3m': '3 месяца',
  '6m': '6 месяцев',
  '1y': '12 месяцев',
};

const PLAN_MONTHS: Record<PlanCode, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
};

const PENDING_PAYMENT_KEY = 'pending-platega-payment';
const PENDING_CRYPTO_PAYMENT_KEY = 'pending-crypto-payment';
const CRYPTO_POLL_INTERVAL_MS = 6_000;
const CRYPTO_POLL_TIMEOUT_MS = 5 * 60_000;
const PLANS_CACHE_AGE_MS = 12 * 60 * 60 * 1000;

const buildPrices = (basePrice: number): Record<string, number> => ({
  '3': basePrice,
  '4': basePrice + 50,
  '5': basePrice + 100,
  '6': basePrice + 150,
  '7': basePrice + 200,
});

const DEFAULT_TARIFFS: TariffOption[] = [
  { plan: '1m', days: 30, prices: buildPrices(99) },
  { plan: '3m', days: 90, prices: buildPrices(269) },
  { plan: '6m', days: 180, prices: buildPrices(516) },
  { plan: '1y', days: 365, prices: buildPrices(999) },
];

function sortTariffs(plans: PlansResponse['plans']): TariffOption[] {
  return [...plans].sort((a, b) => PLAN_MONTHS[a.plan] - PLAN_MONTHS[b.plan]);
}

function getDefaultSelectedTariff(options: TariffOption[]): TariffOption | null {
  return options[1] || options[0] || null;
}

export default function TariffsPage() {
  const cachedPlans = readCachedPlans(PLANS_CACHE_AGE_MS);
  const initialTariffs = cachedPlans?.plans?.length ? sortTariffs(cachedPlans.plans) : DEFAULT_TARIFFS;

  const [selectedDevices, setSelectedDevices] = useState(3);
  const paymentMethods = [
    { id: 'qr', label: 'СБП', icon: BsQrCode },
    { id: 'card', label: 'Карта', icon: BsCreditCard },
    { id: 'stars', label: 'Telegram Stars', icon: BsStars },
    { id: 'cryptobot', label: 'CryptoBot', icon: BsCurrencyBitcoin },
  ] as const;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[number]['id']>('qr');
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [tariffs, setTariffs] = useState<TariffOption[]>(initialTariffs);
  const [selectedTariff, setSelectedTariff] = useState<TariffOption | null>(getDefaultSelectedTariff(initialTariffs));
  const [isLoading, setIsLoading] = useState(!cachedPlans?.plans?.length);
  const [isPaying, setIsPaying] = useState(false);
  const cryptoPollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await getCachedPlans({
          maxAgeMs: PLANS_CACHE_AGE_MS,
          allowStaleOnError: true,
        });
        const sorted = sortTariffs(response.plans);
        if (!sorted.length) {
          throw new Error('Plans list is empty');
        }
        setTariffs(sorted);
        setSelectedTariff((prev) => {
          if (!prev) {
            return getDefaultSelectedTariff(sorted);
          }
          return sorted.find((option) => option.plan === prev.plan) || getDefaultSelectedTariff(sorted);
        });
      } catch (err) {
        console.error('Failed to load plans:', err);
        setTariffs(DEFAULT_TARIFFS);
        setSelectedTariff((prev) => {
          if (!prev) {
            return getDefaultSelectedTariff(DEFAULT_TARIFFS);
          }
          return DEFAULT_TARIFFS.find((option) => option.plan === prev.plan) || getDefaultSelectedTariff(DEFAULT_TARIFFS);
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadPlans();

    return () => {
      if (cryptoPollTimerRef.current) {
        window.clearInterval(cryptoPollTimerRef.current);
      }
    };
  }, []);

  const totalPrice = useMemo(() => {
    if (!selectedTariff) {
      return 0;
    }
    return selectedTariff.prices[String(selectedDevices)] ?? 0;
  }, [selectedTariff, selectedDevices]);

  const selectedPaymentLabel = paymentMethods.find((method) => method.id === selectedPaymentMethod)?.label ?? 'метод';

  const openExternalLink = (url: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const startCryptoPolling = (pending: PendingCryptoPayment) => {
    if (cryptoPollTimerRef.current) {
      window.clearInterval(cryptoPollTimerRef.current);
    }

    const startedAt = Date.now();
    cryptoPollTimerRef.current = window.setInterval(() => {
      void (async () => {
        if (Date.now() - startedAt > CRYPTO_POLL_TIMEOUT_MS) {
          if (cryptoPollTimerRef.current) {
            window.clearInterval(cryptoPollTimerRef.current);
            cryptoPollTimerRef.current = null;
          }
          localStorage.removeItem(PENDING_CRYPTO_PAYMENT_KEY);
          return;
        }

        try {
          const status = await checkCryptoInvoice({
            invoice_id: pending.invoiceId,
            tg_chat_id: pending.tgChatId,
            plan: pending.plan,
            devices: pending.devices,
          });

          if (!status.paid) {
            return;
          }

          await activateSubscription({
            tg_chat_id: pending.tgChatId,
            plan: pending.plan,
            max_devices: pending.devices,
            payment_id: `crypto_${pending.invoiceId}`,
            payment_method: 'crypto-webapp',
          });

          localStorage.setItem(
            PENDING_PAYMENT_KEY,
            JSON.stringify({
              tgChatId: pending.tgChatId,
              createdAt: Date.now(),
            }),
          );
          localStorage.removeItem(PENDING_CRYPTO_PAYMENT_KEY);

          if (cryptoPollTimerRef.current) {
            window.clearInterval(cryptoPollTimerRef.current);
            cryptoPollTimerRef.current = null;
          }

          window.alert('Оплата получена. Подписка активирована.');
        } catch (err) {
          console.error('Failed to process crypto payment:', err);
        }
      })();
    }, CRYPTO_POLL_INTERVAL_MS);
  };

  useEffect(() => {
    const rawPending = localStorage.getItem(PENDING_CRYPTO_PAYMENT_KEY);
    if (!rawPending) {
      return;
    }

    try {
      const pending = JSON.parse(rawPending) as PendingCryptoPayment;
      if (!pending.invoiceId || !pending.tgChatId) {
        localStorage.removeItem(PENDING_CRYPTO_PAYMENT_KEY);
        return;
      }
      startCryptoPolling(pending);
    } catch {
      localStorage.removeItem(PENDING_CRYPTO_PAYMENT_KEY);
    }
  }, []);

  const handlePayment = async () => {
    if (!selectedTariff) {
      return;
    }

    const profile = getTelegramProfile();
    const tgId = profile.userId ?? profile.chatId;
    if (tgId === null) {
      window.alert('Не удалось получить Telegram ID. Откройте приложение через Telegram.');
      return;
    }

    setIsPaying(true);
    try {
      await getCachedUserStatus(tgId, profile.username, {
        maxAgeMs: 60_000,
        allowStaleOnError: true,
      });

      if (selectedPaymentMethod === 'qr' || selectedPaymentMethod === 'card') {
        const method = selectedPaymentMethod === 'qr' ? 'sbp' : 'card';
        const payment = await createPlategaPayment({
          tg_chat_id: tgId,
          plan: selectedTariff.plan,
          devices: selectedDevices,
          method,
        });

        const redirectUrl = payment.redirect || payment.redirectUrl || payment.paymentUrl || payment.url || payment.link;
        if (!redirectUrl) {
          throw new Error('Payment redirect is missing');
        }

        localStorage.setItem(
          PENDING_PAYMENT_KEY,
          JSON.stringify({
            tgChatId: tgId,
            createdAt: Date.now(),
          }),
        );

        openExternalLink(redirectUrl);
        return;
      }

      if (selectedPaymentMethod === 'stars') {
        const invoice = await createStarsInvoice({
          tg_chat_id: tgId,
          plan: selectedTariff.plan,
          devices: selectedDevices,
        });

        if (window.Telegram?.WebApp?.openInvoice) {
          window.Telegram.WebApp.openInvoice(invoice.invoice_link, (status) => {
            if (status !== 'paid') {
              return;
            }

            void (async () => {
              try {
                await activateSubscription({
                  tg_chat_id: tgId,
                  plan: selectedTariff.plan,
                  max_devices: selectedDevices,
                  payment_id: invoice.payment_id,
                  payment_method: 'stars-webapp',
                });

                localStorage.setItem(
                  PENDING_PAYMENT_KEY,
                  JSON.stringify({
                    tgChatId: tgId,
                    createdAt: Date.now(),
                  }),
                );

                window.alert('Оплата Stars подтверждена. Подписка активирована.');
              } catch (err) {
                console.error('Failed to activate stars subscription:', err);
                window.alert('Оплата прошла, но активация не завершилась. Откройте главную через пару секунд.');
              }
            })();
          });
        } else {
          openExternalLink(invoice.invoice_link);
          window.alert('Откройте счет в Telegram и завершите оплату Stars.');
        }
        return;
      }

      const crypto = await createCryptoInvoice({
        tg_chat_id: tgId,
        plan: selectedTariff.plan,
        devices: selectedDevices,
      });

      const pending: PendingCryptoPayment = {
        invoiceId: crypto.invoice_id,
        tgChatId: tgId,
        plan: selectedTariff.plan,
        devices: selectedDevices,
        createdAt: Date.now(),
      };

      localStorage.setItem(PENDING_CRYPTO_PAYMENT_KEY, JSON.stringify(pending));
      openExternalLink(crypto.pay_url);
      startCryptoPolling(pending);
    } catch (err) {
      console.error('Failed to create payment:', err);
      const message = err instanceof Error ? err.message : 'unknown error';
      window.alert(`Не удалось создать платеж: ${message}`);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div>
      <div className='my-[15px]'>
        <h2 className='text-cm font-bold text-white acony-font text-center'>
          PSYCHOWARE VPN
        </h2>

        <div className='theme-card w-[354px] mt-[20px] border-2 rounded-[16px] p-[20px_15px]'>
          {!isPaymentStep ? (
            <>
              <div className='space-y-2'>
                {isLoading ? (
                  <div className='text-white/70 bounded-font text-[13px] p-[14px]'>Загрузка тарифов...</div>
                ) : (
                  tariffs.map((tariff) => {
                    const currentPrice = tariff.prices[String(selectedDevices)] ?? 0;
                    const months = PLAN_MONTHS[tariff.plan] || 1;
                    const monthlyPrice = Math.round(currentPrice / months);
                    return (
                      <div
                        key={tariff.plan}
                        onClick={() => setSelectedTariff(tariff)}
                        className={`px-[20px] border border-white/20 rounded-[30px] tarif-1 crown flex justify-between items-center h-[60px] cursor-pointer transition tarif ${selectedTariff?.plan === tariff.plan ? 'active' : ''}`}
                      >
                        <div className='bounded-font font-light flex flex-col justify-center'>
                          <span className='text-white text-[13px]'>{PLAN_PERIOD_LABEL[tariff.plan]}</span>
                          <span className='text-[10px] text-white/50'>{monthlyPrice}₽ в месяц</span>
                        </div>
                        <span className='text-[14px] bounded-font text-white font-light text-center'>
                          {currentPrice}
                          <span className='text-[12px]'>₽</span>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className='mt-[25px]'>
                <div className='flex flex-col items-center text-center bounded-font font-light'>
                  <p className='text-white text-sm'>Количество устройств</p>
                  <p className='text-white/50 text-[12px] mt-[5px]'>+50₽ / 1 шт.</p>
                </div>
                <div className='mt-[15px] bounded-font flex flex-col items-center'>
                  <input
                    type='range'
                    min='3'
                    max='7'
                    step='1'
                    value={selectedDevices}
                    onChange={(e) => setSelectedDevices(Number(e.target.value))}
                    className='w-full max-w-[300px]'
                  />

                  <div className='flex justify-between px-[5px] w-full max-w-[300px] mt-2 text-white/70 text-sm'>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                  </div>

                  <div className='text-white text-lg mt-2'>
                    Выбрано:
                    <span className='theme-accent font-bold'> {selectedDevices}</span>
                  </div>
                </div>
              </div>

              <div className='mt-[25px]'>
                <div className='flex items-center gap-[10px]'>
                  <div className='bounded-font text-white flex flex-col'>
                    <span className='text-sm'>Итого:</span>
                    <span className='font-bold text-[20px]'>{totalPrice}₽</span>
                  </div>
                  <button
                    type='button'
                    onClick={() => setIsPaymentStep(true)}
                    className='theme-primary-btn text[16px] bounded-font w-[100%] flex justify-center items-center h-[47px] rounded-[30px] cursor-pointer'
                  >
                    К способу оплаты
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className='mt-[8px] space-y-[10px]'>
              <div className='theme-soft border border-white/20 rounded-[20px] p-[12px] bounded-font text-[12px] text-white/90 flex justify-between items-center'>
                <span>{selectedTariff ? PLAN_PERIOD_LABEL[selectedTariff.plan] : '-'}</span>
                <span>{selectedDevices} устройств</span>
                <span>{totalPrice}₽</span>
              </div>
              <div className='flex flex-col items-center text-center bounded-font font-light'>
                <p className='text-white text-sm'>Выберите способ оплаты</p>
              </div>
              <div className='grid grid-cols-2 gap-[8px]'>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type='button'
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`h-[42px] rounded-[22px] border border-white/20 bounded-font text-[12px] text-white cursor-pointer transition ${selectedPaymentMethod === method.id ? 'active' : 'theme-soft'} inline-flex items-center justify-center gap-[6px]`}
                  >
                    <method.icon size={14} />
                    {method.label}
                  </button>
                ))}
              </div>
              <button
                type='button'
                onClick={handlePayment}
                disabled={isPaying || !selectedTariff}
                className='theme-primary-btn text[16px] bounded-font w-[100%] flex justify-center items-center h-[47px] rounded-[30px] cursor-pointer disabled:opacity-60'
              >
                {isPaying ? 'Создаем платеж...' : `Оплатить через ${selectedPaymentLabel}`}
              </button>
              <button
                type='button'
                onClick={() => setIsPaymentStep(false)}
                className='w-full h-[40px] rounded-[24px] border border-white/20 bounded-font text-[12px] text-white/80 cursor-pointer theme-soft'
              >
                Назад к тарифам
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
