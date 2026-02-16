// ============================================================
// lib/legislative-import/ro-soap-client.ts
// SOAP Client pentru legislatie.just.ro
// Raw fetch + XML manual — zero dependențe SOAP
// ============================================================

const SOAP_ENDPOINT = 'http://legislatie.just.ro/apiws/FreeWebService.svc';
const SOAP_NS = 'http://tempuri.org/';

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
  <s:Header>
    <Action s:mustUnderstand="1" xmlns="http://schemas.microsoft.com/ws/2005/05/addressing/none">http://tempuri.org/IFreeWebService/GetToken</Action>
  </s:Header>
  <s:Body>
    <GetToken xmlns="http://tempuri.org/"/>
  </s:Body>
</s:Envelope>`;
}

function buildSearchEnvelope(token: string, params: SearchParams): string {
  const fields = [
    `<NumarPagina>${params.pagina ?? 0}</NumarPagina>`,
    `<RezultatePagina>${params.rezultatePePagina ?? 10}</RezultatePagina>`,
    params.an ? `<SearchAn>${params.an}</SearchAn>` : '',
    params.numar ? `<SearchNumar>${escapeXml(params.numar)}</SearchNumar>` : '',
    params.titlu ? `<SearchTitlu>${escapeXml(params.titlu)}</SearchTitlu>` : '',
  ].filter(Boolean).join('\n        ');

  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Header>
    <Action s:mustUnderstand="1" xmlns="http://schemas.microsoft.com/ws/2005/05/addressing/none">http://tempuri.org/IFreeWebService/Search</Action>
  </s:Header>
  <s:Body>
    <Search xmlns="http://tempuri.org/">
      <tokenKey>${escapeXml(token)}</tokenKey>
      <SearchModel xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
        ${fields}
      </SearchModel>
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
      'SOAPAction': `http://tempuri.org/IFreeWebService/${action}`,
    },
    body: envelope,
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
  const match = xml.match(/<GetTokenResult>(.*?)<\/GetTokenResult>/);

  if (!match?.[1]) {
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

function parseSearchResults(xml: string): LegislativeActResult[] {
  const results: LegislativeActResult[] = [];

  // Extract XML blocks for each act — adapt to actual response structure
  const actPattern = /<[^>]*?(?:DocumentId|ActId)[^>]*?>[\s\S]*?(?:<\/[^>]*?Result>|<\/[^>]*?Act>)/g;
  const blocks: string[] = xml.match(actPattern) || [];

  // Fallback: try splitting on repeating patterns
  if (blocks.length === 0) {
    const altBlocks = xml.split(/<\/?[a-z]:/).filter(b => b.includes('DocumentId') || b.includes('Titlu'));
    // Parse entire response as one block if structured differently
    if (xml.includes('SearchResult') || xml.includes('Titlu')) {
      blocks.push(xml);
    }
  }

  for (const block of blocks) {
    const extract = (tag: string): string => {
      const m = block.match(new RegExp(`<(?:[a-z]:)?${tag}[^>]*?>(.*?)<\\/(?:[a-z]:)?${tag}>`, 'i'));
      return m?.[1]?.trim() ?? '';
    };

    const id = extract('DocumentId') || extract('Id') || extract('ActId');
    const titlu = extract('Titlu') || extract('DenumireAct');

    if (id || titlu) {
      results.push({
        id,
        titlu,
        tipAct: extract('TipAct') || extract('TipDocument') || '',
        numar: extract('Numar') || extract('NumarAct') || '',
        an: parseInt(extract('An') || extract('AnAct') || '0'),
        dataPublicarii: extract('DataPublicarii') || extract('DataDocument') || '',
        emitent: extract('Emitent') || extract('OrganEmitent') || '',
        stare: extract('Stare') || extract('StareAct') || '',
        portalUrl: id ? `https://legislatie.just.ro/Public/DetaliiDocument/${id}` : '',
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
