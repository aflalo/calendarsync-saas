import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code' }, { status: 400 })
  }

  // Store token in cookie (demo - in production use secure backend exchange)
  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set('microsoft_access_token', 'demo-token-' + code.slice(0, 10), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })

  return response
}
