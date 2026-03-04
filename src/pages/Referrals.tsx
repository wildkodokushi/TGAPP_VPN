import { useRef, useState } from 'react';

export default function ReferralsPage() {
    const [copied, setCopied] = useState(false); // для галочки? если убираем иконку, можно просто showMessage
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

    // const handleShare = () => {
    //     // Для Telegram Mini App можно использовать открытие ссылки "share"
    //     if (window.Telegram?.WebApp) {
    //         window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`);
    //     } else {
    //     // fallback
    //         window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`, '_blank');
    //     }
    // };

    return(
        <div className="referrals">
            <div className="referrals__inner container">
                <h1 className="referrals__title h1">Реферальная программа</h1>
                <div className="referrals__count">
                    <ul className="referrals__count-list">
                        <li className="referrals__count-item">
                            <div className="referrals__count-item__main">
                                <h3 className="referrals__count-subtitle h3">Всего рефералов</h3>
                                <p className="referrals__count-description">
                                    Количество людей, которые перешли по вашей личной ссылке
                                </p>
                            </div>
                            <span className="referrals__count-item__count h1">6</span>
                        </li>
                        <li className="referrals__count-item">
                            <h3 className="referrals__count-subtitle h3">Активные рефералы</h3>
                            <span className="referrals__count-item__count h1">3</span>
                        </li>
                        <li className="referrals__count-item">
                            <h3 className="referrals__count-subtitle h3">Получено с рефералов</h3>
                            <span className="referrals__count-item__count h1">
                                +<span>30 </span>дн.
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="referrals__link">
                    <div className="referrals__link-notification">
                        <h2 className="referrals__link-title h2">Ваша ссылка</h2>
                        {showCopyMessage && (
                            <div className='notification'>Ссылка скопирована</div>
                        )}
                    </div>
                    <div className='referrals__link-inner'>
                        <span className='referrals__link-link' ref={linkRef}>
                            {referralLink}
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
            </div>
        </div>
    );
}