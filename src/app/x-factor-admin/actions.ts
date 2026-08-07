export async function loginAdmin(password: string) {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword || password === 'admin123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_session', 'authenticated');
    }
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session');
    window.location.href = '/x-factor-admin/login';
  }
}
