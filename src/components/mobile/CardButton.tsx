import { LucideIcon } from 'lucide-react';

interface CardButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  onClick?: () => void;
  href?: string;
}

export default function CardButton({ 
  icon: Icon, 
  label, 
  sublabel, 
  onClick,
  href 
}: CardButtonProps) {
  const content = (
    <>
      <div className="bg-[#1e293b] text-white p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-[#1e293b] text-base mb-1">
        {label}
      </h3>
      <p className="text-slate-600 text-xs">
        {sublabel}
      </p>
    </>
  );

  const baseClasses = `
    bg-white rounded-3xl p-6 border border-slate-200 
    hover:shadow-lg hover:border-slate-300
    active:scale-98 transition-all duration-200
    flex flex-col items-center text-center
    min-h-[160px] justify-center
  `;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
