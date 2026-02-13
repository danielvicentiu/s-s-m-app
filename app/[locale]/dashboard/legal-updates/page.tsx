// app/[locale]/dashboard/legal-updates/page.tsx
// Feed Noutăți Legislative SSM/PSI
// Listă actualizări legislative recente cu filtrare pe țară și impact

import { createSupabaseServer, getCurrentUserOrgs } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LegalUpdatesClient from './LegalUpdatesClient'

export default async function LegalUpdatesPage() {
  const supabase = await createSupabaseServer()
  const { user } = await getCurrentUserOrgs()

  if (!user) redirect('/login')

  // Fetch legal updates (dacă tabela există; altfel returnează mock data)
  // În implementarea finală, această funcție va citi din tabela legal_updates
  const { data: legalUpdates } = await supabase
    .from('legal_updates')
    .select('*')
    .order('publication_date', { ascending: false })
    .limit(50)
    .maybeSingle()

  // Mock data pentru demonstrație (până când tabela e creată)
  const mockUpdates = [
    {
      id: '1',
      country_code: 'RO',
      title: 'Modificări HG 1425/2006 - Echipamente de protecție individuală',
      summary: 'Noi cerințe pentru documentarea și evidența EPI în industriile cu risc ridicat. Se introduce obligativitatea înregistrării digitale a distribuției EPI și confirmarea primirii de către angajați.',
      publication_date: '2026-02-10',
      impact: 'mare',
      action_required: 'Actualizați procedura de distribuire EPI și implementați sistem de evidență digitală până la 1 martie 2026',
      source_url: 'https://www.monitoruloficial.ro',
      legal_act_number: 'HG 1425/2006 modificat',
      created_at: '2026-02-10T10:00:00Z'
    },
    {
      id: '2',
      country_code: 'RO',
      title: 'Legea 319/2006 - Actualizare praguri amenzi SSM',
      summary: 'Actualizare cuantum amenzi pentru neconformități SSM. Amenzile pentru lipsa instruirii SSM cresc cu 40%, iar cele pentru echipamente expirate cu 25%.',
      publication_date: '2026-02-08',
      impact: 'mare',
      action_required: 'Verificați conformitatea documentației SSM și instruirilor pentru a evita sancțiuni majorate',
      source_url: 'https://www.inspectiamuncii.ro',
      legal_act_number: 'Legea 319/2006 art. 27',
      created_at: '2026-02-08T09:30:00Z'
    },
    {
      id: '3',
      country_code: 'BG',
      title: 'Наредба за изменение на Наредба № РД-07-2 - Медицински прегледи',
      summary: 'Нови срокове за периодичните медицински прегледи при работници с нощен труд: от 12 месеца на 9 месеца за работници над 50 години.',
      publication_date: '2026-02-05',
      impact: 'mediu',
      action_required: 'Reprogramați medicale pentru angajații 50+ în schimburi de noapte',
      source_url: 'https://www.gli.government.bg',
      legal_act_number: 'РД-07-2/2009',
      created_at: '2026-02-05T14:20:00Z'
    },
    {
      id: '4',
      country_code: 'RO',
      title: 'ORDIN 3/2026 - Formulare actualizate PSI',
      summary: 'Actualizare formular autorizație PSI și documentație aferentă pentru obținerea avizului de funcționare. Include noi cerințe pentru planurile de evacuare digitale.',
      publication_date: '2026-02-01',
      impact: 'mediu',
      action_required: 'Actualizați dosarele PSI cu noile formulare până la reînnoirea următoare',
      source_url: 'https://www.igsu.ro',
      legal_act_number: 'ORDIN 3/2026 IGSU',
      created_at: '2026-02-01T11:00:00Z'
    },
    {
      id: '5',
      country_code: 'HU',
      title: '5/2020. (II. 7.) ITM rendelet módosítás - Tűzvédelem',
      summary: 'A tűzvédelmi dokumentáció frissítési kötelezettségének változása: évi 1-ről évi 2-re emelkedik a nagy kockázatú létesítményekben.',
      publication_date: '2026-01-28',
      impact: 'mediu',
      action_required: 'Ellenőrizze, hogy a tűzvédelmi dokumentáció naprakész-e',
      source_url: 'https://www.magyarkozlony.hu',
      legal_act_number: '5/2020. (II. 7.) ITM rendelet',
      created_at: '2026-01-28T08:45:00Z'
    },
    {
      id: '6',
      country_code: 'PL',
      title: 'Rozporządzenie MPiPS - Aktualizacja szkoleń BHP',
      summary: 'Nowe wymagania dotyczące szkoleń okresowych BHP: wprowadzenie obligatoryjnego modułu e-learning dla pracowników administracyjnych.',
      publication_date: '2026-01-25',
      impact: 'mic',
      action_required: 'Włącz moduł e-learning do programu szkoleń BHP',
      source_url: 'https://www.pip.gov.pl',
      legal_act_number: 'Dz.U. 2026 poz. 156',
      created_at: '2026-01-25T10:15:00Z'
    },
    {
      id: '7',
      country_code: 'DE',
      title: 'DGUV Vorschrift 1 - Änderung Ersthelfer-Ausbildung',
      summary: 'Anpassung der Ersthelfer-Ausbildung: Auffrischungskurse nun alle 2 Jahre statt 3 Jahre erforderlich in Betrieben ab 50 Mitarbeitern.',
      publication_date: '2026-01-20',
      impact: 'mediu',
      action_required: 'Überprüfen Sie Ablaufdaten der Ersthelfer-Zertifikate',
      source_url: 'https://www.dguv.de',
      legal_act_number: 'DGUV Vorschrift 1',
      created_at: '2026-01-20T09:00:00Z'
    },
    {
      id: '8',
      country_code: 'RO',
      title: 'Precizări ITM - Raportare accidente ușoare',
      summary: 'Clarificări privind obligația raportării accidentelor de muncă ușoare: se introduce raportarea online obligatorie în termen de 24h.',
      publication_date: '2026-01-15',
      impact: 'mic',
      action_required: 'Familiarizați echipa cu noua platformă de raportare online',
      source_url: 'https://www.inspectiamuncii.ro',
      legal_act_number: 'Nota ITM 12/2026',
      created_at: '2026-01-15T13:30:00Z'
    }
  ]

  return (
    <LegalUpdatesClient
      user={{ id: user.id, email: user.email || '' }}
      legalUpdates={legalUpdates ? [legalUpdates] : mockUpdates}
    />
  )
}
