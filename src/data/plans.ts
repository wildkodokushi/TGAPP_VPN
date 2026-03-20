export type Plan = {
    id: string;
    title: string;
    price: string;
};

export type PlanVariant = 'subscription' | 'gift';

export const PLANS: Plan[] = [
    { id: 'month',   title: 'Месяц',     price: '99'  },
    { id: '3months', title: '3 месяца',  price: '259' },
    { id: '6months', title: '6 месяцев', price: '499' },
    { id: 'year',    title: '1 год',     price: '899' },
];

export const PLAN_BADGE: Record<PlanVariant, { index: number; label: string }> = {
    subscription: { index: 2, label: 'Лучший выбор'   }, // nth-child(2) — 3 месяца
    gift:         { index: 3, label: 'Лучший подарок' }, // nth-child(3) — 6 месяцев
};