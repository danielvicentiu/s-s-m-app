// ============================================================
// lib/legislative-import/change-detector.ts
// Detectează schimbări între versiuni de acte legislative
// ============================================================

export interface ChangeDetail {
  type: 'added' | 'removed' | 'modified';
  section?: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export function detectChanges(oldText: string, newText: string): ChangeDetail[] {
  const changes: ChangeDetail[] = [];

  const oldLines = oldText.split('\n').filter((l) => l.trim());
  const newLines = newText.split('\n').filter((l) => l.trim());

  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  for (const line of newLines) {
    if (!oldSet.has(line)) {
      changes.push({
        type: 'added',
        section: identifySection(line),
        description: truncate(line, 200),
        severity: isStructuralChange(line) ? 'critical' : 'info',
      });
    }
  }

  for (const line of oldLines) {
    if (!newSet.has(line)) {
      changes.push({
        type: 'removed',
        section: identifySection(line),
        description: truncate(line, 200),
        severity: isStructuralChange(line) ? 'warning' : 'info',
      });
    }
  }

  return changes;
}

function identifySection(line: string): string {
  const patterns: Array<[RegExp, string]> = [
    [/Art(?:icolul)?\.?\s*(\d+)/i, 'Art. $1'],
    [/CAPITOLUL\s+(\w+)/i, 'Cap. $1'],
    [/TITLUL\s+(\w+)/i, 'Titlul $1'],
    [/SEC[ȚT]IUNEA\s+(\d+)/i, 'Secț. $1'],
    [/ANEX[AĂ]\s*(\w*)/i, 'Anexa $1'],
  ];

  for (const [regex, label] of patterns) {
    const match = line.match(regex);
    if (match) return label.replace('$1', match[1]);
  }
  return 'General';
}

function isStructuralChange(line: string): boolean {
  return /(?:se\s+abrog[aă]|se\s+modific[aă]|se\s+introduc|se\s+înlocuie[sș]te|intră\s+în\s+vigoare)/i.test(line);
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function generateChangeSummary(changes: ChangeDetail[]): string {
  if (changes.length === 0) return 'Fără modificări detectate.';
  const critical = changes.filter((c) => c.severity === 'critical').length;
  const warnings = changes.filter((c) => c.severity === 'warning').length;
  let summary = `${changes.length} modificări detectate`;
  if (critical > 0) summary += ` (${critical} critice)`;
  if (warnings > 0) summary += ` (${warnings} atenționări)`;
  return summary;
}
