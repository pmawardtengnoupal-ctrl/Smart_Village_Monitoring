// src/auth/validators/dept-code.ts
export function isDeptCode(code: string) {
  return /^[A-Z]{2,10}$/.test((code||'').trim().toUpperCase());
}
