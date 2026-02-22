import { useState } from 'react';

// тут страница выбора тарифа
export default function TariffsPage() {
  const [selectedDevices, setSelectedDevices] = useState(3); // по умолчанию 3

  // Цены за месяц для разных периодов (пример)
  const tariffs = [
    { period: '1 месяц', monthlyPrice: 99, total: 99 },
    { period: '3 месяца', monthlyPrice: 79, total: 237 },
    { period: '6 месяцев', monthlyPrice: 69, total: 414 },
    { period: '12 месяцев', monthlyPrice: 59, total: 708 },
  ];
  const [selectedTariff, setSelectedTariff] = useState(tariffs[1]);

  // Здесь можно заменить на свою логику
  const calculateTotal = () => {
    const base = selectedTariff.total;
    const extraDevices = Math.max(0, Math.min(selectedDevices, 7) - 3);
    return base + extraDevices * 50;
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
    <div className="">
      <div className="my-[15px]">
        <h2 className="text-cm font-bold text-white acony-font text-center">
          PSYCHOWARE VPN
        </h2>

        {/* card */}
        <div className='w-[354px] mt-[20px] border-2 border-white/10 rounded-[16px] bg-[rgba(255,255,255,0.04)] p-[20px_15px]'>

          {/* Тарифы */}
          <div className="space-y-2">
            {tariffs.map((tariff) => (
                <div key={tariff.period} onClick={() => setSelectedTariff(tariff)} className={`px-[20px] border border-white/20 rounded-[30px] tarif-1 crown flex justify-between items-center h-[60px] cursor-pointer transition tarif 
                ${selectedTariff.period === tariff.period
                    ? 'active'
                    : ''
                }`}>
                    <div className={`bounded-font font-light flex flex-col justify-center`}>
                        <span className="text-white text-[13px]">{tariff.period}</span>
                        <span className='text-[10px] text-white/50'>{tariff.monthlyPrice}₽ в месяц</span>
                    </div>
                    <span className={`text-[14px] bounded-font text-white font-light text-center`}>
                        {tariff.total}
                        <span className='text-[12px]'>₽</span>
                    </span>
                </div>
            ))}
          </div>

          {/* Количество устройств */}
          <div className="mt-[25px]">
            <div className='flex flex-col items-center text-center bounded-font font-light'>
                <p className="text-white text-sm">Количество устройств</p>
                <p className='text-white/50 text-[12px] mt-[5px]'>+50₽ / 1 шт.</p>
            </div>
            <div className="mt-[15px] bounded-font flex flex-col items-center">
                <input type="range" min="3" max="7" step="1" value={selectedDevices} onChange={(e) => setSelectedDevices(Number(e.target.value))} className="w-full max-w-[300px] accent-white" />

                <div className="flex justify-between px-[5px] w-full max-w-[300px] mt-2 text-white/70 text-sm">
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                </div>

                <div className="text-white text-lg mt-2">
                    Выбрано: 
                    <span className="text-white font-bold"> {selectedDevices}</span>
                </div>
            </div>
          </div>

          {/* Итого */}
          <div className="mt-[25px]">
            <div className='flex items-center gap-[10px]'>
                <div className='bounded-font text-white flex flex-col'>
                    <span className="text-sm">Итого:</span>
                    <span className="font-bold text-[20px]">{totalPrice}₽</span>
                </div>
                <button onClick={handlePayment} className='bg-white text-black text[16px] bounded-font w-[100%] flex justify-center items-center h-[47px] rounded-[30px] cursor-pointer hover:bg-white/90'>Перейти к оплате</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

