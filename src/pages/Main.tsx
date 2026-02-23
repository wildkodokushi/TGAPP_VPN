import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCachedUserStatus, readCachedUserStatus, type UserStatus } from '../lib/api';
import { getTelegramProfile } from '../lib/telegram';

const PENDING_PAYMENT_KEY = 'pending-platega-payment';
const PAYMENT_POLL_TIMEOUT_MS = 60_000;
const PAYMENT_POLL_INTERVAL_MS = 5_000;
const USER_STATUS_CACHE_AGE_MS = 60_000;

type SubscriptionView = {
  label: string;
  until: string;
  devices: string;
  isActive: boolean;
};

function buildSubscriptionView(user: UserStatus | null): SubscriptionView {
  if (user?.subscription) {
    const expiresDate = new Date(user.subscription.expires_at);
    return {
      label: 'активна',
      until: `до ${expiresDate.toLocaleDateString('ru-RU')}`,
      devices: `${user.subscription.max_devices} устройств`,
      isActive: true,
    };
  }

  return {
    label: 'не активна',
    until: 'нет подписки',
    devices: '0 устройств',
    isActive: false,
  };
}

export default function MainPage() {
  const navigate = useNavigate();
  const profile = getTelegramProfile();
  const tgChatId = profile.userId ?? profile.chatId;
  const cachedUser = tgChatId !== null ? readCachedUserStatus(tgChatId, USER_STATUS_CACHE_AGE_MS) : null;
  const initialSubscription = buildSubscriptionView(cachedUser);

  const [copiedId, setCopiedId] = useState(false);
  const [chatId, setChatId] = useState<string>(tgChatId !== null ? String(tgChatId) : '-');
  const [subscriptionLabel, setSubscriptionLabel] = useState<string>(initialSubscription.label);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [subscriptionMeta, setSubscriptionMeta] = useState<{ until: string; devices: string }>({
    until: initialSubscription.until,
    devices: initialSubscription.devices,
  });
  const idTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  useEffect(() => {
    if (tgChatId === null) {
      return;
    }

    setChatId(String(tgChatId));
    let paymentPollTimer: number | null = null;

    const applyUserStatus = async (forceRefresh = false) => {
      try {
        const user = await getCachedUserStatus(tgChatId, profile.username, {
          maxAgeMs: USER_STATUS_CACHE_AGE_MS,
          forceRefresh,
          allowStaleOnError: true,
        });
        const next = buildSubscriptionView(user);
        setSubscriptionLabel(next.label);
        setSubscriptionMeta({
          until: next.until,
          devices: next.devices,
        });
        setStatusError(null);
        return next.isActive;
      } catch (err) {
        console.error('Failed to load user status:', err);
        const message = err instanceof Error ? err.message : 'unknown error';
        setStatusError(message);
        return false;
      }
    };

    const pollPaymentStatusIfNeeded = () => {
      const raw = localStorage.getItem(PENDING_PAYMENT_KEY);
      if (!raw) {
        return;
      }

      try {
        const pending = JSON.parse(raw) as { tgChatId?: number; createdAt?: number };
        if (pending.tgChatId !== tgChatId) {
          localStorage.removeItem(PENDING_PAYMENT_KEY);
          return;
        }

        const createdAt = pending.createdAt ?? 0;
        if (Date.now() - createdAt > PAYMENT_POLL_TIMEOUT_MS) {
          localStorage.removeItem(PENDING_PAYMENT_KEY);
          return;
        }
      } catch {
        localStorage.removeItem(PENDING_PAYMENT_KEY);
        return;
      }

      let elapsed = 0;
      paymentPollTimer = window.setInterval(() => {
        elapsed += PAYMENT_POLL_INTERVAL_MS;
        if (elapsed > PAYMENT_POLL_TIMEOUT_MS) {
          if (paymentPollTimer) {
            window.clearInterval(paymentPollTimer);
            paymentPollTimer = null;
          }
          localStorage.removeItem(PENDING_PAYMENT_KEY);
          return;
        }

        void (async () => {
          const isActive = await applyUserStatus(true);
          if (isActive) {
            if (paymentPollTimer) {
              window.clearInterval(paymentPollTimer);
              paymentPollTimer = null;
            }
            localStorage.removeItem(PENDING_PAYMENT_KEY);
          }
        })();
      }, PAYMENT_POLL_INTERVAL_MS);
    };

    void (async () => {
      await applyUserStatus(false);
      pollPaymentStatusIfNeeded();
    })();

    return () => {
      if (paymentPollTimer) {
        window.clearInterval(paymentPollTimer);
      }
    };
  }, [profile.username, tgChatId]);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const input = document.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyId = async () => {
    if (idTextRef.current) {
      await copyToClipboard(idTextRef.current.textContent || '');
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1500);
    }
  };

  const handleConnectClick = () => {
    navigate('/connect');
  };

  const t = {
    connect: 'Подключиться',
    sub: 'Подписка',
    active: subscriptionLabel,
    news: 'Новости',
    support: 'Поддержка',
  };

  return (
    <div>
      <div>
        <div className='flex flex-col justify-center items-center'>
          <div className='mt-[15px] logo w-[151px] h-[164px]'></div>
          <h1 className='font-bold text-sm text-center text-white acony-font pt-[20px]'>
            PSYCHOWARE VPN
          </h1>
        </div>

        <div className='theme-card border-2 rounded-2xl w-[354px] p-[20px_15px_25px] my-[20px]'>
          <div className='flex flex-col items-center justify-between gap-2'>
            <div className='flex items-center gap-2 text-gray-700'>
              <div className='font-light text-base text-center text-white/70 bounded-font'>
                <span>id: </span>
                <span ref={idTextRef}>{chatId}</span>
              </div>
              <span
                className='cursor-pointer transition-opacity hover:opacity-80'
                id='copyId'
                onClick={handleCopyId}
              >
                {copiedId ? (
                  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M20 6L9 17L4 12' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                ) : (
                  <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M5.08333 5.08333V3.06111C5.08333 2.25222 5.08333 1.84778 5.24078 1.53867C5.37944 1.26639 5.59972 1.04611 5.872 0.907444C6.18111 0.75 6.58556 0.75 7.39444 0.75H11.4389C12.2478 0.75 12.6522 0.75 12.9613 0.907444C13.2331 1.04593 13.4541 1.26689 13.5926 1.53867C13.75 1.84778 13.75 2.25222 13.75 3.06111V7.10556C13.75 7.91444 13.75 8.31889 13.5926 8.628C13.454 8.89972 13.2331 9.12066 12.9613 9.25922C12.6522 9.41667 12.2478 9.41667 11.4411 9.41667H9.41667M5.08333 5.08333H3.06111C2.25222 5.08333 1.84778 5.08333 1.53867 5.24078C1.26686 5.37922 1.04589 5.60019 0.907444 5.872C0.75 6.18111 0.75 6.58556 0.75 7.39444V11.4389C0.75 12.2478 0.75 12.6522 0.907444 12.9613C1.04593 13.2331 1.26689 13.4541 1.53867 13.5926C1.84706 13.75 2.2515 13.75 3.05894 13.75H7.10844C7.91517 13.75 8.31889 13.75 8.628 13.5926C8.89978 13.4541 9.12074 13.2331 9.25922 12.9613C9.41667 12.6522 9.41667 12.2485 9.41667 11.4411V9.41667M5.08333 5.08333H7.10556C7.91444 5.08333 8.31889 5.08333 8.628 5.24078C8.89978 5.37926 9.12074 5.60022 9.25922 5.872C9.41667 6.18039 9.41667 6.58483 9.41667 7.39228V9.41667' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                )}
              </span>
            </div>
            <button onClick={handleConnectClick} className='theme-primary-btn cursor-pointer w-[100%] inline-flex items-center h-[47px] px-5 font-bold bounded-font text-base leading-none rounded-3xl justify-center text-center transition-colors'>
              {t.connect}
            </button>
            {statusError ? (
              <span className='text-[11px] text-red-300 bounded-font'>Ошибка API: {statusError}</span>
            ) : null}
          </div>

          <div className='flex flex-col items-center gap-2 mt-[25px]'>
            <span className='text-xl font-light text-white bounded-font'>
              {t.sub} <span className='text-xl font-light text-white bounded-font'>{t.active}</span>
            </span>
            <div className='theme-soft w-[100%] inline-flex items-center h-[47px] px-5 text-white font-light text-[13px] border border-white/20 rounded-3xl bounded-font justify-between'>
              <span>{subscriptionMeta.until}</span>
              <span>{subscriptionMeta.devices}</span>
            </div>
          </div>

          <div className='flex justify-between items-center mt-[25px]'>
            <a href='https://t.me/psychowarevpn' target='_blank' rel='noopener noreferrer' className='theme-chip font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] rounded-3xl px-[30px]'>
              {t.news}
            </a>
            <a href='https://t.me/psychowaresupportxbot' target='_blank' rel='noopener noreferrer' className='theme-chip font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] rounded-3xl px-[30px]'>
              {t.support}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
