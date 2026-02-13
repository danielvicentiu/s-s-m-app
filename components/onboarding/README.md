# OnboardingTour Component

Componentă React pentru tur ghidat la prima utilizare a aplicației SSM.

## Caracteristici

- ✅ 5 pași predefiniti (sidebar, dashboard, adaugă angajat, programează instruire, generează raport)
- ✅ Tooltip-uri poziționate automat (top/bottom/left/right)
- ✅ Highlight pe elementul activ cu spotlight effect
- ✅ Butoane Next/Skip/Finish/Back
- ✅ Progress dots pentru vizualizare progres
- ✅ Auto-scroll la element țintă
- ✅ Salvare status în localStorage
- ✅ Responsive și adaptat la scroll/resize

## Utilizare

### 1. Adaugă atribute `data-tour` în componentele țintă

```tsx
// În sidebar
<nav data-tour="sidebar">
  {/* conținut sidebar */}
</nav>

// În dashboard
<div data-tour="dashboard">
  {/* conținut dashboard */}
</div>

// Buton adaugă angajat
<button data-tour="add-employee">
  Adaugă Angajat
</button>

// Buton programează instruire
<button data-tour="schedule-training">
  Programează Instruire
</button>

// Buton generează raport
<button data-tour="generate-report">
  Generează Raport
</button>
```

### 2. Importă și folosește componenta

```tsx
'use client';

import { OnboardingTour, defaultTourSteps } from '@/components/onboarding';

export default function DashboardLayout() {
  const handleComplete = () => {
    console.log('Onboarding completed!');
    // Optional: trimite event către analytics
  };

  const handleSkip = () => {
    console.log('Onboarding skipped');
  };

  return (
    <>
      <OnboardingTour
        steps={defaultTourSteps}
        onComplete={handleComplete}
        onSkip={handleSkip}
        localStorageKey="ssm_onboarding_completed"
      />

      {/* Rest of layout */}
    </>
  );
}
```

### 3. Tour personalizat (opțional)

```tsx
import { OnboardingTour, TourStep } from '@/components/onboarding';

const customSteps: TourStep[] = [
  {
    target: '[data-tour="custom-element"]',
    title: 'Titlu personalizat',
    description: 'Descriere personalizată pentru acest pas',
    position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
  },
  // ... mai mulți pași
];

<OnboardingTour steps={customSteps} onComplete={...} onSkip={...} />
```

## Props

| Prop | Tip | Default | Descriere |
|------|-----|---------|-----------|
| `steps` | `TourStep[]` | - | Array cu pașii turului (required) |
| `onComplete` | `() => void` | - | Callback când turul este finalizat (required) |
| `onSkip` | `() => void` | - | Callback când turul este sărit (required) |
| `localStorageKey` | `string` | `'onboarding_completed'` | Cheie pentru localStorage |

## TourStep Interface

```typescript
interface TourStep {
  target: string;        // CSS selector pentru elementul țintă
  title: string;         // Titlul tooltip-ului
  description: string;   // Descrierea pasului
  position?: 'top' | 'bottom' | 'left' | 'right'; // Poziția tooltip-ului
}
```

## Comportament

- Turul se afișează automat dacă utilizatorul nu l-a completat/sărit înainte
- Status salvat în localStorage: `'completed'` sau `'skipped'`
- Auto-scroll smooth la elementul activ
- Recalculare poziții la resize/scroll
- Z-index ridicat (9998-10000) pentru overlay și tooltip

## Stilizare

Componentele folosesc:
- Tailwind CSS pentru styling
- `lucide-react` pentru iconița X (close)
- Design consistent cu dashboard-ul SSM (rounded-2xl, blue-600)

## Reset pentru testare

Pentru a reseta turul în timpul dezvoltării:

```javascript
localStorage.removeItem('ssm_onboarding_completed');
// apoi reîncarcă pagina
```
