import { TourStep } from './OnboardingTour';

export const defaultTourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigare în aplicație',
    description: 'Aici găsești toate secțiunile principale: Angajați, Instruiri, Echipamente, Documentare și Rapoarte. Click pe orice secțiune pentru a naviga.',
    position: 'right',
  },
  {
    target: '[data-tour="dashboard"]',
    title: 'Tabloul de bord',
    description: 'Aici vezi un rezumat al activității recente, statistici importante și alertele care necesită atenție. Dashboard-ul se actualizează în timp real.',
    position: 'bottom',
  },
  {
    target: '[data-tour="add-employee"]',
    title: 'Adaugă angajați',
    description: 'Click aici pentru a adăuga angajați noi în sistem. Vei putea completa datele personale, funcția, departamentul și alte informații relevante pentru SSM.',
    position: 'left',
  },
  {
    target: '[data-tour="schedule-training"]',
    title: 'Programează instruiri',
    description: 'Programează instruiri SSM/PSI pentru angajați. Poți seta data, tipul instruirii, participanții și vei primi notificări automate înainte de scadență.',
    position: 'bottom',
  },
  {
    target: '[data-tour="generate-report"]',
    title: 'Generează rapoarte',
    description: 'Generează rapoarte detaliate pentru organizație: instruiri, controale medicale, echipamente, incidente. Rapoartele pot fi exportate în format PDF sau Excel.',
    position: 'left',
  },
];
