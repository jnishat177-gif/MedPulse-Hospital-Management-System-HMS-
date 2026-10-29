import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  color?: 'teal' | 'sky' | 'rose' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendUp = true,
  icon: Icon,
  color = 'teal'
}) => {
  const colorSchemes = {
    teal: {
      bg: 'bg-teal-50 text-teal-600 border-teal-200',
      badge: 'bg-teal-100 text-teal-800',
      accent: 'border-l-4 border-l-teal-500'
    },
    sky: {
      bg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'bg-sky-100 text-sky-800',
      accent: 'border-l-4 border-l-sky-500'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
      accent: 'border-l-4 border-l-rose-500'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      accent: 'border-l-4 border-l-amber-500'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      accent: 'border-l-4 border-l-purple-500'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${scheme.accent}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheme.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
            trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
