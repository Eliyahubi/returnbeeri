import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/tasks", label: "משימות", icon: CheckSquare },
  { href: "/timeline", label: "ציר זמן", icon: Calendar },
];
const managerNavItems = [
  { href: "/manager/users", label: "משתמשים", icon: Users },
  { href: "/manager/domains", label: "תחומים", icon: FolderOpen },
  { href: "/manager/reports", label: "דוחות", icon: BarChart3 },
];
const adminNavItems = [{ href: "/admin/settings", label: "הגדרות", icon: Settings }];

export function DashboardNav({ userRole }: { userRole: string }) {
  const { pathname } = useLocation();
  let items = [...navItems];
  if (userRole === "SUPER_ADMIN" || userRole === "DOMAIN_MANAGER") items = [...items, ...managerNavItems];
  if (userRole === "SUPER_ADMIN") items = [...items, ...adminNavItems];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-sage-100 text-sage-800" : "text-sand-600 hover:bg-sand-100 hover:text-sand-800"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
