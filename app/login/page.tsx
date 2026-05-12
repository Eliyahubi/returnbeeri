'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Home, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('אימייל או סיסמה שגויים')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('אירעה שגיאה. נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mb-4">
            <Home className="w-8 h-8 text-sage-600" />
          </div>
          <h1 className="text-2xl font-semibold text-sand-800 mb-2">
            פרויקט החזרה הביתה
          </h1>
          <p className="text-sand-600">
            מערכת ניהול משימות קהילתית
          </p>
        </div>

        {/* Login Card */}
        <div className="calm-card p-8">
          <h2 className="text-xl font-medium text-sand-800 mb-6 text-center">
            התחברות
          </h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pr-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sand-700 mb-1">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'התחבר'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-sand-500">
            פנה למנהל המערכת לקבלת גישה
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-sand-400">
            לבדיקה: admin@example.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
