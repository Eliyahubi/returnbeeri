import Link from 'next/link'
import { Home, CheckSquare, Users, Bell } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-sage-600" />
              </div>
              <span className="font-semibold text-sand-800">פרויקט החזרה הביתה</span>
            </div>
            <Link
              href="/login"
              className="btn-primary"
            >
              התחברות
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-sand-800 mb-6">
              ניהול משימות קהילתי
            </h1>
            <p className="text-xl text-sand-600 mb-8">
              מערכת ניהול משימות ידידותית ושקטה לפרויקטים קהילתיים מורכבים
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="btn-primary text-lg px-8 py-3"
              >
                כניסה למערכת
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="calm-card text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold text-sand-800 mb-2">ניהול משימות</h3>
              <p className="text-sand-600 text-sm">
                מעקב אחר משימות, תלויות, וסטטוסים בזמן אמת
              </p>
            </div>

            <div className="calm-card text-center">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-sand-800 mb-2">שיתוף פעולה</h3>
              <p className="text-sand-600 text-sm">
                עבודה צוותית עם תפקידים מוגדרים והרשאות
              </p>
            </div>

            <div className="calm-card text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-sand-800 mb-2">התראות</h3>
              <p className="text-sand-600 text-sm">
                התראות בוואטסאפ ובמערכת לעדכונים חשובים
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sand-500 text-sm">
          <p>פרויקט החזרה הביתה - מערכת ניהול משימות קהילתית</p>
        </div>
      </footer>
    </div>
  )
}
