/**
 * Bănci active din România
 * Date actualizate pentru cele mai importante instituții bancare
 */

export interface BancaRomania {
  id: string;
  name: string;
  swift: string;
  ibanPrefix: string;
  website: string;
  bankCode: string;
}

export const banciRomania: BancaRomania[] = [
  {
    id: 'bcr',
    name: 'Banca Comercială Română (BCR)',
    swift: 'RNCBROBU',
    ibanPrefix: 'RNCB',
    website: 'https://www.bcr.ro',
    bankCode: 'RNCB',
  },
  {
    id: 'brd',
    name: 'BRD - Groupe Société Générale',
    swift: 'BRDEROBU',
    ibanPrefix: 'BRDE',
    website: 'https://www.brd.ro',
    bankCode: 'BRDE',
  },
  {
    id: 'bt',
    name: 'Banca Transilvania',
    swift: 'BTRLRO22',
    ibanPrefix: 'BTRL',
    website: 'https://www.bancatransilvania.ro',
    bankCode: 'BTRL',
  },
  {
    id: 'ing',
    name: 'ING Bank România',
    swift: 'INGBROBU',
    ibanPrefix: 'INGB',
    website: 'https://www.ing.ro',
    bankCode: 'INGB',
  },
  {
    id: 'raiffeisen',
    name: 'Raiffeisen Bank România',
    swift: 'RZBROBU',
    ibanPrefix: 'RZBR',
    website: 'https://www.raiffeisen.ro',
    bankCode: 'RZBR',
  },
  {
    id: 'unicredit',
    name: 'UniCredit Bank',
    swift: 'BACXROBU',
    ibanPrefix: 'BACX',
    website: 'https://www.unicredit.ro',
    bankCode: 'BACX',
  },
  {
    id: 'alpha',
    name: 'Alpha Bank România',
    swift: 'BUCRROBU',
    ibanPrefix: 'BUCR',
    website: 'https://www.alphabank.ro',
    bankCode: 'BUCR',
  },
  {
    id: 'cec',
    name: 'CEC Bank',
    swift: 'CECEROBU',
    ibanPrefix: 'CECE',
    website: 'https://www.cec.ro',
    bankCode: 'CECE',
  },
  {
    id: 'erste',
    name: 'Erste Bank România',
    swift: 'BRCBROBU',
    ibanPrefix: 'BRCB',
    website: 'https://www.erstebank.ro',
    bankCode: 'BRCB',
  },
  {
    id: 'otp',
    name: 'OTP Bank România',
    swift: 'OTPVROBU',
    ibanPrefix: 'OTPV',
    website: 'https://www.otpbank.ro',
    bankCode: 'OTPV',
  },
  {
    id: 'garanti',
    name: 'Garanti BBVA România',
    swift: 'TGBARO22',
    ibanPrefix: 'TGBA',
    website: 'https://www.garantibbva.ro',
    bankCode: 'TGBA',
  },
  {
    id: 'vista',
    name: 'Vista Bank (fost Marfin Bank)',
    swift: 'EFIBROBU',
    ibanPrefix: 'EFIB',
    website: 'https://www.vistabank.ro',
    bankCode: 'EFIB',
  },
  {
    id: 'libra',
    name: 'Libra Internet Bank',
    swift: 'LBIGRO22',
    ibanPrefix: 'LBIG',
    website: 'https://www.librabank.ro',
    bankCode: 'LBIG',
  },
  {
    id: 'exim',
    name: 'EximBank (Banca de Export-Import a României)',
    swift: 'BEXRROBU',
    ibanPrefix: 'BEXR',
    website: 'https://www.eximbank.ro',
    bankCode: 'BEXR',
  },
  {
    id: 'procredit',
    name: 'ProCredit Bank România',
    swift: 'MICOPBBU',
    ibanPrefix: 'MICO',
    website: 'https://www.procreditbank.ro',
    bankCode: 'MICO',
  },
];

/**
 * Găsește o bancă după prefix IBAN
 */
export function findBancaByIbanPrefix(prefix: string): BancaRomania | undefined {
  return banciRomania.find(
    (banca) => banca.ibanPrefix.toLowerCase() === prefix.toLowerCase()
  );
}

/**
 * Găsește o bancă după cod SWIFT
 */
export function findBancaBySwift(swift: string): BancaRomania | undefined {
  return banciRomania.find(
    (banca) => banca.swift.toLowerCase() === swift.toLowerCase()
  );
}

/**
 * Găsește o bancă după ID
 */
export function findBancaById(id: string): BancaRomania | undefined {
  return banciRomania.find((banca) => banca.id === id);
}
