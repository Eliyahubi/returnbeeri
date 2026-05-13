# המרת Return Home Project ל-Vite + React

## מטרה
להמיר את האפליקציה הקיימת מ-Next.js לסטאק שנתמך ב-Lovable: Vite + React + React Router + Tailwind + Lovable Cloud (במקום Prisma/NextAuth).

## שלבים

### 1. ניקוי תשתית Next.js
- מחיקת: `next.config.js`, `next-env.d.ts`, `vercel.json`, `postcss.config.mjs`, `app/` directory, `package-lock.json`
- מחיקת תיקיית `node_modules` הישנה
- עדכון `package.json` ל-Vite + React Router + dependencies של shadcn

### 2. הקמת תשתית Vite
- יצירת `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`
- הגדרת Tailwind עם design tokens (semantic HSL) ב-`src/index.css`
- הגדרת alias `@/*` ב-`tsconfig` ו-`vite.config`
- React Router עם המסלולים: `/`, `/login`, `/dashboard`, `/tasks`, `/timeline`, `/manager/users`, `/manager/domains`, `/manager/reports`

### 3. העברת קומפוננטות
- העברת `components/` ו-`lib/` לתוך `src/`
- החלפת `next/link` ב-`react-router-dom Link`
- החלפת `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`) ב-hooks של React Router
- הסרת `'use client'`
- שמירה על RTL/עברית, ועיצוב sand/sage כ-design tokens

### 4. אימות עם Lovable Cloud
- החלפת ה-AuthProvider המבוסס localStorage ב-Supabase Auth (email + password)
- יצירת טבלת `profiles` + `user_roles` (enum: super_admin, domain_manager, task_owner, viewer)
- פונקציית `has_role` security definer + RLS
- דפי `/auth` (signup + login)

### 5. סכמת בסיס נתונים
טבלאות: `profiles`, `user_roles`, `domains`, `tasks`, `task_dependencies`, `notifications`
RLS לפי תפקיד (admin/manager/owner) דרך `has_role`.

### 6. החלפת mock-data
החלפת `lib/mock-data.ts` בקריאות אמיתיות ל-Supabase, עם realtime על `tasks`.

### 7. וידוא
- בדיקת build, ניווט בין דפים, login/signup, יצירת משימה.

## הערות טכניות
- אין WhatsApp/Twilio בשלב זה (אפשר להוסיף בהמשך כ-edge function).
- countdown ימים בלבד נשמר.
- העיצוב sand/sage יוגדר כ-HSL tokens ב-`index.css` ו-`tailwind.config.ts`.

## גודל
זו עבודה גדולה (כ-15-25 קבצים). ממליץ שאחלק לשני שלבים:
**שלב א'** (הצעד הזה): שלבים 1-3 — תשתית Vite + ניווט + UI עובד עם mock data.
**שלב ב'** (הודעה הבאה): שלבים 4-6 — חיבור ל-Lovable Cloud + auth + DB.
