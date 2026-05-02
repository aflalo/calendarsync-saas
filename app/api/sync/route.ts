import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const microsoftToken = request.cookies.get('microsoft_access_token')?.value
    const googleToken = request.cookies.get('google_access_token')?.value

    if (!microsoftToken || !googleToken) {
      return NextResponse.json(
        { error: 'Missing calendar connections. Connect both Microsoft 365 and Google Calendar.' },
        { status: 400 }
      )
    }

    // Get events from Microsoft 365
    const msEventsResponse = await fetch('https://graph.microsoft.com/v1.0/me/events', {
      headers: {
        Authorization: `Bearer ${microsoftToken}`,
      },
    })

    if (!msEventsResponse.ok) {
      console.error('Failed to fetch Microsoft events:', await msEventsResponse.text())
      return NextResponse.json(
        { error: 'Failed to access Microsoft 365 calendar' },
        { status: 400 }
      )
    }

    const msEvents = await msEventsResponse.json()

    // Sync events to Google Calendar
    let syncedCount = 0
    for (const event of msEvents.value || []) {
      try {
        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: event.subject,
            description: event.bodyPreview,
            start: { dateTime: event.start.dateTime, timeZone: 'UTC' },
            end: { dateTime: event.end.dateTime, timeZone: 'UTC' },
          }),
        })
        syncedCount++
      } catch (err) {
        console.error('Failed to sync event:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} events from Microsoft 365 to Google Calendar`,
      eventsSynced: syncedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed: ' + String(error) },
      { status: 500 }
    )
  }
}
