import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

type UserStatus = 'ok' | 'not_subscribed' | 'banned';

async function checkUserStatus(): Promise<UserStatus> {
    // TODO: заменить на fetch('/api/user/status') или Telegram WebApp проверку
    return 'ok';
    // return 'not_subscribed';
    // return 'banned';
}

function BannedOverlay() {
    const handleSupport = () => {
        window.open('tg://resolve?domain=psychowaresupportxbot', '_blank');
    };
 
    return (
        <div className="home-overlay">
            <div className="home-overlay__card">
                <div className="home-overlay__emoji home-overlay__emoji--banned"></div>
                <span className="home-overlay__title">
                    Ваш аккаунт <span className="home-overlay__title--accent">заблокирован</span>
                </span>
                <p className="home-overlay__desc">
                    Вы можете связаться с поддержкой,<br /> чтобы оспорить блокировку.
                </p>
                <button className="home-overlay__btn button" onClick={handleSupport}>
                    Поддержка
                </button>
            </div>
        </div>
    );
}

function NotSubscribedOverlay() {
    const handleSubscribe = () => {
        window.open('tg://resolve?domain=psychowarevpn', '_blank');
    };
 
    return (
        <div className="home-overlay">
            <div className="home-overlay__card">
                <div className="home-overlay__emoji home-overlay__emoji--notSubscribed"></div>
                <span className="home-overlay__title">
                    Доступ <span className="home-overlay__title--accent">ограничен</span>
                </span>
                <p className="home-overlay__desc">
                    Для использования приложения,<br />необходимо подписаться на наш<br /> новостной канал.
                </p>
                <button className="home-overlay__btn button" onClick={handleSubscribe}>
                    Подписаться
                </button>
            </div>
        </div>
    );
}

export default function MainPage() {
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
 
    useEffect(() => {
        checkUserStatus().then(setUserStatus);
    }, []);

    return (
        <div className="home">
            <div className="home__row container">
                <div className="home__row-top">
                    <h1 className="home__titl h1">Добро пожаловать, <span>sweater!</span></h1>
                    <div className="home__info">
                        <ul className="home__info-list">
                            <li className="home__info-item" onClick={() => navigate('/profile')}>
                                <div className="home__info-row">
                                    <h3 className="home__info-subtitle h3">Ваш баланс</h3>
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <span>
                                    <span className="h1">99</span>
                                    <span className="h4">₽</span>
                                </span>
                            </li>
                            <li className="home__info-item" onClick={() => navigate('/subscription')}>
                                <div className="home__info-row">
                                    <h3 className="home__info-subtitle h3">Подписка</h3>
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <span className="h1">Активна</span>
                            </li>
                            <li className="home__info-item" onClick={() => navigate('/referrals')}>
                                <div className="home__info-row">
                                    <h3 className="home__info-subtitle h3">Рефералы</h3>
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <span className="h1">3</span>
                            </li>
                            <li className="home__info-item" onClick={() => navigate('/devices')}>
                                <div className="home__info-row">
                                    <h3 className="home__info-subtitle h3">Устройства</h3>
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <span className="h1">5</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="home__row-bottom">
                    <h2 className="home__subtitle h2">Бесплатная пробная подписка</h2>
                    <ul className="home__free-trial-list">
                        <li className="home__free-trial-item">
                            <span className="home__free-trial-subtitle">3</span>
                            устройства
                        </li>
                        <li className="home__free-trial-item">
                            <span className="home__free-trial-subtitle">3</span>
                            дня
                        </li>
                        <li className="home__free-trial-item">
                            <span className="home__free-trial-subtitle infinite"></span>
                            ГБ
                        </li>
                    </ul>
                    <button className="home__row-button button">Активировать</button>
                </div>
            </div>
            {/* Оверлеи — рендерятся поверх всего после проверки статуса */}
            {userStatus === 'not_subscribed' && <NotSubscribedOverlay />}
            {userStatus === 'banned'         && <BannedOverlay />}
        </div>
    );
}