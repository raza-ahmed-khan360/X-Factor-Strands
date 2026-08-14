export interface PaymentMethodConfig {
  id: 'cashapp' | 'venmo' | 'zelle';
  name: string;
  badge: string;
  color: string; // Tailwind color classes
  handle: string;
  recipientName?: string;
  payUrl: string;
  instructions: string;
}

export const PAYMENT_METHODS: Record<'cashapp' | 'venmo' | 'zelle', PaymentMethodConfig> = {
  cashapp: {
    id: 'cashapp',
    name: 'Cash App',
    badge: 'Instant Mobile Pay',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    handle: '$BrianTrimmer1', // PLACEHOLDER: Paste your Cash App Cashtag here (e.g. $XFactorPeptides)
    payUrl: 'https://cash.app/$BrianTrimmer1', // PLACEHOLDER: Paste your direct Cash App link here
    instructions: 'Open Cash App, enter the payment amount, and include your Order Number in the note/memo.',
  },
  venmo: {
    id: 'venmo',
    name: 'Venmo',
    badge: 'Instant Mobile Pay',
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    handle: '@Brian-Trimmer-3', // PLACEHOLDER: Paste your Venmo handle here (e.g. @XFactor-Peptides)
    payUrl: 'https://venmo.com/code?user_id=2936161538408448164&created=1786661861', // PLACEHOLDER: Paste your direct Venmo link here
    instructions: 'Open Venmo, send payment to our handle, and mention your Order Number in the transaction memo.',
  },
  zelle: {
    id: 'zelle',
    name: 'Zelle',
    badge: 'Direct Bank Transfer',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    handle: '484 903 2964', // PLACEHOLDER: Paste your Zelle email or phone here
    recipientName: 'BRIAN TRIMMER', // PLACEHOLDER: Paste your Zelle registered account name here
    payUrl: 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiQlJJQU4iLCJ0b2tlbiI6IjQ4NDkwMzI5NjQifQ==', // Zelle doesn't use web deep links; users send via banking app
    instructions: 'Log into your bank app, send Zelle payment to our registered number (484) 903-2964 (BRIAN TRIMMER), and put your Order Number in the memo.',
  },
};

export function getPaymentMethodDetails(methodKey: string): PaymentMethodConfig {
  const normalized = (methodKey || '').toLowerCase();
  if (normalized.includes('cash')) return PAYMENT_METHODS.cashapp;
  if (normalized.includes('venmo')) return PAYMENT_METHODS.venmo;
  if (normalized.includes('zelle')) return PAYMENT_METHODS.zelle;
  return PAYMENT_METHODS.cashapp;
}
