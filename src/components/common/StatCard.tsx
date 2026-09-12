import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorScheme?: 'blue' | 'emerald' | 'indigo' | 'amber';
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  trend = 'neutral',
  colorScheme = 'blue',
  id,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  };

  const selectedColor = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      id={id || `stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${selectedColor.bg} ${selectedColor.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold ${
                trend === 'up'
                  ? 'text-emerald-600'
                  : trend === 'down'
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
