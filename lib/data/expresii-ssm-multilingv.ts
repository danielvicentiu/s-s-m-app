/**
 * Expresii SSM esențiale traduse în 6 limbi
 * Pentru afișare în zonele de lucru cu lucrători multilingvi
 *
 * Limbi: RO (Română), EN (English), DE (Deutsch), HU (Magyar), VI (Tiếng Việt), ZH (中文)
 */

export type SSMCategory = 'urgenta' | 'eip' | 'instructiuni' | 'medical';

export interface SSMExpression {
  id: string;
  category: SSMCategory;
  translations: {
    ro: string;
    en: string;
    de: string;
    hu: string;
    vi: string;
    zh: string;
  };
}

export const expresiiSSM: SSMExpression[] = [
  // ========== URGENȚĂ (13 expresii) ==========
  {
    id: 'urgenta-stop',
    category: 'urgenta',
    translations: {
      ro: 'STOP',
      en: 'STOP',
      de: 'HALT',
      hu: 'ÁLLJ',
      vi: 'DỪNG LẠI',
      zh: '停止',
    },
  },
  {
    id: 'urgenta-pericol',
    category: 'urgenta',
    translations: {
      ro: 'PERICOL',
      en: 'DANGER',
      de: 'GEFAHR',
      hu: 'VESZÉLY',
      vi: 'NGUY HIỂM',
      zh: '危险',
    },
  },
  {
    id: 'urgenta-evacuare',
    category: 'urgenta',
    translations: {
      ro: 'EVACUARE',
      en: 'EVACUATION',
      de: 'EVAKUIERUNG',
      hu: 'KIÜRÍTÉS',
      vi: 'SƠ TẢN',
      zh: '疏散',
    },
  },
  {
    id: 'urgenta-iesire-urgenta',
    category: 'urgenta',
    translations: {
      ro: 'Ieșire de urgență',
      en: 'Emergency exit',
      de: 'Notausgang',
      hu: 'Vészkijárat',
      vi: 'Lối thoát hiểm',
      zh: '紧急出口',
    },
  },
  {
    id: 'urgenta-incendiu',
    category: 'urgenta',
    translations: {
      ro: 'INCENDIU',
      en: 'FIRE',
      de: 'FEUER',
      hu: 'TŰZ',
      vi: 'HỎA HOẠN',
      zh: '火灾',
    },
  },
  {
    id: 'urgenta-atentie',
    category: 'urgenta',
    translations: {
      ro: 'ATENȚIE',
      en: 'WARNING',
      de: 'ACHTUNG',
      hu: 'FIGYELEM',
      vi: 'CẢNH BÁO',
      zh: '警告',
    },
  },
  {
    id: 'urgenta-alarma',
    category: 'urgenta',
    translations: {
      ro: 'ALARMĂ',
      en: 'ALARM',
      de: 'ALARM',
      hu: 'RIASZTÁS',
      vi: 'BÁO ĐỘNG',
      zh: '警报',
    },
  },
  {
    id: 'urgenta-tensiune',
    category: 'urgenta',
    translations: {
      ro: 'Înaltă tensiune',
      en: 'High voltage',
      de: 'Hochspannung',
      hu: 'Nagyfeszültség',
      vi: 'Điện áp cao',
      zh: '高压电',
    },
  },
  {
    id: 'urgenta-toxic',
    category: 'urgenta',
    translations: {
      ro: 'Toxic',
      en: 'Toxic',
      de: 'Giftig',
      hu: 'Mérgező',
      vi: 'Độc hại',
      zh: '有毒',
    },
  },
  {
    id: 'urgenta-inflamabil',
    category: 'urgenta',
    translations: {
      ro: 'Inflamabil',
      en: 'Flammable',
      de: 'Brennbar',
      hu: 'Gyúlékony',
      vi: 'Dễ cháy',
      zh: '易燃',
    },
  },
  {
    id: 'urgenta-apel-urgenta',
    category: 'urgenta',
    translations: {
      ro: 'Apel de urgență: 112',
      en: 'Emergency call: 112',
      de: 'Notruf: 112',
      hu: 'Segélyhívás: 112',
      vi: 'Gọi cấp cứu: 112',
      zh: '紧急电话：112',
    },
  },
  {
    id: 'urgenta-radiatie',
    category: 'urgenta',
    translations: {
      ro: 'Radiație',
      en: 'Radiation',
      de: 'Strahlung',
      hu: 'Sugárzás',
      vi: 'Phóng xạ',
      zh: '辐射',
    },
  },
  {
    id: 'urgenta-explozie',
    category: 'urgenta',
    translations: {
      ro: 'Pericol de explozie',
      en: 'Explosion hazard',
      de: 'Explosionsgefahr',
      hu: 'Robbanásveszély',
      vi: 'Nguy cơ nổ',
      zh: '爆炸危险',
    },
  },

  // ========== EIP - Echipament Individual de Protecție (15 expresii) ==========
  {
    id: 'eip-obligatoriu',
    category: 'eip',
    translations: {
      ro: 'EIP obligatoriu',
      en: 'PPE mandatory',
      de: 'PSA Pflicht',
      hu: 'Védőfelszerelés kötelező',
      vi: 'Bắt buộc đeo bảo hộ',
      zh: '必须佩戴防护装备',
    },
  },
  {
    id: 'eip-casca',
    category: 'eip',
    translations: {
      ro: 'Purtați cască',
      en: 'Wear hard hat',
      de: 'Schutzhelm tragen',
      hu: 'Védősisak használata',
      vi: 'Đội mũ bảo hiểm',
      zh: '戴安全帽',
    },
  },
  {
    id: 'eip-manusi',
    category: 'eip',
    translations: {
      ro: 'Purtați mănuși',
      en: 'Wear gloves',
      de: 'Handschuhe tragen',
      hu: 'Kesztyű használata',
      vi: 'Đeo găng tay',
      zh: '戴手套',
    },
  },
  {
    id: 'eip-ochelari',
    category: 'eip',
    translations: {
      ro: 'Purtați ochelari de protecție',
      en: 'Wear safety glasses',
      de: 'Schutzbrille tragen',
      hu: 'Védőszemüveg használata',
      vi: 'Đeo kính bảo hộ',
      zh: '戴护目镜',
    },
  },
  {
    id: 'eip-bocanci',
    category: 'eip',
    translations: {
      ro: 'Purtați încălțăminte de protecție',
      en: 'Wear safety boots',
      de: 'Sicherheitsschuhe tragen',
      hu: 'Védőcipő használata',
      vi: 'Đi giày bảo hộ',
      zh: '穿安全鞋',
    },
  },
  {
    id: 'eip-masca',
    category: 'eip',
    translations: {
      ro: 'Purtați mască respiratorie',
      en: 'Wear respirator',
      de: 'Atemschutz tragen',
      hu: 'Légzésvédő használata',
      vi: 'Đeo khẩu trang phòng độc',
      zh: '戴呼吸面罩',
    },
  },
  {
    id: 'eip-vesta',
    category: 'eip',
    translations: {
      ro: 'Purtați vestă reflectorizantă',
      en: 'Wear high-visibility vest',
      de: 'Warnweste tragen',
      hu: 'Fényvisszaverő mellény használata',
      vi: 'Mặc áo phản quang',
      zh: '穿反光背心',
    },
  },
  {
    id: 'eip-protectie-auditiva',
    category: 'eip',
    translations: {
      ro: 'Protecție auditivă obligatorie',
      en: 'Hearing protection required',
      de: 'Gehörschutz erforderlich',
      hu: 'Hallásvédő kötelező',
      vi: 'Bắt buộc bảo vệ thính giác',
      zh: '必须佩戴护耳器',
    },
  },
  {
    id: 'eip-ham',
    category: 'eip',
    translations: {
      ro: 'Folosiți ham de siguranță',
      en: 'Use safety harness',
      de: 'Sicherheitsgurt verwenden',
      hu: 'Biztonsági heveder használata',
      vi: 'Sử dụng dây an toàn',
      zh: '使用安全带',
    },
  },
  {
    id: 'eip-fata',
    category: 'eip',
    translations: {
      ro: 'Protecție facială',
      en: 'Face protection',
      de: 'Gesichtsschutz',
      hu: 'Arcvédő',
      vi: 'Bảo vệ mặt',
      zh: '面部防护',
    },
  },
  {
    id: 'eip-combinezoane',
    category: 'eip',
    translations: {
      ro: 'Purtați echipament de protecție',
      en: 'Wear protective clothing',
      de: 'Schutzkleidung tragen',
      hu: 'Védőruha használata',
      vi: 'Mặc đồ bảo hộ',
      zh: '穿防护服',
    },
  },
  {
    id: 'eip-verificare',
    category: 'eip',
    translations: {
      ro: 'Verificați echipamentul înainte de utilizare',
      en: 'Check equipment before use',
      de: 'Ausrüstung vor Gebrauch prüfen',
      hu: 'Ellenőrizze a felszerelést használat előtt',
      vi: 'Kiểm tra thiết bị trước khi sử dụng',
      zh: '使用前检查设备',
    },
  },
  {
    id: 'eip-nu-lucrati-fara',
    category: 'eip',
    translations: {
      ro: 'Nu lucrați fără echipament de protecție',
      en: 'Do not work without protective equipment',
      de: 'Nicht ohne Schutzausrüstung arbeiten',
      hu: 'Ne dolgozzon védőfelszerelés nélkül',
      vi: 'Không làm việc mà không có đồ bảo hộ',
      zh: '未穿戴防护装备禁止工作',
    },
  },
  {
    id: 'eip-protectie-maini',
    category: 'eip',
    translations: {
      ro: 'Protejați-vă mâinile',
      en: 'Protect your hands',
      de: 'Schützen Sie Ihre Hände',
      hu: 'Védje a kezét',
      vi: 'Bảo vệ đôi tay của bạn',
      zh: '保护你的双手',
    },
  },
  {
    id: 'eip-protectie-ochi',
    category: 'eip',
    translations: {
      ro: 'Protejați-vă ochii',
      en: 'Protect your eyes',
      de: 'Schützen Sie Ihre Augen',
      hu: 'Védje a szemét',
      vi: 'Bảo vệ mắt của bạn',
      zh: '保护你的眼睛',
    },
  },

  // ========== INSTRUCȚIUNI (12 expresii) ==========
  {
    id: 'instructiuni-nu-atinge',
    category: 'instructiuni',
    translations: {
      ro: 'Nu atingeți',
      en: 'Do not touch',
      de: 'Nicht berühren',
      hu: 'Ne érintse',
      vi: 'Không chạm vào',
      zh: '请勿触摸',
    },
  },
  {
    id: 'instructiuni-zona-interzisa',
    category: 'instructiuni',
    translations: {
      ro: 'Zonă interzisă',
      en: 'Restricted area',
      de: 'Sperrbereich',
      hu: 'Tiltott terület',
      vi: 'Khu vực cấm',
      zh: '禁区',
    },
  },
  {
    id: 'instructiuni-acces-interzis',
    category: 'instructiuni',
    translations: {
      ro: 'Acces interzis',
      en: 'No entry',
      de: 'Zutritt verboten',
      hu: 'Belépni tilos',
      vi: 'Cấm vào',
      zh: '禁止进入',
    },
  },
  {
    id: 'instructiuni-fumat-interzis',
    category: 'instructiuni',
    translations: {
      ro: 'Fumatul interzis',
      en: 'No smoking',
      de: 'Rauchen verboten',
      hu: 'Tilos a dohányzás',
      vi: 'Cấm hút thuốc',
      zh: '禁止吸烟',
    },
  },
  {
    id: 'instructiuni-foc-deschis-interzis',
    category: 'instructiuni',
    translations: {
      ro: 'Foc deschis interzis',
      en: 'No open flames',
      de: 'Offenes Feuer verboten',
      hu: 'Nyílt láng tilos',
      vi: 'Cấm lửa',
      zh: '禁止明火',
    },
  },
  {
    id: 'instructiuni-pastrati-distanta',
    category: 'instructiuni',
    translations: {
      ro: 'Păstrați distanța',
      en: 'Keep distance',
      de: 'Abstand halten',
      hu: 'Tartsa a távolságot',
      vi: 'Giữ khoảng cách',
      zh: '保持距离',
    },
  },
  {
    id: 'instructiuni-mentineti-curat',
    category: 'instructiuni',
    translations: {
      ro: 'Mențineți zona curată',
      en: 'Keep area clean',
      de: 'Bereich sauber halten',
      hu: 'Tartsa tisztán a területet',
      vi: 'Giữ khu vực sạch sẽ',
      zh: '保持区域清洁',
    },
  },
  {
    id: 'instructiuni-spalati-maini',
    category: 'instructiuni',
    translations: {
      ro: 'Spălați-vă pe mâini',
      en: 'Wash your hands',
      de: 'Hände waschen',
      hu: 'Mossa meg a kezét',
      vi: 'Rửa tay',
      zh: '洗手',
    },
  },
  {
    id: 'instructiuni-raportati',
    category: 'instructiuni',
    translations: {
      ro: 'Raportați orice incident',
      en: 'Report any incident',
      de: 'Alle Vorfälle melden',
      hu: 'Jelentsen minden eseményt',
      vi: 'Báo cáo mọi sự cố',
      zh: '报告任何事故',
    },
  },
  {
    id: 'instructiuni-opriti-masina',
    category: 'instructiuni',
    translations: {
      ro: 'Opriți mașina înainte de întreținere',
      en: 'Stop machine before maintenance',
      de: 'Maschine vor Wartung stoppen',
      hu: 'Állítsa le a gépet karbantartás előtt',
      vi: 'Dừng máy trước khi bảo trì',
      zh: '维护前停止机器',
    },
  },
  {
    id: 'instructiuni-urmariti-procedura',
    category: 'instructiuni',
    translations: {
      ro: 'Urmăriți procedura de siguranță',
      en: 'Follow safety procedure',
      de: 'Sicherheitsverfahren befolgen',
      hu: 'Kövesse a biztonsági eljárást',
      vi: 'Tuân thủ quy trình an toàn',
      zh: '遵守安全程序',
    },
  },
  {
    id: 'instructiuni-nu-alergati',
    category: 'instructiuni',
    translations: {
      ro: 'Nu alergați',
      en: 'Do not run',
      de: 'Nicht rennen',
      hu: 'Ne fusson',
      vi: 'Không chạy',
      zh: '请勿奔跑',
    },
  },

  // ========== MEDICAL (10 expresii) ==========
  {
    id: 'medical-accident',
    category: 'medical',
    translations: {
      ro: 'Accident',
      en: 'Accident',
      de: 'Unfall',
      hu: 'Baleset',
      vi: 'Tai nạn',
      zh: '事故',
    },
  },
  {
    id: 'medical-prim-ajutor',
    category: 'medical',
    translations: {
      ro: 'Prim ajutor',
      en: 'First aid',
      de: 'Erste Hilfe',
      hu: 'Elsősegély',
      vi: 'Sơ cứu',
      zh: '急救',
    },
  },
  {
    id: 'medical-trusa',
    category: 'medical',
    translations: {
      ro: 'Trusă de prim ajutor',
      en: 'First aid kit',
      de: 'Erste-Hilfe-Kasten',
      hu: 'Elsősegély doboz',
      vi: 'Hộp sơ cứu',
      zh: '急救箱',
    },
  },
  {
    id: 'medical-durere',
    category: 'medical',
    translations: {
      ro: 'Durere',
      en: 'Pain',
      de: 'Schmerz',
      hu: 'Fájdalom',
      vi: 'Đau',
      zh: '疼痛',
    },
  },
  {
    id: 'medical-ranit',
    category: 'medical',
    translations: {
      ro: 'Rănit',
      en: 'Injured',
      de: 'Verletzt',
      hu: 'Sérült',
      vi: 'Bị thương',
      zh: '受伤',
    },
  },
  {
    id: 'medical-chemati-salvarea',
    category: 'medical',
    translations: {
      ro: 'Chemați salvarea',
      en: 'Call ambulance',
      de: 'Krankenwagen rufen',
      hu: 'Hívjon mentőt',
      vi: 'Gọi xe cấp cứu',
      zh: '叫救护车',
    },
  },
  {
    id: 'medical-arsura',
    category: 'medical',
    translations: {
      ro: 'Arsură',
      en: 'Burn',
      de: 'Verbrennung',
      hu: 'Égés',
      vi: 'Bỏng',
      zh: '烧伤',
    },
  },
  {
    id: 'medical-otravire',
    category: 'medical',
    translations: {
      ro: 'Otrăvire',
      en: 'Poisoning',
      de: 'Vergiftung',
      hu: 'Mérgezés',
      vi: 'Ngộ độc',
      zh: '中毒',
    },
  },
  {
    id: 'medical-dus-ochi',
    category: 'medical',
    translations: {
      ro: 'Duș pentru ochi',
      en: 'Eye wash station',
      de: 'Augenspülstation',
      hu: 'Szemöblítő',
      vi: 'Trạm rửa mắt',
      zh: '洗眼站',
    },
  },
  {
    id: 'medical-electrocutare',
    category: 'medical',
    translations: {
      ro: 'Electrocutare',
      en: 'Electric shock',
      de: 'Stromschlag',
      hu: 'Áramütés',
      vi: 'Điện giật',
      zh: '触电',
    },
  },
];

/**
 * Returnează expresiile filtrate după categorie
 */
export function getExpresiiByCategory(category: SSMCategory): SSMExpression[] {
  return expresiiSSM.filter((expr) => expr.category === category);
}

/**
 * Returnează expresia după ID
 */
export function getExpresieById(id: string): SSMExpression | undefined {
  return expresiiSSM.find((expr) => expr.id === id);
}

/**
 * Returnează toate categoriile disponibile
 */
export function getCategories(): SSMCategory[] {
  return ['urgenta', 'eip', 'instructiuni', 'medical'];
}

/**
 * Returnează numărul de expresii per categorie
 */
export function getExpresiiCount(): Record<SSMCategory, number> {
  return {
    urgenta: getExpresiiByCategory('urgenta').length,
    eip: getExpresiiByCategory('eip').length,
    instructiuni: getExpresiiByCategory('instructiuni').length,
    medical: getExpresiiByCategory('medical').length,
  };
}
