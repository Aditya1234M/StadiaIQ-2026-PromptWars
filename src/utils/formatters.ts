/**
 * @description Utility helpers for formatting times, capacity metrics, and severity badge styling.
 */

export const formatWaitTime = (minutes: number): string => {
  if (minutes <= 0) return 'No Queue (Instant)';
  if (minutes < 10) return `${minutes} min (Fast)`;
  if (minutes < 20) return `${minutes} min (Moderate)`;
  return `${minutes} min (Heavy Delay)`;
};

export const formatCapacityColor = (percent: number): string => {
  if (percent < 50) return 'var(--primary)'; // Green / Teal
  if (percent < 80) return 'var(--warning)'; // Amber
  return 'var(--danger)'; // Red
};

export const formatSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
  switch (severity) {
    case 'critical':
      return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', label: 'CRITICAL SURGE' };
    case 'high':
      return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', label: 'HIGH PRIORITY' };
    case 'medium':
      return { bg: 'rgba(0, 184, 212, 0.2)', color: '#00b8d4', label: 'MODERATE' };
    case 'low':
    default:
      return { bg: 'rgba(0, 229, 153, 0.2)', color: '#00e599', label: 'LOW / RESOLVED' };
  }
};
