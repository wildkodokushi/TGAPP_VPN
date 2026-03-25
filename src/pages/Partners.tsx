import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { REFERRAL_LEVELS, getCurrentLevel } from '../data/referralLevels';
import ReferralLevelCard from '../components/ReferralLevel';
// import { useNavigate } from 'react-router-dom';

// демо-данные (замени на API)
const USER = {
    name:       'devnyash',
    id:         '12741274',
    registered: '12.12.2025',
    badge:      'MEDIA-PARTNER',
    levelName:  'Профессионал',
    referrals:  185,
    conversion: 17,
    income:     2430,
    percent:    25,
    refLink:    'https://t.me/psychowarevpnxbot?start=ref_662911398',
    balance:    2430,
};

type ChartTab = 'registrations' | 'income' | 'growth';

const CHART_DATA: Record<ChartTab, { date: string; value: number }[]> = {
    registrations: [
        { date: '02.03', value: 8  },
        { date: '03.03', value: 14 },
        { date: '04.03', value: 5  },
        { date: '05.03', value: 18 },
        { date: '06.03', value: 3  },
    ],
    income: [
        { date: '02.03', value: 120 },
        { date: '03.03', value: 540 },
        { date: '04.03', value: 210 },
        { date: '05.03', value: 870 },
        { date: '06.03', value: 90  },
    ],
    growth: [
        { date: '02.03', value: 2  },
        { date: '03.03', value: 7  },
        { date: '04.03', value: 3  },
        { date: '05.03', value: 11 },
        { date: '06.03', value: 1  },
    ],
};

const CHART_TABS: { id: ChartTab; label: string }[] = [
    { id: 'registrations', label: 'Регистрации' },
    { id: 'income', label: 'Доход' },
    { id: 'growth', label: 'Рост реф-ов' },
];

const ACCENT = '#ba59ab';

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="partner-chart__tooltip">
            <strong>{payload[0].value}</strong>
        </div>
    );
}

function CopyButton({ text } : { text: string }) {
    const [copied, setCopied] = useState(false);
    const handle = async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button className={`partner-link__btn button ${copied ? ' partner-link__btn--copied' : ''}`} onClick={handle} >
            {copied ? 'Скопировано!' : 'Копировать'}
        </button>
    );
}

export default function PartnerPage() {
    const [chartTab, setChartTab] = useState<ChartTab>('registrations');
    const [activeBar, setActiveBar] = useState<number | null>(null);

    const currentLevel = getCurrentLevel(USER.referrals);
    const chartData    = CHART_DATA[chartTab];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ url: USER.refLink }).catch(() => {});
        } else {
            navigator.clipboard.writeText(USER.refLink).catch(() => {});
        }
    };

    return (
        <div className="partner container">
            <h1 className="partner__title h1">Партнёрка</h1>
            <div className="partner__inner">

                {/* Профиль */}
                <div className="partner-profile">
                    <div className="partner-profile__inner">
                        <div className="partner-profile__avatar">
                            {USER.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="partner-profile__info">
                            <span className="partner-profile__name h1">{USER.name}</span>
                            <span className="partner-profile__meta">id: {USER.id}</span>
                            <span className="partner-profile__meta">Дата регистрации: {USER.registered}</span>
                        </div>
                        <div className="partner-profile__badges">
                            <span className="partner-profile__badge partner-profile__badge--partner button">{USER.badge}</span>
                            <span className="partner-profile__badge partner-profile__badge--level button">{USER.levelName}</span>
                        </div>
                    </div>
                
                    {/* Статы */}
                    <ul className="partner-stats">
                        <li className="partner-stats__item">
                            <span className='partner-stats__icon'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.6743 18.4146C28.6893 16.6847 29.1277 14.6768 28.9259 12.6812C28.6276 9.70792 26.9676 7.07958 24.2543 5.28125L22.4126 8.05792C24.2776 9.29458 25.4126 11.0563 25.6093 13.0146C25.7 13.9247 25.5866 14.8437 25.2776 15.7046C24.9685 16.5654 24.4715 17.3466 23.8226 17.9912L21.8359 19.9779L24.5326 20.7696C31.5859 22.8363 31.6676 29.9296 31.6676 30.0012H35.0009C35.0009 27.0196 33.4076 21.1929 27.6743 18.4146Z" fill="white" />
                                    <path d="M15.834 20.0013C19.5107 20.0013 22.5007 17.0113 22.5007 13.3346C22.5007 9.65797 19.5107 6.66797 15.834 6.66797C12.1573 6.66797 9.16732 9.65797 9.16732 13.3346C9.16732 17.0113 12.1573 20.0013 15.834 20.0013ZM15.834 10.0013C17.6723 10.0013 19.1673 11.4963 19.1673 13.3346C19.1673 15.173 17.6723 16.668 15.834 16.668C13.9957 16.668 12.5007 15.173 12.5007 13.3346C12.5007 11.4963 13.9957 10.0013 15.834 10.0013ZM18.334 21.668H13.334C7.81898 21.668 3.33398 26.153 3.33398 31.668V33.3346H6.66732V31.668C6.66732 27.9913 9.65732 25.0013 13.334 25.0013H18.334C22.0107 25.0013 25.0007 27.9913 25.0007 31.668V33.3346H28.334V31.668C28.334 26.153 23.849 21.668 18.334 21.668Z" fill="white" />
                                </svg>
                            </span>
                            <span className="partner-stats__value h1">{USER.referrals}</span>
                            <span className="partner-stats__label">Рефералов</span>
                        </li>
                        <li className="partner-stats__item">
                            <span className='partner-stats__icon'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0007 34.9987H5.00065C4.55862 34.9987 4.1347 34.8231 3.82214 34.5105C3.50958 34.198 3.33398 33.7741 3.33398 33.332V19.9987C3.33398 19.5567 3.50958 19.1327 3.82214 18.8202C4.1347 18.5076 4.55862 18.332 5.00065 18.332H10.0007C10.4427 18.332 10.8666 18.5076 11.1792 18.8202C11.4917 19.1327 11.6673 19.5567 11.6673 19.9987V33.332C11.6673 33.7741 11.4917 34.198 11.1792 34.5105C10.8666 34.8231 10.4427 34.9987 10.0007 34.9987ZM21.6673 34.9987H16.6673C16.2253 34.9987 15.8014 34.8231 15.4888 34.5105C15.1762 34.198 15.0007 33.7741 15.0007 33.332V4.9987C15.0007 4.55667 15.1762 4.13275 15.4888 3.82019C15.8014 3.50763 16.2253 3.33203 16.6673 3.33203H21.6673C22.1093 3.33203 22.5333 3.50763 22.8458 3.82019C23.1584 4.13275 23.334 4.55667 23.334 4.9987V33.332C23.334 33.7741 23.1584 34.198 22.8458 34.5105C22.5333 34.8231 22.1093 34.9987 21.6673 34.9987ZM33.334 34.9987H28.334C27.892 34.9987 27.468 34.8231 27.1555 34.5105C26.8429 34.198 26.6673 33.7741 26.6673 33.332V14.9987C26.6673 14.5567 26.8429 14.1327 27.1555 13.8202C27.468 13.5076 27.892 13.332 28.334 13.332H33.334C33.776 13.332 34.1999 13.5076 34.5125 13.8202C34.8251 14.1327 35.0007 14.5567 35.0007 14.9987V33.332C35.0007 33.7741 34.8251 34.198 34.5125 34.5105C34.1999 34.8231 33.776 34.9987 33.334 34.9987Z" fill="white" />
                                </svg>
                            </span>
                            <span className="partner-stats__value h1">{USER.conversion}%</span>
                            <span className="partner-stats__label">Конверсия</span>
                        </li>
                        <li className="partner-stats__item">
                            <span className='partner-stats__icon'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.3333 24.1654C18.3333 26.4654 22.065 28.332 26.6667 28.332C31.2683 28.332 35 26.4654 35 24.1654M5 15.832C5 18.132 8.73167 19.9987 13.3333 19.9987C15.21 19.9987 16.9417 19.6887 18.3333 19.1654M5 21.6654C5 23.9654 8.73167 25.832 13.3333 25.832C15.21 25.832 16.94 25.522 18.3333 24.9987M26.6667 21.6654C22.065 21.6654 18.3333 19.7987 18.3333 17.4987C18.3333 15.1987 22.065 13.332 26.6667 13.332C31.2683 13.332 35 15.1987 35 17.4987C35 19.7987 31.2683 21.6654 26.6667 21.6654Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5 9.16797V27.5013C5 29.8013 8.73167 31.668 13.3333 31.668C15.21 31.668 16.94 31.358 18.3333 30.8346M18.3333 30.8346V17.5013M18.3333 30.8346C18.3333 33.1346 22.065 35.0013 26.6667 35.0013C31.2683 35.0013 35 33.1346 35 30.8346V17.5013M21.6667 14.168V9.16797" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M13.3333 13.3333C8.73167 13.3333 5 11.4667 5 9.16667C5 6.86667 8.73167 5 13.3333 5C17.935 5 21.6667 6.86667 21.6667 9.16667C21.6667 11.4667 17.935 13.3333 13.3333 13.3333Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className="partner-stats__value h1">{USER.income}<span className='partner-stats__value--currency'>₽</span></span>
                            <span className="partner-stats__label">Доход</span>
                        </li>
                        <li className="partner-stats__item">
                            <span className='partner-stats__icon'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33203 31.6693L31.6654 8.33594" stroke="white" stroke-width="4" stroke-linecap="square" stroke-linejoin="round" />
                                    <path d="M11.666 16.668C14.4274 16.668 16.666 14.4294 16.666 11.668C16.666 8.90654 14.4274 6.66797 11.666 6.66797C8.90459 6.66797 6.66602 8.90654 6.66602 11.668C6.66602 14.4294 8.90459 16.668 11.666 16.668Z" stroke="white" stroke-width="4" stroke-linecap="square" stroke-linejoin="round" />
                                    <path d="M28.332 33.3359C31.0935 33.3359 33.332 31.0974 33.332 28.3359C33.332 25.5745 31.0935 23.3359 28.332 23.3359C25.5706 23.3359 23.332 25.5745 23.332 28.3359C23.332 31.0974 25.5706 33.3359 28.332 33.3359Z" stroke="white" stroke-width="4" stroke-linecap="square" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span className="partner-stats__value h1">{USER.percent}%</span>
                            <span className="partner-stats__label">Процент</span>
                        </li>
                    </ul>

                </div>


                {/* Партнёрская ссылка */}
                <div className="partner-link referrals__link">
                    <div className="partner-link__header referrals__link-notification">
                        <h2 className="partner-link__title h2">Партнёрская ссылка</h2>
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="#694363" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className="partner-link__url referrals__link-link">
                        {USER.refLink}
                    </div>
                    <div className="partner-link__actions">
                        <CopyButton text={USER.refLink} />
                        <button className="partner-link__btn partner-link__btn--outline button" onClick={handleShare}>
                            Поделиться
                        </button>
                        <button className="partner-link__qr" title="QR-код">
                            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.959 24.1654H24.1673M19.334 24.1654H16.9173V20.5404M20.5423 20.5404H24.1673V16.9154H22.959M16.9173 16.9154H19.334M4.83398 20.5404C4.83398 19.4142 4.83398 18.8511 5.01765 18.4064C5.26292 17.8146 5.73319 17.3443 6.32507 17.099C6.76973 16.9154 7.33282 16.9154 8.45898 16.9154C9.58515 16.9154 10.1482 16.9154 10.5929 17.099C11.185 17.3443 11.655 17.8144 11.9003 18.4064C12.084 18.8511 12.084 19.4142 12.084 20.5404C12.084 21.6665 12.084 22.2296 11.9003 22.6731C11.779 22.9664 11.6011 23.2329 11.3768 23.4574C11.1524 23.682 10.8861 23.8601 10.5929 23.9817C10.1482 24.1654 9.58515 24.1654 8.45898 24.1654C7.33282 24.1654 6.76973 24.1654 6.32507 23.9817C6.03196 23.8603 5.76564 23.6824 5.54131 23.458C5.31698 23.2337 5.13904 22.9674 5.01765 22.6743C4.83398 22.2296 4.83398 21.6665 4.83398 20.5404ZM16.9173 8.45703C16.9173 7.33086 16.9173 6.76778 17.101 6.32311C17.3463 5.73123 17.8165 5.26097 18.4084 5.0157C18.8531 4.83203 19.4161 4.83203 20.5423 4.83203C21.6685 4.83203 22.2316 4.83203 22.6762 5.0157C23.2683 5.26099 23.7384 5.73103 23.9837 6.32311C24.1673 6.76778 24.1673 7.33086 24.1673 8.45703C24.1673 9.5832 24.1673 10.1463 23.9837 10.5897C23.8623 10.883 23.6844 11.1496 23.4601 11.3741C23.2358 11.5986 22.9694 11.7768 22.6762 11.8984C22.2316 12.082 21.6685 12.082 20.5423 12.082C19.4161 12.082 18.8531 12.082 18.4084 11.8984C18.1153 11.777 17.849 11.599 17.6246 11.3747C17.4003 11.1504 17.2224 10.8841 17.101 10.5909C16.9173 10.1463 16.9173 9.5832 16.9173 8.45703ZM4.83398 8.45703C4.83398 7.33086 4.83398 6.76778 5.01765 6.32311C5.26292 5.73123 5.73319 5.26097 6.32507 5.0157C6.76973 4.83203 7.33282 4.83203 8.45898 4.83203C9.58515 4.83203 10.1482 4.83203 10.5929 5.0157C11.185 5.26099 11.655 5.73103 11.9003 6.32311C12.084 6.76778 12.084 7.33086 12.084 8.45703C12.084 9.5832 12.084 10.1463 11.9003 10.5897C11.779 10.883 11.6011 11.1496 11.3768 11.3741C11.1524 11.5986 10.8861 11.7768 10.5929 11.8984C10.1482 12.082 9.58515 12.082 8.45898 12.082C7.33282 12.082 6.76973 12.082 6.32507 11.8984C6.03196 11.777 5.76564 11.599 5.54131 11.3747C5.31698 11.1504 5.13904 10.8841 5.01765 10.5909C4.83398 10.1463 4.83398 9.5832 4.83398 8.45703Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <p className='referrals__link-description'>
                        Вы получаете 50% от кол-ва дней оплаченных рефералом
                    </p>
                </div>

                {/* График */}
                <div className="partner-chart">
                    <h2 className="partner-chart__title h2">Статистика</h2>
                    <div className="partner-chart__tabs">
                        {CHART_TABS.map((tab) => (
                            <button key={tab.id} className={`partner-chart__tab button ${chartTab === tab.id ? ' partner-chart__tab--active' : ''}`} onClick={() => setChartTab(tab.id)} >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={250} className={'partner-chart__schedule'}>
                        <BarChart data={chartData} barCategoryGap="40%" onMouseLeave={() => setActiveBar(null)} >
                            <XAxis dataKey="date" axisLine={{ strokeWidth: 0.5, strokeDasharray: '8 8' }} tickLine={{ strokeWidth: 1, strokeDasharray: '3 3' }} tick={{ fontSize: 16, fontWeight: 700 }} height={22} />
                            <YAxis axisLine={{ strokeWidth: 0.5, strokeDasharray: '8 8' }} tickLine={{ strokeWidth: 1, strokeDasharray: '3 3' }} tick={{ fontSize: 16, fontWeight: 700, }} width={26} />
                            <Tooltip content={<ChartTooltip />} cursor={false} />
                            <Bar dataKey="value" fill="#892c97" radius={[10, 10, 0, 0]} onMouseEnter={(_: any, i: number) => setActiveBar(i)} >
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={activeBar === i ? '#d472c6' : ACCENT} opacity={activeBar === null || activeBar === i ? 1 : 0.45} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Текущий уровень */}
                <ReferralLevelCard level={currentLevel} />

                {/* Все уровни */}
                {/* <div className="partner-levels">
                    {REFERRAL_LEVELS.map((level) => (
                        <ReferralLevelCard key={level.id} level={level} />
                    ))}
                </div> */}

                {/* Баланс */}
                <div className="partner-balance">
                    <div className="partner-balance__info">
                        <span className="partner-balance__label h2">Баланс к выводу</span>
                        <span className="partner-balance__value h1">{USER.balance}₽</span>
                    </div>
                    <div className="partner-balance__actions">
                        <button className="partner-balance__btn button">
                            Запросить выплату
                        </button>
                        <button className="partner-balance__btn button partner-balance__btn--outline">
                            История выплат
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}