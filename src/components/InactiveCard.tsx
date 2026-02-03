'use client';

export function InactiveCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 grayscale hover:grayscale-0 transition-all cursor-not-allowed group">
      <div className="text-3xl mb-4 opacity-50 group-hover:opacity-100">{icon}</div>
      <h3 className="text-lg font-bold text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      <div className="text-xs font-bold text-teal-500/50 uppercase tracking-widest">Inactiv în planul tău</div>
    </div>
  );
}