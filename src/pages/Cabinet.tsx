export default function CabinetPage() {
  const referralsCount = 12;
  const referralDays = 34;
  const referralLink = 'https://t.me/psychowarevpnxbot?start=ref_660741573';
  const maxReferralLinkChars = 32;
  const shortReferralLink =
    referralLink.length > maxReferralLinkChars
      ? `${referralLink.slice(0, maxReferralLinkChars)}...`
      : referralLink;

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (err) {
      console.error('Failed to copy referral link:', err);
    }
  };

  return (
    <div className='my-[15px]'>
      <div className='w-[354px]'>
        <h2 className='text-cm font-bold text-white acony-font text-center'>
          PSYCHOWARE VPN
        </h2>

        <div className='mt-[20px] w-full flex items-center gap-[20px] h-[85px] border border-white/20 rounded-2xl bg-[rgba(255,255,255,0.04)] bg-black/30'>
          <div className='border-2 rounded-full w-[50px] h-[50px] border-white/70 ml-[20px]'></div>
          <div className='flex flex-col gap-[5px] bounded-font'>
            <span className='text-white text-[14px] font-bold'>sweater</span>
            <div className='text-white/30 text-[12px]'>
              <span>ID: </span>
              <span>660741573</span>
            </div>
          </div>
        </div>

        <h2 className='font-light text-[18px] text-left my-[10px] text-white bounded-font'>Реферальная статистика</h2>

        <div className='grid grid-cols-2 gap-[10px]'>
          <div className='w-full border border-white/20 rounded-2xl bg-[rgba(255,255,255,0.04)] p-[14px] bounded-font'>
            <div className='text-white/60 text-[11px]'>Рефералы</div>
            <div className='text-white text-[26px] font-bold leading-none mt-[6px]'>{referralsCount}</div>
          </div>
          <div className='w-full border border-white/20 rounded-2xl bg-[rgba(255,255,255,0.04)] p-[14px] bounded-font'>
            <div className='text-white/60 text-[11px]'>Дней получено</div>
            <div className='text-white text-[26px] font-bold leading-none mt-[6px]'>{referralDays}</div>
          </div>
        </div>

        <div className='mt-[10px] w-full border border-white/20 rounded-2xl bg-[rgba(255,255,255,0.04)] p-[14px] bounded-font'>
          <div className='text-white/60 text-[11px]'>Реферальная ссылка</div>
          <div className='mt-[8px] flex items-center justify-between gap-[10px]'>
            <span className='text-white/80 text-[12px] leading-tight'>{shortReferralLink}</span>
            <button
              onClick={handleCopyReferralLink}
              className='shrink-0 h-[34px] w-[34px] rounded-full border border-white/20 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors'
              aria-label='Скопировать реферальную ссылку'
            >
              <svg width='17' height='17' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M6.41667 6.41667V3.77222C6.41667 2.71444 6.41667 2.18556 6.62256 1.78133C6.80389 1.42528 7.09194 1.13722 7.448 0.955889C7.85222 0.75 8.38111 0.75 9.43889 0.75H14.7278C15.7856 0.75 16.3144 0.75 16.7187 0.955889C17.0741 1.13698 17.363 1.42593 17.5441 1.78133C17.75 2.18556 17.75 2.71444 17.75 3.77222V9.06111C17.75 10.1189 17.75 10.6478 17.5441 11.052C17.3629 11.4073 17.074 11.6962 16.7187 11.8774C16.3144 12.0833 15.7856 12.0833 14.7306 12.0833H12.0833M6.41667 6.41667H3.77222C2.71444 6.41667 2.18556 6.41667 1.78133 6.62256C1.42589 6.80359 1.13693 7.09256 0.955889 7.448C0.75 7.85222 0.75 8.38111 0.75 9.43889V14.7278C0.75 15.7856 0.75 16.3144 0.955889 16.7187C1.13698 17.0741 1.42593 17.363 1.78133 17.5441C2.18461 17.75 2.7135 17.75 3.76939 17.75H9.06489C10.1198 17.75 10.6478 17.75 11.052 17.5441C11.4074 17.363 11.6964 17.0741 11.8774 16.7187C12.0833 16.3144 12.0833 15.7865 12.0833 14.7306V12.0833M6.41667 6.41667H9.06111C10.1189 6.41667 10.6478 6.41667 11.052 6.62256C11.4074 6.80365 11.6964 7.0926 11.8774 7.448C12.0833 7.85128 12.0833 8.38017 12.0833 9.43605V12.0833' stroke='white' strokeOpacity='0.5' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </button>
          </div>
        </div>

        <h2 className='font-light text-[18px] text-left my-[10px] text-white bounded-font'>Ваши покупки</h2>

        <div className='grid grid-cols-1 gap-[15px]'>
          <div className='w-full border border-white/20 rounded-2xl bg-[rgba(255,255,255,0.04)] p-[20px] flex flex-col gap-[10px]'>
            <div className='flex justify-between items-center bounded-font text-white text-[14px]'>
              <span className='uppercase font-bold'>анти-афк</span>
              <span className='flex items-center'>100<span>₽</span></span>
            </div>
            <div className='bounded-font text-white/40 text-[12px]'>
              <span className='flex items-center gap-[3px]'>21.01.2026 <span className='text-[16px]'>•</span> <span>7 дн.</span></span>
              <div className='bounded-font font-light text-white/40 text-[11px]'>
                <span>Заказ:</span>
                <span>3123432143</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
