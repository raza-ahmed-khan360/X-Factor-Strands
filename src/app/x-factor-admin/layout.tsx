'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChevronRight } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/x-factor-admin', icon: LayoutDashboard },
  { name: 'Products', href: '/x-factor-admin/products', icon: Package },
  { name: 'Orders', href: '/x-factor-admin/orders', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/x-factor-admin/login';
    }
  };

  // If we are on the login page, render children directly without layout checks
  if (pathname === '/x-factor-admin/login') {
    return <>{children}</>;
  }

  // Protect admin pages: check server HTTP-only session cookie
  React.useEffect(() => {
    fetch('/api/admin/check-auth')
      .then((res) => {
        if (!res.ok) {
          window.location.href = '/x-factor-admin/login';
        }
      })
      .catch(() => {
        window.location.href = '/x-factor-admin/login';
      });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/x-factor-admin" className="font-display font-bold text-xl tracking-wider text-white">
            <span className="text-accent">X</span>-FACTOR <span className="text-muted-foreground text-xs font-sans tracking-normal ml-1">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = item.href === '/x-factor-admin'
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-md w-full text-left text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:hidden">
          <Link href="/x-factor-admin" className="font-display font-bold text-lg tracking-wider text-white">
            <span className="text-accent">X</span>-FACTOR
          </Link>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
