export function validateCUI(cui: string): { valid: boolean; message: string; cleanedCUI: string } {
  const clean = cui.replace(/^RO/i, '').replace(/\s/g, '').trim()
  if (!clean) return { valid: false, message: 'CUI este obligatoriu', cleanedCUI: '' }
  if (!/^\d{1,10}$/.test(clean)) return { valid: false, message: 'CUI trebuie sa contina doar cifre', cleanedCUI: clean }
  const digits = clean.split('').map(Number)
  if (digits.length < 2 || digits.length > 10) return { valid: false, message: 'CUI trebuie sa aiba intre 2 si 10 cifre', cleanedCUI: clean }
  const weights = [7, 5, 3, 2, 1, 7, 5, 3, 2]
  const padded = digits.slice(0, -1)
  while (padded.length < 9) padded.unshift(0)
  let sum = 0
  for (let i = 0; i < 9; i++) sum += padded[i] * weights[i]
  const control = (sum * 10) % 11 === 10 ? 0 : (sum * 10) % 11
  if (control !== digits[digits.length - 1]) return { valid: false, message: 'CUI invalid - cifra de control incorecta', cleanedCUI: clean }
  return { valid: true, message: 'CUI valid', cleanedCUI: clean }
}
export function formatCUI(cui: string): string {
  return cui.replace(/^RO/i, '').replace(/\s/g, '').trim()
}