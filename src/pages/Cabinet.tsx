import { useEffect, useRef, useState } from 'react';
import { getCachedUserStatus, readCachedUserStatus, type PlanCode, type UserStatus } from '../lib/api';
import { getTelegramProfile } from '../lib/telegram';

type PurchaseItem = UserStatus['purchases'][number];

const PLAN_LABELS: Record<PlanCode, string> = {
  '1m': '1 месяц',
  '3m': '3 месяца',
  '6m': '6 месяцев',
  '1y': '12 месяцев',
};

const BOT_USERNAME = 'psychowarevpnxbot';
const USER_STATUS_CACHE_AGE_MS = 60_000;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ru-RU');
}

function copyTextFallback(text: string): boolean {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  input.style.left = '-9999px';
  document.body.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);
  const copied = document.execCommand('copy');
  document.body.removeChild(input);
  return copied;
}

export default function CabinetPage() {
  const profile = getTelegramProfile();
  const identityId = profile.userId ?? profile.chatId;
  const cachedUser = identityId !== null ? readCachedUserStatus(identityId, USER_STATUS_CACHE_AGE_MS) : null;

  const initialProfileName = profile.fullName || profile.username || 'Пользователь';
  const initialProfileId = identityId !== null ? String(identityId) : '-';
  const initialReferralLink = identityId !== null
    ? `https://t.me/${BOT_USERNAME}?start=ref_${identityId}`
    : `https://t.me/${BOT_USERNAME}`;

  const [referralsCount, setReferralsCount] = useState(Number(cachedUser?.referrals_count) || 0);
  const [referralDays, setReferralDays] = useState(Number(cachedUser?.bonus_days) || 0);
  const [profileName] = useState<string>(initialProfileName);
  const [profileId] = useState<string>(initialProfileId);
  const [profilePhotoUrl] = useState<string | null>(profile.photoUrl || null);
  const [referralLink] = useState<string>(initialReferralLink);
  const [purchases, setPurchases] = useState<PurchaseItem[]>(cachedUser?.purchases || []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    if (identityId === null) {
      return () => {
        if (copiedTimerRef.current) {
          window.clearTimeout(copiedTimerRef.current);
        }
      };
    }

    const loadUser = async () => {
      try {
        const user = await getCachedUserStatus(identityId, profile.username, {
          maxAgeMs: USER_STATUS_CACHE_AGE_MS,
          allowStaleOnError: true,
        });
        setReferralsCount(Number(user.referrals_count) || 0);
        setReferralDays(Number(user.bonus_days) || 0);
        setPurchases(user.purchases || []);
        setLoadError(null);
      } catch (err) {
        console.error('Failed to load cabinet data:', err);
        const message = err instanceof Error ? err.message : 'unknown error';
        setLoadError(message);
      }
    };

    void loadUser();

    return () => {
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, [identityId, profile.username]);

  const handleCopyReferralLink = async () => {
    setCopyError(null);
    try {
      let copied = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(referralLink);
          copied = true;
        } catch (clipboardErr) {
          console.warn('Clipboard API rejected, using fallback copy:', clipboardErr);
        }
      }

      if (!copied) {
        copied = copyTextFallback(referralLink);
      }

      if (!copied) {
        throw new Error('Clipboard copy command failed');
      }

      setCopiedReferral(true);
      if (copiedTimerRef.current) {
        window.clearTimeout(copiedTimerRef.current);
      }
      copiedTimerRef.current = window.setTimeout(() => {
        setCopiedReferral(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy referral link:', err);
      setCopyError('Не удалось скопировать. Удерживайте ссылку и скопируйте вручную.');
    }
  };

  const avatarLetter = profileName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className='my-[15px]'>
      <div className='w-[354px]'>
        <h2 className='text-cm font-bold text-white acony-font text-center'>
          PSYCHOWARE VPN
        </h2>

        <div className='mt-[20px] w-full flex items-center gap-[20px] h-[85px] border border-white/20 rounded-2xl theme-card theme-soft'>
          <div className='border-2 rounded-full w-[50px] h-[50px] theme-avatar-border ml-[20px] overflow-hidden flex items-center justify-center theme-soft'>
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt='Telegram avatar'
                className='w-full h-full object-cover'
                loading='eager'
                referrerPolicy='no-referrer'
              />
            ) : (
              <span className='text-white/80 text-[18px] font-bold bounded-font'>{avatarLetter}</span>
            )}
          </div>
          <div className='flex flex-col gap-[5px] bounded-font'>
            <span className='text-white text-[14px] font-bold'>{profileName}</span>
            <div className='text-white/30 text-[12px]'>
              <span>ID: </span>
              <span>{profileId}</span>
            </div>
          </div>
        </div>

        <h2 className='font-light text-[18px] text-left my-[10px] text-white bounded-font'>Реферальная статистика</h2>
        {loadError ? (
          <div className='mb-[8px] text-[11px] text-red-300 bounded-font'>Ошибка API: {loadError}</div>
        ) : null}

        <div className='grid grid-cols-2 gap-[10px]'>
          <div className='w-full border border-white/20 rounded-2xl theme-card p-[14px] bounded-font'>
            <div className='text-white/60 text-[11px]'>Рефералы</div>
            <div className='text-white text-[26px] font-bold leading-none mt-[6px]'>{referralsCount}</div>
          </div>
          <div className='w-full border border-white/20 rounded-2xl theme-card p-[14px] bounded-font'>
            <div className='text-white/60 text-[11px]'>Дней получено</div>
            <div className='text-white text-[26px] font-bold leading-none mt-[6px]'>{referralDays}</div>
          </div>
        </div>

        <div className='mt-[10px] w-full border border-white/20 rounded-2xl theme-card p-[14px] bounded-font'>
          <div className='text-white/60 text-[11px]'>Реферальная ссылка</div>
          <div className='mt-[8px] flex items-center justify-between gap-[10px]'>
            <span
              className='block max-w-[250px] text-white/80 text-[12px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap'
              title={referralLink}
            >
              {referralLink}
            </span>
            <button
              onClick={handleCopyReferralLink}
              className='shrink-0 h-[34px] w-[34px] rounded-full border border-white/20 theme-soft flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors'
              aria-label='Скопировать реферальную ссылку'
            >
              {copiedReferral ? (
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M20 6L9 17L4 12' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              ) : (
                <svg width='17' height='17' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M6.41667 6.41667V3.77222C6.41667 2.71444 6.41667 2.18556 6.62256 1.78133C6.80389 1.42528 7.09194 1.13722 7.448 0.955889C7.85222 0.75 8.38111 0.75 9.43889 0.75H14.7278C15.7856 0.75 16.3144 0.75 16.7187 0.955889C17.0741 1.13698 17.363 1.42593 17.5441 1.78133C17.75 2.18556 17.75 2.71444 17.75 3.77222V9.06111C17.75 10.1189 17.75 10.6478 17.5441 11.052C17.3629 11.4073 17.074 11.6962 16.7187 11.8774C16.3144 12.0833 15.7856 12.0833 14.7306 12.0833H12.0833M6.41667 6.41667H3.77222C2.71444 6.41667 2.18556 6.41667 1.78133 6.62256C1.42589 6.80359 1.13693 7.09256 0.955889 7.448C0.75 7.85222 0.75 8.38111 0.75 9.43889V14.7278C0.75 15.7856 0.75 16.3144 0.955889 16.7187C1.13698 17.0741 1.42593 17.363 1.78133 17.5441C2.18461 17.75 2.7135 17.75 3.76939 17.75H9.06489C10.1198 17.75 10.6478 17.75 11.052 17.5441C11.4074 17.363 11.6964 17.0741 11.8774 16.7187C12.0833 16.3144 12.0833 15.7865 12.0833 14.7306V12.0833M6.41667 6.41667H9.06111C10.1189 6.41667 10.6478 6.41667 11.052 6.62256C11.4074 6.80365 11.6964 7.0926 11.8774 7.448C12.0833 7.85128 12.0833 8.38017 12.0833 9.43605V12.0833' stroke='white' strokeOpacity='0.5' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              )}
            </button>
          </div>
          {copiedReferral ? (
            <div className='mt-[6px] text-[11px] text-white/60'>Ссылка скопирована</div>
          ) : null}
          {copyError ? (
            <div className='mt-[6px] text-[11px] text-red-300'>{copyError}</div>
          ) : null}
        </div>

        <h2 className='font-light text-[18px] text-left my-[10px] text-white bounded-font'>Ваши покупки</h2>

        <div className='grid grid-cols-1 gap-[15px]'>
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <div key={purchase.id} className='w-full border border-white/20 rounded-2xl theme-card p-[20px] flex flex-col gap-[10px]'>
                <div className='flex justify-between items-center bounded-font text-white text-[14px]'>
                  <span className='uppercase font-bold'>{PLAN_LABELS[purchase.plan] || purchase.plan}</span>
                  <span className='flex items-center'>
                    {Math.round(purchase.price_paid)}
                    <span>₽</span>
                  </span>
                </div>
                <div className='bounded-font text-white/40 text-[12px]'>
                  <span className='flex items-center gap-[3px]'>
                    {formatDate(purchase.created_at)} <span className='text-[16px]'>•</span> <span>{purchase.max_devices} устр.</span>
                  </span>
                  <div className='bounded-font font-light text-white/40 text-[11px]'>
                    <span>Заказ:</span>
                    <span>{purchase.payment_id || `sub_${purchase.id}`}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full border border-white/20 rounded-2xl theme-card p-[20px] bounded-font text-white/60 text-[13px]'>
              Пока нет оплаченных покупок
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
