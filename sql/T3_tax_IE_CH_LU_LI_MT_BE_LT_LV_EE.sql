-- T3_tax_IE_CH_LU_LI_MT_BE_LT_LV_EE.sql
-- Tax information for IE, CH, LU, LI, MT, BE, LT, LV, EE
-- Generated: 2026-02-15
-- Data sources: Official tax authorities and verified fiscal data 2025-2026

-- =============================================================================
-- IRELAND (IE) — Tax Information
-- =============================================================================

-- IE-LTD: Private Limited Company
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, income_tax_rate,
    dividend_tax_rate, salary_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, offshore_eligible, special_tax_status,
    fiscal_reporting, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-LTD', 'IE',
    TRUE, '€37,500 (services) / €75,000 (goods)', 23.0, '13.5%, 9%, 4.8%, 0%',
    'Standard corporate taxation', '12.5% (trading income), 25% (passive income)', NULL,
    '25% (withholding tax on non-residents)', '20% - 40% progressive + USC + PRSI',
    '11.25% (Class A PRSI, from Oct 2025)', '4.2% (Class A PRSI, from Oct 2025)',
    '€1 (nominal)', FALSE, 'Standard rate 12.5%; 15% minimum rate for large companies (Pillar Two)',
    'Annual corporation tax return (CT1); audited financial statements', 'Revenue Commissioners',
    'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'Ireland maintains 12.5% rate for trading income. OECD Pillar Two 15% minimum applies to large multinationals (turnover >€750m). PRSI rates increased Oct 2025.'
);

-- IE-DAC: Designated Activity Company
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-DAC', 'IE',
    TRUE, '€37,500 (services) / €75,000 (goods)', 23.0, '13.5%, 9%, 4.8%, 0%',
    'Standard corporate taxation', '12.5% (trading), 25% (passive)', '25% WHT',
    '11.25%', '4.2%',
    '€1 (nominal)', 'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'DAC replaced "company limited by shares with objects clause". Same tax treatment as LTD.'
);

-- IE-PLC: Public Limited Company
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-PLC', 'IE',
    TRUE, 23.0, '13.5%, 9%, 4.8%, 0%',
    'Standard corporate taxation', '12.5% (trading), 25% (passive)', '25% WHT',
    '11.25%', '4.2%',
    '€25,000', 'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'Listed companies. Minimum capital €25,000. May be subject to 15% Pillar Two minimum if large.'
);

-- IE-SOLE: Sole Trader
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate, salary_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-SOLE', 'IE',
    TRUE, '€37,500 (services) / €75,000 (goods)', 23.0, '13.5%, 9%, 4.8%, 0%',
    'Personal income tax', '20% (up to €42,000) / 40% (above)', '20% - 40% + USC 0.5%-8% + PRSI',
    'Self-employed: 4% (capped €2,653/year)', '4.2% (Class A if employing)',
    'None', 'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'Sole proprietors taxed as individuals. Self-employed PRSI rate 4%. USC (Universal Social Charge) 0.5%-8% on income.'
);

-- IE-MED: Medical Practice / Professional
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-MED', 'IE',
    FALSE, 23.0, 'Exempt (medical services)',
    'Personal income tax or corporate (if incorporated)', '20% - 40% (personal) or 12.5% (corporate)',
    '4% (self-employed) or 11.25% (incorporated)', 'None',
    'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole trader or incorporated medical company.'
);

-- IE-CHARITY: Charitable Organisation
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate,
    min_capital, offshore_eligible, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-CHARITY', 'IE',
    FALSE, 23.0, 'Exempt (charitable activities)',
    'Tax-exempt (if approved by Revenue)', '0% (charitable activities exempt)',
    '€1', FALSE, 'CHY number registration grants tax exemption on charitable income. Donations eligible for tax relief.',
    'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-01-01', NULL, '2026-02-15',
    'Registered charities exempt from income/corporation tax on charitable activities. Must have CHY or RCN number.'
);

-- IE-COOP: Cooperative Society
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'IE-COOP', 'IE',
    TRUE, 23.0, '13.5%, 9%, 4.8%, 0%',
    'Cooperative taxation', '12.5% (trading), 25% (passive)', '25% WHT',
    '11.25%', '4.2%',
    'Varies', 'Revenue Commissioners', 'https://www.revenue.ie',
    '2025-10-01', NULL, '2026-02-15',
    'Co-operatives taxed as corporations. Agricultural co-ops may have special reliefs.'
);

-- =============================================================================
-- SWITZERLAND (CH) — Tax Information
-- =============================================================================

-- CH-AG: Aktiengesellschaft (Stock Corporation)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-AG', 'CH',
    TRUE, 'CHF 100,000 (annual turnover)', 8.1, '2.6% (essentials), 3.8% (lodging)',
    'Federal + cantonal taxation', '12-14% combined (8.5% federal + 11.5-22% cantonal)', '35% withholding tax',
    'AHV/IV/EO 5.3%, ALV 1.1%, FAK 0.06%', 'AHV/IV/EO 5.3%, ALV 1.1%',
    'CHF 100,000 (50% paid-up)', 'Federal Tax Administration (ESTV)', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'VAT increased to 8.1% from Jan 2025. Tax rates vary by canton (11.5-22%). Capital tax levied by cantons. Participation exemption for 10%+ holdings.'
);

-- CH-GMBH: Gesellschaft mit beschränkter Haftung (LLC)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-GMBH', 'CH',
    TRUE, 'CHF 100,000', 8.1, '2.6%, 3.8%',
    'Federal + cantonal taxation', '12-14% combined', '35% WHT',
    'AHV/IV/EO 5.3%, ALV 1.1%', 'AHV/IV/EO 5.3%, ALV 1.1%',
    'CHF 20,000 (fully paid-up)', 'ESTV', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'GmbH popular for SMEs. Lower capital requirement than AG. Same tax treatment as AG.'
);

-- CH-EINZEL: Einzelunternehmen (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-EINZEL', 'CH',
    TRUE, 'CHF 100,000', 8.1, '2.6%, 3.8%',
    'Personal income tax', 'Progressive: Federal 0.77-11.5% + cantonal/communal (varies by canton)',
    'Self-employed: AHV/IV/EO 8.1%, ALV voluntary', 'Self-employed: 8.1%',
    'None', 'ESTV', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'Sole traders taxed on personal income. Rates vary significantly by canton. Wealth tax also applies.'
);

-- CH-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-MED', 'CH',
    FALSE, 8.1, 'Exempt (medical care)',
    'Personal or corporate income tax', 'Progressive (personal) or 12-14% (corporate)',
    '8.1% (self-employed) or 5.3% (employed)', 'None',
    'ESTV', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or medical corporation.'
);

-- CH-VEREIN: Verein (Association)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-VEREIN', 'CH',
    FALSE, 8.1, 'Exempt (non-profit)',
    'Non-profit taxation', '0% (non-profit activities) or 12-14% (commercial)',
    'None', 'Non-profit associations exempt if pursuing public benefit goals. Commercial activities taxed.',
    'ESTV', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'Non-profit associations exempt from tax on non-commercial activities. Must serve public interest.'
);

-- CH-GENO: Genossenschaft (Cooperative)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'CH-GENO', 'CH',
    TRUE, 'CHF 100,000', 8.1, '2.6%, 3.8%',
    'Cooperative taxation', '12-14% combined', '35% WHT',
    '5.3% + 1.1%', 'None (minimum 7 members)',
    'ESTV', 'https://www.estv.admin.ch',
    '2025-01-01', NULL, '2026-02-15',
    'Cooperatives taxed as corporations. Popular in agriculture, housing, retail sectors.'
);

-- =============================================================================
-- LUXEMBOURG (LU) — Tax Information
-- =============================================================================

-- LU-SARL: Société à Responsabilité Limitée (LLC)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-SARL', 'LU',
    TRUE, '€35,000 (annual turnover)', 17.0, '14%, 8%, 3%',
    'Standard corporate taxation', '17.12% aggregate (14-30% CIT + 7% surtax) / 23.87% effective (incl. MBT Luxembourg City)',
    '5% WHT (10%+ holding) / 15% WHT (other)',
    'Health 2.8%, Pension 8% (max monthly €13,518.68)', 'Health 2.8%, Pension 8%',
    '€12,000', 'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'CIT rates: 14% (<€175k), progressive to 17.12% (>€200k). Municipal business tax (MBT) varies by commune. Participation exemption for 10%+ holdings.'
);

-- LU-SARLS: Société à Responsabilité Limitée Simplifiée (Simplified LLC)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-SARLS', 'LU',
    TRUE, 17.0, '14%, 8%, 3%',
    'Standard corporate taxation', '17.12% aggregate / 23.87% effective (Luxembourg City)',
    '5% / 15% WHT',
    '2.8% + 8%', '2.8% + 8%',
    '€1', 'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Simplified SARL for single-member companies. Minimum capital €1. Same tax treatment as SARL.'
);

-- LU-SA: Société Anonyme (Public Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-SA', 'LU',
    TRUE, 17.0, '14%, 8%, 3%',
    'Standard corporate taxation', '17.12% aggregate / 23.87% effective',
    '5% / 15% WHT',
    '2.8% + 8%', '2.8% + 8%',
    '€30,000 (25% paid-up)', 'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement. Used for larger businesses and listings.'
);

-- LU-SAS: Société par Actions Simplifiée (Simplified Joint-Stock Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-SAS', 'LU',
    TRUE, 17.0, '14%, 8%, 3%',
    'Standard corporate taxation', '17.12% / 23.87%', '5% / 15% WHT',
    '2.8% + 8%', '€1',
    'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Flexible structure. Low capital requirement. Same tax as SARL.'
);

-- LU-EI: Entreprise Individuelle (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-EI', 'LU',
    TRUE, '€35,000', 17.0, '14%, 8%, 3%',
    'Personal income tax', 'Progressive: 0-42% (brackets vary by income and family status)',
    'Self-employed: Health 5.6%, Pension 16%', 'None',
    'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Sole traders taxed as individuals. Progressive rates with municipal multiplier.'
);

-- LU-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-MED', 'LU',
    FALSE, 17.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Progressive 0-42% (personal) or 17.12% (corporate)',
    'Self-employed: 5.6% + 16%', 'None',
    'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or medical SARL.'
);

-- LU-ASBL: Association Sans But Lucratif (Non-Profit)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LU-ASBL', 'LU',
    FALSE, 17.0, 'Exempt (non-profit)',
    'Non-profit taxation', '0% (non-profit) / 17.12% (commercial activities)',
    'None', 'Non-profit associations exempt from CIT on non-commercial activities. Charitable status grants further benefits.',
    'Administration des Contributions Directes', 'https://impotsdirects.public.lu',
    '2025-01-01', NULL, '2026-02-15',
    'Non-profit associations. Exempt if pursuing public benefit. Commercial activities taxed.'
);

-- =============================================================================
-- LIECHTENSTEIN (LI) — Tax Information
-- =============================================================================

-- LI-AG: Aktiengesellschaft (Stock Corporation)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    min_capital, offshore_eligible, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-AG', 'LI',
    TRUE, 'CHF 100,000 (annual turnover)', 7.7, 'Various special rates',
    'Flat-rate corporate taxation', '12.5% flat rate',
    '0% (no withholding tax on dividends)',
    'CHF 50,000', FALSE, 'No dividend WHT. Participation exemption for corporate dividends (with anti-abuse rules).',
    'Steuerverwaltung Liechtenstein', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'Favorable tax regime: 12.5% flat corporate tax, no dividend WHT. Capital tax on equity. Anti-abuse rules for passive income entities.'
);

-- LI-GMBH: Gesellschaft mit beschränkter Haftung (LLC)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-GMBH', 'LI',
    TRUE, 'CHF 100,000', 7.7, 'Various',
    'Flat-rate corporate taxation', '12.5%', '0% WHT',
    'CHF 30,000', 'Steuerverwaltung', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'GmbH popular for SMEs. Same tax treatment as AG. Lower capital requirement.'
);

-- LI-ANSTALT: Anstalt (Establishment)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    min_capital, offshore_eligible, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-ANSTALT', 'LI',
    TRUE, 'CHF 100,000', 7.7,
    'Flexible taxation', '12.5%', '0% WHT',
    'CHF 30,000', FALSE, 'Unique Liechtenstein entity. Flexible structure combining company and foundation features. Subject to anti-abuse rules.',
    'Steuerverwaltung', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'Anstalt is unique to Liechtenstein. Hybrid entity with no shareholders, controlled by founder. 12.5% corporate tax, no dividend WHT.'
);

-- LI-STIFTUNG: Stiftung (Foundation)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-STIFTUNG', 'LI',
    FALSE, 7.7,
    'Foundation taxation', '12.5% (commercial) / 0% (charitable)',
    'CHF 30,000', 'Charitable foundations exempt. Family foundations subject to 12.5% on commercial income. Capital tax applies.',
    'Steuerverwaltung', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'Foundations for charitable, family, or commercial purposes. Charitable foundations tax-exempt. Family foundations 12.5% on income.'
);

-- LI-EINZEL: Einzelunternehmen (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard,
    default_tax_regime, income_tax_rate,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-EINZEL', 'LI',
    TRUE, 'CHF 100,000', 7.7,
    'Personal income tax', 'Progressive: 1.2% - 8% (income tax) + 1.5% (wealth tax)',
    'None', 'Steuerverwaltung', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'Sole traders taxed on personal income. Low personal tax rates (1.2-8%) compared to neighbors. Wealth tax applies.'
);

-- LI-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, income_tax_rate,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LI-MED', 'LI',
    FALSE, 7.7,
    'Personal or corporate income tax', '1.2-8% (personal) or 12.5% (corporate)',
    'None', 'Steuerverwaltung', 'https://www.steuerverwaltung.li',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or medical corporation.'
);

-- =============================================================================
-- MALTA (MT) — Tax Information
-- =============================================================================

-- MT-LTD: Private Limited Company
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, tax_regime_options,
    corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-LTD', 'MT',
    TRUE, '€35,000 (intra-EU) / €30,000 (services)', 18.0, '7% (tourism, sports), 5% (utilities, food), 0% (exports)',
    'Standard corporate with imputation system', ARRAY['35% with shareholder refunds (6/7ths or 5/7ths)', '15% Final Income Tax (no refunds, from Sept 2025)'],
    '35% (standard with refunds) / 15% (final tax regime, no refunds)',
    '0% (imputation at company level eliminates double taxation)',
    '10% social security (max €50/week)', '10% social security',
    '€1,165', 'Malta imputation system allows 6/7ths (85.7%) or 5/7ths (71.4%) refund to shareholders. Effective rate 5% or 10%. Sept 2025: new 15% final tax regime introduced.',
    'Malta Tax and Customs Administration', 'https://cfr.gov.mt',
    '2025-09-01', NULL, '2026-02-15',
    'Malta offers lowest effective EU corporate tax through imputation (5-10%) or 15% final regime. Popular for EU holding structures.'
);

-- MT-PLC: Public Limited Company
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, tax_regime_options,
    corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-PLC', 'MT',
    TRUE, 18.0, '7%, 5%, 0%',
    'Standard corporate with imputation', ARRAY['35% with refunds', '15% final tax'],
    '35% / 15%', '0% (imputation)',
    '10%', '10%',
    '€46,600', 'MTCA', 'https://cfr.gov.mt',
    '2025-09-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement. Same tax treatment as LTD.'
);

-- MT-SOLE: Sole Trader
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-SOLE', 'MT',
    TRUE, '€35,000 / €30,000', 18.0, '7%, 5%, 0%',
    'Personal income tax', 'Progressive: 0% (<€9,100), 15% (€9,101-€14,500), 25% (€14,501-€19,500), 25% (€19,501-€60,000), 35% (>€60,000)',
    'Self-employed: 10-15%', 'Self-employed: 10-15%',
    'None', 'MTCA', 'https://cfr.gov.mt',
    '2025-01-01', NULL, '2026-02-15',
    'Sole proprietors taxed on personal income. Self-employed social security 10-15% of income.'
);

-- MT-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-MED', 'MT',
    FALSE, 18.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Progressive 0-35% (personal) or 35%/15% (corporate)',
    '10-15%', 'None',
    'MTCA', 'https://cfr.gov.mt',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or incorporated.'
);

-- MT-VOL: Voluntary Organisation
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-VOL', 'MT',
    FALSE, 18.0,
    'Non-profit taxation', '0% (non-profit) / 35% (commercial)',
    'None', 'Registered voluntary organisations exempt from tax on non-commercial activities. Commercial activities taxed at 35%.',
    'MTCA', 'https://cfr.gov.mt',
    '2025-01-01', NULL, '2026-02-15',
    'Non-profit voluntary organisations. Exempt if pursuing public benefit.'
);

-- MT-COOP: Cooperative Society
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'MT-COOP', 'MT',
    TRUE, 18.0, '7%, 5%, 0%',
    'Cooperative taxation', '35% (with imputation)', '0% (imputation)',
    '10%', 'Varies',
    'MTCA', 'https://cfr.gov.mt',
    '2025-01-01', NULL, '2026-02-15',
    'Co-operatives taxed as corporations with imputation system. Popular in agriculture and social sectors.'
);

-- =============================================================================
-- BELGIUM (BE) — Tax Information
-- =============================================================================

-- BE-SRL: Société à Responsabilité Limitée / Besloten Vennootschap (Private Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-SRL', 'BE',
    TRUE, '€25,000 (annual turnover)', 21.0, '12%, 6%',
    'Standard corporate taxation', '25% (standard) + 6.75% surcharge (FY 2026) = 26.69% effective / 20% reduced for SMEs',
    '30% WHT (standard) / 15-20% (VVPRbis regime for small companies)',
    'Employer social security ~25% of gross salary', 'Employee social security ~13.07%',
    '€1 (no minimum since 2019)', 'Service Public Fédéral Finances (SPF)', 'https://finances.belgium.be',
    '2026-01-01', NULL, '2026-02-15',
    'CIT 25% + surcharge 6.75% for FY 2026. Reduced 20% rate for SMEs (taxable income <€100k). VVPRbis: 15% WHT on dividends for small companies (20% rate abolished from 2026).'
);

-- BE-SA: Société Anonyme / Naamloze Vennootschap (Public Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-SA', 'BE',
    TRUE, 21.0, '12%, 6%',
    'Standard corporate taxation', '25% + 6.75% surcharge = 26.69%', '30% WHT',
    '~25%', '~13.07%',
    '€61,500 (abolished for new formations)', 'SPF Finances', 'https://finances.belgium.be',
    '2026-01-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement (historical). Same tax as SRL.'
);

-- BE-INDEP: Indépendant / Zelfstandige (Self-Employed)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-INDEP', 'BE',
    TRUE, '€25,000', 21.0, '12%, 6%',
    'Personal income tax', 'Progressive: 25% (€0-€15,200), 40% (€15,201-€26,830), 45% (€26,831-€46,440), 50% (>€46,440)',
    'Self-employed: ~20-22% on net profit', 'None',
    'SPF Finances', 'https://finances.belgium.be',
    '2025-01-01', NULL, '2026-02-15',
    'Self-employed taxed on personal income. High progressive rates (up to 50%). Social contributions ~20-22% on net profit.'
);

-- BE-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-MED', 'BE',
    FALSE, 21.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Progressive 25-50% (personal) or 25% (corporate)',
    '20-22% (self-employed) or ~25% (incorporated)', 'None',
    'SPF Finances', 'https://finances.belgium.be',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as self-employed or incorporated medical practice.'
);

-- BE-ASBL: Association Sans But Lucratif / Vereniging Zonder Winstoogmerk (Non-Profit)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-ASBL', 'BE',
    FALSE, 21.0,
    'Non-profit taxation', '0% (non-profit) / 25% (commercial)',
    'None', 'Non-profit associations exempt from CIT on non-commercial activities. Commercial activities taxed at standard rate.',
    'SPF Finances', 'https://finances.belgium.be',
    '2025-01-01', NULL, '2026-02-15',
    'Non-profit associations. Exempt if pursuing disinterested purpose. Commercial activities taxed.'
);

-- BE-SC: Société Coopérative / Coöperatieve Vennootschap (Cooperative)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'BE-SC', 'BE',
    TRUE, 21.0, '12%, 6%',
    'Cooperative taxation', '25% + 6.75% surcharge', '30% WHT',
    '~25%', '€1',
    'SPF Finances', 'https://finances.belgium.be',
    '2026-01-01', NULL, '2026-02-15',
    'Cooperatives taxed as corporations. Popular in social economy and agriculture.'
);

-- =============================================================================
-- LITHUANIA (LT) — Tax Information
-- =============================================================================

-- LT-UAB: Uždaroji Akcinė Bendrovė (Private Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-UAB', 'LT',
    TRUE, '€45,000 (annual turnover)', 21.0, '9% (district heating from 2026 -> 21%), 5% (essentials)',
    'Standard corporate taxation', '15% (standard) / 0% (micro companies <10 employees, <€300k revenue)',
    '15% (individuals) / 16% (corporate-to-corporate from 2025)',
    'Social insurance 19.5-22.4%, Health 6.98%', 'Social insurance 19.5%, Health 6.98%',
    '€2,500', 'Valstybinė mokesčių inspekcija', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'CIT 15% standard. Micro companies (0% CIT). District heating VAT increases to 21% in 2026. Dividend tax 15% (individuals), 16% (corporate from 2025).'
);

-- LT-AB: Akcinė Bendrovė (Public Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-AB', 'LT',
    TRUE, 21.0, '9%, 5%',
    'Standard corporate taxation', '15%', '15% / 16% (corporate)',
    '19.5-22.4% + 6.98%', '19.5% + 6.98%',
    '€40,000', 'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement. Same tax as UAB.'
);

-- LT-II: Individuali Įmonė (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-II', 'LT',
    TRUE, '€45,000', 21.0, '9%, 5%',
    'Personal income tax', 'Progressive: 20% (up to €105,300), 32% (above €105,300)',
    'Self-employed: Social insurance 12.52%, Health 6.98% (on minimum monthly wage)', 'Self-employed: 12.52% + 6.98%',
    'None', 'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Sole proprietors taxed on personal income. Progressive rates 20%/32%. Self-employed contributions based on minimum wage.'
);

-- LT-IV: Individualios Veiklos (Individual Activity - Freelancer)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-IV', 'LT',
    TRUE, '€45,000', 21.0, '9%, 5%',
    'Personal income tax', 'Progressive: 20% / 32%',
    'Self-employed: 12.52% + 6.98%', 'None',
    'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Individual activity certificate for freelancers. Simplified registration. Same tax as II.'
);

-- LT-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-MED', 'LT',
    FALSE, 21.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Progressive 20%/32% (personal) or 15% (corporate)',
    '12.52% + 6.98%', 'None',
    'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or UAB.'
);

-- LT-ASOC: Asociacija (Association / Non-Profit)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-ASOC', 'LT',
    FALSE, 21.0,
    'Non-profit taxation', '0% (non-profit) / 15% (commercial)',
    'None', 'Non-profit associations exempt from CIT on non-commercial activities. Commercial activities taxed at 15%.',
    'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Non-profit associations. Exempt if pursuing public benefit.'
);

-- LT-COOP: Kooperatinė Bendrovė (Cooperative)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LT-COOP', 'LT',
    TRUE, 21.0, '9%, 5%',
    'Cooperative taxation', '15% / 0% (micro)', '15% / 16%',
    '19.5-22.4% + 6.98%', 'Varies',
    'VMI', 'https://www.vmi.lt',
    '2025-01-01', NULL, '2026-02-15',
    'Cooperatives taxed as corporations. Popular in agriculture and credit unions.'
);

-- =============================================================================
-- LATVIA (LV) — Tax Information
-- =============================================================================

-- LV-SIA: Sabiedrība ar Ierobežotu Atbildību (Limited Liability Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, tax_regime_options,
    corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-SIA', 'LV',
    TRUE, '€40,000 (annual turnover)', 21.0, '13% (from 2026, was 12%), 5%',
    'Deferred CIT (0% on reinvested profits)', ARRAY['0% on reinvested profits, 20% on distributions (standard)', '15% on distributions + 6% personal income tax (optional from 2026, for natural person shareholders only)'],
    '0% (reinvested) / 20% (distributed) / 15% + 6% PIT (optional from 2026)',
    '20% (2025) / 25% (from 2026)',
    'Employer social security ~23.59%', 'Employee social security ~11%',
    '€1 (since 2021)', 'Valsts ieņēmumu dienests (VID)', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Latvia deferred CIT model: 0% on reinvested profits, 20% only on distributions. From 2026: optional 15% CIT + 6% PIT for natural person shareholders. Dividend tax increases to 25% in 2026. Reduced VAT rate increases from 12% to 13% in 2026.'
);

-- LV-AS: Akciju Sabiedrība (Joint-Stock Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, tax_regime_options,
    corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-AS', 'LV',
    TRUE, 21.0, '13% (from 2026), 5%',
    'Deferred CIT', ARRAY['0% / 20%', '15% + 6% PIT (from 2026)'],
    '0% / 20% / 15% + 6% PIT',
    '20% (2025) / 25% (from 2026)',
    '~23.59%', '~11%',
    '€35,000', 'VID', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement. Same tax as SIA.'
);

-- LV-IK: Individuālais Komersants (Sole Proprietorship)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-IK', 'LV',
    TRUE, '€40,000', 21.0, '13% (from 2026), 5%',
    'Personal income tax', 'Progressive: 25.5% (up to €105,300), 33% (above) / Non-taxable minimum €510/month (2025), €550/month (2026), €570/month (2027)',
    'Self-employed social security ~31.07%', 'None',
    'VID', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Sole proprietors taxed on personal income. Two-step progressive rates: 25.5% / 33%. Non-taxable minimum €550/month in 2026. High self-employed contributions (~31%).'
);

-- LV-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-MED', 'LV',
    FALSE, 21.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Progressive 25.5%/33% (personal) or 0%/20% (corporate)',
    '~31% (self-employed) or ~23.59% (incorporated)', 'None',
    'VID', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or SIA.'
);

-- LV-BIEDR: Biedrība (Association / Non-Profit)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-BIEDR', 'LV',
    FALSE, 21.0,
    'Non-profit taxation', '0% (non-profit) / 20% (commercial distributions)',
    'None', 'Non-profit associations exempt from CIT on non-commercial activities. Commercial distributions taxed at 20%.',
    'VID', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Non-profit associations. Exempt if pursuing public benefit.'
);

-- LV-COOP: Kooperatīvā Sabiedrība (Cooperative)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'LV-COOP', 'LV',
    TRUE, 21.0, '13% (from 2026), 5%',
    'Deferred CIT', '0% / 20%', '20% (2025) / 25% (2026)',
    '~23.59%', 'Varies',
    'VID', 'https://www.vid.gov.lv',
    '2026-01-01', NULL, '2026-02-15',
    'Cooperatives taxed as corporations with deferred CIT model.'
);

-- =============================================================================
-- ESTONIA (EE) — Tax Information
-- =============================================================================

-- EE-OU: Osaühing (Private Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-OU', 'EE',
    TRUE, '€40,000 (annual turnover)', 24.0, '13%, 9%, 5% (press from 9%), 0%',
    'Deferred CIT (0% on reinvested profits)', '0% (reinvested) / 22/78 (distributed 2025) / 24/76 (distributed 2026)',
    '22/78 (company level 2025) / 24/76 (2026) - no further personal dividend tax',
    'Social tax 33% of gross salary, Unemployment insurance 0.8%', 'Unemployment insurance 1.6%',
    '€0.01 (since 2023)', 'Estonia unique deferred CIT: 0% on retained profits, tax only on distributions. Rate increases to 24/76 in 2026. 14/86 preferential rate eliminated in 2025.',
    'Maksu- ja Tolliamet (EMTA)', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Estonia pioneered deferred CIT: 0% tax on reinvested profits, tax only when distributed. Rate 22/78 (2025) increases to 24/76 (2026). Preferential 14/86 rate eliminated 2025. Minimum social tax obligation €292.38/month (2026).'
);

-- EE-AS: Aktsiaselts (Public Limited Company)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, social_contributions_employee,
    min_capital, fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-AS', 'EE',
    TRUE, 24.0, '13%, 9%, 5%, 0%',
    'Deferred CIT', '0% / 22/78 (2025) / 24/76 (2026)', '22/78 / 24/76 (company level)',
    'Social tax 33%, UI 0.8%', 'UI 1.6%',
    '€25,000', 'EMTA', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Public companies. Higher capital requirement. Same deferred CIT as OÜ.'
);

-- EE-FIE: Füüsilisest Isikust Ettevõtja (Sole Proprietor)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_threshold, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-FIE', 'EE',
    TRUE, '€40,000', 24.0, '13%, 9%, 5%, 0%',
    'Personal income tax', 'Flat: 20% (personal income tax) / 22% (business income tax)',
    'Self-employed: Social tax 33% (minimum €292.38/month in 2026)', 'None',
    'EMTA', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Sole proprietors taxed at flat 20% (personal income) or 22% (business income). Minimum monthly social tax €292.38 (2026).'
);

-- EE-MED: Medical Practice
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, income_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-MED', 'EE',
    FALSE, 24.0, 'Exempt (medical services)',
    'Personal or corporate income tax', 'Flat 20%/22% (personal) or 0%/22-24% (corporate)',
    '33% (self-employed min €292.38/month)', 'None',
    'EMTA', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Medical services VAT-exempt. Can operate as sole practitioner or OÜ.'
);

-- EE-MTU: Mittetulundusühing (Non-Profit Association)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard,
    default_tax_regime, corporate_tax_rate,
    min_capital, special_tax_status,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-MTU', 'EE',
    FALSE, 24.0,
    'Non-profit taxation', '0% (non-profit) / 22/78 (2025) or 24/76 (2026) on distributions',
    'None', 'Non-profit associations exempt from CIT on non-commercial activities. Distributions taxed under deferred CIT.',
    'EMTA', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Non-profit associations. Exempt if pursuing public benefit.'
);

-- EE-TULIST: Tulundusühistu (Cooperative)
INSERT INTO legal_form_tax_info (
    legal_form_code, country_code,
    vat_required, vat_rate_standard, vat_rate_reduced,
    default_tax_regime, corporate_tax_rate, dividend_tax_rate,
    social_contributions_employer, min_capital,
    fiscal_authority, fiscal_authority_url,
    valid_from, valid_until, last_verified, notes
) VALUES (
    'EE-TULIST', 'EE',
    TRUE, 24.0, '13%, 9%, 5%, 0%',
    'Deferred CIT', '0% / 22/78 (2025) / 24/76 (2026)', '22/78 / 24/76',
    '33% + 0.8%', 'Varies (minimum 5 members)',
    'EMTA', 'https://www.emta.ee',
    '2026-01-01', NULL, '2026-02-15',
    'Cooperatives taxed under deferred CIT model. Popular in agriculture and housing.'
);

-- =============================================================================
-- VERIFICATION QUERY
-- =============================================================================

-- Verify record counts per country
-- Expected: IE=7, CH=6, LU=7, LI=6, MT=6, BE=6, LT=7, LV=6, EE=6 (Total: 57)
SELECT
    country_code,
    COUNT(*) as form_count,
    array_agg(legal_form_code ORDER BY legal_form_code) as forms
FROM legal_form_tax_info
WHERE country_code IN ('IE','CH','LU','LI','MT','BE','LT','LV','EE')
GROUP BY country_code
ORDER BY country_code;

-- Verify data completeness
SELECT
    country_code,
    legal_form_code,
    vat_rate_standard,
    corporate_tax_rate,
    income_tax_rate,
    valid_from,
    last_verified
FROM legal_form_tax_info
WHERE country_code IN ('IE','CH','LU','LI','MT','BE','LT','LV','EE')
ORDER BY country_code, legal_form_code;

-- End of T3_tax_IE_CH_LU_LI_MT_BE_LT_LV_EE.sql
