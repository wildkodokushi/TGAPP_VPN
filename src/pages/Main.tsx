import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// тут главная елик
export default function MainPage() {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const idTextRef = useRef<HTMLSpanElement>(null);
  const inviteTextRef = useRef<HTMLSpanElement>(null);

  const navigate = useNavigate();

  // Инициализация Telegram WebApp
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

  const handleCopyInvite = async () => {
    if (inviteTextRef.current) {
      await copyToClipboard(inviteTextRef.current.textContent || '');
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 1500);
    }
  };

  const handleBuyClick = () => {
    navigate('/tariffs');
  };

  return (
    <div className="min-h-screen main-background flex justify-center items-center">
      <div className="">
        {/* Header */}
        <div className="flex flex-col justify-center items-center">
          <div className="mt-[15px] logo w-[151px] h-[164px]"></div>
          <h1 className="font-bold text-sm text-center text-white acony-font pt-[20px]">
            PSYCHOWARE VPN
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[rgba(210,0,255,0.05)] border-2 border-white/10 rounded-2xl w-[354px] p-[20px_15px_25px] my-[20px]">
          {/* ID and Buy */}
          <div className="flex flex-col items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="font-light text-base text-center text-white/70 bounded-font">
                <span>id: </span>
                <span ref={idTextRef}>26263</span>
              </div>
              <span
                className="cursor-pointer transition-opacity hover:opacity-80"
                id="copyId"
                onClick={handleCopyId}
              >
                {copiedId ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#15ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.08333 5.08333V3.06111C5.08333 2.25222 5.08333 1.84778 5.24078 1.53867C5.37944 1.26639 5.59972 1.04611 5.872 0.907444C6.18111 0.75 6.58556 0.75 7.39444 0.75H11.4389C12.2478 0.75 12.6522 0.75 12.9613 0.907444C13.2331 1.04593 13.4541 1.26689 13.5926 1.53867C13.75 1.84778 13.75 2.25222 13.75 3.06111V7.10556C13.75 7.91444 13.75 8.31889 13.5926 8.628C13.454 8.89972 13.2331 9.12066 12.9613 9.25922C12.6522 9.41667 12.2478 9.41667 11.4411 9.41667H9.41667M5.08333 5.08333H3.06111C2.25222 5.08333 1.84778 5.08333 1.53867 5.24078C1.26686 5.37922 1.04589 5.60019 0.907444 5.872C0.75 6.18111 0.75 6.58556 0.75 7.39444V11.4389C0.75 12.2478 0.75 12.6522 0.907444 12.9613C1.04593 13.2331 1.26689 13.4541 1.53867 13.5926C1.84706 13.75 2.2515 13.75 3.05894 13.75H7.10844C7.91517 13.75 8.31889 13.75 8.628 13.5926C8.89978 13.4541 9.12074 13.2331 9.25922 12.9613C9.41667 12.6522 9.41667 12.2485 9.41667 11.4411V9.41667M5.08333 5.08333H7.10556C7.91444 5.08333 8.31889 5.08333 8.628 5.24078C8.89978 5.37926 9.12074 5.60022 9.25922 5.872C9.41667 6.18039 9.41667 6.58483 9.41667 7.39228V9.41667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </div>
            <button
              onClick={handleBuyClick}
              className="cursor-pointer w-[100%] bg-[#d200ff] inline-flex items-center h-[47px] px-5 text-white font-bold bounded-font text-base leading-none rounded-3xl justify-center text-center transition-colors"
            >
              Купить
            </button>
          </div>

          {/* Subscription Info */}
          <div className="flex flex-col items-center gap-2 mt-[25px]">
            <span className="text-xl font-light text-white bounded-font">
              Подписка <span className="text-xl font-light text-[#15ff00] bounded-font">активна</span>
            </span>
            <div className="w-[100%] inline-flex items-center h-[47px] px-5 text-white font-light text-[13px] border border-white/20 rounded-3xl bg-[rgba(210,0,255,0.05)] bounded-font justify-between">
              <span>до 15.02.2026</span>
              <span>3 устройства</span>
            </div>
          </div>

          {/* Invite Friend */}
          <div className="flex flex-col items-center gap-2 mt-[25px]">
            <span className="font-light text-xl text-center text-white/70 bounded-font">Пригласить друга:</span>
            <div className="w-[100%] inline-flex items-center justify-between h-[47px] px-5 border border-white/20 rounded-3xl bg-black/30 bounded-font">
              <span
                className="font-normal text-[13px] leading-none text-white/70 whitespace-nowrap overflow-hidden text-ellipsis"
                ref={inviteTextRef}
              >
                https://t.me/psychowarevpnxbot
              </span>
              <span
                className="cursor-pointer transition-opacity hover:opacity-80"
                id="copyInvite"
                onClick={handleCopyInvite}
              >
                {copiedInvite ? (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#15ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.41667 6.41667V3.77222C6.41667 2.71444 6.41667 2.18556 6.62256 1.78133C6.80389 1.42528 7.09194 1.13722 7.448 0.955889C7.85222 0.75 8.38111 0.75 9.43889 0.75H14.7278C15.7856 0.75 16.3144 0.75 16.7187 0.955889C17.0741 1.13698 17.363 1.42593 17.5441 1.78133C17.75 2.18556 17.75 2.71444 17.75 3.77222V9.06111C17.75 10.1189 17.75 10.6478 17.5441 11.052C17.3629 11.4073 17.074 11.6962 16.7187 11.8774C16.3144 12.0833 15.7856 12.0833 14.7306 12.0833H12.0833M6.41667 6.41667H3.77222C2.71444 6.41667 2.18556 6.41667 1.78133 6.62256C1.42589 6.80359 1.13693 7.09256 0.955889 7.448C0.75 7.85222 0.75 8.38111 0.75 9.43889V14.7278C0.75 15.7856 0.75 16.3144 0.955889 16.7187C1.13698 17.0741 1.42593 17.363 1.78133 17.5441C2.18461 17.75 2.7135 17.75 3.76939 17.75H9.06489C10.1198 17.75 10.6478 17.75 11.052 17.5441C11.4074 17.363 11.6964 17.0741 11.8774 16.7187C12.0833 16.3144 12.0833 15.7865 12.0833 14.7306V12.0833M6.41667 6.41667H9.06111C10.1189 6.41667 10.6478 6.41667 11.052 6.62256C11.4074 6.80365 11.6964 7.0926 11.8774 7.448C12.0833 7.85128 12.0833 8.38017 12.0833 9.43605V12.0833" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center mt-[25px]">
            <a href="https://t.me/psychowarevpn" target="_blank" rel="noopener noreferrer" className="font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] bg-black/50 rounded-3xl px-[30px]">
              Новости
            </a>
            <a href="https://t.me/psychowaresupportxbot" target="_blank" rel="noopener noreferrer" className="font-medium text-xs leading-none text-center text-white bounded-font cursor-pointer inline-flex items-center h-[35px] bg-black/50 rounded-3xl px-[30px]">
              Поддержка
            </a>
          </div>
          
        </div>
      </div>
      {/* <div className='footer bg-[#202020]  w-[354px] mt-[auto] flex items-center justify-between px-[30px] py-[15px]'>
        <button className='flex flex-col items-center gap-[5px]'>
          <svg width="25" height="25" viewBox="0 0 150 179" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4062 2.39681C41.7571 4.59389 41.4575 4.84356 39.4102 5.54263L37.1133 6.34157L39.0607 7.1405C40.5587 7.78964 41.2078 8.53864 42.1066 10.4361L43.2551 12.9328L44.4036 10.4361C45.3024 8.48871 45.9515 7.73971 47.5494 7.04064L49.5467 6.19177L47.7991 5.84223C45.8017 5.44276 45.0028 4.69376 43.9042 1.94741L43.1552 1.90735e-06L42.4062 2.39681Z" fill="white" />
            <path d="M79.907 9.63704C71.7678 16.1284 62.7798 25.2163 57.1872 32.6564L55.7891 34.5539L58.7351 33.2057C63.1792 31.2083 69.8204 29.1611 74.7139 28.2623C77.1606 27.8129 79.5075 27.2636 79.907 27.0639C80.9057 26.5146 83.6021 20.173 84.8504 15.3295C86.0488 10.7855 86.7479 5.04315 86.0988 5.04315C85.8491 5.04315 83.0528 7.14036 79.907 9.63704Z" fill="white" />
            <path d="M130.088 6.64114C113.809 13.6318 98.9289 21.771 87.1946 30.0101C84.5481 31.9075 83.1999 32.4568 81.0527 32.7564C74.3117 33.6053 61.3789 37.4502 56.3855 40.0966C50.1938 43.3423 45.3502 49.0348 41.9048 57.0241C39.6578 62.3171 38.4594 64.1147 35.8129 66.0122C33.1664 67.9097 26.6751 69.9569 23.1797 69.9569C20.683 69.9569 20.4334 70.0568 19.934 71.3051C19.185 73.2026 20.0339 78.0961 21.7316 81.8911C24.2782 87.4836 30.7197 92.1774 37.7104 93.4756C41.6052 94.2246 46.5486 93.7253 52.1911 92.1774C60.53 89.8305 65.5234 88.8818 67.6705 89.2313C68.7691 89.3811 71.5653 90.6294 73.9122 91.9277C80.3037 95.5729 82.8004 96.1721 91.4888 96.1721C95.4835 96.1721 98.9789 96.0223 99.1786 95.8225C99.3783 95.5729 99.1786 95.0236 98.7292 94.5242C97.1313 92.7766 92.4376 85.2366 92.6873 84.8871C92.9869 84.3877 96.5821 84.7872 100.627 85.7859C103.822 86.5349 107.967 88.6321 110.963 91.0289C112.711 92.3771 112.91 92.427 113.16 91.5782C113.31 91.0788 113.659 90.1301 113.909 89.431C115.457 84.937 115.956 73.5022 114.858 67.4602C114.558 65.7625 114.358 64.2645 114.458 64.1646C114.558 64.1147 116.206 65.0135 118.103 66.2119L121.599 68.409L121.898 67.0608C122.448 64.8637 122.398 53.5787 121.848 48.7352C121.549 46.2884 120.85 42.094 120.301 39.4475L119.352 34.6539L122.647 28.9615C127.042 21.4215 134.332 6.64114 134.332 5.29294C134.332 4.89347 133.633 5.0932 130.088 6.64114ZM71.4155 58.3224C71.9149 58.7718 69.1186 63.116 67.6206 64.3144C66.7218 64.9636 64.9242 65.8624 63.6259 66.2618C60.9295 67.0608 56.6352 67.2106 56.1858 66.4616C55.7863 65.8124 57.2344 63.0661 58.8822 61.3184C60.53 59.5208 62.4275 58.5221 65.074 58.0228C67.0214 57.6733 70.8663 57.873 71.4155 58.3224Z" fill="white" />
            <path d="M26.0788 24.8174C24.5309 30.0604 22.933 31.6084 18.2892 32.5072L14.8438 33.1563L17.5402 34.155C22.4836 35.9526 23.8817 37.5505 26.8278 44.9406C27.2273 46.0392 27.3771 45.9393 28.3758 43.143C30.3731 37.7003 32.3704 35.5531 36.9144 34.0052L39.5109 33.1563L36.3651 32.5072C30.7226 31.4086 29.9237 30.6097 28.0262 23.8687L27.1773 20.9725L26.0788 24.8174Z" fill="white" />
            <path d="M11.5983 94.0251C-1.18475 106.908 -3.63149 126.582 5.40649 143.859C12.6968 157.84 24.0816 167.178 38.7122 171.173C43.4559 172.471 44.3048 172.521 54.9406 172.521C66.8747 172.571 70.5199 172.121 79.1584 169.575C84.1518 168.127 87.2976 166.878 92.4407 164.332C96.6351 162.184 97.3342 161.485 94.3881 162.334C90.6931 163.383 80.8062 164.332 73.3162 164.332C54.2415 164.332 38.7122 159.638 29.6243 151.149C25.0304 146.855 19.288 138.915 20.1369 138.017C20.2867 137.917 21.6349 138.816 23.1828 140.064C33.569 148.503 45.4532 152.847 58.1863 152.847C63.5791 152.847 66.5751 152.447 83.1531 149.501C90.2936 148.253 99.9807 148.453 106.023 150.001C115.111 152.397 124.997 157.94 132.438 164.781C136.133 168.226 140.876 174.019 142.474 177.065L143.223 178.563L144.322 176.066C148.117 167.278 150.014 157.491 149.715 148.353C149.515 143.559 149.215 141.362 148.316 138.865C144.971 129.278 138.48 122.537 127.993 117.494L124.099 115.646L128.593 115.397L133.087 115.147L130.34 112.95C122.401 106.608 114.062 103.213 103.127 101.865C93.8888 100.716 83.7023 102.664 67.9233 108.556C53.143 114.048 44.9539 116.146 39.7608 115.746C27.8267 114.797 17.6901 105.859 14.794 93.7755L14.1948 91.3786L11.5983 94.0251Z" fill="white" />
          </svg>
          <span className='text-white bounded-font text-[13px] cursor-pointer'>Кабинет</span>
        </button>
        <button className='flex flex-col items-center gap-[5px]'>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1024 1024"><path fill="#fff" d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9M214 184h596v88H214zm362 656.1H448V736h128zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3c-40.8 0-76.4-22.1-95.2-54.9c-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 0 1 512 544c-40.7 0-76.2-22-95-54.7c-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 0 1-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5z"/></svg>
          <span className='text-white bounded-font text-[13px] cursor-pointer'>Магазин</span>
        </button>
      </div> */}
    </div>
  );
}
