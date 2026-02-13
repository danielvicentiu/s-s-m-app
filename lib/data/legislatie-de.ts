/**
 * German Occupational Safety and Health Legislation
 * Main regulations for SSM (Arbeitsschutz) in Germany
 */

export interface LegislationDE {
  id: string;
  title: string;
  titleDE: string;
  abbreviation: string;
  domain: 'ssm' | 'psi' | 'both';
  description: string;
}

export const legislatieDE: LegislationDE[] = [
  {
    id: 'arbschg',
    title: 'Occupational Safety and Health Act',
    titleDE: 'Arbeitsschutzgesetz',
    abbreviation: 'ArbSchG',
    domain: 'ssm',
    description: 'Grundlegendes Gesetz zum Schutz von Sicherheit und Gesundheit der Beschäftigten bei der Arbeit. Regelt Pflichten des Arbeitgebers zur Gefährdungsbeurteilung, Unterweisung und Organisation des Arbeitsschutzes.'
  },
  {
    id: 'betrsichv',
    title: 'Industrial Safety Ordinance',
    titleDE: 'Betriebssicherheitsverordnung',
    abbreviation: 'BetrSichV',
    domain: 'ssm',
    description: 'Verordnung über Sicherheit und Gesundheitsschutz bei der Verwendung von Arbeitsmitteln. Regelt Prüffristen, Betriebsanweisungen und sichere Verwendung von Maschinen und Anlagen.'
  },
  {
    id: 'arbstattv',
    title: 'Workplace Ordinance',
    titleDE: 'Arbeitsstättenverordnung',
    abbreviation: 'ArbStättV',
    domain: 'ssm',
    description: 'Verordnung über Arbeitsstätten. Regelt Anforderungen an die Einrichtung und den Betrieb von Arbeitsstätten, einschließlich Beleuchtung, Klima, Sanitärräume und Verkehrswege.'
  },
  {
    id: 'gefstoffv',
    title: 'Hazardous Substances Ordinance',
    titleDE: 'Gefahrstoffverordnung',
    abbreviation: 'GefStoffV',
    domain: 'ssm',
    description: 'Verordnung zum Schutz vor Gefahrstoffen. Regelt den Umgang mit chemischen Stoffen, Kennzeichnung, Substitutionsprüfung, Betriebsanweisungen und arbeitsmedizinische Vorsorge.'
  },
  {
    id: 'lasthandhabv',
    title: 'Manual Handling of Loads Ordinance',
    titleDE: 'Lastenhandhabungsverordnung',
    abbreviation: 'LasthandhabV',
    domain: 'ssm',
    description: 'Verordnung über Sicherheit und Gesundheitsschutz bei der manuellen Handhabung von Lasten bei der Arbeit. Schützt vor Gesundheitsschäden durch Heben, Tragen und Bewegen von Lasten.'
  },
  {
    id: 'bildscharbv',
    title: 'Screen Work Ordinance',
    titleDE: 'Bildschirmarbeitsverordnung',
    abbreviation: 'BildscharbV',
    domain: 'ssm',
    description: 'Verordnung über Sicherheit und Gesundheitsschutz bei der Arbeit an Bildschirmgeräten. Regelt ergonomische Anforderungen, Augenuntersuchungen und Bildschirmpausen.'
  },
  {
    id: 'asig',
    title: 'Occupational Safety Act',
    titleDE: 'Arbeitssicherheitsgesetz',
    abbreviation: 'ASiG',
    domain: 'ssm',
    description: 'Gesetz über Betriebsärzte, Sicherheitsingenieure und andere Fachkräfte für Arbeitssicherheit. Regelt die betriebliche Organisation des Arbeitsschutzes und Bestellung von Fachkräften.'
  },
  {
    id: 'biostoffv',
    title: 'Biological Agents Ordinance',
    titleDE: 'Biostoffverordnung',
    abbreviation: 'BioStoffV',
    domain: 'ssm',
    description: 'Verordnung über Sicherheit und Gesundheitsschutz bei Tätigkeiten mit Biologischen Arbeitsstoffen. Schützt vor Infektionen, sensibilisierenden und toxischen Wirkungen.'
  },
  {
    id: 'laermvibrationsarbschv',
    title: 'Noise and Vibration Ordinance',
    titleDE: 'Lärm- und Vibrations-Arbeitsschutzverordnung',
    abbreviation: 'LärmVibrationsArbSchV',
    domain: 'ssm',
    description: 'Verordnung zum Schutz der Beschäftigten vor Gefährdungen durch Lärm und Vibrationen. Legt Auslöse- und Expositionsgrenzwerte fest und regelt Schutzmaßnahmen.'
  },
  {
    id: 'arbmedvv',
    title: 'Occupational Health Care Ordinance',
    titleDE: 'Verordnung zur arbeitsmedizinischen Vorsorge',
    abbreviation: 'ArbMedVV',
    domain: 'ssm',
    description: 'Verordnung zur arbeitsmedizinischen Vorsorge. Regelt Pflicht-, Angebots- und Wunschvorsorge bei Tätigkeiten mit besonderen Gefährdungen wie Gefahrstoffen, Biostoffen oder Bildschirmarbeit.'
  }
];
