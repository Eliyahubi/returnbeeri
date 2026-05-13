import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Bell } from "lucide-react";
import { cn, roleLabels } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

export function UserNav() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-sand-100 transition-colors"
      >
        <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-sage-600" />
        </div>
        <ChevronDown className={cn("w-4 h-4 text-sand-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-sand-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-sand-100">
              <p className="font-medium text-sand-800">{user.name}</p>
              <p className="text-sm text-sand-500">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-sage-100 text-sage-700 text-xs rounded-full">
                {roleLabels[user.role] || user.role}
              </span>
            </div>
            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-sand-700 hover:bg-sand-50"
              >
                <User className="w-4 h-4" /> פרופיל
              </Link>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-sand-700 hover:bg-sand-50"
              >
                <Bell className="w-4 h-4" /> התראות
              </Link>
            </div>
            <div className="border-t border-sand-100 py-1">
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-right"
              >
                <LogOut className="w-4 h-4" /> התנתק
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
