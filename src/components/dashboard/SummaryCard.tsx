import React from "react";

interface SummaryCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  variant?: "glass" | "primary";
}

export function SummaryCard({ label, value, subtitle, icon, trend, variant = "glass" }: SummaryCardProps) {
  if (variant === "primary") {
    return (
      <div className="p-6 sm:p-8 bg-primary bg-gradient-to-br from-primary to-primary-container rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-primary/20 flex flex-col justify-between h-48 sm:h-56 text-white group hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <span className="material-symbols-outlined p-2 sm:p-2.5 bg-white/20 rounded-xl text-lg sm:text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50">{label}</span>
        </div>
        <div className="relative z-10">
          <p className="text-3xl sm:text-4xl font-black tracking-tighter mb-1">{value}</p>
          <p className="text-[9px] sm:text-[10px] text-white/70 font-black uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
           <span className="material-symbols-outlined text-[8rem] sm:text-9xl">{icon}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-surface-container-lowest rounded-[2rem] sm:rounded-[2.5rem] shadow-sm flex flex-col justify-between h-48 sm:h-56 group hover:translate-y-[-2px] transition-all duration-300 border border-stone-100 hover:border-stone-200 shadow-stone-200/50">
      <div className="flex justify-between items-start relative z-10">
        <span className="material-symbols-outlined p-2 sm:p-2.5 bg-primary/10 text-primary rounded-xl text-lg sm:text-xl font-bold">
          {icon}
        </span>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">{label}</span>
      </div>
      <div className="relative z-10">
        <p className="text-3xl sm:text-4xl font-black tracking-tighter text-on-surface mb-1 sm:mb-2">{value}</p>
        {trend && (
           <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
             <span className="material-symbols-outlined text-xs sm:text-sm font-bold">
               {trend.isUp ? "trending_up" : "trending_down"}
             </span>
             {trend.value}
           </p>
        )}
        {subtitle && !trend && (
           <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 leading-none">{subtitle}</p>
        )}
      </div>
       <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 group-hover:opacity-[0.06]">
         <span className="material-symbols-outlined text-[8rem] sm:text-9xl">{icon}</span>
      </div>
    </div>
  );
}
