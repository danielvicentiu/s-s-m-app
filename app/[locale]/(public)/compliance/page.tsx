'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Users,
  Clock,
  TrendingDown,
  Calculator,
  ArrowRight,
  Globe
} from 'lucide-react';

export default function CompliancePage() {
  const [employees, setEmployees] = useState(50);
  const [documents, setDocuments] = useState(200);

  // Savings calculator
  const traditionalCost = employees * 15 + documents * 5; // €15/employee + €5/document
  const platformCost = 199; // Monthly subscription
  const annualSavings = (traditionalCost - platformCost) * 12;
  const timeSaved = employees * 2; // 2 hours saved per employee annually

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conformitate Completă SSM/PSI
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Gestionați conformitatea cu legislația de securitate și sănătate în muncă
              din 5 țări europene dintr-o singură platformă digitală
            </p>
          </div>
        </div>
      </section>

      {/* Legislation Coverage by Country */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Legislație Acoperită per Țară
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platforma noastră vă ajută să respectați toate cerințele legale în materie de SSM și PSI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Romania */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  RO
                </div>
                <h3 className="text-xl font-bold text-gray-900">România</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Legea 319/2006 (SSM)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">HG 1425/2006 (competențe SSM)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Legea 307/2006 (PSI)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ordinul 537/2007 (echipamente)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">HG 1091/2006 (risc incendiu)</span>
                </li>
              </ul>
            </div>

            {/* Bulgaria */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  BG
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bulgaria</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Закон за здравословни и безопасни условия на труд</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Наредба № 3 (периодични инструктажи)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Наредба № РД-07-2 (пожарна безопасност)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Кодекс на труда (медицински прегледи)</span>
                </li>
              </ul>
            </div>

            {/* Hungary */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  HU
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ungaria</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1993. évi XCIII. törvény (munkabiztonság)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">5/1993 MüM rendelet (oktatás)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">54/2014 BM rendelet (tűzvédelem)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">33/1998 NM rendelet (egészségügyi szolgálat)</span>
                </li>
              </ul>
            </div>

            {/* Germany */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  DE
                </div>
                <h3 className="text-xl font-bold text-gray-900">Germania</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Arbeitsschutzgesetz (ArbSchG)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">DGUV Vorschrift 1 (instruire)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Arbeitsstättenverordnung (ASR)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Betriebssicherheitsverordnung (BetrSichV)</span>
                </li>
              </ul>
            </div>

            {/* Poland */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                  PL
                </div>
                <h3 className="text-xl font-bold text-gray-900">Polonia</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Kodeks pracy (art. 207-237¹⁵)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rozporządzenie w sprawie BHP</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ustawa o ochronie przeciwpożarowej</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rozporządzenie w sprawie szkoleń BHP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help You Stay Compliant */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cum Vă Ajutăm să Fiți Conformi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platformă completă pentru gestionarea conformității SSM/PSI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Documente Automatizate
              </h3>
              <p className="text-gray-600">
                Generați automat registre obligatorii, planuri de evacuare,
                fișe de instruire și documente de conformitate pentru fiecare țară.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Alerte Automate
              </h3>
              <p className="text-gray-600">
                Notificări în timp real pentru expirări de acte, scadențe instruiri,
                controale medicale și verificări periodice ale echipamentelor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gestionare Angajați
              </h3>
              <p className="text-gray-600">
                Urmăriți istoric medical, instruiri, echipamente de protecție,
                incidente și certificări pentru fiecare angajat.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Rapoarte de Conformitate
              </h3>
              <p className="text-gray-600">
                Rapoarte detaliate de conformitate cu legislația,
                identificarea riscurilor și statistici pentru inspecții ITM.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Evaluări de Risc
              </h3>
              <p className="text-gray-600">
                Șabloane predefinite pentru evaluări de risc SSM/PSI adaptate
                la specificul fiecărei țări și domeniu de activitate.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Multilingv
              </h3>
              <p className="text-gray-600">
                Interfață și documente în 5 limbi (RO, BG, EN, HU, DE),
                cu terminologie specifică legislației fiecărei țări.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional vs Digital Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Consultanță Digitală vs Tradițională
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De ce să alegeți platforma noastră în loc de consultanță clasică
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional Consulting */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Consultanță Tradițională
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Costuri mari și variabile</p>
                    <p className="text-gray-600 text-sm">€500-2000/lună pentru fiecare locație</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Documentație în Excel/Word</p>
                    <p className="text-gray-600 text-sm">Greu de urmărit, actualizat manual</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Fără alerte automate</p>
                    <p className="text-gray-600 text-sm">Depindeți de apeluri/email-uri din partea consultantului</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Disponibilitate limitată</p>
                    <p className="text-gray-600 text-sm">Vizite lunare sau trimestriale</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Raportare manuală</p>
                    <p className="text-gray-600 text-sm">Fără statistici în timp real</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Greu de scalat</p>
                    <p className="text-gray-600 text-sm">Fiecare țară nouă = un consultant nou</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Digital Platform */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-600">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Platforma s-s-m.ro
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Cost fix și transparent</p>
                    <p className="text-gray-600 text-sm">€199/lună pentru locații nelimitate</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Totul digital și centralizat</p>
                    <p className="text-gray-600 text-sm">Acces 24/7 la toate documentele și date</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Alerte automate inteligente</p>
                    <p className="text-gray-600 text-sm">Email/SMS cu 30 zile înainte de expirări</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Disponibil oricând</p>
                    <p className="text-gray-600 text-sm">Acces instant la date și rapoarte</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Dashboard în timp real</p>
                    <p className="text-gray-600 text-sm">Statistici și KPI-uri actualizate automat</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Scalare instantanee</p>
                    <p className="text-gray-600 text-sm">Adăugați țări noi cu un click</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Calculator className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Calculator Economii
            </h2>
            <p className="text-xl text-blue-100">
              Calculați cât puteți economisi trecând la platforma digitală
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Input: Employees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Număr angajați
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold text-blue-600">{employees}</span>
                  <span className="text-gray-600 ml-2">angajați</span>
                </div>
              </div>

              {/* Input: Documents */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Număr documente anual
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={documents}
                  onChange={(e) => setDocuments(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold text-blue-600">{documents}</span>
                  <span className="text-gray-600 ml-2">documente</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Traditional Cost */}
                <div className="bg-red-50 rounded-xl p-6 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Consultanță Tradițională
                  </p>
                  <p className="text-3xl font-bold text-red-600 mb-1">
                    €{traditionalCost.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">pe lună</p>
                </div>

                {/* Platform Cost */}
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Platforma s-s-m.ro
                  </p>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    €{platformCost}
                  </p>
                  <p className="text-xs text-gray-500">pe lună</p>
                </div>

                {/* Annual Savings */}
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Economie Anuală
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    €{annualSavings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">pe an</p>
                </div>
              </div>

              {/* Additional Benefits */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center bg-purple-50 rounded-xl p-4">
                  <TrendingDown className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">
                      Reducere costuri: {Math.round((1 - platformCost/traditionalCost) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      față de consultanța clasică
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 rounded-xl p-4">
                  <Clock className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">
                      ~{timeSaved} ore economisie
                    </p>
                    <p className="text-sm text-gray-600">
                      pe an pentru management
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Începe perioada de probă gratuită
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <p className="text-sm text-gray-500 mt-4">
                14 zile gratuit, fără card necesar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gata să Simplificați Conformitatea SSM/PSI?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Alăturați-vă celor peste 100+ companii care și-au digitalizat
            procesele de conformitate cu s-s-m.ro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Începe perioada de probă gratuită
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors border-2 border-gray-300"
            >
              Contactează-ne
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
