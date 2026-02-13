/**
 * German SSM (Occupational Health & Safety) Legislative Acts Database
 *
 * Contains key German workplace safety regulations including:
 * - ArbSchG (Arbeitsschutzgesetz - Occupational Health and Safety Act)
 * - BetrSichV (Betriebssicherheitsverordnung - Industrial Safety Ordinance)
 * - ArbStättV (Arbeitsstättenverordnung - Workplace Ordinance)
 * - GefStoffV (Gefahrstoffverordnung - Hazardous Substances Ordinance)
 * - DGUV Regulations (German Social Accident Insurance)
 */

export interface LegislativeActDE {
  id: string;
  type: 'law' | 'ordinance' | 'regulation' | 'directive';
  titleDE: string;
  titleEN: string;
  shortName: string;
  jurisdiction: 'federal' | 'state';
  issuingAuthority: string;
  effectiveDate: string;
  lastAmended?: string;
  keyObligations: Array<{
    obligation: string;
    responsibleParty: 'employer' | 'employee' | 'safety_officer' | 'occupational_physician';
    description: string;
  }>;
  penalties: {
    minEUR: number;
    maxEUR: number;
    description: string;
    criminalLiability?: boolean;
  };
  relatedRegulations?: string[];
  officialReference: string;
}

export const legislatieDeSSM: LegislativeActDE[] = [
  {
    id: 'de-arbschg',
    type: 'law',
    titleDE: 'Arbeitsschutzgesetz',
    titleEN: 'Occupational Health and Safety Act',
    shortName: 'ArbSchG',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '1996-08-21',
    lastAmended: '2023-06-20',
    keyObligations: [
      {
        obligation: 'Gefährdungsbeurteilung durchführen',
        responsibleParty: 'employer',
        description: 'Employer must conduct systematic risk assessments for all workplace activities and document them in writing (§5 ArbSchG)'
      },
      {
        obligation: 'Arbeitsschutzorganisation einrichten',
        responsibleParty: 'employer',
        description: 'Establish occupational safety organization including appointment of safety officers and occupational physicians (§3 ArbSchG)'
      },
      {
        obligation: 'Unterweisung der Beschäftigten',
        responsibleParty: 'employer',
        description: 'Provide adequate instruction and training to employees about workplace hazards, at least annually and when starting new tasks (§12 ArbSchG)'
      },
      {
        obligation: 'Persönliche Schutzausrüstung bereitstellen',
        responsibleParty: 'employer',
        description: 'Provide necessary personal protective equipment (PPE) free of charge and ensure its proper use'
      },
      {
        obligation: 'Weisungen befolgen',
        responsibleParty: 'employee',
        description: 'Employees must follow safety instructions and use provided safety equipment properly (§15 ArbSchG)'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Violations can result in fines up to €25,000. Serious violations causing injury or death may lead to criminal prosecution under §26 ArbSchG',
      criminalLiability: true
    },
    relatedRegulations: ['BetrSichV', 'ArbStättV', 'ASiG'],
    officialReference: 'BGBl. I S. 1246'
  },
  {
    id: 'de-betrsichv',
    type: 'ordinance',
    titleDE: 'Betriebssicherheitsverordnung',
    titleEN: 'Industrial Safety Ordinance',
    shortName: 'BetrSichV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2015-06-01',
    lastAmended: '2023-10-01',
    keyObligations: [
      {
        obligation: 'Prüfung von Arbeitsmitteln',
        responsibleParty: 'employer',
        description: 'Regular inspection of work equipment by qualified personnel before first use and at specified intervals (§14 BetrSichV)'
      },
      {
        obligation: 'Befähigte Person bestellen',
        responsibleParty: 'employer',
        description: 'Appoint competent persons (befähigte Personen) to conduct equipment inspections'
      },
      {
        obligation: 'Prüfbuch führen',
        responsibleParty: 'employer',
        description: 'Maintain inspection records for all work equipment for at least 2 years'
      },
      {
        obligation: 'Erlaubnisschein für gefährliche Arbeiten',
        responsibleParty: 'employer',
        description: 'Issue work permits for particularly hazardous activities (Anhang 2 BetrSichV)'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 50000,
      description: 'Violations of BetrSichV can result in fines up to €50,000 under §22 ArbSchG. Severe violations may lead to criminal charges',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'DGUV-V3', 'DGUV-V4'],
    officialReference: 'BGBl. I S. 49'
  },
  {
    id: 'de-arbstaettv',
    type: 'ordinance',
    titleDE: 'Arbeitsstättenverordnung',
    titleEN: 'Workplace Ordinance',
    shortName: 'ArbStättV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2004-08-12',
    lastAmended: '2022-06-27',
    keyObligations: [
      {
        obligation: 'Arbeitsstätten einrichten und betreiben',
        responsibleParty: 'employer',
        description: 'Design and operate workplaces according to safety and health requirements (§3 ArbStättV)'
      },
      {
        obligation: 'Sanitärräume und Pausenräume',
        responsibleParty: 'employer',
        description: 'Provide adequate sanitary facilities, changing rooms, and break rooms based on workforce size'
      },
      {
        obligation: 'Beleuchtung und Belüftung',
        responsibleParty: 'employer',
        description: 'Ensure sufficient lighting and ventilation in all work areas according to ASR standards'
      },
      {
        obligation: 'Fluchtwege und Notausgänge',
        responsibleParty: 'employer',
        description: 'Maintain clearly marked emergency exits and escape routes, ensure they remain unobstructed'
      },
      {
        obligation: 'Barrierefreiheit',
        responsibleParty: 'employer',
        description: 'Ensure workplace accessibility for employees with disabilities where applicable'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Violations punishable with fines up to €25,000 under §9 ArbStättV',
      criminalLiability: false
    },
    relatedRegulations: ['ArbSchG', 'ASR-A1.3', 'ASR-A2.3'],
    officialReference: 'BGBl. I S. 2179'
  },
  {
    id: 'de-gefstoffv',
    type: 'ordinance',
    titleDE: 'Gefahrstoffverordnung',
    titleEN: 'Hazardous Substances Ordinance',
    shortName: 'GefStoffV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2010-11-26',
    lastAmended: '2023-03-21',
    keyObligations: [
      {
        obligation: 'Gefahrstoffverzeichnis führen',
        responsibleParty: 'employer',
        description: 'Maintain a comprehensive hazardous substances register listing all hazardous materials used in the workplace (§6 GefStoffV)'
      },
      {
        obligation: 'Substitutionsprüfung',
        responsibleParty: 'employer',
        description: 'Examine possibilities to replace hazardous substances with less dangerous alternatives (§7 GefStoffV)'
      },
      {
        obligation: 'Betriebsanweisung erstellen',
        responsibleParty: 'employer',
        description: 'Create written operating instructions for handling hazardous substances in German language (§14 GefStoffV)'
      },
      {
        obligation: 'Arbeitsmedizinische Vorsorge',
        responsibleParty: 'employer',
        description: 'Provide occupational health examinations for employees exposed to hazardous substances according to ArbMedVV'
      },
      {
        obligation: 'Schutzmaßnahmen nach STOP-Prinzip',
        responsibleParty: 'employer',
        description: 'Implement protective measures following the STOP principle: Substitution, Technical, Organizational, Personal'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 50000,
      description: 'Violations can result in fines up to €50,000. Serious violations causing health damage may lead to criminal prosecution under §27 ChemG',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'ChemG', 'ArbMedVV', 'TRGS-400'],
    officialReference: 'BGBl. I S. 1643'
  },
  {
    id: 'de-asig',
    type: 'law',
    titleDE: 'Arbeitssicherheitsgesetz',
    titleEN: 'Occupational Safety and Health Act',
    shortName: 'ASiG',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '1973-12-12',
    lastAmended: '2021-06-20',
    keyObligations: [
      {
        obligation: 'Fachkraft für Arbeitssicherheit bestellen',
        responsibleParty: 'employer',
        description: 'Appoint qualified safety specialists (Fachkraft für Arbeitssicherheit) based on company size and risk level (§5 ASiG)'
      },
      {
        obligation: 'Betriebsarzt bestellen',
        responsibleParty: 'employer',
        description: 'Appoint occupational physician (Betriebsarzt) to provide health services to employees (§2 ASiG)'
      },
      {
        obligation: 'Arbeitsschutzausschuss einrichten',
        responsibleParty: 'employer',
        description: 'Establish occupational safety committee (ASA) in companies with more than 20 employees, meeting quarterly (§11 ASiG)'
      },
      {
        obligation: 'Einsatzzeiten dokumentieren',
        responsibleParty: 'employer',
        description: 'Document deployment hours of safety specialists and occupational physicians according to DGUV-V2'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Failure to appoint required safety personnel can result in fines up to €25,000 under §9 ASiG',
      criminalLiability: false
    },
    relatedRegulations: ['ArbSchG', 'DGUV-V2', 'AMR-2.1'],
    officialReference: 'BGBl. I S. 1885'
  },
  {
    id: 'de-dguv-v1',
    type: 'regulation',
    titleDE: 'DGUV Vorschrift 1 - Grundsätze der Prävention',
    titleEN: 'DGUV Regulation 1 - Principles of Prevention',
    shortName: 'DGUV-V1',
    jurisdiction: 'federal',
    issuingAuthority: 'Deutsche Gesetzliche Unfallversicherung (DGUV)',
    effectiveDate: '2014-10-01',
    lastAmended: '2023-01-01',
    keyObligations: [
      {
        obligation: 'Organisation des Arbeitsschutzes',
        responsibleParty: 'employer',
        description: 'Organize occupational safety structure including delegation of responsibilities and supervision (§13 DGUV-V1)'
      },
      {
        obligation: 'Unterweisung mindestens jährlich',
        responsibleParty: 'employer',
        description: 'Conduct safety instruction at least annually, documented with signature (§4 DGUV-V1)'
      },
      {
        obligation: 'Erste-Hilfe-Organisation',
        responsibleParty: 'employer',
        description: 'Establish first aid organization with trained personnel and adequate equipment (§24-28 DGUV-V1)'
      },
      {
        obligation: 'Arbeitsunfälle melden',
        responsibleParty: 'employer',
        description: 'Report work accidents resulting in more than 3 days absence to the Berufsgenossenschaft (§193 SGB VII)'
      },
      {
        obligation: 'Mitwirkungspflichten beachten',
        responsibleParty: 'employee',
        description: 'Employees must participate in safety measures and report hazards immediately (§15 DGUV-V1)'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 10000,
      description: 'Violations can result in fines up to €10,000 imposed by the Berufsgenossenschaft under §209 SGB VII',
      criminalLiability: false
    },
    relatedRegulations: ['ArbSchG', 'SGB-VII', 'DGUV-V2'],
    officialReference: 'DGUV Vorschrift 1 (bisherige BGV A1)'
  },
  {
    id: 'de-dguv-v2',
    type: 'regulation',
    titleDE: 'DGUV Vorschrift 2 - Betriebsärzte und Fachkräfte für Arbeitssicherheit',
    titleEN: 'DGUV Regulation 2 - Occupational Physicians and Safety Specialists',
    shortName: 'DGUV-V2',
    jurisdiction: 'federal',
    issuingAuthority: 'Deutsche Gesetzliche Unfallversicherung (DGUV)',
    effectiveDate: '2011-01-01',
    lastAmended: '2020-01-01',
    keyObligations: [
      {
        obligation: 'Betreuungsmodell wählen',
        responsibleParty: 'employer',
        description: 'Choose appropriate supervision model: Regelbetreuung, alternative Betreuung, or Unternehmermodell (§2 DGUV-V2)'
      },
      {
        obligation: 'Grundbetreuung sicherstellen',
        responsibleParty: 'employer',
        description: 'Ensure basic supervision hours calculated based on workforce size and risk group (Anlage 2 DGUV-V2)'
      },
      {
        obligation: 'Betriebsspezifische Betreuung',
        responsibleParty: 'employer',
        description: 'Provide additional company-specific supervision based on risk assessment results'
      },
      {
        obligation: 'Unternehmermodell für Kleinbetriebe',
        responsibleParty: 'employer',
        description: 'Small businesses (<10 employees) may use entrepreneur model after completing mandatory training and regular updates'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 10000,
      description: 'Non-compliance with supervision requirements can result in fines up to €10,000 from the Berufsgenossenschaft',
      criminalLiability: false
    },
    relatedRegulations: ['ASiG', 'ArbSchG', 'DGUV-V1'],
    officialReference: 'DGUV Vorschrift 2 (bisherige BGV A2)'
  },
  {
    id: 'de-dguv-v3',
    type: 'regulation',
    titleDE: 'DGUV Vorschrift 3 - Elektrische Anlagen und Betriebsmittel',
    titleEN: 'DGUV Regulation 3 - Electrical Systems and Equipment',
    shortName: 'DGUV-V3',
    jurisdiction: 'federal',
    issuingAuthority: 'Deutsche Gesetzliche Unfallversicherung (DGUV)',
    effectiveDate: '1979-04-01',
    lastAmended: '2022-01-01',
    keyObligations: [
      {
        obligation: 'Prüfung elektrischer Anlagen',
        responsibleParty: 'employer',
        description: 'Regular inspection of electrical installations and equipment by qualified electricians (§5 DGUV-V3)'
      },
      {
        obligation: 'Prüffristen einhalten',
        responsibleParty: 'employer',
        description: 'Fixed installations: every 4 years; portable equipment: every 6-12 months; construction sites: every 3 months'
      },
      {
        obligation: 'Elektrofachkraft bestellen',
        responsibleParty: 'employer',
        description: 'Appoint qualified electrical specialists (Elektrofachkraft) for electrical work (§3 DGUV-V3)'
      },
      {
        obligation: 'Prüfprotokoll dokumentieren',
        responsibleParty: 'employer',
        description: 'Maintain detailed inspection records for all electrical equipment and installations'
      },
      {
        obligation: 'Fünf Sicherheitsregeln beachten',
        responsibleParty: 'safety_officer',
        description: 'Follow five safety rules for electrical work: disconnect, secure, verify, ground, cover/barrier'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 10000,
      description: 'Violations can result in fines up to €10,000. Electrical accidents may lead to criminal prosecution for negligence',
      criminalLiability: true
    },
    relatedRegulations: ['BetrSichV', 'DIN-VDE-0100', 'DIN-VDE-0105'],
    officialReference: 'DGUV Vorschrift 3 (bisherige BGV A3)'
  },
  {
    id: 'de-dguv-v4',
    type: 'regulation',
    titleDE: 'DGUV Vorschrift 4 - Arbeitsmedizinische Vorsorge',
    titleEN: 'DGUV Regulation 4 - Occupational Health Care',
    shortName: 'DGUV-V4',
    jurisdiction: 'federal',
    issuingAuthority: 'Deutsche Gesetzliche Unfallversicherung (DGUV)',
    effectiveDate: '2008-12-01',
    lastAmended: '2021-01-01',
    keyObligations: [
      {
        obligation: 'Pflichtvorsorge veranlassen',
        responsibleParty: 'employer',
        description: 'Arrange mandatory occupational health examinations for specific hazardous activities (ArbMedVV Anhang)'
      },
      {
        obligation: 'Angebotsvorsorge anbieten',
        responsibleParty: 'employer',
        description: 'Offer voluntary health examinations for activities with certain health risks'
      },
      {
        obligation: 'Wunschvorsorge ermöglichen',
        responsibleParty: 'employer',
        description: 'Provide health examinations upon employee request if work-related health concerns exist (§5a ArbMedVV)'
      },
      {
        obligation: 'Vorsorgekartei führen',
        responsibleParty: 'occupational_physician',
        description: 'Maintain confidential medical records for all occupational health examinations'
      },
      {
        obligation: 'Vorsorgebescheinigung ausstellen',
        responsibleParty: 'occupational_physician',
        description: 'Issue health examination certificates to employer (without medical details) after each examination'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Failure to provide mandatory health examinations can result in fines up to €25,000 under §9 ArbMedVV',
      criminalLiability: false
    },
    relatedRegulations: ['ArbMedVV', 'ASiG', 'ArbSchG'],
    officialReference: 'DGUV Vorschrift 4 (Arbeitsmedizinische Vorsorge)'
  },
  {
    id: 'de-arbmedvv',
    type: 'ordinance',
    titleDE: 'Verordnung zur arbeitsmedizinischen Vorsorge',
    titleEN: 'Ordinance on Occupational Health Examinations',
    shortName: 'ArbMedVV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2008-12-24',
    lastAmended: '2022-11-18',
    keyObligations: [
      {
        obligation: 'Pflicht-, Angebots- und Wunschvorsorge unterscheiden',
        responsibleParty: 'employer',
        description: 'Distinguish between mandatory, offered, and requested health examinations according to Anhang ArbMedVV'
      },
      {
        obligation: 'Facharzt für Arbeitsmedizin beauftragen',
        responsibleParty: 'employer',
        description: 'Engage qualified occupational physicians with specialist certification (§7 ArbMedVV)'
      },
      {
        obligation: 'Vorsorgetermine rechtzeitig anbieten',
        responsibleParty: 'employer',
        description: 'Offer health examination appointments before starting hazardous work and at required intervals'
      },
      {
        obligation: 'Arbeitsplatzbegehung durchführen',
        responsibleParty: 'occupational_physician',
        description: 'Conduct workplace inspections to assess health hazards before providing medical advice (§3 ArbMedVV)'
      },
      {
        obligation: 'Bescheinigung dem Arbeitgeber vorlegen',
        responsibleParty: 'employee',
        description: 'Provide health examination certificate to employer for mandatory examinations'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Violations punishable with fines up to €25,000 under §9 ArbMedVV',
      criminalLiability: false
    },
    relatedRegulations: ['ArbSchG', 'ASiG', 'DGUV-V4'],
    officialReference: 'BGBl. I S. 2768'
  },
  {
    id: 'de-lasv',
    type: 'ordinance',
    titleDE: 'Lärm- und Vibrations-Arbeitsschutzverordnung',
    titleEN: 'Noise and Vibration Protection Ordinance',
    shortName: 'LärmVibrationsArbSchV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2007-03-06',
    lastAmended: '2017-06-19',
    keyObligations: [
      {
        obligation: 'Lärmpegel messen und bewerten',
        responsibleParty: 'employer',
        description: 'Measure and assess noise exposure levels at workplace; trigger values: 80 dB(A) and 85 dB(A) (§3 LärmVibrationsArbSchV)'
      },
      {
        obligation: 'Gehörschutz bereitstellen',
        responsibleParty: 'employer',
        description: 'Provide hearing protection at 80 dB(A), mandatory use at 85 dB(A) or peak level 137 dB(C)'
      },
      {
        obligation: 'Lärmminderungsprogramm erstellen',
        responsibleParty: 'employer',
        description: 'Develop noise reduction program if exposure limits exceeded (§3 Abs. 2)'
      },
      {
        obligation: 'Kennzeichnung von Lärmbereichen',
        responsibleParty: 'employer',
        description: 'Mark areas with noise levels above 85 dB(A) with warning signs and restrict access'
      },
      {
        obligation: 'Vibrationsexposition bewerten',
        responsibleParty: 'employer',
        description: 'Assess hand-arm and whole-body vibration exposure according to trigger and exposure limit values (§6-9)'
      },
      {
        obligation: 'Vorsorge bei Lärmexposition',
        responsibleParty: 'employer',
        description: 'Offer occupational health examinations at 80 dB(A), mandatory at 85 dB(A) according to ArbMedVV'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 50000,
      description: 'Violations can result in fines up to €50,000. Negligent exposure causing hearing damage may lead to criminal charges',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'ArbMedVV', 'TRLV-Lärm'],
    officialReference: 'BGBl. I S. 261'
  },
  {
    id: 'de-biovv',
    type: 'ordinance',
    titleDE: 'Biostoffverordnung',
    titleEN: 'Biological Agents Ordinance',
    shortName: 'BioStoffV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '2013-07-15',
    lastAmended: '2021-05-11',
    keyObligations: [
      {
        obligation: 'Gefährdungsbeurteilung für Biostoffe',
        responsibleParty: 'employer',
        description: 'Conduct specific risk assessment for biological agents classified in risk groups 1-4 (§4-6 BioStoffV)'
      },
      {
        obligation: 'Schutzstufen festlegen',
        responsibleParty: 'employer',
        description: 'Determine and implement appropriate protection levels (Schutzstufen 1-4) based on biological agent classification'
      },
      {
        obligation: 'Betriebsanweisung für Biostoffe',
        responsibleParty: 'employer',
        description: 'Create specific operating instructions for handling biological agents (§14 BioStoffV)'
      },
      {
        obligation: 'Hygienemaßnahmen umsetzen',
        responsibleParty: 'employer',
        description: 'Implement hygiene measures including hand washing facilities, separate storage of work and personal clothing'
      },
      {
        obligation: 'Impfangebot bei Infektionsgefährdung',
        responsibleParty: 'employer',
        description: 'Offer vaccinations when employees are at risk of infection and effective vaccines are available (§13 BioStoffV)'
      },
      {
        obligation: 'Tätigkeiten mit Biostoffen melden',
        responsibleParty: 'employer',
        description: 'Report activities involving biological agents of risk groups 2-4 to the competent authority before commencing work'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 50000,
      description: 'Violations can result in fines up to €50,000. Negligent exposure causing infection or disease may lead to criminal prosecution',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'ArbMedVV', 'TRBA-100'],
    officialReference: 'BGBl. I S. 2514'
  },
  {
    id: 'de-psgvu',
    type: 'ordinance',
    titleDE: 'PSA-Benutzungsverordnung',
    titleEN: 'Personal Protective Equipment Use Ordinance',
    shortName: 'PSA-BV',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '1996-12-04',
    lastAmended: '2019-06-20',
    keyObligations: [
      {
        obligation: 'PSA kostenlos bereitstellen',
        responsibleParty: 'employer',
        description: 'Provide appropriate personal protective equipment (PPE) free of charge after risk assessment (§2 PSA-BV)'
      },
      {
        obligation: 'PSA-Auswahl dokumentieren',
        responsibleParty: 'employer',
        description: 'Document PPE selection based on hazard assessment and ensure CE marking compliance'
      },
      {
        obligation: 'Unterweisung zur PSA-Benutzung',
        responsibleParty: 'employer',
        description: 'Provide instruction and training on correct use, maintenance, and limitations of PPE (§3 PSA-BV)'
      },
      {
        obligation: 'PSA instand halten',
        responsibleParty: 'employer',
        description: 'Maintain PPE in hygienic and functional condition; replace damaged equipment immediately'
      },
      {
        obligation: 'PSA bestimmungsgemäß benutzen',
        responsibleParty: 'employee',
        description: 'Use provided PPE as instructed and report defects immediately (§3 PSA-BV)'
      },
      {
        obligation: 'PSA-Liste führen',
        responsibleParty: 'employer',
        description: 'Maintain register of all PPE provided to employees including issue dates and inspection records'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 25000,
      description: 'Violations can result in fines up to €25,000. Accidents due to missing or defective PPE may lead to criminal charges',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'PSA-Verordnung-EU-2016/425', 'DGUV-R112-189'],
    officialReference: 'BGBl. I S. 1841'
  },
  {
    id: 'de-mutterschg',
    type: 'law',
    titleDE: 'Mutterschutzgesetz',
    titleEN: 'Maternity Protection Act',
    shortName: 'MuSchG',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Familie, Senioren, Frauen und Jugend (BMFSFJ)',
    effectiveDate: '2018-01-01',
    lastAmended: '2024-01-01',
    keyObligations: [
      {
        obligation: 'Gefährdungsbeurteilung für Schwangere',
        responsibleParty: 'employer',
        description: 'Conduct risk assessment for pregnant and breastfeeding women for all workplace activities (§10 MuSchG)'
      },
      {
        obligation: 'Unverantwortbare Gefährdungen vermeiden',
        responsibleParty: 'employer',
        description: 'Eliminate or minimize unacceptable hazards through workplace modifications or job reassignment (§9 MuSchG)'
      },
      {
        obligation: 'Beschäftigungsverbote beachten',
        responsibleParty: 'employer',
        description: 'Observe employment prohibitions: 6 weeks before and 8 weeks after childbirth (12 weeks for premature/multiple births)'
      },
      {
        obligation: 'Mehrarbeit und Nachtarbeit vermeiden',
        responsibleParty: 'employer',
        description: 'Prohibit overtime, night work (20:00-06:00), and Sunday/holiday work with specific exceptions (§5-6 MuSchG)'
      },
      {
        obligation: 'Mitteilungspflicht an Aufsichtsbehörde',
        responsibleParty: 'employer',
        description: 'Notify supervisory authority immediately upon receiving notification of pregnancy (§27 MuSchG)'
      },
      {
        obligation: 'Stillzeit ermöglichen',
        responsibleParty: 'employer',
        description: 'Provide breastfeeding breaks (minimum 2x30 minutes or 1x60 minutes daily) during first 12 months (§7 MuSchG)'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 30000,
      description: 'Violations can result in fines up to €30,000 under §32 MuSchG. Serious violations may lead to criminal prosecution',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'ArbZG', 'MuSchRiV'],
    officialReference: 'BGBl. I S. 2152'
  },
  {
    id: 'de-arbzg',
    type: 'law',
    titleDE: 'Arbeitszeitgesetz',
    titleEN: 'Working Time Act',
    shortName: 'ArbZG',
    jurisdiction: 'federal',
    issuingAuthority: 'Bundesministerium für Arbeit und Soziales (BMAS)',
    effectiveDate: '1994-07-06',
    lastAmended: '2023-08-28',
    keyObligations: [
      {
        obligation: 'Arbeitszeit begrenzen',
        responsibleParty: 'employer',
        description: 'Limit daily working time to maximum 8 hours (extendable to 10 hours if compensated within 6 months) (§3 ArbZG)'
      },
      {
        obligation: 'Ruhepausen gewähren',
        responsibleParty: 'employer',
        description: 'Provide mandatory breaks: 30 minutes for work exceeding 6 hours, 45 minutes for work exceeding 9 hours (§4 ArbZG)'
      },
      {
        obligation: 'Ruhezeit einhalten',
        responsibleParty: 'employer',
        description: 'Ensure minimum 11 consecutive hours of rest between work shifts (§5 ArbZG)'
      },
      {
        obligation: 'Sonn- und Feiertagsruhe',
        responsibleParty: 'employer',
        description: 'Prohibit work on Sundays and public holidays from 00:00 to 24:00 with specific exceptions (§9 ArbZG)'
      },
      {
        obligation: 'Nachtarbeit berücksichtigen',
        responsibleParty: 'employer',
        description: 'Provide health examinations for night workers and compensatory time off or wage premium (§6 ArbZG)'
      },
      {
        obligation: 'Arbeitszeitaufzeichnung führen',
        responsibleParty: 'employer',
        description: 'Record working hours exceeding 8 hours, Sunday/holiday work, and night work; retain for 2 years (§16 ArbZG)'
      }
    ],
    penalties: {
      minEUR: 0,
      maxEUR: 30000,
      description: 'Violations can result in fines up to €30,000 under §22 ArbZG. Willful or repeated violations may lead to criminal prosecution with prison sentences up to 1 year',
      criminalLiability: true
    },
    relatedRegulations: ['ArbSchG', 'MuSchG', 'JArbSchG'],
    officialReference: 'BGBl. I S. 1170'
  }
];

/**
 * Helper function to get legislation by ID
 */
export function getLegislationById(id: string): LegislativeActDE | undefined {
  return legislatieDeSSM.find(act => act.id === id);
}

/**
 * Helper function to filter legislation by type
 */
export function getLegislationByType(type: LegislativeActDE['type']): LegislativeActDE[] {
  return legislatieDeSSM.filter(act => act.type === type);
}

/**
 * Helper function to search legislation by keyword (searches in titleDE, titleEN, shortName)
 */
export function searchLegislation(keyword: string): LegislativeActDE[] {
  const searchTerm = keyword.toLowerCase();
  return legislatieDeSSM.filter(act =>
    act.titleDE.toLowerCase().includes(searchTerm) ||
    act.titleEN.toLowerCase().includes(searchTerm) ||
    act.shortName.toLowerCase().includes(searchTerm)
  );
}

/**
 * Helper function to get total count
 */
export function getLegislationCount(): number {
  return legislatieDeSSM.length;
}
