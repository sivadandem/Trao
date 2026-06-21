/**
 * Format currency to human-readable string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get risk level label and color class based on score
 */
export const getRiskLevel = (score) => {
  if (score <= 25) return { label: 'Low Risk', className: 'risk-low', color: '#4ade80' };
  if (score <= 50) return { label: 'Moderate Risk', className: 'risk-medium', color: '#fbbf24' };
  if (score <= 75) return { label: 'High Risk', className: 'risk-high', color: '#f87171' };
  return { label: 'Critical Risk', className: 'risk-critical', color: '#ef4444' };
};

/**
 * Get budget tier badge data
 */
export const getBudgetBadge = (tier) => {
  const map = {
    low: { label: 'Budget', className: 'badge-low' },
    medium: { label: 'Mid-Range', className: 'badge-medium' },
    high: { label: 'Luxury', className: 'badge-high' },
  };
  return map[tier] || { label: tier, className: 'badge-info' };
};

/**
 * Get interest emoji
 */
export const interestEmojis = {
  food: '🍜',
  culture: '🏛️',
  adventure: '🧗',
  shopping: '🛍️',
  nature: '🌿',
  nightlife: '🌃',
  family: '👨‍👩‍👧',
  history: '📜',
};

/**
 * Get packing category icon
 */
export const packingCategoryIcon = {
  documents: '📄',
  clothing: '👕',
  electronics: '💻',
  medicine: '💊',
  'activity-equipment': '🎒',
  'weather-essentials': '🌦️',
  other: '📦',
};

/**
 * Truncate text to specified length
 */
export const truncate = (str, length = 100) => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Calculate packing completion percentage
 */
export const getPackingProgress = (packingList) => {
  if (!packingList || packingList.length === 0) return 0;
  const completed = packingList.filter((i) => i.completed).length;
  return Math.round((completed / packingList.length) * 100);
};

/**
 * Generate a color from a string (for avatars)
 */
export const stringToColor = (str) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
