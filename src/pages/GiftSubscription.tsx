import PlanList from '../components/PlanCard';

export default function GiftSubscriptionPage() {
    return (
        <div className="subscription">
            <div className="subscription__inner container">
                <h1 className="subscription__title h1">Подарить подписку</h1>
                <div className="subscription__tariffs">
                    <h2 className="subscription__tariffs-title h2">Выберите тариф</h2>
                    <PlanList variant="gift" isGift={true} />
                </div>
            </div>
        </div>
    );
}