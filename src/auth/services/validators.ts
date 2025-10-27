export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function passwordPolicyCheck(pw: string) {
  const rules = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
  const passed = Object.values(rules).every(Boolean)
  // naive strength: 0..4
  const strength = (Number(rules.length) + Number(rules.upper) + Number(rules.number) + Number(rules.special))
  return { rules, passed, strength }
}
