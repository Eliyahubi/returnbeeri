import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { AuthProvider } from '@/components/providers/auth-provider'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Return Home Project - Task Management',
  description: 'A calm, collaborative task management system for community projects',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="he" dir="rtl" className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
