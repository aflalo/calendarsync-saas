import { NextResponse } from 'next/server'

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID
const MICROSOFT_REDIRECT_URI = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/microsoft/callback` : 'https://calendarsync-saas.vercel.app/api/auth/microsoft/callback'

export async function GET() {
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID || '',
    redirect_uri: MICROSOFT_REDIRECT_URI,
    response_type: 'code',
    scope: 'Calendars.ReadWrite offline_access',
    response_mode: 'query',
  })

  const authUrl = `https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?${params.toString()}`
  
  return NextResponse.redirect(authUrl)
}
