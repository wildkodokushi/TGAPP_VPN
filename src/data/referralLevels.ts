export type ReferralLevel = {
    id: string;
    name: string;
    percent: number;
    requiredReferrals: number; // рефералов для достижения
    nextLevelReferrals: number | null; // null = максимальный уровень
    class: string;
};

export const REFERRAL_LEVELS: ReferralLevel[] = [
    {
        id: 'starter',
        name: 'Стартовый',
        percent: 5,
        requiredReferrals: 0,
        nextLevelReferrals: 5,
        class: 'starter',
    },
    {
        id: 'advanced',
        name: 'Продвинутый',
        percent: 10,
        requiredReferrals: 5,
        nextLevelReferrals: 10,
        class: 'advanced',
    },
    {
        id: 'pro',
        name: 'Профессионал',
        percent: 15,
        requiredReferrals: 15,
        nextLevelReferrals: 5,
        class: 'pro',
    },
    {
        id: 'elite',
        name: 'Элита',
        percent: 20,
        requiredReferrals: 20,
        nextLevelReferrals: 5,
        class: 'elite',
    },
    {
        id: 'master',
        name: 'Мастер',
        percent: 25,
        requiredReferrals: 25,
        nextLevelReferrals: 5,
        class: 'master',
    },
    {
        id: 'legend',
        name: 'Легенда',
        percent: 30,
        requiredReferrals: 30,
        nextLevelReferrals: null,
        class: 'legend',
    },
];

// Определяем текущий уровень по количеству рефералов
export function getCurrentLevel(referralsCount: number): ReferralLevel {
    const levels = [...REFERRAL_LEVELS].reverse();
    return levels.find((l) => referralsCount >= l.requiredReferrals) ?? REFERRAL_LEVELS[0];
}