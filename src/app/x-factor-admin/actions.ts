'use server';

export async function loginAdmin(password: string) {
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envPassword && password.trim() === envPassword.trim()) {
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function logoutAdmin() {
  return { success: true };
}
