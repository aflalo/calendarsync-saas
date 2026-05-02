'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CalendarSync</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.email}! 👋</h2>
          <p className="text-gray-600">You are logged in to CalendarSync</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-bold text-lg mb-2">📅 Calendars</h4>
              <p className="text-gray-600">Connect your calendars</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="font-bold text-lg mb-2">✅ Status</h4>
              <p className="text-gray-600">Sync ready</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-bold text-lg mb-2">🔄 Auto-sync</h4>
              <p className="text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
