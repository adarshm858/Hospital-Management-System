/**
 * Format currency amount with Rupee symbol and Indian number formatting
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date string into readable medical format (e.g., 28 Oct 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Format date and time (e.g., 28 Oct 2026, 04:30 PM)
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
};

/**
 * Format time string (e.g. "14:30:00" -> "02:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '—';
  try {
    if (timeString.includes('T')) {
      return formatDateTime(timeString);
    }
    const [hours, minutes] = timeString.split(':');
    const d = new Date();
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return timeString;
  }
};

/**
 * Get initials from a name (e.g. "Adarsh Mishra" -> "AM")
 */
export const getInitials = (firstName = '', lastName = '') => {
  const f = (firstName || '').trim().charAt(0).toUpperCase();
  const l = (lastName || '').trim().charAt(0).toUpperCase();
  if (f && l) return `${f}${l}`;
  if (f) return f;
  return 'U';
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 * Export JSON data to CSV and trigger browser download
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = row[header] === null || row[header] === undefined ? '' : row[header];
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Mask person name for EMR privacy (e.g. "Rahul Sharma" -> "R•••• S•••••")
 */
export const maskName = (name) => {
  if (!name) return '—';
  return name
    .split(' ')
    .map((part) => (part.length > 0 ? `${part[0]}${'•'.repeat(Math.max(part.length - 1, 3))}` : ''))
    .join(' ');
};

/**
 * Mask phone number (e.g. "+91 9876543210" -> "******3210")
 */
export const maskPhone = (phone) => {
  if (!phone) return '—';
  const clean = String(phone).replace(/\s+/g, '');
  if (clean.length <= 4) return '••••';
  const visible = clean.slice(-4);
  return '******' + visible;
};

/**
 * Mask email (e.g. "rahul@example.com" -> "r••••@••••.com")
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '•••••@••••';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 1 ? `${local[0]}••••` : '•';
  const domainParts = domain.split('.');
  const ext = domainParts.length > 1 ? `.${domainParts.slice(1).join('.')}` : '';
  return `${maskedLocal}@••••${ext}`;
};

/**
 * Mask ID (e.g. 104 -> "#••04")
 */
export const maskId = (id) => {
  if (!id) return '#••';
  const s = String(id);
  if (s.length <= 2) return `#••`;
  return `#••${s.slice(-2)}`;
};

