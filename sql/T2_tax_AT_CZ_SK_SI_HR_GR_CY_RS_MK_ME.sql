-- T2_tax_AT_CZ_SK_SI_HR_GR_CY_RS_MK_ME.sql
-- Tax information for Austria, Czech Republic, Slovakia, Slovenia, Croatia,
-- Greece, Cyprus, Serbia, North Macedonia, Montenegro
-- Generated: 2026-02-15
-- Data sources: Official tax authorities, PWC, KPMG tax summaries 2025-2026

-- =======================================================================================
-- AUSTRIA (AT) — 8 forms
-- =======================================================================================

-- AT-GMBH: Gesellschaft mit beschränkter Haftung (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-GMBH', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Standard corporate taxation', ARRAY['Standard', 'Small business exemption'],
  '23%', 'Progressive 0-55%', '27.5% (KESt)', 'Progressive 0-55%',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  '€10,000 (€5,000 cash minimum)', false, 'Minimum corporation tax: €500',
  'Annual corporate tax return, monthly/quarterly VAT', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Corporate tax reduced from 25% to 23% since 2024. Max contribution base €6,450/month (2025). Investment allowance doubled to 20% for Nov 2025-Dec 2026.'
);

-- AT-AG: Aktiengesellschaft (Stock Corporation)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-AG', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '23%', 'Progressive 0-55%', '27.5% (KESt)', 'Progressive 0-55%',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  '€70,000', false, 'Stricter reporting requirements, supervisory board required',
  'Annual audited financial statements, quarterly reports', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than GmbH. Subject to additional regulatory oversight.'
);

-- AT-OG: Offene Gesellschaft (General Partnership)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-OG', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Transparent taxation (pass-through)', ARRAY['Pass-through'],
  'N/A (pass-through)', 'Progressive 0-55% (partners)', 'N/A', 'Progressive 0-55%',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  'No minimum capital', false, 'Unlimited personal liability of partners',
  'Annual partnership return, partners taxed individually', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Transparent entity — profits taxed at partner level. Each partner liable for partnership debts.'
);

-- AT-KG: Kommanditgesellschaft (Limited Partnership)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-KG', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Transparent taxation (pass-through)', ARRAY['Pass-through'],
  'N/A (pass-through)', 'Progressive 0-55% (partners)', 'N/A', 'Progressive 0-55%',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  'No minimum capital', false, 'General partner has unlimited liability, limited partners have limited liability',
  'Annual partnership return, partners taxed individually', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Hybrid structure: at least one general partner (unlimited liability) and one limited partner (limited liability).'
);

-- AT-EU: Einzelunternehmen (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-EU', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Personal income taxation', ARRAY['Standard', 'Small business exemption (Kleinunternehmer)'],
  'N/A', 'Progressive 0-55%', 'N/A', 'Progressive 0-55%',
  'N/A (self-employed)', 'Self-employed: varies by activity (SVA/GSVG)',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly/quarterly VAT if applicable', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Self-employed individuals pay social contributions to SVA (Sozialversicherungsanstalt der Selbständigen) based on income.'
);

-- AT-VEREIN: Verein (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-VEREIN', 'AT',
  false, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial exempt'],
  'Exempt if non-profit status maintained', 'N/A', 'N/A', 'Progressive 0-55% (employees)',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  'No minimum capital', false, 'Tax-exempt if pursuing public benefit purposes',
  'Annual financial statements, limited reporting for small associations', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial activities may be subject to corporate tax.'
);

-- AT-GENO: Genossenschaft (Cooperative)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-GENO', 'AT',
  true, '€55,000 annual turnover', 20.0, '10% (essentials), 13% (reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '23%', 'Progressive 0-55%', '27.5% (KESt)', 'Progressive 0-55%',
  '21.23% + 3.7% (FLAF) + 3% (municipal) + 1.53% (pension fund)', '18.12%',
  'Varies (minimum 2 members)', false, 'Democratic governance structure',
  'Annual audited financial statements, cooperative reporting', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Member-owned enterprise. Subject to mandatory audits by cooperative associations.'
);

-- AT-ARZT: Arztpraxis (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'AT-ARZT', 'AT',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard', 'Pauschalierung (flat-rate expenses)'],
  'N/A', 'Progressive 0-55%', 'N/A', 'Progressive 0-55%',
  'N/A (self-employed)', 'Self-employed physicians: SVA (based on income)',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special record-keeping requirements', 'Finanzamt (Austrian Tax Office)', 'https://www.bmf.gv.at',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT under EU directives. Physicians pay social contributions to SVA.'
);

-- =======================================================================================
-- CZECH REPUBLIC (CZ) — 5 forms
-- =======================================================================================

-- CZ-SRO: Společnost s ručením omezeným (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CZ-SRO', 'CZ',
  true, 'CZK 2,000,000 annual turnover', 21.0, '12% (reduced), 0% (exports)',
  'Standard corporate taxation', ARRAY['Standard'],
  '21%', 'Progressive 15-23%', '7% (withholding on dividends)', 'Progressive 15-23%',
  '24.8% (social security) + 9% (health insurance) = 33.8%', '7.1% (social security) + 4.5% (health insurance) = 11.6%',
  'CZK 1 (symbolic since 2014)', false, NULL,
  'Annual corporate tax return, monthly VAT reporting', 'Finanční správa (Czech Tax Administration)', 'https://www.financnisprava.cz',
  '2025-01-01', NULL, '2026-02-15',
  'Corporate tax rate increased from 19% to 21% in 2025. Most common business entity in Czech Republic.'
);

-- CZ-AS: Akciová společnost (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CZ-AS', 'CZ',
  true, 'CZK 2,000,000 annual turnover', 21.0, '12% (reduced), 0% (exports)',
  'Standard corporate taxation', ARRAY['Standard'],
  '21%', 'Progressive 15-23%', '7% (withholding on dividends)', 'Progressive 15-23%',
  '24.8% (social security) + 9% (health insurance) = 33.8%', '7.1% (social security) + 4.5% (health insurance) = 11.6%',
  'CZK 2,000,000 (or CZK 80,000 for non-public)', false, 'Suitable for larger enterprises, can issue public shares',
  'Annual audited financial statements, stricter governance', 'Finanční správa (Czech Tax Administration)', 'https://www.financnisprava.cz',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital and more complex governance than SRO. Used for larger companies.'
);

-- CZ-OSVC: Osoba samostatně výdělečně činná (Self-Employed/Sole Trader)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CZ-OSVC', 'CZ',
  true, 'CZK 2,000,000 annual turnover', 21.0, '12% (reduced), 0% (exports)',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate expenses'],
  'N/A', 'Progressive 15-23%', 'N/A', 'Progressive 15-23%',
  'N/A (self-employed)', 'Main activity: CZK 5,720/month (2026), Secondary: CZK 1,574/month (2026)',
  'No minimum capital', false, NULL,
  'Annual income tax return, monthly VAT if applicable', 'Finanční správa (Czech Tax Administration)', 'https://www.financnisprava.cz',
  '2025-01-01', NULL, '2026-02-15',
  'MAJOR CHANGE for 2026: Minimum social contributions increase significantly. Main activity: CZK 5,720/month, health insurance: CZK 3,306/month.'
);

-- CZ-SPOLEK: Spolek (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CZ-SPOLEK', 'CZ',
  false, 'CZK 2,000,000 annual turnover', 21.0, '12% (reduced), 0% (exports)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 15-23% (employees)',
  '24.8% (social security) + 9% (health insurance) = 33.8%', '7.1% (social security) + 4.5% (health insurance) = 11.6%',
  'No minimum capital (minimum 3 members)', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small associations', 'Finanční správa (Czech Tax Administration)', 'https://www.financnisprava.cz',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be taxed at 21%.'
);

-- CZ-LEKAR: Lékař (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CZ-LEKAR', 'CZ',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate expenses'],
  'N/A', 'Progressive 15-23%', 'N/A', 'Progressive 15-23%',
  'N/A (self-employed)', 'Self-employed: CZK 5,720/month (main activity, 2026)',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'Finanční správa (Czech Tax Administration)', 'https://www.financnisprava.cz',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Subject to new 2026 self-employment contribution rules.'
);

-- =======================================================================================
-- SLOVAKIA (SK) — 5 forms
-- =======================================================================================

-- SK-SRO: Spoločnosť s ručením obmedzeným (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SK-SRO', 'SK',
  true, 'EUR 49,790 (2025)', 23.0, '19% (reduced), 5% (super-reduced)',
  'Progressive corporate taxation', ARRAY['Standard'],
  '10% (up to €100k), 21% (€100k-€5M), 24% (over €5M)', 'Progressive 19-35%', '7% (withholding)', 'Progressive 19-35%',
  'Approx. 35.2%', 'Approx. 13.4%',
  'EUR 5,000', false, 'Progressive CIT rates since 2025',
  'Annual corporate tax return, monthly VAT reporting', 'Finančná správa (Slovak Tax Administration)', 'https://www.financnasprava.sk',
  '2025-01-01', NULL, '2026-02-15',
  '2026 changes: Health insurance +1% (Jan 2026-Dec 2027). VAT on high-sugar foods rises to 23%.'
);

-- SK-AS: Akciová spoločnosť (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SK-AS', 'SK',
  true, 'EUR 49,790 (2025)', 23.0, '19% (reduced), 5% (super-reduced)',
  'Progressive corporate taxation', ARRAY['Standard'],
  '10% (up to €100k), 21% (€100k-€5M), 24% (over €5M)', 'Progressive 19-35%', '7% (withholding)', 'Progressive 19-35%',
  'Approx. 35.2%', 'Approx. 13.4%',
  'EUR 25,000', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'Finančná správa (Slovak Tax Administration)', 'https://www.financnasprava.sk',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than SRO. Can issue public shares.'
);

-- SK-SZCO: Samostatne zárobkovo činná osoba (Self-Employed)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SK-SZCO', 'SK',
  true, 'EUR 49,790 (2025)', 23.0, '19% (reduced), 5% (super-reduced)',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate expenses'],
  'N/A', 'Progressive 19-35%', 'N/A', 'Progressive 19-35%',
  'N/A (self-employed)', 'Minimum: EUR 303.11/month (2026) based on 60% avg wage, Low-income: EUR 131.34/month',
  'No minimum capital', false, NULL,
  'Annual income tax return, monthly VAT if applicable', 'Finančná správa (Slovak Tax Administration)', 'https://www.financnasprava.sk',
  '2025-01-01', NULL, '2026-02-15',
  '2026 MAJOR CHANGES: (1) Contribution holiday eliminated — must pay after 5 months regardless of income. (2) Minimum contributions based on 60% avg wage (was 50%). (3) Health insurance +1%.'
);

-- SK-OBZDR: Občianske združenie (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SK-OBZDR', 'SK',
  false, 'EUR 49,790 (2025)', 23.0, '19% (reduced), 5% (super-reduced)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 19-35% (employees)',
  'Approx. 35.2%', 'Approx. 13.4%',
  'No minimum capital (minimum 3 members)', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'Finančná správa (Slovak Tax Administration)', 'https://www.financnasprava.sk',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- SK-LEKAR: Lekár (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SK-LEKAR', 'SK',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate expenses'],
  'N/A', 'Progressive 19-35%', 'N/A', 'Progressive 19-35%',
  'N/A (self-employed)', 'Self-employed: EUR 303.11/month minimum (2026)',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'Finančná správa (Slovak Tax Administration)', 'https://www.financnasprava.sk',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Subject to 2026 self-employment contribution changes.'
);

-- =======================================================================================
-- SLOVENIA (SI) — 5 forms
-- =======================================================================================

-- SI-DOO: Družba z omejeno odgovornostjo (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SI-DOO', 'SI',
  true, 'EUR 50,000 (12-month period)', 22.0, '9.5% (essentials), 5% (books/newspapers)',
  'Standard corporate taxation', ARRAY['Standard'],
  '22% (2024-2028), 19% standard', 'Progressive 16-50%', '25% (withholding)', 'Progressive 16-50%',
  '16.1% (pension 8.85%, health 6.56%, unemployment 0.06%, injury 0.53%, parental 0.1%)', '22.1% (pension 15%, health 6.36%, unemployment 0.14%, parental 0.1%) + EUR 35/month compulsory health',
  'EUR 7,500', false, 'Temporary higher CIT rate 22% until 2028',
  'Annual corporate tax return, monthly VAT reporting', 'FURS (Finančna uprava Republike Slovenije)', 'https://www.fu.gov.si',
  '2025-01-01', NULL, '2026-02-15',
  'Corporate tax temporarily increased to 22% for 2024-2028 period, then returns to 19%. 2025 change: 9.5% VAT on sugary drinks increased to 22%.'
);

-- SI-DD: Delniška družba (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SI-DD', 'SI',
  true, 'EUR 50,000 (12-month period)', 22.0, '9.5% (essentials), 5% (books/newspapers)',
  'Standard corporate taxation', ARRAY['Standard'],
  '22% (2024-2028), 19% standard', 'Progressive 16-50%', '25% (withholding)', 'Progressive 16-50%',
  '16.1% (pension 8.85%, health 6.56%, unemployment 0.06%, injury 0.53%, parental 0.1%)', '22.1% (pension 15%, health 6.36%, unemployment 0.14%, parental 0.1%) + EUR 35/month compulsory health',
  'EUR 25,000', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'FURS (Finančna uprava Republike Slovenije)', 'https://www.fu.gov.si',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than DOO. Can issue public shares.'
);

-- SI-SP: Samostojni podjetnik (Sole Proprietor)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SI-SP', 'SI',
  true, 'EUR 50,000 (12-month period)', 22.0, '9.5% (essentials), 5% (books/newspapers)',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate (normirana)'],
  'N/A', 'Progressive 16-50%', 'N/A', 'Progressive 16-50%',
  'N/A (self-employed)', 'Self-employed: 38.2% on income base + EUR 35/month compulsory health',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly VAT if applicable', 'FURS (Finančna uprava Republike Slovenije)', 'https://www.fu.gov.si',
  '2025-01-01', NULL, '2026-02-15',
  'Self-employed pay combined contributions of 38.2% on income. Minimum wage EUR 1,277.72/month (2025).'
);

-- SI-DRUSTVO: Društvo (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SI-DRUSTVO', 'SI',
  false, 'EUR 50,000 (12-month period)', 22.0, '9.5% (essentials), 5% (books/newspapers)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 16-50% (employees)',
  '16.1%', '22.1% + EUR 35/month compulsory health',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small associations', 'FURS (Finančna uprava Republike Slovenije)', 'https://www.fu.gov.si',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- SI-ZDRAVNIK: Zdravnik (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'SI-ZDRAVNIK', 'SI',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate'],
  'N/A', 'Progressive 16-50%', 'N/A', 'Progressive 16-50%',
  'N/A (self-employed)', 'Self-employed: 38.2% on income base + EUR 35/month',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'FURS (Finančna uprava Republike Slovenije)', 'https://www.fu.gov.si',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Self-employed physicians pay 38.2% social contributions.'
);

-- =======================================================================================
-- CROATIA (HR) — 6 forms
-- =======================================================================================

-- HR-DOO: Društvo s ograničenom odgovornošću (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-DOO', 'HR',
  true, 'EUR 60,000 annual turnover', 25.0, '13% (reduced), 5% (temporary for utilities until Mar 2026)',
  'Standard corporate taxation', ARRAY['Standard'],
  '18%', 'Progressive 15-45.9%', '10% (withholding)', 'Progressive 15-45.9%',
  '16.5% (health insurance)', '20% (pension: 15% first pillar, 5% second pillar)',
  'HRK 20,000 (approx. EUR 2,700)', false, NULL,
  'Annual corporate tax return, monthly VAT reporting', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Croatia adopted EUR in 2023. Temporary 5% VAT on natural gas/utilities until March 31, 2026. Employee pension contributions capped at EUR 11,958/month.'
);

-- HR-JDOO: Jednostavno društvo s ograničenom odgovornošću (Simple LLC)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-JDOO', 'HR',
  true, 'EUR 60,000 annual turnover', 25.0, '13% (reduced), 5% (temporary)',
  'Simplified corporate taxation', ARRAY['Simplified'],
  '18%', 'Progressive 15-45.9%', '10% (withholding)', 'Progressive 15-45.9%',
  '16.5% (health insurance)', '20% (pension)',
  'HRK 10 (approx. EUR 1.30)', false, 'Simplified reporting, limited to 1-3 members',
  'Simplified annual reporting, monthly VAT if applicable', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Simplified form of LLC with very low minimum capital and reduced administrative burden.'
);

-- HR-DD: Dioničko društvo (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-DD', 'HR',
  true, 'EUR 60,000 annual turnover', 25.0, '13% (reduced), 5% (temporary)',
  'Standard corporate taxation', ARRAY['Standard'],
  '18%', 'Progressive 15-45.9%', '10% (withholding)', 'Progressive 15-45.9%',
  '16.5% (health insurance)', '20% (pension)',
  'HRK 200,000 (approx. EUR 26,500)', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than DOO. Can issue public shares.'
);

-- HR-OBRT: Obrt (Craft/Trade Business)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-OBRT', 'HR',
  true, 'EUR 60,000 annual turnover', 25.0, '13% (reduced), 5% (temporary)',
  'Personal income taxation', ARRAY['Standard', 'Flat-rate'],
  'N/A', 'Progressive 15-45.9%', 'N/A', 'Progressive 15-45.9%',
  'N/A (self-employed)', 'Self-employed: EUR 210/month minimum (2026) if not employed elsewhere',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly VAT if applicable', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Traditional craft/trade business form. 2026 minimum contribution: EUR 210/month (20% of EUR 1,050).'
);

-- HR-UDRUGA: Udruga (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-UDRUGA', 'HR',
  false, 'EUR 60,000 annual turnover', 25.0, '13% (reduced), 5% (temporary)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 15-45.9% (employees)',
  '16.5%', '20%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- HR-LIJEC: Liječnička ordinacija (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'HR-LIJEC', 'HR',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Progressive 15-45.9%', 'N/A', 'Progressive 15-45.9%',
  'N/A (self-employed)', 'Self-employed: EUR 210/month minimum (2026)',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'Porezna uprava (Croatian Tax Administration)', 'https://www.porezna-uprava.hr',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Self-employed physicians pay minimum EUR 210/month social contributions.'
);

-- =======================================================================================
-- GREECE (GR) — 6 forms
-- =======================================================================================

-- GR-EPE: Εταιρεία Περιορισμένης Ευθύνης (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-EPE', 'GR',
  true, 'EUR 10,000 annual turnover', 24.0, '13% (reduced), 6% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '22%', 'Progressive 9-44%', '5% (withholding)', 'Progressive 9-44%',
  '21.79% (includes EFKA)', '13.37% (includes EFKA)',
  'EUR 1 (symbolic since 2021)', false, NULL,
  'Annual corporate tax return, monthly VAT reporting', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Social security contribution cap: EUR 7,761.94/month (from Jan 2026). Total contributions: 35.16%.'
);

-- GR-AE: Ανώνυμη Εταιρεία (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-AE', 'GR',
  true, 'EUR 10,000 annual turnover', 24.0, '13% (reduced), 6% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '22%', 'Progressive 9-44%', '5% (withholding)', 'Progressive 9-44%',
  '21.79%', '13.37%',
  'EUR 25,000', false, 'Suitable for larger enterprises, can be publicly traded',
  'Annual audited financial statements, stricter governance', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than EPE. Can issue public shares.'
);

-- GR-OE: Ομόρρυθμη Εταιρεία (General Partnership)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-OE', 'GR',
  true, 'EUR 10,000 annual turnover', 24.0, '13% (reduced), 6% (super-reduced)',
  'Pass-through taxation', ARRAY['Pass-through'],
  'N/A (pass-through)', 'Progressive 9-44% (partners)', 'N/A', 'Progressive 9-44%',
  '21.79%', '13.37%',
  'No minimum capital', false, 'Unlimited personal liability of all partners',
  'Annual partnership return, partners taxed individually', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Transparent entity — profits taxed at partner level. All partners jointly and severally liable.'
);

-- GR-IKE: Ιδιωτική Κεφαλαιουχική Εταιρεία (Private Capital Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-IKE', 'GR',
  true, 'EUR 10,000 annual turnover', 24.0, '13% (reduced), 6% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '22%', 'Progressive 9-44%', '5% (withholding)', 'Progressive 9-44%',
  '21.79%', '13.37%',
  'EUR 1 (symbolic)', false, 'Simplified alternative to EPE',
  'Annual corporate tax return, simplified reporting', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Modern company form introduced 2012. Very low capital requirements, flexible structure.'
);

-- GR-ONG: Σωματείο (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-ONG', 'GR',
  false, 'EUR 10,000 annual turnover', 24.0, '13% (reduced), 6% (super-reduced)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 9-44% (employees)',
  '21.79%', '13.37%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- GR-IATROS: Ιατρείο (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'GR-IATROS', 'GR',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Progressive 9-44%', 'N/A', 'Progressive 9-44%',
  'N/A (self-employed)', 'Self-employed professionals: contribution to EFKA based on income',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'AADE (Independent Authority for Public Revenue)', 'https://www.aade.gr',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT under EU directives. Physicians contribute to EFKA (social security fund).'
);

-- =======================================================================================
-- CYPRUS (CY) — 6 forms
-- =======================================================================================

-- CY-LTD: Private Limited Company
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-LTD', 'CY',
  true, 'EUR 15,600 annual turnover', 19.0, '9% (reduced), 5% (reduced II)',
  'Standard corporate taxation', ARRAY['Standard', 'IP Box regime'],
  '15% (from 2026, was 12.5%)', 'Progressive 0-35%', '5% (SDC, from 2026, was 17%)', 'Progressive 0-35%',
  'Approx. 8.3% (social insurance)', 'Approx. 8.3% (social insurance)',
  'No minimum capital required', true, '2026 TAX REFORM: CIT 12.5%→15%, dividend SDC 17%→5%, stamp duty abolished',
  'Annual corporate tax return, quarterly VAT', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'MAJOR 2026 CHANGES: (1) Corporate tax 15% (OECD alignment), (2) Dividend SDC reduced to 5%, (3) Deemed dividend abolished for 2026+ profits, (4) Loss carry-forward 5→7 years, (5) R&D deduction 120% extended to 2030, (6) Non-dom regime intact (0% on dividends/interest).'
);

-- CY-LLC: Limited Liability Company (Public)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-LLC', 'CY',
  true, 'EUR 15,600 annual turnover', 19.0, '9% (reduced), 5% (reduced II)',
  'Standard corporate taxation', ARRAY['Standard'],
  '15% (from 2026)', 'Progressive 0-35%', '5% (SDC, from 2026)', 'Progressive 0-35%',
  'Approx. 8.3%', 'Approx. 8.3%',
  'Varies', true, 'Can be publicly traded',
  'Annual audited financial statements, stricter governance', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'Subject to same 2026 tax reform changes as CY-LTD.'
);

-- CY-SP: Sole Proprietor
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-SP', 'CY',
  true, 'EUR 15,600 annual turnover', 19.0, '9% (reduced), 5% (reduced II)',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Progressive 0-35%', 'N/A', 'Progressive 0-35%',
  'N/A (self-employed)', 'Self-employed: approx. 16.6% on income',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, quarterly VAT if applicable', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'Self-employed individuals contribute to social insurance fund. Non-dom individuals enjoy 0% tax on dividends/interest.'
);

-- CY-NGO: Non-Governmental Organization
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-NGO', 'CY',
  false, 'EUR 15,600 annual turnover', 19.0, '9% (reduced), 5% (reduced II)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 0-35% (employees)',
  'Approx. 8.3%', 'Approx. 8.3%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- CY-PROF: Professional Practice (e.g., Doctor, Lawyer)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-PROF', 'CY',
  false, 'Medical/legal services often VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Progressive 0-35%', 'N/A', 'Progressive 0-35%',
  'N/A (self-employed)', 'Self-employed: approx. 16.6%',
  'No minimum capital', false, 'Professional services often VAT-exempt',
  'Annual income tax return, professional record-keeping', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'Medical and legal services typically exempt from VAT under EU directives.'
);

-- CY-PARTNERSHIP: General Partnership
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'CY-PARTNERSHIP', 'CY',
  true, 'EUR 15,600 annual turnover', 19.0, '9% (reduced), 5% (reduced II)',
  'Pass-through taxation', ARRAY['Pass-through'],
  'N/A (pass-through)', 'Progressive 0-35% (partners)', 'N/A', 'Progressive 0-35%',
  'Approx. 8.3%', 'Approx. 8.3%',
  'No minimum capital', false, 'Unlimited liability',
  'Annual partnership return, partners taxed individually', 'Cyprus Tax Department', 'https://www.mof.gov.cy/tax',
  '2026-01-01', NULL, '2026-02-15',
  'Transparent entity — profits taxed at partner level.'
);

-- =======================================================================================
-- SERBIA (RS) — 6 forms
-- =======================================================================================

-- RS-DOO: Društvo sa ograničenom odgovornošću (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-DOO', 'RS',
  true, 'RSD 8,000,000 annual turnover', 20.0, '8% (essential goods/services)',
  'Standard corporate taxation', ARRAY['Standard'],
  '15%', 'Flat 10% (personal income)', '15% (withholding)', 'Flat 10%',
  '15.15% (on salary)', '19.9% (from salary), capped at RSD 656,425/month',
  'RSD 100 (approx. EUR 1)', false, 'One of lowest CIT rates in Europe',
  'Annual corporate tax return, monthly VAT reporting', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Serbia offers flat 15% CIT and 10% PIT. Social contributions capped. Minimum contributions if salary below RSD 45,950.'
);

-- RS-AD: Akcionarsko društvo (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-AD', 'RS',
  true, 'RSD 8,000,000 annual turnover', 20.0, '8% (essential goods/services)',
  'Standard corporate taxation', ARRAY['Standard'],
  '15%', 'Flat 10%', '15% (withholding)', 'Flat 10%',
  '15.15%', '19.9%, capped at RSD 656,425/month',
  'RSD 3,000,000 (approx. EUR 25,500)', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than DOO. Can issue public shares.'
);

-- RS-PREDUZETNIK: Preduzetnik (Sole Entrepreneur)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-PREDUZETNIK', 'RS',
  true, 'RSD 8,000,000 annual turnover', 20.0, '8% (essential goods/services)',
  'Personal income taxation', ARRAY['Standard', 'Lump-sum (paušalno)'],
  'N/A', 'Flat 10%', 'N/A', 'Flat 10%',
  'N/A (self-employed)', 'Self-employed: 35.05% on income base (pension, health, unemployment)',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly VAT if applicable', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Self-employed pay 10% income tax + 35.05% social contributions. Lump-sum (paušal) option available for small entrepreneurs.'
);

-- RS-UDRUZENJE: Udruženje (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-UDRUZENJE', 'RS',
  false, 'RSD 8,000,000 annual turnover', 20.0, '8% (essential goods/services)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Flat 10% (employees)',
  '15.15%', '19.9%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- RS-DOKTOR: Doktorska ordinacija (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-DOKTOR', 'RS',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Flat 10%', 'N/A', 'Flat 10%',
  'N/A (self-employed)', 'Self-employed: 35.05%',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Self-employed physicians pay 10% income tax + 35.05% social contributions.'
);

-- RS-ZADRUGA: Zadruga (Cooperative)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'RS-ZADRUGA', 'RS',
  true, 'RSD 8,000,000 annual turnover', 20.0, '8% (essential goods/services)',
  'Standard corporate taxation', ARRAY['Standard'],
  '15%', 'Flat 10%', '15%', 'Flat 10%',
  '15.15%', '19.9%',
  'Varies (member-based)', false, 'Democratic governance structure',
  'Annual financial statements, cooperative reporting', 'Poreska uprava (Serbian Tax Administration)', 'https://www.purs.gov.rs',
  '2025-01-01', NULL, '2026-02-15',
  'Member-owned enterprise. Subject to standard corporate taxation.'
);

-- =======================================================================================
-- NORTH MACEDONIA (MK) — 6 forms
-- =======================================================================================

-- MK-DOOEL: Друштво со ограничена одговорност (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-DOOEL', 'MK',
  true, 'MKD 2,000,000 annual turnover', 18.0, '10% (reduced), 5% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '10%', 'Flat 10% (personal income)', '10% (withholding)', 'Flat 10%',
  'Approx. 28% (pension, health, unemployment, injury)', 'Approx. 18.8% (pension, health, unemployment)',
  'No minimum capital (since 2019)', false, 'One of lowest CIT rates in Europe',
  'Annual corporate tax return, monthly VAT reporting', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'North Macedonia offers very competitive flat 10% CIT and PIT. VAT threshold: MKD 2 million.'
);

-- MK-AD: Акционерско друштво (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-AD', 'MK',
  true, 'MKD 2,000,000 annual turnover', 18.0, '10% (reduced), 5% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '10%', 'Flat 10%', '10% (withholding)', 'Flat 10%',
  'Approx. 28%', 'Approx. 18.8%',
  'MKD 625,000 (approx. EUR 10,000)', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than DOOEL. Can issue public shares.'
);

-- MK-TRGOVEC: Трговец поединец (Sole Trader)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-TRGOVEC', 'MK',
  true, 'MKD 2,000,000 annual turnover', 18.0, '10% (reduced), 5% (super-reduced)',
  'Personal income taxation', ARRAY['Standard', 'Lump-sum'],
  'N/A', 'Flat 10%', 'N/A', 'Flat 10%',
  'N/A (self-employed)', 'Self-employed: approx. 46.8% on income (pension, health, unemployment)',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly VAT if applicable', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'Self-employed pay 10% income tax + social contributions. Lump-sum option available for small traders.'
);

-- MK-ZDRUZHENIE: Здружение (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-ZDRUZHENIE', 'MK',
  false, 'MKD 2,000,000 annual turnover', 18.0, '10% (reduced), 5% (super-reduced)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Flat 10% (employees)',
  'Approx. 28%', 'Approx. 18.8%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- MK-LEKAR: Лекарска ординација (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-LEKAR', 'MK',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Flat 10%', 'N/A', 'Flat 10%',
  'N/A (self-employed)', 'Self-employed: approx. 46.8%',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Self-employed physicians pay 10% income tax + social contributions.'
);

-- MK-ZADRUGA: Задруга (Cooperative)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'MK-ZADRUGA', 'MK',
  true, 'MKD 2,000,000 annual turnover', 18.0, '10% (reduced), 5% (super-reduced)',
  'Standard corporate taxation', ARRAY['Standard'],
  '10%', 'Flat 10%', '10%', 'Flat 10%',
  'Approx. 28%', 'Approx. 18.8%',
  'Varies (member-based)', false, 'Democratic governance structure',
  'Annual financial statements, cooperative reporting', 'UJP (Public Revenue Office)', 'https://ujp.gov.mk',
  '2025-01-01', NULL, '2026-02-15',
  'Member-owned enterprise. Subject to standard corporate taxation.'
);

-- =======================================================================================
-- MONTENEGRO (ME) — 6 forms
-- =======================================================================================

-- ME-DOO: Društvo sa ograničenom odgovornošću (Limited Liability Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-DOO', 'ME',
  true, 'EUR 30,000 (12-month period)', 21.0, '15% (reduced I), 7% (reduced II), 0% (exports)',
  'Progressive corporate taxation', ARRAY['Standard'],
  '9% (up to EUR 100k), 15% (over EUR 100k)', 'Progressive 9-15%', '9% (withholding)', 'Progressive 9-15%',
  'Approx. 30% (pension, health, unemployment, injury)', 'Approx. 24% (pension, health, unemployment)',
  'EUR 1', false, 'Progressive CIT structure',
  'Annual corporate tax return, monthly VAT reporting', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Montenegro uses EUR. Progressive CIT: 9% up to €100k, 15% above. 4-tier VAT system (21%, 15%, 7%, 0%).'
);

-- ME-AD: Akcionarsko društvo (Joint Stock Company)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-AD', 'ME',
  true, 'EUR 30,000 (12-month period)', 21.0, '15% (reduced I), 7% (reduced II), 0% (exports)',
  'Progressive corporate taxation', ARRAY['Standard'],
  '9% (up to EUR 100k), 15% (over EUR 100k)', 'Progressive 9-15%', '9% (withholding)', 'Progressive 9-15%',
  'Approx. 30%', 'Approx. 24%',
  'EUR 25,000', false, 'Suitable for larger enterprises',
  'Annual audited financial statements, stricter governance', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Higher minimum capital than DOO. Can issue public shares.'
);

-- ME-PREDUZETNIK: Preduzetnik (Sole Entrepreneur)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-PREDUZETNIK', 'ME',
  true, 'EUR 30,000 (12-month period)', 21.0, '15% (reduced I), 7% (reduced II), 0% (exports)',
  'Personal income taxation', ARRAY['Standard', 'Lump-sum'],
  'N/A', 'Progressive 9-15%', 'N/A', 'Progressive 9-15%',
  'N/A (self-employed)', 'Self-employed: approx. 54% on income (pension, health, unemployment)',
  'No minimum capital', false, 'Unlimited personal liability',
  'Annual income tax return, monthly VAT if applicable', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Self-employed pay progressive income tax (9-15%) + social contributions. Lump-sum option available.'
);

-- ME-UDRUZENJE: Udruženje (Association/Non-profit)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-UDRUZENJE', 'ME',
  false, 'EUR 30,000 (12-month period)', 21.0, '15% (reduced I), 7% (reduced II), 0% (exports)',
  'Exempt (non-profit)', ARRAY['Exempt', 'Partial taxation'],
  'Exempt (if public benefit status maintained)', 'N/A', 'N/A', 'Progressive 9-15% (employees)',
  'Approx. 30%', 'Approx. 24%',
  'No minimum capital', false, 'Tax-exempt for public benefit activities',
  'Annual financial statements, simplified for small NGOs', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Tax-exempt for non-commercial activities. Commercial income may be subject to tax.'
);

-- ME-DOKTOR: Doktorska ordinacija (Medical Practice)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-DOKTOR', 'ME',
  false, 'Medical services generally VAT-exempt', 0.0, 'N/A',
  'Personal income taxation', ARRAY['Standard'],
  'N/A', 'Progressive 9-15%', 'N/A', 'Progressive 9-15%',
  'N/A (self-employed)', 'Self-employed: approx. 54%',
  'No minimum capital', false, 'Medical services VAT-exempt',
  'Annual income tax return, special medical record-keeping', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Medical services exempt from VAT. Self-employed physicians pay progressive income tax + social contributions.'
);

-- ME-ZADRUGA: Zadruga (Cooperative)
INSERT INTO legal_form_tax_info (
  legal_form_code, country_code,
  vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
  default_tax_regime, tax_regime_options,
  corporate_tax_rate, income_tax_rate, dividend_tax_rate, salary_tax_rate,
  social_contributions_employer, social_contributions_employee,
  min_capital, offshore_eligible, special_tax_status,
  fiscal_reporting, fiscal_authority, fiscal_authority_url,
  valid_from, valid_until, last_verified, notes
) VALUES (
  'ME-ZADRUGA', 'ME',
  true, 'EUR 30,000 (12-month period)', 21.0, '15% (reduced I), 7% (reduced II), 0% (exports)',
  'Progressive corporate taxation', ARRAY['Standard'],
  '9% (up to EUR 100k), 15% (over EUR 100k)', 'Progressive 9-15%', '9%', 'Progressive 9-15%',
  'Approx. 30%', 'Approx. 24%',
  'Varies (member-based)', false, 'Democratic governance structure',
  'Annual financial statements, cooperative reporting', 'Poreska uprava (Montenegro Tax Administration)', 'https://www.poreskauprava.gov.me',
  '2025-01-01', NULL, '2026-02-15',
  'Member-owned enterprise. Subject to progressive corporate taxation.'
);

-- =======================================================================================
-- VERIFICATION QUERY
-- =======================================================================================
-- Run this to verify data insertion:
-- SELECT country_code, COUNT(*) as form_count
-- FROM legal_form_tax_info
-- WHERE country_code IN ('AT','CZ','SK','SI','HR','GR','CY','RS','MK','ME')
-- GROUP BY country_code
-- ORDER BY country_code;
--
-- Expected results:
-- AT: 8, CZ: 5, SK: 5, SI: 5, HR: 6, GR: 6, CY: 6, RS: 6, MK: 6, ME: 6
-- Total: 59 records

-- =======================================================================================
-- END OF T2_tax_AT_CZ_SK_SI_HR_GR_CY_RS_MK_ME.sql
-- =======================================================================================
