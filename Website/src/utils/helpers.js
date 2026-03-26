// ============================
// Utility Helpers
// ============================

/**
 * Format currency in Indian Rupee notation.
 * Large numbers show as ₹1.2M, ₹450K etc., smaller numbers use ₹XX,XXX format.
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${amount.toLocaleString('en-IN')}`;
  return `₹${amount}`;
}

/** Full currency with no abbreviation */
export function formatCurrencyFull(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format date as "DD MMM YYYY" */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Get status badge CSS class */
export function getStatusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending' || s === 'new orders') return 'badge-pending';
  if (s === 'fulfilled' || s === 'delivered' || s === 'paid') return 'badge-fulfilled';
  if (s === 'processing' || s === 'partial') return 'badge-processing';
  if (s === 'shipped') return 'badge-shipped';
  if (s === 'cancelled' || s === 'overdue' || s === 'unpaid') return 'badge-cancelled';
  return 'badge-pending';
}

/** Get user initials */
export function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/** Generate a simple ID */
export function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}
