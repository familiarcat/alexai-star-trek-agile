import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AlexAI Enterprise Dashboard',
  description: 'Central dashboard for AlexAI Enterprise Platform - orchestrates all subdomains',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900">
          {/* Main Content */}
          <main className="bg-gray-800">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 