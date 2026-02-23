import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [copiedId, setCopiedId] = useState(false);
  const idTextRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

  const handleBuyClick = () => {
    navigate('/tariffs');
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
                <span ref={idTextRef}>26263</span>
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
            <button onClick={handleBuyClick} className='theme-primary-btn cursor-pointer w-[100%] inline-flex items-center h-[47px] px-5 font-bold bounded-font text-base leading-none rounded-3xl justify-center text-center transition-colors'>
              Купить
            </button>
          </div>

          <div className='flex flex-col items-center gap-2 mt-[25px]'>
            <span className='text-xl font-light text-white bounded-font'>
              Подписка <span className='text-xl font-light text-white bounded-font'>активна</span>
            </span>
            <div className='theme-soft w-[100%] inline-flex items-center h-[47px] px-5 text-white font-light text-[13px] border border-white/20 rounded-3xl bounded-font justify-between'>
              <span>до 15.02.2026</span>
              <span>3 устройства</span>
            </div>
          </div>

          <div className='flex justify-between items-center mt-[25px]'>
            <a href='https://t.me/psychowarevpn' target='_blank' rel='noopener noreferrer' className='theme-chip font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] rounded-3xl px-[30px]'>
              Новости
            </a>
            <a href='https://t.me/psychowaresupportxbot' target='_blank' rel='noopener noreferrer' className='theme-chip font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] rounded-3xl px-[30px]'>
              Поддержка
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
