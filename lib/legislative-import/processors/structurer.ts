// lib/legislative-import/processors/structurer.ts
// Claude API processor — classifies legislation, extracts obligations, generates summaries

import { env, COST_ESTIMATES } from '../config';
import { RateLimiter, withRetry } from '../utils/rate-limiter';
import type {
  TranslatedLegislation,
  StructuredLegislation,
  StructuredSection,
  Obligation,
  CrossReference,
  Domain,
  OpLegoModule,
} from '../types';

interface ClaudeResponse {
  id: string;
  content: Array<{ type: 'text'; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
}

interface StructurerOutput {
  domains: Domain[];
  opLegoModules: OpLegoModule[];
  ssmRelevanceScore: number;
  keywords: string[];
  summaryRo: string;
  obligations: Obligation[];
  crossReferences: CrossReference[];
}

export class LegislativeStructurer {
  private rateLimiter: RateLimiter;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;

  constructor() {
    this.rateLimiter = new RateLimiter(2, 500);
  }

  async structure(translated: TranslatedLegislation): Promise<StructuredLegislation> {
    console.log(`[structurer] Structuring: ${translated.sourceId}`);

    const textForAnalysis = (translated.textRo || translated.textOriginal).substring(0, 100_000);
    const result = await this.callClaude(textForAnalysis, translated);

    let structuredSections: StructuredSection[] | undefined;
    if (translated.sections && translated.sections.length > 0) {
      structuredSections = translated.sections.map((s) => ({
        ...s,
        relevanceScore: 5,
        domains: result.domains,
        obligations: [],
      }));
    }

    const totalCostUsd =
      this.totalInputTokens * COST_ESTIMATES.claudeInputPerToken +
      this.totalOutputTokens * COST_ESTIMATES.claudeOutputPerToken;

    console.log(
      `[structurer] Done: ${translated.sourceId} — ` +
      `relevance=${result.ssmRelevanceScore}/10, domains=[${result.domains.join(',')}], ` +
      `${result.obligations.length} obligations, $${totalCostUsd.toFixed(4)}`
    );

    return {
      ...translated,
      domains: result.domains,
      opLegoModules: result.opLegoModules,
      ssmRelevanceScore: result.ssmRelevanceScore,
      keywords: result.keywords,
      summaryRo: result.summaryRo,
      obligations: result.obligations,
      crossReferences: result.crossReferences,
      structurerModel: env.anthropicModel,
      structurerTokensUsed: this.totalInputTokens + this.totalOutputTokens,
      structurerCostUsd: totalCostUsd,
      sections: structuredSections,
    };
  }

  private async callClaude(
    text: string,
    metadata: TranslatedLegislation,
  ): Promise<StructurerOutput> {
    if (!env.anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(text, metadata);

    return this.rateLimiter.withLimit(async () => {
      return withRetry(async () => {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.anthropicApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: env.anthropicModel,
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Claude API error ${response.status}: ${errorBody}`);
        }

        const data = (await response.json()) as ClaudeResponse;
        this.totalInputTokens += data.usage.input_tokens;
        this.totalOutputTokens += data.usage.output_tokens;

        const textContent = data.content.find((c) => c.type === 'text');
        if (!textContent) throw new Error('No text in Claude response');

        return this.parseResponse(textContent.text);
      }, 2, 2000, 'claude-structure');
    });
  }

  private buildSystemPrompt(): string {
    return `Ești un expert în legislația europeană și națională de securitate și sănătate în muncă (SSM/OSH).
Analizezi acte legislative și extragi informații structurate.

RĂSPUNDE EXCLUSIV în format JSON valid, fără text suplimentar, fără markdown, fără backticks.

Schema JSON de răspuns:
{
  "domains": ["ssm"|"psi"|"labor"|"gdpr"|"environment"|"fiscal"|"general"],
  "opLegoModules": ["M1"|"M2"|"M3"|"M4"|"M5"|"M6"],
  "ssmRelevanceScore": 1-10,
  "keywords": ["max 15 keywords în română"],
  "summaryRo": "Rezumat de 2-4 propoziții în română",
  "obligations": [
    {
      "description": "Descriere obligație în română",
      "responsibleEntity": "employer|employee|authority|service_provider",
      "deadline": "termen dacă există sau null",
      "frequency": "one_time|annual|quarterly|monthly|ongoing",
      "penalty": "sancțiune dacă e specificată sau null",
      "sourceArticle": "Art. X"
    }
  ],
  "crossReferences": [
    {
      "targetReferenceText": "text referință complet",
      "targetCelex": "CELEX dacă e act UE sau null",
      "referenceType": "implements|amends|repeals|references|transposes|supplements|cites",
      "sourceSection": "secțiunea sursă sau null",
      "targetSection": "secțiunea target sau null"
    }
  ]
}

MODULE operaționale s-s-m.ro:
- M1: Legislație & Conformitate (import, monitorizare, distribuire acte)
- M2: Evaluare Riscuri (identificare pericole, evaluare, măsuri)
- M3: Instruire & Formare (programe, testare, evidențe)
- M4: Documente & Evidențe (fișe SSM, procese verbale, registre)
- M5: Publicare & Diseminare (difuzare acte, notificări)
- M6: Monitorizare & Raportare (indicatori, dashboard, alerte)

DOMENII:
- ssm: securitate și sănătate în muncă
- psi: prevenire și stingere incendii, situații de urgență
- labor: dreptul muncii, contracte, relații de muncă
- gdpr: protecția datelor personale
- environment: mediu, substanțe periculoase
- fiscal: fiscal, contribuții sociale
- general: legislație generală, administrativă`;
  }

  private buildUserPrompt(text: string, metadata: TranslatedLegislation): string {
    return `Analizează următorul act legislativ și returnează JSON-ul structurat.

METADATE ACT:
- Țara: ${metadata.countryCode}
- Titlu: ${metadata.titleRo || metadata.titleOriginal}
- Tip: ${metadata.actType}
- Număr: ${metadata.actNumber}
- Data adoptării: ${metadata.dateAdopted || 'necunoscută'}
- În vigoare: ${metadata.inForce ? 'DA' : 'NU'}
- Sursa: ${metadata.sourceId}

TEXT LEGISLATIV (poate fi trunchiat):
${text}

Returnează DOAR JSON-ul conform schemei din instrucțiuni.`;
  }

  private parseResponse(responseText: string): StructurerOutput {
    // Clean potential markdown wrapping
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    try {
      const parsed = JSON.parse(cleaned);

      // Validate and sanitize
      return {
        domains: this.validateArray(parsed.domains, ['ssm', 'psi', 'labor', 'gdpr', 'environment', 'fiscal', 'general']),
        opLegoModules: this.validateArray(parsed.opLegoModules, ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']),
        ssmRelevanceScore: Math.min(10, Math.max(1, parseInt(parsed.ssmRelevanceScore) || 5)),
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 15) : [],
        summaryRo: String(parsed.summaryRo || ''),
        obligations: Array.isArray(parsed.obligations) ? parsed.obligations.map(this.sanitizeObligation) : [],
        crossReferences: Array.isArray(parsed.crossReferences) ? parsed.crossReferences.map(this.sanitizeCrossRef) : [],
      };
    } catch (err) {
      console.error('[structurer] Failed to parse Claude response:', cleaned.substring(0, 200));
      // Return minimal valid structure
      return {
        domains: ['general'],
        opLegoModules: ['M1'],
        ssmRelevanceScore: 5,
        keywords: [],
        summaryRo: 'Eroare la procesarea automată. Necesită review manual.',
        obligations: [],
        crossReferences: [],
      };
    }
  }

  private validateArray<T extends string>(arr: unknown, validValues: T[]): T[] {
    if (!Array.isArray(arr)) return [];
    return arr.filter((v): v is T => validValues.includes(v as T));
  }

  private sanitizeObligation(o: any): Obligation {
    return {
      description: String(o.description || ''),
      responsibleEntity: String(o.responsibleEntity || 'employer'),
      deadline: o.deadline || undefined,
      frequency: o.frequency || 'ongoing',
      penalty: o.penalty || undefined,
      sourceArticle: String(o.sourceArticle || ''),
    };
  }

  private sanitizeCrossRef(r: any): CrossReference {
    return {
      targetReferenceText: String(r.targetReferenceText || ''),
      targetCelex: r.targetCelex || undefined,
      referenceType: r.referenceType || 'references',
      sourceSection: r.sourceSection || undefined,
      targetSection: r.targetSection || undefined,
    };
  }

  resetCounters(): void {
    this.totalInputTokens = 0;
    this.totalOutputTokens = 0;
  }

  getTokensUsed(): { input: number; output: number; total: number } {
    return {
      input: this.totalInputTokens,
      output: this.totalOutputTokens,
      total: this.totalInputTokens + this.totalOutputTokens,
    };
  }
}
