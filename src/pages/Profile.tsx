import { useRef, useState } from 'react';

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
                        <span className='referrals__link-link' ref={linkRef}>
                            {referralLink}
                            {showCopyMessage && (
                                <div className='notification'>Ссылка скопирована</div>
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

                </div>
            </div>
        </div>
    );
}