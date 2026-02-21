import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// тут страница выбора тарифа
export default function TariffsPage() {
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
    <div className="min-h-screen main-background flex items-center justify-center">
      <div className="my-[15px]">
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