// Formatting helpers shared across surfaces.

const DAY_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatMoney(minor: number, currency = 'USD', opts?: { cents?: boolean }) {
  const major = (minor ?? 0) / 100;
  const showCents = opts?.cents ?? true;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(major);
}

export function formatMoneyCompactK(minor: number, currency = 'USD') {
  const major = (minor ?? 0) / 100;
  if (Math.abs(major) >= 1000) {
    const k = Math.round(major / 1000);
    return `$${k}K`;
  }
  return formatMoney(minor, currency, { cents: false });
}

export function formatMoneyWhole(minor: number, currency = 'USD') {
  return formatMoney(minor, currency, { cents: false });
}

export function formatDateLong(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${day} ${DAY_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateShort(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${day} ${DAY_NAMES[d.getUTCMonth()]}`;
}

export function formatDateIso(iso: string | null | undefined) {
  if (!iso) return '—';
  return iso.slice(0, 10);
}

export function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatPct(n: number) {
  if (n == null || Number.isNaN(n)) return '—';
  return `${Math.round(n)}%`;
}

export function countryFlag(cc: string | null | undefined) {
  if (!cc || cc.length !== 2) return '';
  const A = 0x1f1e6;
  return String.fromCodePoint(A + cc.toUpperCase().charCodeAt(0) - 65) +
         String.fromCodePoint(A + cc.toUpperCase().charCodeAt(1) - 65);
}
