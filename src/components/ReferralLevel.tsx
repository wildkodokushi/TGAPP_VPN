import type { ReferralLevel } from '../data/referralLevels';

type Props = {
    level: ReferralLevel;
    // isCurrent?: boolean;
};

export default function ReferralLevelCard({ level }: Props) {
    return (
        <div className={`ref-level ${level.class}`}>
            <div className="ref-level__header">
                <span className="ref-level__label h2">Уровень реферала</span>
            </div>
            <span className="ref-level__name">
                {level.name}
            </span>
            <span className="ref-level__percent">
                {level.percent}% от прибыли реферала
            </span>
            {level.nextLevelReferrals !== null ? (
                <span className="ref-level__next">
                    До следующего уровня: {level.nextLevelReferrals} рефералов
                </span>
            ) : (
                <span className="ref-level__next ref-level__next--max">
                    Максимальный уровень
                </span>
            )}
        </div>
    );
}