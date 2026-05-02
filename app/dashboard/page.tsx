'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APP_VERSION } from '../version'

interface ConnectedCalendar {
  id: string
  type: 'microsoft' | 'google'
  email: string
  connectedAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [calendars, setCalendars] = useState<ConnectedCalendar[]>([])
  const [syncLoading, setSyncLoading] = useState(false)
  const [showAddCalendar, setShowAddCalendar] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    setUser(JSON.parse(userData))
    
    const savedCalendars = localStorage.getItem('calendars')
    if (savedCalendars) {
      setCalendars(JSON.parse(savedCalendars))
    }
    setLoading(false)
  }, [router])

  const handleAddCalendar = (type: 'microsoft' | 'google') => {
    if (type === 'microsoft') {
      window.location.href = '/api/auth/microsoft'
    } else {
      window.location.href = '/api/auth/google'
    }
  }

  const handleRemoveCalendar = (id: string) => {
    const updated = calendars.filter(c => c.id !== id)
    setCalendars(updated)
    localStorage.setItem('calendars', JSON.stringify(updated))
  }

  const handleSync = async () => {
    if (calendars.length === 0) {
      alert('❌ Please add at least one calendar')
      return
    }
    setSyncLoading(true)
    try {
      const response = await fetch('/api/sync', { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        alert('✅ Sync completed! ' + data.message)
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Sync failed')
    }
    setSyncLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('calendars')
    router.push('/')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CalendarSync</h1>
          <div className="flex gap-3">
            <Link href="/profile" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium">
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.email}! 👋</h2>
          <p className="text-gray-600 mb-8">Add calendars to start syncing</p>

          {/* Connected Calendars */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Connected Calendars ({calendars.length})</h3>
            {calendars.length === 0 ? (
              <p className="text-gray-600 mb-6">No calendars connected yet</p>
            ) : (
              <div className="space-y-3 mb-6">
                {calendars.map(cal => (
                  <div key={cal.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">{cal.type === 'microsoft' ? '🔵 Microsoft 365' : '🔴 Google Calendar'}</p>
                      <p className="text-sm text-gray-600">{cal.email}</p>
                    </div>
                    <button onClick={() => handleRemoveCalendar(cal.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!showAddCalendar ? (
              <button onClick={() => setShowAddCalendar(true)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                + Add Calendar
              </button>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleAddCalendar('microsoft')} className="px-4 py-3 bg-blue-50 border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium">
                  🔵 Connect Microsoft 365
                </button>
                <button onClick={() => handleAddCalendar('google')} className="px-4 py-3 bg-red-50 border-2 border-red-600 text-red-700 rounded-lg hover:bg-red-100 transition font-medium">
                  🔴 Connect Google Calendar
                </button>
              </div>
            )}
          </div>

          {/* Sync Section */}
          {calendars.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-lg mb-2">🔄 Sync Calendars</h3>
              <p className="text-gray-600 mb-4">Sync events between your connected calendars</p>
              <button onClick={handleSync} disabled={syncLoading} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50">
                {syncLoading ? 'Syncing...' : '🔄 Sync Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm py-4 border-t border-gray-200">
        CalendarSync v{APP_VERSION}
      </footer>
    </main>
  )
}
