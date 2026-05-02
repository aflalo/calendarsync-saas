import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    const error = request.nextUrl.searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url))
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || '',
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
        code,
        redirect_uri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/microsoft/callback` : 'https://calendarsync-saas.vercel.app/api/auth/microsoft/callback',
        grant_type: 'authorization_code',
        scope: 'Calendars.ReadWrite offline_access',
      }).toString(),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url))
    }

    // Store token in cookie
    const response = NextResponse.redirect(new URL('/dashboard?microsoft=connected', request.url))
    response.cookies.set('microsoft_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
    })
    
    if (tokenData.refresh_token) {
      response.cookies.set('microsoft_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    console.error('Microsoft callback error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=callback_error', request.url))
  }
}
