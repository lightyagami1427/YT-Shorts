import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle, Activity } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  isPositive: boolean;
}

const KpiCard = ({ title, value, trend, isPositive }: KpiCardProps) => {
  return (
    <div className="glass-card p-10 bg-white relative group overflow-hidden border-transparent hover:border-indigo-100">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        <Activity size={80} strokeWidth={3} className="text-indigo-600" />
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
          <div className="h-0.5 w-6 bg-indigo-50 group-hover:w-full transition-all duration-700" />
        </div>
        <button className="text-slate-200 hover:text-indigo-400 transition-colors">
          <HelpCircle size={16} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="flex items-baseline gap-4 relative z-10">
        <h4 className="text-4xl font-black text-[#0f172a] tracking-tightest leading-none">
          {value}
        </h4>
        <div className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl border ${
          isPositive 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50' 
            : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50'
        }`}>
          {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
          {trend}%
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
         <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />
            ))}
         </div>
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Updated 2m ago</span>
      </div>
    </div>
  );
};

export default KpiCard;
