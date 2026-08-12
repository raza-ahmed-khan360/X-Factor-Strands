'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { loginAdmin } from '../actions';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // console.log('Logging in with password:', password);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }).then((r) => r.json());

      console.log('Login API response:', res);
      if (res.success) {
        localStorage.setItem('admin_session', 'authenticated');
        window.location.href = '/x-factor-admin/orders';
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 relative overflow-hidden">
        {/* Subtle neon glow effect behind the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-accent/20 blur-[60px] pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Secure Access</h1>
          <p className="text-muted-foreground text-sm">Enter the master password to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-6">
          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg shadow-[0_0_15px_rgba(11,95,255,0.3)]"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}
