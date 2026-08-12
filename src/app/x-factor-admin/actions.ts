'use server';

export async function loginAdmin(password: string) {
  const envPassword = process.env.ADMIN_PASSWORD || 'GrimReaper654985';

  console.log('[Admin Login Attempt] Password submitted:', password, '| Expected:', envPassword);

  if (password && password.trim() === envPassword.trim()) {
    return { success: true };
  }

  return { success: false, error: 'Invalid master password' };
}

export async function logoutAdmin() {
  return { success: true };
}
