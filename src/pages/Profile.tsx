import { useRef, useState } from 'react';

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
    <label className='toggle-switch'>
        <span className='toggle-label'>{label}</span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className='toggle-input' />
        <span className='toggle-slider'></span>
    </label>
);

export default function CabinetPage() {
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const linkRef = useRef<HTMLSpanElement>(null);

    const referralLink = 'https://t.me/psychowarevpnxbot?start=ref_662911398';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setShowCopyMessage(true);
            setTimeout(() => setShowCopyMessage(false), 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const [expiryReminder, setExpiryReminder] = useState(false);
    const [daysBefore, setDaysBefore] = useState(14);
    const [newsEnabled, setNewsEnabled] = useState(false);
    const [rafflesEnabled, setRafflesEnabled] = useState(false);
    const [promosEnabled, setPromosEnabled] = useState(true);

    const daysOptions = [1, 3, 7, 14];


    return(
        <div className="profile container">
            <h1 className="profile__title h1">Профиль</h1>
            <div className="profile__inner">
                <div className="profile__info">
                    <ul className="profile__info-list">
                        <li className="profile__info-item">
                            <span className="profile__info-field">Telegram ID</span>
                            <span className="profile__info-subtitle h1">283560206</span>
                        </li>
                        <li className="profile__info-item">
                            <span className="profile__info-field">Username</span>
                            <span className="profile__info-subtitle h1">@devnyash</span>
                        </li>
                        <li className="profile__info-item">
                            <span className="profile__info-field">Имя</span>
                            <span className="profile__info-subtitle h1">sweater</span>
                        </li>
                        <li className="profile__info-item">
                            <span className="profile__info-field">Дата регистрации</span>
                            <span className="profile__info-subtitle h1">26.10.2006</span>
                        </li>
                    </ul>
                </div>
                <div className="profile__referral referrals__link">
                    <div className="referrals__link-notification">
                        <h2 className="referrals__link-title h2">Реферальная программа</h2>
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="#694363" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className='referrals__link-inner'>
                        <span className='profile__referral-link referrals__link-link' ref={linkRef}>
                            {showCopyMessage ? (
                                <div className='notification profile__referral-notification'>
                                    Ссылка скопирована
                                </div>
                            ) : (
                                <span id='referralLink'>{referralLink}</span>
                            )}
                        </span>
                        <div className='referrals__link-buttons'>
                            <button className='referrals__link-button button' onClick={handleCopy}>
                                <span>Копировать</span>
                            </button>
                            <button className='referrals__link-button button'>
                                <span>Поделиться</span>
                            </button>
                        </div>
                    </div>
                    <p className='referrals__link-description'>
                        Вы получаете 50% от кол-ва дней оплаченных рефералом
                    </p>
                </div>
                <button className="profile__button button">
                    Подарить подписку
                </button>
                <div className="profile__settings">
                    <h2 className="profile__settings-title h2">Настройки</h2>
                    <div className="profile__settings-notification">
                        <div className="profile__settings-main">
                            <ToggleSwitch checked={expiryReminder} onChange={setExpiryReminder} label="Уведомление об окончании подписки" />
                        </div>
                        <ul className="profile__settings-list">
                            <li className="profile__settings-item">
                                <label className="profile__settings-label no-active">Дней до окончания</label>
                                <select value={daysBefore} onChange={(e) => setDaysBefore(Number(e.target.value))} disabled={!expiryReminder} >
                                    {daysOptions.map((days) => (
                                        <option key={days} value={days}>
                                            {days}
                                        </option>
                                    ))}
                                </select>
                            </li>
                            <li className="profile__settings-item">
                                 <ToggleSwitch checked={newsEnabled} onChange={setNewsEnabled} label="Уведомления о новостях" />
                            </li>
                            <li className="profile__settings-item">
                                <ToggleSwitch checked={rafflesEnabled} onChange={setRafflesEnabled} label="Уведомления о розыгрышах" />
                            </li>
                            <li className="profile__settings-item">
                                <ToggleSwitch checked={promosEnabled} onChange={setPromosEnabled} label="Уведомления о промокодах" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}