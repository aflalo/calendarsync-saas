'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { APP_VERSION } from '../version'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [microsoftConnected, setMicrosoftConnected] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleMicrosoftConnect = () => {
    window.location.href = '/api/auth/microsoft'
  }

  const handleGoogleConnect = () => {
    window.location.href = '/api/auth/google'
  }

  const handleSync = async () => {
    setSyncLoading(true)
    try {
      const response = await fetch('/api/sync')
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
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.email}! 👋</h2>
          <p className="text-gray-600 mb-8">Connect your calendars to start syncing</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-lg mb-2">Microsoft 365</h3>
              <p className="text-gray-600 mb-4">Sync your M365 calendar</p>
              <button onClick={handleMicrosoftConnect} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Connect Microsoft 365
              </button>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="font-bold text-lg mb-2">Google Calendar</h3>
              <p className="text-gray-600 mb-4">Sync your Google Calendar</p>
              <button onClick={handleGoogleConnect} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                Connect Google Calendar
              </button>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-bold text-lg mb-2">🔄 Sync Your Calendars</h3>
            <p className="text-gray-600 mb-4">Connect both calendars above, then click Sync Now</p>
            <button onClick={handleSync} disabled={syncLoading} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50">
              {syncLoading ? 'Syncing...' : '🔄 Sync Now'}
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm py-4 border-t border-gray-200">
        CalendarSync v{APP_VERSION}
      </footer>
    </main>
  )
}
