import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const microsoftToken = request.cookies.get('microsoft_access_token')?.value
    const googleToken = request.cookies.get('google_access_token')?.value

    if (!microsoftToken || !googleToken) {
      return NextResponse.json(
        { error: 'Missing calendar connections' },
        { status: 400 }
      )
    }

    // Demo: Just return success message
    return NextResponse.json({
      success: true,
      message: 'Calendar sync started!',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}
