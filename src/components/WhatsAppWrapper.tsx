'use client';

import { usePathname } from 'next/navigation';
import WhatsAppButton from './WhatsAppButton';

export default function WhatsAppWrapper() {
  const pathname = usePathname();

  // Hide WhatsApp button on admin routes
  if (pathname?.startsWith('/x-factor-admin')) {
    return null;
  }

  return <WhatsAppButton />;
}
