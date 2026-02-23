import { useState } from 'react';
import { BsCreditCard, BsCurrencyBitcoin, BsQrCode, BsStars } from 'react-icons/bs';

export default function TariffsPage() {
  const [selectedDevices, setSelectedDevices] = useState(3);
  const paymentMethods = [
    { id: 'qr', label: 'QR-код', icon: BsQrCode },
    { id: 'card', label: 'Карта', icon: BsCreditCard },
    { id: 'stars', label: 'Telegram Stars', icon: BsStars },
    { id: 'cryptobot', label: 'CryptoBot', icon: BsCurrencyBitcoin },
  ] as const;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[number]['id']>('qr');
  const [isPaymentStep, setIsPaymentStep] = useState(false);

  const tariffs = [
    { period: '1 месяц', monthlyPrice: 99, total: 99 },
    { period: '3 месяца', monthlyPrice: 90, total: 269 },
    { period: '6 месяцев', monthlyPrice: 86, total: 516 },
    { period: '12 месяцев', monthlyPrice: 83, total: 999 },
  ];
  const [selectedTariff, setSelectedTariff] = useState(tariffs[1]);

  const calculateTotal = () => {
    const base = selectedTariff.total;
    const extraDevices = Math.max(0, Math.min(selectedDevices, 7) - 3);
    return base + extraDevices * 50;
  };

  const totalPrice = calculateTotal();
  const selectedPaymentLabel = paymentMethods.find((method) => method.id === selectedPaymentMethod)?.label ?? 'метод';

  const handlePayment = () => {
    const paymentUrl = `https://example.com/pay?tariff=${selectedTariff.period}&devices=${selectedDevices}&method=${selectedPaymentMethod}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(paymentUrl);
    } else {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div>
      <div className='my-[15px]'>
        <h2 className='text-cm font-bold text-white acony-font text-center'>
          PSYCHOWARE VPN
        </h2>

        <div className='theme-card w-[354px] mt-[20px] border-2 rounded-[16px] p-[20px_15px]'>
          <div className='space-y-2'>
            {tariffs.map((tariff) => (
              <div
                key={tariff.period}
                onClick={() => setSelectedTariff(tariff)}
                className={`px-[20px] border border-white/20 rounded-[30px] tarif-1 crown flex justify-between items-center h-[60px] cursor-pointer transition tarif
                ${selectedTariff.period === tariff.period ? 'active' : ''}`}
              >
                <div className='bounded-font font-light flex flex-col justify-center'>
                  <span className='text-white text-[13px]'>{tariff.period}</span>
                  <span className='text-[10px] text-white/50'>{tariff.monthlyPrice}₽ в месяц</span>
                </div>
                <span className='text-[14px] bounded-font text-white font-light text-center'>
                  {tariff.total}
                  <span className='text-[12px]'>₽</span>
                </span>
              </div>
            ))}
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
            {!isPaymentStep ? (
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
            ) : (
              <div className='space-y-[10px]'>
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
                  className='theme-primary-btn text[16px] bounded-font w-[100%] flex justify-center items-center h-[47px] rounded-[30px] cursor-pointer'
                >
                  Оплатить через {selectedPaymentLabel}
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
    </div>
  );
}
