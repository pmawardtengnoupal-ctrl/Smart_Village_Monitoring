export async function verifyCaptchaOnServer(token?: string | null) {
  const provider = (process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER || 'dev') as 'hcaptcha' | 'dev'
  const res = await fetch('/api/captcha/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, token }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error('Captcha failed')
  return true
}
