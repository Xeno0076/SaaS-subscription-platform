import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number; // -1 for unlimited
  unit?: string;
  subtext?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  max,
  unit = '',
  subtext,
  id,
}) => {
  const isUnlimited = max === -1;
  const percentage = isUnlimited ? Math.min(100, Math.round((current / 50) * 100)) : Math.min(100, Math.round((current / max) * 100));

  let barColor = 'bg-blue-600';
  if (!isUnlimited) {
    if (percentage >= 95) {
      barColor = 'bg-rose-500';
    } else if (percentage >= 75) {
      barColor = 'bg-amber-500';
    }
  }

  return (
    <div id={id || `progress-${label.toLowerCase().replace(/\s+/g, '-')}`} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">
          {current} {unit}
          <span className="text-slate-500 font-normal">
            {' '}/ {isUnlimited ? 'Unlimited' : `${max} ${unit}`}
          </span>
        </span>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${isUnlimited ? Math.max(5, percentage) : percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{subtext || (isUnlimited ? 'Unlimited on current plan' : `${percentage}% utilized`)}</span>
        {!isUnlimited && percentage >= 90 && (
          <span className="text-rose-600 font-medium">Near limit</span>
        )}
      </div>
    </div>
  );
};
