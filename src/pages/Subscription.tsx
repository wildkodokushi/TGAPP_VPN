import { useState } from 'react';
import PlanList from '../components/PlanCard';

// Временный переключатель для демонстрации (удалить в продакшене)
const DEMO_TOGGLE = false; // поставьте false, чтобы увидеть "нет подписки"

export default function SubscriptionPage() {
    const [hasActiveSubscription] = useState(DEMO_TOGGLE);

    const activeSubscription = {
        expiryDate: '12.12.2026 13:00:00',
        devices: 5,
        duration: '3',
        traffic: '∞',
    };

    return(
        <div className="subscription">
            <div className="subscription__inner container">
                <h1 className="subscription__title h1">Подписка</h1>
                <div className="subscription__active">
                    {hasActiveSubscription ? (
                        <div className="subscription__active-info">
                            <div className="subscription__active-inner">
                                <h2 className="subscription__active-subtitle h2">Подписка активна!</h2>
                                <span className="subscription__active-date">
                                    <span>до</span>
                                    <span>{activeSubscription.expiryDate}</span>
                                </span>
                            </div>
                            <ul className="subscription__active-list">
                                <li className="subscription__active-item">
                                    <span className="subscription__active-details-value">
                                        {activeSubscription.devices}
                                    </span>
                                    <span className="subscription__active-details-label">
                                        устройств
                                    </span>
                                </li>
                                <li className="subscription__active-item">
                                    <span className="subscription__active-details-value">
                                        {activeSubscription.duration}
                                    </span>
                                    <span className="subscription__active-details-label">
                                        месяца
                                    </span>
                                </li>
                                <li className="subscription__active-item">
                                    <span className="subscription__active-details-value infinite">
                                        
                                    </span>
                                    <span className="subscription__active-details-label">
                                        трафик
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="subscription__active-none">
                            <h2 className='h2'>У вас нет активной подписки</h2>
                        </div>
                    )}
                </div>
                <div className="subscription__tariffs">
                    <h2 className="subscription__tariffs-title h2">Доступные тарифы</h2>
                    <PlanList variant="subscription" />
                </div>
            </div>
        </div>
    );
}