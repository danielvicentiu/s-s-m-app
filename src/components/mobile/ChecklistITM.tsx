import { CheckCircle2, Phone, FolderOpen } from 'lucide-react';

const steps = [
  {
    title: "Verifică legitimația inspectorului",
    subtitle: "Notează nume + instituție (dacă e ceasul)."
  },
  {
    title: "Prezintă Registrul Unic de Control",
    subtitle: "Ține-l la îndemână, fără grabă."
  },
  {
    title: "Deschide Arhiva Cloud s-s-m.ro",
    subtitle: "Arată documentele cerute, în ordine."
  },
  {
    title: "Apelează Expertul (dacă e necesar)",
    subtitle: "Pentru clarificări, fără panică."
  }
];

export default function ChecklistITM() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[#1e293b] font-bold text-xl">
            Protocol Asistență Control
          </h2>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            PREGĂTIT
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          Checklist ITM • pași de buzunar
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="bg-[#1e293b] text-white rounded-full p-1.5 mt-0.5 flex-shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[#1e293b] font-bold text-sm leading-tight">
                {step.title}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {step.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 italic text-center border border-slate-100 mb-6">
        Vibe: ordine, control, siguranță. Urmezi lista.
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 bg-white text-slate-700 py-4 rounded-2xl text-xs font-bold border border-slate-200 hover:bg-slate-50 active:scale-98 transition-all">
          <FolderOpen size={18} className="text-slate-400" />
          Arhivă Documente
        </button>
        <a 
          href="tel:0730123456"
          className="flex items-center justify-center gap-2 bg-[#1e293b] text-white py-4 rounded-2xl text-xs font-bold hover:bg-[#0f172a] active:scale-98 transition-all"
        >
          <Phone size={18} />
          APEL EXPERT SSM
        </a>
      </div>
    </div>
  );
}
