import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const tab = (path: string, label: string, Icon: typeof Home) => (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        pathname === path
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold">פאנל ניהול</h1>
          <nav className="flex items-center gap-2 flex-wrap">
            {tab("/admin", "תוצאות", BarChart3)}
            {tab("/admin/edit", "עריכת שאלות", Edit3)}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border hover:bg-accent"
            >
              <Home className="w-4 h-4" />
              חזרה לעמוד הראשי
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
