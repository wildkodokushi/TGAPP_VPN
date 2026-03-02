// import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCachedUserStatus, readCachedUserStatus, type UserStatus } from '../lib/api';
// import { getTelegramProfile } from '../lib/telegram';



export default function MainPage() {
  return(

    <div className="home">
      <div className="home__row container">
        <div className="home__row-top">
          <h1 className="home__title">
            Добро пожаловать, sweater!
          </h1>
          <div className="home__info">
            <ul className="home__info-list">
              <li className="home__info-item">
                <div className="home__info-row">
                  <h2 className="home__info-subtitle">Ваш баланс</h2>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <span>99₽</span>
              </li>
              <li className="home__info-item">
                <div className="home__info-row">
                  <h2 className="home__info-subtitle">Подписка</h2>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <span>Активна</span>
              </li>
              <li className="home__info-item">
                <div className="home__info-row">
                  <h2 className="home__info-subtitle">Рефералы</h2>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <span>3</span>
              </li>
              <li className="home__info-item">
                <div className="home__info-row">
                  <h2 className="home__info-subtitle">Дни с реф-ов</h2>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6.83333H14.3333M14.3333 6.83333L8.5 1M14.3333 6.83333L8.5 12.6667" stroke="white" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <span>+30 дн.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="home__row-bottom">
          <h2 className="home__subtitle">Бесплатная пробная подписка</h2>
          <ul className="home__free-trial-list">
            <li className="home__free-trial-item">
              <h3 className="home__free-trial-subtitle">3</h3>
              устройства            
            </li>
            <li className="home__free-trial-item">
              <h3 className="home__free-trial-subtitle">3</h3>
              дня
            </li>
            <li className="home__free-trial-item">
              <h3 className="home__free-trial-subtitle infinite"></h3>
              ГБ
            </li>
          </ul>
          <button className="home__row-button button">Активировать</button>
        </div>
      </div>
    </div>
    
  );
}
