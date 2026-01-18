import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Settings, LayoutDashboard, Home } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'דשבורד', icon: LayoutDashboard },
    { path: '/admin/edit', label: 'עריכת שאלות', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">ממשק ניהול</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground mr-4 border-r border-border pr-4"
              >
                <Home className="w-4 h-4" />
                עמוד ראשי
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  );
};

export default AdminLayout;
