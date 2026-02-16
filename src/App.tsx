import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// тут главная елик
function MainPage() {
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
    <div className="min-h-screen main-background flex items-center justify-center">
      <div className="">
        {/* Header */}
        <div className="flex flex-col justify-center items-center">
          <div className="logo w-[151px] h-[164px]"></div>
          <h1 className="font-bold text-sm text-center text-white acony-font pt-[20px]">
            PSYCHOWARE VPN
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[rgba(210,0,255,0.05)] border-2 border-white/10 rounded-2xl w-[354px] p-[20px_15px_25px] mt-[20px]">
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
    </div>
  );
}

// тут страница выбора тарифа
function TariffsPage() {
  const navigate = useNavigate();
  const [selectedDevices, setSelectedDevices] = useState(3); // по умолчанию 3

  // Цены за месяц для разных периодов (пример)
  const tariffs = [
    { period: '1 месяц', monthlyPrice: 99, total: 99 },
    { period: '3 месяца', monthlyPrice: 79, total: 237 },
    { period: '6 месяцев', monthlyPrice: 69, total: 414 },
    { period: '12 месяцев', monthlyPrice: 59, total: 708 },
  ];
  const [selectedTariff, setSelectedTariff] = useState(tariffs[1]);

  // Простейший расчёт: итог = базовая цена * (0.9 + 0.1 * количество устройств), например
  // Здесь можно заменить на свою логику
  const calculateTotal = () => {
    const base = selectedTariff.total;
    // Допустим, каждое доп. устройство +10% стоимости
    const multiplier = 0.9 + selectedDevices * 0.1;
    return Math.round(base * multiplier);
  };

  const totalPrice = calculateTotal();

  const handlePayment = () => {
    // Открываем платёжную ссылку (замените на свою)
    const paymentUrl = `https://example.com/pay?tariff=${selectedTariff.period}&devices=${selectedDevices}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(paymentUrl);
    } else {
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen main-background flex items-center justify-center">
      <div className="">
        <h2 className="text-cm font-bold text-white acony-font text-center">
          PSYCHOWARE VPN
        </h2>

        {/* card */}
        <div className='w-[354px] mt-[20px] border-2 border-white/10 rounded-[16px] bg-[rgba(210,0,255,0.05)] p-[20px_15px]'>

          {/* Тарифы */}
          <div className="space-y-2">
            {tariffs.map((tariff) => (
              <div
                key={tariff.period}
                onClick={() => setSelectedTariff(tariff)}
                className={`crown flex justify-between items-center cursor-pointer transition tarif`}>
                <div className={`bounded-font font-light flex flex-col justify-center w-[77%] h-[60px] pl-[20px] border border-white/20 rounded-[30px] tarif-1
                  ${selectedTariff.period === tariff.period
                    ? 'active'
                    : ''
                  }`}>
                  <span className="text-white text-[13px]">{tariff.period}</span>
                  <span className='text-[10px] text-white/50'>{tariff.monthlyPrice}₽ в месяц</span>
                </div>
                <div className="">
                  <span
                    className={`text-[14px] bounded-font rounded-full border border-white/20 w-[60px] h-[60px] flex flex-col items-center justify-center text-white font-light text-center tarif-2
                      ${selectedTariff.period === tariff.period
                        ? 'active'
                        : ''
                      }`}>
                    {tariff.total}₽
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Количество устройств */}
          <div className="mt-[25px]">
            <div className='flex flex-col items-center text-center bounded-font font-light'>
              <p className="text-white text-sm">Количество устройств</p>
              <p className='text-white/50 text-[12px] mt-[5px]'>+50₽ / 1 шт.</p>
            </div>
            <div className="flex justify-between mt-[15px] bounded-font">
              {[3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedDevices(num)}
                  className={`w-[60px] h-[60px] rounded-full border-1 border-white/20 transition cursor-pointer text-white font-light text-[20px] ${
                    selectedDevices === num
                      ? 'bg-[#d200ff]'
                      : 'hover:border-[#d200ff]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Итого */}
          <div className="mt-[25px] flex flex-col gap-2 ">
            <div className='flex items-center gap-[10px]'>
              <div className='bounded-font text-white flex flex-col'>
                <span className="text-sm">Итого:</span>
                <span className="font-bold text-[20px]">{totalPrice}₽</span>
              </div>
              <button onClick={handlePayment} className='bg-[#d200ff] text-white text[16px] bounded-font w-[100%] flex justify-center items-center h-[47px] rounded-[30px] cursor-pointer'>Перейти к оплате</button>
            </div>
            <button onClick={() => navigate(-1)} className='w-[100%] flex justify-center items-center h-[47px] rounded-[30px] text-white bounded-font bg-black/50 cursor-pointer'>Назад</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// маршруты
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;