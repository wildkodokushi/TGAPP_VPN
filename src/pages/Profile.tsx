import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CustomSelect = ({
    options,
    value,
    onChange,
    disabled = false,
    placeholder = 'Выберите',
}: {
    options: number[];
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    placeholder?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = value;

    const handleSelect = (opt: number) => {
        if (disabled) return;
        onChange(opt);
        setIsOpen(false);
    };

    return (
        <div className={`custom-select-container ${disabled ? 'disabled' : ''}`} ref={containerRef}>
            <div className={`custom-select-header custom-select-header-profile  ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`} onClick={() => !disabled && setIsOpen(!isOpen)} >
                <span className="custom-select-value">
                    {selectedOption !== undefined ? `${selectedOption}` : placeholder}
                </span>
                <span className="custom-select-arrow">
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5.7706L9.212 7.55859L5.24 3.4666L1.268 7.55859L-0.519981 5.7706L5.24 -0.00140238L11 5.7706Z" fill="white" />
                    </svg>
                </span>
            </div>
            {isOpen && !disabled && (
                <ul className="custom-select-dropdown">
                    {options.map((opt) => (
                        <li key={opt} className={`custom-select-option ${opt === value ? 'selected' : ''}`} onClick={() => handleSelect(opt)} >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
    <label className='toggle-switch'>
        <span className='toggle-label'>{label}</span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className='toggle-input' />
        <span className='toggle-slider'></span>
    </label>
);

// Ключ для localStorage
const STORAGE_KEY = 'profile-settings';

// Значения по умолчанию
const defaultSettings = {
    expiryReminder: false,
    daysBefore: 14,
    newsEnabled: false,
    rafflesEnabled: true,
    promosEnabled: true,
};

const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return defaultSettings;
};

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

  // Инициализация настроек из localStorage
  const [expiryReminder, setExpiryReminder] = useState(loadSettings().expiryReminder);
  const [daysBefore, setDaysBefore] = useState(loadSettings().daysBefore);
  const [newsEnabled, setNewsEnabled] = useState(loadSettings().newsEnabled);
  const [rafflesEnabled, setRafflesEnabled] = useState(loadSettings().rafflesEnabled);
  const [promosEnabled, setPromosEnabled] = useState(loadSettings().promosEnabled);

  const daysOptions = [1, 3, 7, 14];

  // Сохранение всех настроек в localStorage при любом изменении
  useEffect(() => {
    const settings = {
        expiryReminder,
        daysBefore,
        newsEnabled,
        rafflesEnabled,
        promosEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [expiryReminder, daysBefore, newsEnabled, rafflesEnabled, promosEnabled]);


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
                        <Link to="/referrals">
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="#694363" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </Link>
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
                                <CustomSelect options={daysOptions} value={daysBefore} onChange={setDaysBefore} disabled={!expiryReminder} placeholder="дней" />
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