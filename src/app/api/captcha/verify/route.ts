import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { provider, token } = (await req.json()) as {
      provider: 'hcaptcha' | 'dev'
      token?: string
    }

    if (!provider) return NextResponse.json({ ok: false, error: 'provider missing' }, { status: 400 })

    if (provider === 'dev') {
      return NextResponse.json({ ok: !!token })
    }

    const secret = process.env.HCAPTCHA_SECRET
    if (!secret) return NextResponse.json({ ok: false, error: 'HCAPTCHA_SECRET missing' }, { status: 500 })

    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token || '' }),
    })
    const data = await res.json()
    return NextResponse.json({ ok: !!data.success, raw: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'captcha error' }, { status: 500 })
  }
}
