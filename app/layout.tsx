import type { Metadata } from 'next'
import { ThemeProvider } from './context/ThemeContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'CalendarSync',
  description: 'Keep all your calendars in sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
