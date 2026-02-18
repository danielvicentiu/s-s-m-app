// ============================================================
// lib/legislative-import/ro-soap-client.ts
// SOAP Client pentru legislatie.just.ro
// Raw fetch + XML manual — zero dependențe SOAP
// ============================================================

const SOAP_ENDPOINT = 'https://legislatie.just.ro/apiws/FreeWebService.svc/SOAP';
const DC_NS = 'http://schemas.datacontract.org/2004/07/FreeWebService';

export interface SearchParams {
  an?: number;
  numar?: string;
  titlu?: string;
  pagina?: number;
  rezultatePePagina?: number;
}

export interface LegislativeActResult {
  id: string;
  titlu: string;
  tipAct: string;
  numar: string;
  an: number;
  dataPublicarii: string;
  emitent: string;
  stare: string;
  portalUrl: string;
}

// ─── XML Helpers ─────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildGetTokenEnvelope(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <GetToken xmlns="http://tempuri.org/"/>
  </s:Body>
</s:Envelope>`;
}

function buildSearchEnvelope(token: string, params: SearchParams): string {
  // WCF requires: no namespace on SearchModel wrapper, DC namespace on each child element
  // Schema order: SearchModel first, tokenKey second
  const fields = [
    `<NumarPagina xmlns="${DC_NS}">${params.pagina ?? 0}</NumarPagina>`,
    `<RezultatePagina xmlns="${DC_NS}">${params.rezultatePePagina ?? 10}</RezultatePagina>`,
    params.an    ? `<SearchAn xmlns="${DC_NS}">${params.an}</SearchAn>`                      : '',
    params.numar ? `<SearchNumar xmlns="${DC_NS}">${escapeXml(params.numar)}</SearchNumar>` : '',
    params.titlu ? `<SearchTitlu xmlns="${DC_NS}">${escapeXml(params.titlu)}</SearchTitlu>` : '',
  ].filter(Boolean).join('\n        ');

  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <Search xmlns="http://tempuri.org/">
      <SearchModel>
        ${fields}
      </SearchModel>
      <tokenKey>${escapeXml(token)}</tokenKey>
    </Search>
  </s:Body>
</s:Envelope>`;
}

// ─── SOAP Request ────────────────────────────────────────────

async function soapRequest(envelope: string, action: string): Promise<string> {
  const response = await fetch(SOAP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"http://tempuri.org/IFreeWebService/${action}"`,
    },
    body: envelope,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`SOAP ${action} failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

// ─── Token Management ────────────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const xml = await soapRequest(buildGetTokenEnvelope(), 'GetToken');
  const match = xml.match(/<(?:[a-zA-Z]+:)?GetTokenResult[^>]*>(.*?)<\/(?:[a-zA-Z]+:)?GetTokenResult>/);

  if (!match?.[1]) {
    console.error('[SOAP] GetToken raw response:', xml.substring(0, 500));
    throw new Error('Failed to extract token from SOAP response');
  }

  cachedToken = {
    value: match[1],
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  return cachedToken.value;
}

// ─── Search ──────────────────────────────────────────────────

export async function searchActs(params: SearchParams): Promise<LegislativeActResult[]> {
  const token = await getToken();
  const xml = await soapRequest(buildSearchEnvelope(token, params), 'Search');
  return parseSearchResults(xml);
}

// Normalize SOAP full act type names to abbreviations used in the UI
function normalizeTipAct(raw: string): string {
  const t = raw.toUpperCase().trim();
  if (t.includes('URGENȚĂ') || t.includes('URGENTA')) return 'OUG';
  if (t.startsWith('ORDONANȚĂ') || t.startsWith('ORDONANTA')) return 'OG';
  if (t.startsWith('HOTĂRÂRE') || t.startsWith('HOTARARE')) return 'HG';
  if (t.startsWith('LEGE')) return 'Lege';
  if (t.startsWith('ORDIN')) return 'Ordin';
  if (t.startsWith('COD')) return 'Cod';
  // Return title-cased original for unknown types
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

// Response schema (Legi type): DataVigoare, Emitent, LinkHtml, Numar, Publicatie, Text, TipAct, Titlu
function parseSearchResults(xml: string): LegislativeActResult[] {
  const results: LegislativeActResult[] = [];

  // Split on <Legi> elements
  const legiBlocks = xml.match(/<(?:[a-zA-Z]+:)?Legi[\s>][\s\S]*?<\/(?:[a-zA-Z]+:)?Legi>/gi) || [];

  for (const block of legiBlocks) {
    const extract = (tag: string): string => {
      // Use [\s\S]*? (dotAll) so multiline fields like Titlu are captured correctly
      const m = block.match(new RegExp(`<(?:[a-zA-Z]+:)?${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[a-zA-Z]+:)?${tag}>`, 'i'));
      return m?.[1]?.trim() ?? '';
    };

    const titluRaw = extract('Titlu');
    // Collapse whitespace — Titlu contains multiline formatted text
    const titlu = titluRaw.replace(/\s+/g, ' ').trim();
    const linkHtml = extract('LinkHtml');
    const numarStr = extract('Numar');

    // Extract year from Numar (e.g. "319/2006") or from DataVigoare
    const anMatch = numarStr.match(/\/(\d{4})$/) || extract('DataVigoare').match(/(\d{4})/);
    const an = anMatch ? parseInt(anMatch[1]) : 0;
    const numar = numarStr.replace(/\/\d{4}$/, '');

    // Extract ID from LinkHtml (e.g. https://legislatie.just.ro/Public/DetaliiDocument/12345)
    const idMatch = linkHtml.match(/\/(\d+)\s*$/);
    const id = idMatch ? idMatch[1] : '';

    if (titlu || numarStr) {
      results.push({
        id,
        titlu,
        tipAct: normalizeTipAct(extract('TipAct')),
        numar,
        an,
        dataPublicarii: extract('DataVigoare'),
        emitent: extract('Emitent'),
        stare: extract('Publicatie'),
        portalUrl: linkHtml || (id ? `https://legislatie.just.ro/Public/DetaliiDocument/${id}` : ''),
      });
    }
  }

  return results;
}

// ─── Find specific act ───────────────────────────────────────

export async function findAct(
  tipAct: string,
  numar: string,
  an: number
): Promise<LegislativeActResult | null> {
  try {
    const results = await searchActs({ an, numar, rezultatePePagina: 5 });

    const normalized = tipAct.toLowerCase();
    return (
      results.find(
        (r) =>
          r.tipAct.toLowerCase().includes(normalized) ||
          r.titlu.toLowerCase().includes(normalized)
      ) ||
      results[0] ||
      null
    );
  } catch (error) {
    console.warn(`[M7 SOAP] findAct failed for ${tipAct} ${numar}/${an}:`, error);
    return null;
  }
}
