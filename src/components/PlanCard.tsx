import { useNavigate } from 'react-router-dom';
import type { Plan, PlanVariant } from '../data/plans';
import { PLANS, PLAN_BADGE } from '../data/plans';

type PlanListProps = {
    variant: PlanVariant;
    redirectTo?: string; // куда ведёт кнопка "Купить", по умолчанию /checkout
};

const GlobeIcon = () => (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.4167 9.08333C17.4167 4.48083 13.6858 0.75 9.08333 0.75C4.48083 0.75 0.75 4.48083 0.75 9.08333C0.75 13.6858 4.48083 17.4167 9.08333 17.4167" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.91706 0.792969C9.91706 0.792969 12.4171 4.08464 12.4171 9.08464M8.25039 17.3763C8.25039 17.3763 5.75039 14.0846 5.75039 9.08464C5.75039 4.08464 8.25039 0.792969 8.25039 0.792969M1.27539 12.0013H9.08372M1.27539 6.16797H16.8921" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.3166 14.015C17.7283 14.2683 17.7025 14.8842 17.2791 14.9325L15.14 15.175L14.1808 17.1017C13.9908 17.4842 13.4033 17.2967 13.3058 16.8233L12.26 11.7267C12.1775 11.3267 12.5375 11.075 12.885 11.2892L17.3166 14.015Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
);

const InfinityIcon = () => (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.264 0C15.744 0 12.888 3.024 12 3.984C11.28 3.192 8.304 0 5.736 0C2.568 0 0 2.592 0 5.76C0 8.928 2.568 11.52 5.736 11.52C8.256 11.52 11.112 8.496 12 7.536C12.72 8.328 15.696 11.52 18.264 11.52C21.432 11.52 24 8.928 24 5.76C24 2.592 21.432 0 18.264 0ZM5.736 9.144C5.29146 9.14453 4.85118 9.05736 4.44038 8.88748C4.02957 8.71761 3.65631 8.46836 3.34198 8.15402C3.02764 7.83968 2.77839 7.46643 2.60852 7.05562C2.43864 6.64482 2.35147 6.20454 2.352 5.76C2.3549 4.8634 2.71236 4.00435 3.34635 3.37035C3.98035 2.73636 4.8394 2.3789 5.736 2.376C6.912 2.376 8.976 4.176 10.416 5.76C10.008 6.216 7.272 9.144 5.736 9.144ZM18.264 9.144C17.088 9.144 15.024 7.344 13.584 5.76C13.992 5.304 16.752 2.376 18.264 2.376C18.7085 2.37547 19.1488 2.46264 19.5596 2.63252C19.9704 2.8024 20.3437 3.05164 20.658 3.36598C20.9724 3.68032 21.2216 4.05357 21.3915 4.46438C21.5614 4.87518 21.6485 5.31546 21.648 5.76C21.624 7.632 20.112 9.144 18.264 9.144Z" fill="white" fillOpacity="0.5" />
    </svg>
);

// Одна карточка тарифа
type PlanCardProps = {
    plan: Plan;
    onBuy: (planId: string) => void;
};

export function PlanCard({ plan, onBuy }: PlanCardProps) {
    return (
        <li className="subscription__tariffs-item">
            <div className="subscription__tariffs-header">
                <span className="h2">{plan.title}</span>
                <span className="h2">от {plan.price}</span>
            </div>
            <div className="subscription__tariffs-features">
                <span><GlobeIcon /> 1 GB/S</span>
                <span><InfinityIcon /> GB</span>
                <button
                    className="subscription__tariffs-button button"
                    onClick={() => onBuy(plan.id)}
                >
                    Купить
                </button>
            </div>
        </li>
    );
}

// Список тарифов — сюда приходит variant, он управляет CSS-классом и бейджем
export default function PlanList({ variant, redirectTo }: PlanListProps) {
    const navigate = useNavigate();
    const badge = PLAN_BADGE[variant];

    const handleBuy = (planId: string) => {
        const base = redirectTo ?? '/checkout';
        navigate(`${base}?plan=${planId}`);
    };

    return (
        <ul className={`subscription__tariffs-list subscription__tariffs-list--${variant}`} style={{ '--badge-label': `"${badge.label}"` } as React.CSSProperties}>
            {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onBuy={handleBuy} />
            ))}
        </ul>
    );
}