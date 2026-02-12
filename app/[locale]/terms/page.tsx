import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termeni și Condiții | S-S-M.ro',
  description: 'Termeni și condiții de utilizare a platformei S-S-M.ro pentru consultanți SSM/PSI și firme',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Termeni și Condiții
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Data ultimei actualizări: 13 februarie 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          {/* 1. Definiții */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Definiții
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>Platforma</strong> sau <strong>Serviciul</strong> – aplicația web disponibilă la adresa{' '}
                <a href="https://app.s-s-m.ro" className="text-blue-600 hover:underline">
                  app.s-s-m.ro
                </a>
                , destinată gestionării activităților de securitate și sănătate în muncă (SSM) și prevenire și stingere a incendiilor (PSI).
              </p>
              <p>
                <strong>Furnizor</strong> – entitatea care operează și administrează Platforma S-S-M.ro.
              </p>
              <p>
                <strong>Utilizator</strong> – orice persoană fizică sau juridică care își creează un cont și utilizează Serviciul, inclusiv consultanți SSM/PSI și reprezentanți ai firmelor.
              </p>
              <p>
                <strong>Cont</strong> – contul personal creat de Utilizator pentru accesarea Platformei.
              </p>
              <p>
                <strong>Conținut</strong> – orice date, informații, documente, fișiere sau materiale încărcate sau generate de Utilizator în cadrul Platformei.
              </p>
            </div>
          </section>

          {/* 2. Obiectul Serviciului */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Obiectul Serviciului
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Platforma S-S-M.ro oferă o soluție digitală pentru gestionarea conformității în domeniul securității și sănătății în muncă (SSM) și prevenirii și stingerii incendiilor (PSI), incluzând dar fără a se limita la:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestionarea dosarelor medicale ale angajaților</li>
                <li>Evidența și planificarea instruirilor SSM și PSI</li>
                <li>Managementul echipamentelor de protecție și stingere</li>
                <li>Generarea de rapoarte și documente specifice</li>
                <li>Sistem de alerte și notificări automate</li>
                <li>Gestionarea relației consultant-firmă</li>
              </ul>
              <p>
                Serviciul este disponibil în limba română, bulgară, engleză, maghiară și germană.
              </p>
            </div>
          </section>

          {/* 3. Înregistrare și Cont */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Înregistrare și Cont
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>3.1.</strong> Pentru utilizarea Platformei, este necesară crearea unui Cont prin furnizarea unor informații exacte și complete.
              </p>
              <p>
                <strong>3.2.</strong> Utilizatorul se obligă să mențină confidențialitatea datelor de autentificare (email și parolă) și să notifice imediat Furnizorul în cazul oricărei utilizări neautorizate a Contului.
              </p>
              <p>
                <strong>3.3.</strong> Utilizatorul este responsabil pentru toate activitățile desfășurate prin intermediul Contului său.
              </p>
              <p>
                <strong>3.4.</strong> Furnizorul își rezervă dreptul de a refuza înregistrarea sau de a suspenda/închide Conturi care încalcă prezentii Termeni și Condiții.
              </p>
              <p>
                <strong>3.5.</strong> Conturile pot avea diferite roluri (consultant SSM/PSI, administrator firmă, angajat), fiecare cu drepturi de acces specifice.
              </p>
            </div>
          </section>

          {/* 4. Obligații Utilizator */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Obligațiile Utilizatorului
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>Utilizatorul se obligă să:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizeze Platforma în conformitate cu legislația în vigoare</li>
                <li>Furnizeze informații exacte, complete și actualizate</li>
                <li>Nu încerce să acceseze zone sau funcționalități pentru care nu are autorizare</li>
                <li>Nu utilizeze Platforma în scopuri ilegale sau neautorizate</li>
                <li>Nu încerce să compromită securitatea sau integritatea Platformei</li>
                <li>Nu încarce conținut ilegal, defăimător, obscen sau care încalcă drepturile terților</li>
                <li>Respecte drepturile de proprietate intelectuală ale Furnizorului și ale terților</li>
                <li>Nu distribuie sau revândă accesul la Platformă fără acordul prealabil scris al Furnizorului</li>
              </ul>
            </div>
          </section>

          {/* 5. Obligații Furnizor */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Obligațiile Furnizorului
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>Furnizorul se obligă să:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Asigure funcționarea Platformei în condiții optime, cu excepția perioadelor de mentenanță planificată</li>
                <li>Protejeze datele Utilizatorilor conform legislației aplicabile în materie de protecție a datelor personale</li>
                <li>Ofere suport tehnic pentru problemele legate de funcționarea Platformei</li>
                <li>Notifice Utilizatorii cu privire la modificările semnificative ale Serviciului sau ale Termenilor și Condițiilor</li>
                <li>Realizeze backup-uri regulate ale datelor</li>
              </ul>
            </div>
          </section>

          {/* 6. Proprietate Intelectuală */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Proprietate Intelectuală
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>6.1.</strong> Toate drepturile de proprietate intelectuală asupra Platformei, inclusiv design, cod sursă, logo, mărci și interfață, aparțin Furnizorului.
              </p>
              <p>
                <strong>6.2.</strong> Utilizatorul primește o licență limitată, non-exclusivă și revocabilă de utilizare a Platformei, strict pentru scopurile prevăzute în prezentii Termeni și Condiții.
              </p>
              <p>
                <strong>6.3.</strong> Conținutul încărcat de Utilizator rămâne proprietatea acestuia. Prin încărcarea Conținutului, Utilizatorul acordă Furnizorului o licență de utilizare necesară pentru prestarea Serviciului (stocare, procesare, afișare).
              </p>
              <p>
                <strong>6.4.</strong> Este interzisă copierea, modificarea, distribuirea sau utilizarea în orice mod a elementelor Platformei fără acordul prealabil scris al Furnizorului.
              </p>
            </div>
          </section>

          {/* 7. Protecția Datelor cu Caracter Personal */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Protecția Datelor cu Caracter Personal
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>7.1.</strong> Furnizorul prelucrează datele cu caracter personal ale Utilizatorilor în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația română aplicabilă.
              </p>
              <p>
                <strong>7.2.</strong> Detalii complete privind prelucrarea datelor personale sunt disponibile în Politica de Confidențialitate.
              </p>
              <p>
                <strong>7.3.</strong> Utilizatorul are dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție cu privire la datele sale personale.
              </p>
              <p>
                <strong>7.4.</strong> Utilizatorul care încarcă date personale ale angajaților sau ale terților își asumă responsabilitatea pentru legalitatea prelucrării și pentru obținerea consimțământului necesar.
              </p>
            </div>
          </section>

          {/* 8. Limitarea Răspunderii */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Limitarea Răspunderii
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>8.1.</strong> Platforma este furnizată „ca atare", fără garanții de niciun fel, exprese sau implicite.
              </p>
              <p>
                <strong>8.2.</strong> Furnizorul nu garantează că Serviciul va fi neîntrerupt, fără erori sau complet securizat împotriva accesului neautorizat.
              </p>
              <p>
                <strong>8.3.</strong> Furnizorul nu este responsabil pentru:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pierderea de date cauzată de acțiuni ale Utilizatorului sau ale terților</li>
                <li>Daune indirecte, incidentale sau consecvente rezultate din utilizarea sau imposibilitatea utilizării Platformei</li>
                <li>Conținutul încărcat de Utilizatori sau acuratețea informațiilor furnizate de aceștia</li>
                <li>Decizii luate pe baza informațiilor din Platformă</li>
                <li>Întreruperi cauzate de forță majoră, probleme de rețea sau terți</li>
              </ul>
              <p>
                <strong>8.4.</strong> Utilizatorul este singurul responsabil pentru conformitatea cu legislația SSM/PSI și pentru deciziile de business luate pe baza datelor din Platformă.
              </p>
            </div>
          </section>

          {/* 9. Disponibilitate și Mentenanță */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Disponibilitate și Mentenanță
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>9.1.</strong> Furnizorul depune eforturi rezonabile pentru a asigura disponibilitatea Platformei 24/7, cu excepția perioadelor de mentenanță planificată.
              </p>
              <p>
                <strong>9.2.</strong> Furnizorul își rezervă dreptul de a întrerupe temporar Serviciul pentru actualizări, îmbunătățiri sau mentenanță, notificând Utilizatorii când este posibil.
              </p>
              <p>
                <strong>9.3.</strong> În caz de probleme tehnice majore, Furnizorul va depune eforturi rezonabile pentru restabilirea Serviciului în cel mai scurt timp.
              </p>
            </div>
          </section>

          {/* 10. Modificări ale Serviciului */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Modificări ale Serviciului și Termenilor
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>10.1.</strong> Furnizorul își rezervă dreptul de a modifica, suspenda sau întrerupe orice aspect al Platformei, inclusiv funcționalități, prețuri sau disponibilitate.
              </p>
              <p>
                <strong>10.2.</strong> Termenii și Condițiile pot fi modificate periodic. Utilizatorii vor fi notificați cu privire la modificări semnificative prin email sau prin intermediul Platformei.
              </p>
              <p>
                <strong>10.3.</strong> Continuarea utilizării Platformei după notificarea modificărilor constituie acceptarea noilor Termeni și Condiții.
              </p>
            </div>
          </section>

          {/* 11. Reziliere */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Reziliere
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>11.1.</strong> Utilizatorul poate închide Contul în orice moment prin intermediul setărilor Platformei sau contactând Furnizorul.
              </p>
              <p>
                <strong>11.2.</strong> Furnizorul își rezervă dreptul de a suspenda sau închide Contul unui Utilizator în cazul încălcării Termenilor și Condițiilor, fără notificare prealabilă și fără obligația de a restitui sume achitate.
              </p>
              <p>
                <strong>11.3.</strong> La încetarea Contului, Utilizatorul poate solicita exportul datelor sale într-un termen de 30 de zile. După această perioadă, Furnizorul poate șterge datele conform politicii de retenție.
              </p>
              <p>
                <strong>11.4.</strong> Prevederile care, prin natura lor, trebuie să supraviețuiască rezilierii (proprietate intelectuală, limitare răspundere, lege aplicabilă) vor rămâne în vigoare.
              </p>
            </div>
          </section>

          {/* 12. Lege Aplicabilă și Jurisdicție */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Lege Aplicabilă și Jurisdicție
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>12.1.</strong> Prezentii Termeni și Condiții sunt guvernați de legea română.
              </p>
              <p>
                <strong>12.2.</strong> Orice litigiu decurgând din sau în legătură cu prezentii Termeni și Condiții va fi soluționat pe cale amiabilă. În absența unei înțelegeri, litigiile vor fi de competența instanțelor judecătorești române competente.
              </p>
            </div>
          </section>

          {/* 13. Dispoziții Finale */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Dispoziții Finale
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>13.1.</strong> În cazul în care o prevedere a prezentilor Termeni și Condiții este declarată nulă sau inaplicabilă, celelalte prevederi rămân valabile și aplicabile.
              </p>
              <p>
                <strong>13.2.</strong> Neexercitarea de către Furnizor a oricărui drept prevăzut în prezentii Termeni nu constituie o renunțare la acel drept.
              </p>
              <p>
                <strong>13.3.</strong> Utilizatorul nu poate transfera sau cesiona drepturile și obligațiile decurgând din prezentii Termeni fără acordul prealabil scris al Furnizorului.
              </p>
            </div>
          </section>

          {/* 14. Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Contact
            </h2>
            <div className="text-gray-700 space-y-3">
              <p>
                Pentru întrebări, reclamații sau solicitări legate de prezentii Termeni și Condiții, vă rugăm să ne contactați:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="font-semibold">S-S-M.ro</p>
                <p>Email: contact@s-s-m.ro</p>
                <p>Website: <a href="https://app.s-s-m.ro" className="text-blue-600 hover:underline">app.s-s-m.ro</a></p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Prin utilizarea Platformei S-S-M.ro, confirmați că ați citit, înțeles și acceptat prezentii Termeni și Condiții.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
