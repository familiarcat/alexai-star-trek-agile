import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DashboardProvider } from '@/contexts/DashboardContext'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

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
        <DashboardProvider>
          <div className="flex h-screen bg-gray-900">
            {/* LCARS Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* LCARS Header */}
              <Header />
              
              {/* Main Content */}
              <main className="flex-1 overflow-auto bg-gray-800">
                {children}
              </main>
            </div>
          </div>
        </DashboardProvider>
      </body>
    </html>
  )
} 