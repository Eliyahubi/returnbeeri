import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardNav } from "./nav";
import { UserNav } from "./user-nav";

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="sticky top-0 z-50 bg-white border-b border-sand-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <DashboardNav userRole={user.role} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-sand-600 hidden sm:inline">{user.name}</span>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
