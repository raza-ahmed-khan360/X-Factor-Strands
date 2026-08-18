'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  LogOut,
  ChevronRight,
  Lock,
  AlertCircle,
  Loader2,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Overview', href: '/x-factor-admin', icon: LayoutDashboard },
  { name: 'Products', href: '/x-factor-admin/products', icon: Package },
  { name: 'Orders', href: '/x-factor-admin/orders', icon: ShoppingCart },
  { name: 'Discounts', href: '/x-factor-admin/discounts', icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/x-factor-admin/login';

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  // Login form state inside layout fallback
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Close mobile drawer whenever path changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('xfactor_admin_authenticated');
      const token = localStorage.getItem('admin_session_token');
      if (auth === 'true' || token === 'authenticated_admin_xfactor_2026') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanInput = password.trim();

    if (cleanInput.toLowerCase() === 'grimreaper654985') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('xfactor_admin_authenticated', 'true');
        localStorage.setItem('admin_session_token', 'authenticated_admin_xfactor_2026');
        document.cookie = 'admin_session=authenticated; path=/; max-age=604800; SameSite=Lax';
        document.cookie = 'admin_session_token=authenticated_admin_xfactor_2026; path=/; max-age=604800; SameSite=Lax';
      }
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: cleanInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('xfactor_admin_authenticated', 'true');
          localStorage.setItem('admin_session_token', 'authenticated_admin_xfactor_2026');
          document.cookie = 'admin_session=authenticated; path=/; max-age=604800; SameSite=Lax';
          document.cookie = 'admin_session_token=authenticated_admin_xfactor_2026; path=/; max-age=604800; SameSite=Lax';
        }
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid master password');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('xfactor_admin_authenticated');
      localStorage.removeItem('admin_session_token');
      document.cookie = 'admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'admin_session_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    setIsAuthenticated(false);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-muted-foreground font-display">Loading admin portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-accent/20 blur-[60px] pointer-events-none" />

          <div className="relative z-10 text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Enter the master password to access X-Factor Admin</p>
          </div>

          <form onSubmit={handleInlineLogin} className="relative z-10 space-y-5 sm:space-y-6">
            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Master Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-sm"
                placeholder="Enter master password..."
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-primary text-white hover:bg-primary/90 text-sm sm:text-base font-semibold cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/x-factor-admin" className="font-display font-bold text-xl tracking-wider text-white">
            <span className="text-accent">X</span>-FACTOR <span className="text-muted-foreground text-xs font-sans tracking-normal ml-1">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === '/x-factor-admin'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-md w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="h-16 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/x-factor-admin" className="font-display font-bold text-lg tracking-wider text-white">
            <span className="text-accent">X</span>-FACTOR <span className="text-muted-foreground text-[10px] font-sans">ADMIN</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/x-factor-admin/discounts"
            className="p-2 rounded-lg text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
            title="Discounts"
          >
            <Tag className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-card border-r border-border h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <Link
                href="/x-factor-admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-display font-bold text-lg tracking-wider text-white"
              >
                <span className="text-accent">X</span>-FACTOR <span className="text-muted-foreground text-xs font-sans">ADMIN</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-border/50 bg-accent/5">
              <div className="flex items-center gap-2 text-xs text-accent font-semibold">
                <ShieldCheck className="w-4 h-4" /> Authenticated Administrator
              </div>
            </div>

            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
              {navigation.map((item) => {
                const isActive =
                  item.href === '/x-factor-admin'
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-accent text-white font-bold shadow-lg shadow-accent/25'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors font-medium text-sm cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around py-2 px-2 md:hidden">
        {navigation.map((item) => {
          const isActive =
            item.href === '/x-factor-admin'
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] transition-colors ${
                isActive ? 'text-accent font-bold' : 'text-muted-foreground hover:text-white'
              }`}
            >
              <item.icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
