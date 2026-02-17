/**
 * Scan Service
 * AI-powered document extraction using Anthropic Claude Vision API
 */

import type { ExtractionResult, TemplateField } from './types';
import { validateCNP, validateCUI } from '@/lib/utils/validators';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: Array<{
    type: 'image' | 'text';
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
    text?: string;
  }>;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ScanService {
  private apiKey: string;
  private model = 'claude-sonnet-4-5-20250929';
  private maxTokens = 4096;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
  }

  /**
   * Detectează tipul documentului din imagine folosind AI
   */
  async detectDocumentType(imageBase64: string): Promise<string> {
    try {
      // Determină media type
      const mediaType = this.detectMediaType(imageBase64);

      // Prompt pentru detectare tip document
      const prompt = `Analizează acest document românesc și identifică tipul său.

Returnează DOAR template_key din lista de mai jos, nimic altceva:

DOCUMENTE SSM:
- contract_munca
- fisa_instruire_ig (instruire la angajare - instrucțiuni generale)
- fisa_instruire_llm (instruire la locul de muncă)
- fisa_instruire_periodica
- proces_verbal_instruire
- fisa_post
- decizie_numire_cssm
- tematica_instruire
- test_verificare
- declaratie_proprie_raspundere

DOCUMENTE PSI:
- autorizatie_psi
- revizie_stingator
- decizie_numire_responsabil_psi
- plan_evacuare

DOCUMENTE MEDICALE:
- certificat_medical_aptitudine
- fisa_aptitudine

DOCUMENTE ECHIPAMENTE:
- verificare_iscir
- certificat_verificare_instalatie
- registru_verificare_tehnica
- permis_lucru
- bon_fiscal_echipament

DOCUMENTE GENERALE:
- carte_identitate
- diploma_studii
- certificat_curs

DOCUMENTE CONTABILITATE:
- factura_fiscala
- chitanta
- extras_cont

INSTRUCȚIUNI:
1. Identifică cu atenție tipul documentului
2. Returnează DOAR template_key exact așa cum apare în listă
3. Nu adăuga explicații, comentarii sau text suplimentar
4. Dacă documentul nu se potrivește niciunui tip, returnează "general"`;

      // Construiește request-ul pentru Anthropic API
      const messages: AnthropicMessage[] = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ];

      // Apelează Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 100, // Răspuns scurt
          messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Anthropic API error in detectDocumentType:', errorData);
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data: AnthropicResponse = await response.json();

      // Extrage răspunsul text și curăță
      const detectedType = data.content[0]?.text?.trim() || 'general';

      console.log('Detected document type:', detectedType);
      return detectedType;
    } catch (error) {
      console.error('Error in detectDocumentType:', error);
      throw new Error(
        `Failed to detect document type: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Extrage date din imagine folosind AI (Anthropic Claude Vision)
   */
  async extractFromImage(
    imageBase64: string,
    templateFields: TemplateField[],
    extractionPrompt?: string
  ): Promise<ExtractionResult> {
    try {
      // Determină media type
      const mediaType = this.detectMediaType(imageBase64);

      // Construiește prompt-ul de extragere
      const prompt = this.buildExtractionPrompt(templateFields, extractionPrompt);

      // Construiește request-ul pentru Anthropic API
      const messages: AnthropicMessage[] = [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ];

      // Apelează Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Anthropic API error:', errorData);
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data: AnthropicResponse = await response.json();

      // Extrage răspunsul text
      const rawResponse = data.content[0]?.text || '';

      // Parsează JSON-ul din răspuns
      const extractedData = this.parseExtractionResponse(rawResponse, templateFields);

      // Validează câmpurile CNP/CUI și colectează erori
      const validationErrors = this.validateFields(extractedData, templateFields);

      // Calculează confidence score bazat pe câmpuri completate și validări
      const confidence = this.calculateConfidence(extractedData, templateFields, validationErrors);

      return {
        fields: extractedData,
        confidence,
        raw_response: rawResponse,
        errors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined,
      };
    } catch (error) {
      console.error('Error in extractFromImage:', error);
      throw new Error(
        `Failed to extract data from image: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Detectează media type din base64 string
   */
  private detectMediaType(base64: string): string {
    // Verifică header-ul base64 pentru a detecta tipul
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
    if (base64.startsWith('R0lGOD')) return 'image/gif';
    if (base64.startsWith('UklGR')) return 'image/webp';

    // Default la JPEG
    return 'image/jpeg';
  }

  /**
   * Construiește prompt-ul de extragere pentru AI
   */
  private buildExtractionPrompt(fields: TemplateField[], customPrompt?: string): string {
    const fieldDescriptions = fields
      .map((field) => {
        let desc = `- ${field.key}: ${field.label}`;
        if (field.type === 'select' && field.options) {
          desc += ` (opțiuni: ${field.options.join(', ')})`;
        }
        if (field.validation) {
          desc += ` [validare: ${field.validation}]`;
        }
        return desc;
      })
      .join('\n');

    return `Analizează acest document și extrage următoarele informații:

${customPrompt || 'Extrage datele din document conform listei de câmpuri de mai jos.'}

CÂMPURI DE EXTRAS:
${fieldDescriptions}

INSTRUCȚIUNI:
1. Citește cu atenție documentul și identifică fiecare câmp cerut
2. Pentru câmpuri de tip select, folosește EXACT una din opțiunile specificate
3. Pentru date, folosește formatul ISO 8601 (YYYY-MM-DD)
4. Pentru câmpuri numerice, extrage doar numărul (fără unități de măsură)
5. Pentru CNP/CUI, extrage cifre fără spații sau liniuțe
6. Dacă un câmp nu este vizibil sau lipsește din document, folosește "" (string gol)
7. Nu inventa date - extrage doar ce este clar vizibil în document

RĂSPUNS:
Returnează DOAR un obiect JSON valid cu structura:
{
  "field_key_1": "valoare_extrasă",
  "field_key_2": "valoare_extrasă",
  ...
}

NU include explicații, comentarii sau text suplimentar. DOAR JSON-ul.`;
  }

  /**
   * Parsează răspunsul AI și extrage JSON-ul
   */
  private parseExtractionResponse(
    response: string,
    fields: TemplateField[]
  ): Record<string, string> {
    try {
      // Încearcă să găsească JSON în răspuns
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in response, returning empty fields');
        return this.createEmptyFields(fields);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validează că toate câmpurile sunt string
      const result: Record<string, string> = {};
      for (const field of fields) {
        const value = parsed[field.key];
        result[field.key] = value !== undefined && value !== null ? String(value) : '';
      }

      return result;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw response:', response);
      return this.createEmptyFields(fields);
    }
  }

  /**
   * Creează un obiect cu toate câmpurile goale
   */
  private createEmptyFields(fields: TemplateField[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const field of fields) {
      result[field.key] = '';
    }
    return result;
  }

  /**
   * Validează câmpurile CNP/CUI folosind validatori cu check digit
   */
  private validateFields(
    extractedData: Record<string, string>,
    fields: TemplateField[]
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = extractedData[field.key];

      // Doar validăm câmpuri completate
      if (!value || value.trim() === '') continue;

      // Validare CNP
      if (field.validation === 'cnp') {
        const result = validateCNP(value);
        if (!result.valid) {
          errors[field.key] = result.error || 'CNP invalid';
        }
      }

      // Validare CUI
      if (field.validation === 'cui') {
        const result = validateCUI(value);
        if (!result.valid) {
          errors[field.key] = result.error || 'CUI invalid';
        }
      }
    }

    return errors;
  }

  /**
   * Calculează confidence score bazat pe câmpuri completate și validări
   */
  private calculateConfidence(
    extractedData: Record<string, string>,
    fields: TemplateField[],
    validationErrors: Record<string, string> = {}
  ): number {
    if (fields.length === 0) return 0;

    let filledCount = 0;
    let totalWeight = 0;

    for (const field of fields) {
      // Câmpuri obligatorii au weight mai mare
      const weight = field.validation ? 1.5 : 1.0;
      totalWeight += weight;

      const value = extractedData[field.key];
      if (value && value.trim() !== '') {
        filledCount += weight;

        // Bonus pentru validare corectă
        if (field.validation === 'cnp' && this.isValidCNP(value)) {
          filledCount += 0.2;
        }
        if (field.validation === 'cui' && this.isValidCUI(value)) {
          filledCount += 0.2;
        }
        if (field.type === 'date' && this.isValidDate(value)) {
          filledCount += 0.1;
        }
      }
    }

    let score = (filledCount / totalWeight) * 100;

    // Penalizare pentru erori de validare: -20 puncte per câmp invalid
    const errorPenalty = Object.keys(validationErrors).length * 20;
    score = Math.max(0, score - errorPenalty);

    return Math.min(Math.round(score * 100) / 100, 100); // Max 100, rotunjit la 2 decimale
  }

  /**
   * Validare simplă CNP (13 cifre)
   */
  private isValidCNP(value: string): boolean {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned.length === 13;
  }

  /**
   * Validare simplă CUI (2-10 cifre)
   */
  private isValidCUI(value: string): boolean {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned.length >= 2 && cleaned.length <= 10;
  }

  /**
   * Validare format dată ISO
   */
  private isValidDate(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDatePattern.test(value)) return false;

    const date = new Date(value);
    return !isNaN(date.getTime());
  }
}
