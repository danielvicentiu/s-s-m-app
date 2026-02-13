/**
 * Template-uri declarații angajat pentru SSM/PSI
 * Utilizate pentru generarea documentelor PDF semnate de angajați
 */

export interface DeclaratieField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'checkbox' | 'textarea';
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export interface DeclaratieTemplate {
  id: string;
  title: string;
  description: string;
  fields: DeclaratieField[];
  contentTemplate: string; // Template cu placeholders pentru generare PDF
}

/**
 * 1. Declarație instruire SSM
 * Confirmă că angajatul a fost instruit în domeniul SSM
 */
export const declaratieInstruireSSM: DeclaratieTemplate = {
  id: 'instruire-ssm',
  title: 'Declarație privind instruirea în domeniul securității și sănătății în muncă',
  description: 'Angajatul confirmă că a fost instruit conform cerințelor legale SSM',
  fields: [
    {
      key: 'numePrenume',
      label: 'Nume și prenume',
      type: 'text',
      required: true,
      placeholder: 'Ex: Popescu Ion'
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      required: true,
      placeholder: 'Ex: 1234567890123'
    },
    {
      key: 'functie',
      label: 'Funcție',
      type: 'text',
      required: true,
      placeholder: 'Ex: Inginer'
    },
    {
      key: 'dataInstruire',
      label: 'Data instruirii',
      type: 'date',
      required: true
    },
    {
      key: 'tipInstruire',
      label: 'Tip instruire',
      type: 'text',
      required: true,
      defaultValue: 'Instruire generală SSM',
      placeholder: 'Ex: Instruire generală SSM, Instruire periodică, Instruire la locul de muncă'
    },
    {
      key: 'durata',
      label: 'Durata instruirii (ore)',
      type: 'text',
      required: true,
      placeholder: 'Ex: 2 ore'
    },
    {
      key: 'teme',
      label: 'Teme abordate',
      type: 'textarea',
      required: true,
      placeholder: 'Ex: Riscuri la locul de muncă, Echipamente de protecție, Proceduri de urgență'
    },
    {
      key: 'instructor',
      label: 'Nume instructor SSM',
      type: 'text',
      required: true,
      placeholder: 'Ex: Ionescu Maria'
    },
    {
      key: 'confirmInstruire',
      label: 'Confirm că am înțeles instrucțiunile primite',
      type: 'checkbox',
      required: true
    },
    {
      key: 'dataDeclaratie',
      label: 'Data declarației',
      type: 'date',
      required: true
    }
  ],
  contentTemplate: `
DECLARAȚIE
privind instruirea în domeniul securității și sănătății în muncă

Subsemnatul(a), {{numePrenume}}, CNP {{cnp}}, având funcția de {{functie}}, declar prin prezenta că:

1. Am participat la instruirea în domeniul securității și sănătății în muncă în data de {{dataInstruire}}.

2. Tipul instruirii: {{tipInstruire}}

3. Durata instruirii: {{durata}}

4. În cadrul instruirii au fost abordate următoarele teme:
{{teme}}

5. Instructorul SSM: {{instructor}}

6. Declar că am înțeles instrucțiunile primite și mă angajez să respect toate normele de securitate și sănătate în muncă la locul de muncă.

7. Sunt conștient(ă) că nerespectarea normelor SSM poate pune în pericol viața și sănătatea mea, precum și a colegilor mei de muncă.

Data: {{dataDeclaratie}}
Semnătura angajatului: _____________________
  `.trim()
};

/**
 * 2. Declarație primire echipamente individuale de protecție (EIP)
 * Confirmă primirea echipamentelor de protecție
 */
export const declaratiePrimireEIP: DeclaratieTemplate = {
  id: 'primire-eip',
  title: 'Declarație de primire a echipamentelor individuale de protecție (EIP)',
  description: 'Angajatul confirmă primirea echipamentelor de protecție necesare pentru desfășurarea activității',
  fields: [
    {
      key: 'numePrenume',
      label: 'Nume și prenume',
      type: 'text',
      required: true,
      placeholder: 'Ex: Popescu Ion'
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      required: true,
      placeholder: 'Ex: 1234567890123'
    },
    {
      key: 'functie',
      label: 'Funcție',
      type: 'text',
      required: true,
      placeholder: 'Ex: Muncitor construcții'
    },
    {
      key: 'dataPrimire',
      label: 'Data primirii echipamentelor',
      type: 'date',
      required: true
    },
    {
      key: 'echipamente',
      label: 'Echipamente primite',
      type: 'textarea',
      required: true,
      placeholder: 'Ex:\n- Cască de protecție\n- Mănuși de lucru\n- Ochelari de protecție\n- Vesta reflectorizantă'
    },
    {
      key: 'stareBuna',
      label: 'Confirm că echipamentele sunt în stare bună',
      type: 'checkbox',
      required: true
    },
    {
      key: 'instruireUtilizare',
      label: 'Am fost instruit privind utilizarea corectă a echipamentelor',
      type: 'checkbox',
      required: true
    },
    {
      key: 'raspunderePastrare',
      label: 'Îmi asum responsabilitatea păstrării și utilizării corecte',
      type: 'checkbox',
      required: true
    },
    {
      key: 'dataDeclaratie',
      label: 'Data declarației',
      type: 'date',
      required: true
    }
  ],
  contentTemplate: `
DECLARAȚIE
de primire a echipamentelor individuale de protecție (EIP)

Subsemnatul(a), {{numePrenume}}, CNP {{cnp}}, având funcția de {{functie}}, declar prin prezenta că:

1. Am primit în data de {{dataPrimire}} următoarele echipamente individuale de protecție:

{{echipamente}}

2. Declar că echipamentele primite sunt în stare bună de funcționare și corespund cerințelor postului meu.

3. Am fost instruit(ă) privind:
   - Utilizarea corectă a echipamentelor de protecție
   - Întreținerea și păstrarea echipamentelor
   - Obligativitatea purtării echipamentelor la locul de muncă

4. Mă angajez să:
   - Utilizez echipamentele de protecție pe toată durata desfășurării activității
   - Să păstrez și să întretin corespunzător echipamentele primite
   - Să anunț imediat coordonatorul SSM în cazul deteriorării echipamentelor
   - Să restituie echipamentele la încetarea raporturilor de muncă

5. Sunt conștient(ă) că nerespectarea obligației de a utiliza echipamentele de protecție constituie abatere disciplinară și poate pune în pericol viața și sănătatea mea.

Data: {{dataDeclaratie}}
Semnătura angajatului: _____________________
  `.trim()
};

/**
 * 3. Declarație pe propria răspundere privind starea de sănătate
 * Angajatul declară că nu are afecțiuni care să îl împiedice să lucreze
 */
export const declaratieStareSanatate: DeclaratieTemplate = {
  id: 'stare-sanatate',
  title: 'Declarație pe propria răspundere privind starea de sănătate',
  description: 'Angajatul declară că nu are afecțiuni medicale incompatibile cu munca desfășurată',
  fields: [
    {
      key: 'numePrenume',
      label: 'Nume și prenume',
      type: 'text',
      required: true,
      placeholder: 'Ex: Popescu Ion'
    },
    {
      key: 'cnp',
      label: 'CNP',
      type: 'text',
      required: true,
      placeholder: 'Ex: 1234567890123'
    },
    {
      key: 'functie',
      label: 'Funcție',
      type: 'text',
      required: true,
      placeholder: 'Ex: Operator producție'
    },
    {
      key: 'dataAngajare',
      label: 'Data angajării',
      type: 'date',
      required: true
    },
    {
      key: 'nuAreBoli',
      label: 'Declar că nu am boli sau afecțiuni care să mă împiedice să lucrez',
      type: 'checkbox',
      required: true
    },
    {
      key: 'nuEsteGravida',
      label: 'Declar că nu sunt gravidă (pentru femei)',
      type: 'checkbox',
      required: false
    },
    {
      key: 'nuAreAlergii',
      label: 'Declar că nu am alergii la substanțe utilizate la locul de muncă',
      type: 'checkbox',
      required: true
    },
    {
      key: 'mentiuni',
      label: 'Mențiuni suplimentare (opțional)',
      type: 'textarea',
      required: false,
      placeholder: 'Informații medicale relevante pe care doriți să le comunicați'
    },
    {
      key: 'inteleg',
      label: 'Înțeleg că voi fi supus(ă) examinării medicale de medicina muncii',
      type: 'checkbox',
      required: true
    },
    {
      key: 'dataDeclaratie',
      label: 'Data declarației',
      type: 'date',
      required: true
    }
  ],
  contentTemplate: `
DECLARAȚIE PE PROPRIA RĂSPUNDERE
privind starea de sănătate

Subsemnatul(a), {{numePrenume}}, CNP {{cnp}}, domiciliat(ă) în _________________,
având funcția de {{functie}}, angajat(ă) începând cu data de {{dataAngajare}},

DECLAR PE PROPRIA RĂSPUNDERE că:

1. Nu sufăr de boli care să mă împiedice să îmi desfășor activitatea în condiții normale de siguranță și sănătate în muncă.

2. Nu am boli cronice, afecțiuni cardiace, neurologice, psihice sau alte afecțiuni care ar putea pune în pericol viața și sănătatea mea sau a colegilor de muncă.

3. Nu am alergii la substanțele chimice, biologice sau fizice utilizate/prezente la locul de muncă.

{{#nuEsteGravida}}
4. Nu sunt gravidă.
{{/nuEsteGravida}}

{{#mentiuni}}
Mențiuni suplimentare:
{{mentiuni}}
{{/mentiuni}}

5. Înțeleg că prezenta declarație este valabilă până la efectuarea examinării medicale de către medicul de medicina muncii.

6. Înțeleg că voi fi supus(ă) examinării medicale periodice conform cerințelor legale și că sunt obligat(ă) să informez imediat angajatorul despre orice modificare a stării mele de sănătate care ar putea afecta capacitatea de muncă.

7. Declar că toate informațiile furnizate mai sus sunt adevărate și complete și îmi asum răspunderea pentru corectitudinea acestora.

Data: {{dataDeclaratie}}
Semnătura angajatului: _____________________

NOTĂ: Prezenta declarație nu înlocuiește examinarea medicală obligatorie de medicina muncii,
ci reprezintă o declarație inițială în vederea începerii activității.
  `.trim()
};

/**
 * Export centralizat toate template-urile
 */
export const declaratiiAngajatTemplates: DeclaratieTemplate[] = [
  declaratieInstruireSSM,
  declaratiePrimireEIP,
  declaratieStareSanatate
];

/**
 * Helper pentru a găsi un template după ID
 */
export function getDeclaratieTemplate(id: string): DeclaratieTemplate | undefined {
  return declaratiiAngajatTemplates.find(template => template.id === id);
}

/**
 * Helper pentru a genera conținut declarație cu date completate
 * Înlocuiește placeholders {{fieldKey}} cu valorile furnizate
 */
export function generateDeclaratieContent(
  templateId: string,
  fieldValues: Record<string, any>
): string | null {
  const template = getDeclaratieTemplate(templateId);
  if (!template) return null;

  let content = template.contentTemplate;

  // Înlocuiește placeholders simpli {{key}}
  Object.keys(fieldValues).forEach(key => {
    const value = fieldValues[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value?.toString() || '');
  });

  // Gestionează blocuri condiționale {{#key}}...{{/key}}
  Object.keys(fieldValues).forEach(key => {
    const value = fieldValues[key];
    const blockRegex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');

    if (value) {
      // Păstrează conținutul blocului dacă valoarea este true
      content = content.replace(blockRegex, '$1');
    } else {
      // Elimină blocul dacă valoarea este false
      content = content.replace(blockRegex, '');
    }
  });

  return content;
}
