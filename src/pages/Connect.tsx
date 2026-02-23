import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCachedUserStatus, readCachedUserStatus, type UserStatus } from '../lib/api';
import { getTelegramProfile } from '../lib/telegram';

type AppLink = {
  id: string;
  label: string;
  build: (subUrl: string) => string;
};

const SUBS_LINK_GATE = 'https://subs.psychoware.ru/url?url=';
const USER_STATUS_CACHE_AGE_MS = 60_000;

const APP_LINKS: AppLink[] = [
  {
    id: 'happ-mobile',
    label: 'Happ (iOS/Android)',
    build: (subUrl) => `${SUBS_LINK_GATE}happ://add/${subUrl}`,
  },
  {
    id: 'happ-desktop',
    label: 'Happ (Windows/Mac)',
    build: (subUrl) => `${SUBS_LINK_GATE}happ://add/${subUrl}`,
  },
  {
    id: 'v2raytun',
    label: 'v2rayTun (iOS/Android/PC)',
    build: (subUrl) => `${SUBS_LINK_GATE}v2raytun://import/${subUrl}`,
  },
  {
    id: 'v2rayn',
    label: 'v2rayN (Windows)',
    build: (subUrl) => `${SUBS_LINK_GATE}v2rayn://install-sub?url=${subUrl}`,
  },
];

function getActiveSubUrl(user: UserStatus | null): string | null {
  if (!user?.subscription) {
    return null;
  }
  return user.sub_url || null;
}

export default function ConnectPage() {
  const navigate = useNavigate();
  const profile = getTelegramProfile();
  const tgId = profile.userId ?? profile.chatId;
  const cachedUser = tgId !== null ? readCachedUserStatus(tgId, USER_STATUS_CACHE_AGE_MS) : null;
  const initialSubUrl = getActiveSubUrl(cachedUser);

  const [isLoading, setIsLoading] = useState(tgId !== null && !cachedUser);
  const [subUrl, setSubUrl] = useState<string | null>(initialSubUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    if (tgId === null) {
      setError('Не удалось получить Telegram ID');
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        const user = await getCachedUserStatus(tgId, profile.username, {
          maxAgeMs: USER_STATUS_CACHE_AGE_MS,
          allowStaleOnError: true,
        });
        setSubUrl(getActiveSubUrl(user));
        setError(null);
      } catch (err) {
        console.error('Failed to load sub url:', err);
        const message = err instanceof Error ? err.message : 'unknown error';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [profile.username, tgId]);

  useEffect(() => {
    const backButton = window.Telegram?.WebApp?.BackButton;
    if (!backButton) {
      return;
    }

    const handleBack = () => navigate('/');
    backButton.show();
    backButton.onClick?.(handleBack);

    return () => {
      backButton.offClick?.(handleBack);
      backButton.hide();
    };
  }, [navigate]);

  const links = useMemo(
    () => (subUrl ? APP_LINKS.map((item) => ({ ...item, url: item.build(subUrl) })) : []),
    [subUrl],
  );

  const openLink = (url: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <div className='my-[15px]'>
        <h2 className='text-cm font-bold text-white acony-font text-center'>PSYCHOWARE VPN</h2>

        <div className='theme-card w-[354px] mt-[20px] border-2 rounded-[16px] p-[20px_15px]'>
          <h3 className='bounded-font text-white text-[17px] font-semibold text-center'>Подключиться</h3>

          {isLoading ? (
            <div className='mt-[16px] text-white/70 bounded-font text-[13px] text-center'>Загрузка данных...</div>
          ) : null}

          {!isLoading && error ? (
            <div className='mt-[16px] text-red-300 bounded-font text-[12px] text-center'>Ошибка API: {error}</div>
          ) : null}

          {!isLoading && !error && !subUrl ? (
            <div className='mt-[16px]'>
              <p className='text-white/80 bounded-font text-[13px] text-center'>У вас нет активной подписки</p>
              <button
                type='button'
                onClick={() => navigate('/tariffs')}
                className='mt-[14px] theme-primary-btn bounded-font w-full h-[47px] rounded-[30px] cursor-pointer'
              >
                Купить подписку
              </button>
            </div>
          ) : null}

          {!isLoading && !error && subUrl ? (
            <div className='mt-[16px] grid grid-cols-1 gap-[10px]'>
              {links.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => openLink(item.url)}
                  className='theme-soft border border-white/20 bounded-font text-white text-[13px] w-full h-[44px] rounded-[24px] cursor-pointer'
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          <button
            type='button'
            onClick={() => navigate('/')}
            className='mt-[16px] w-full h-[40px] rounded-[24px] border border-white/20 bounded-font text-[12px] text-white/80 cursor-pointer theme-soft'
          >
            Назад на главную
          </button>
        </div>
      </div>
    </div>
  );
}
