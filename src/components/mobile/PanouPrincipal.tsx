import CardButton from './CardButton';
import { CheckCircle, FolderOpen, BarChart3, Headphones } from 'lucide-react';

export default function PanouPrincipal() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <CardButton
        icon={CheckCircle}
        label="Protocol Control"
        sublabel="Checklist ITM / Siguranță"
        onClick={() => {
          // Va naviga către tab asistență
          console.log('Navigate to Asistență Control');
        }}
      />
      
      <CardButton
        icon={FolderOpen}
        label="Arhivă Documente"
        sublabel="Fișiere & Atestate"
        onClick={() => {
          console.log('Open documents');
        }}
      />
      
      <CardButton
        icon={BarChart3}
        label="Rapoarte SSM"
        sublabel="Evaluări & Audituri"
        onClick={() => {
          console.log('Open reports');
        }}
      />
      
      <CardButton
        icon={Headphones}
        label="Contact Expert"
        sublabel="Asistență SSM"
        href="tel:0730123456"
      />
    </div>
  );
}
