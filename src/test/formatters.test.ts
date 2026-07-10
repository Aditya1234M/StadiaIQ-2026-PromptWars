import { describe, it, expect } from 'vitest';
import { formatWaitTime, formatCapacityColor, formatSeverityBadge } from '../utils/formatters';

describe('Formatter Utility Unit Tests', () => {
  it('formats zero wait time as instant', () => {
    expect(formatWaitTime(0)).toBe('No Queue (Instant)');
  });

  it('formats negative wait time as instant', () => {
    expect(formatWaitTime(-5)).toBe('No Queue (Instant)');
  });

  it('formats short wait time as fast', () => {
    expect(formatWaitTime(5)).toBe('5 min (Fast)');
    expect(formatWaitTime(9)).toBe('9 min (Fast)');
  });

  it('formats moderate wait time correctly', () => {
    expect(formatWaitTime(10)).toBe('10 min (Moderate)');
    expect(formatWaitTime(19)).toBe('19 min (Moderate)');
  });

  it('formats heavy delay wait time correctly', () => {
    expect(formatWaitTime(20)).toBe('20 min (Heavy Delay)');
    expect(formatWaitTime(45)).toBe('45 min (Heavy Delay)');
  });

  it('returns green color for low capacity', () => {
    expect(formatCapacityColor(30)).toBe('var(--primary)');
    expect(formatCapacityColor(49)).toBe('var(--primary)');
  });

  it('returns warning color for moderate capacity', () => {
    expect(formatCapacityColor(50)).toBe('var(--warning)');
    expect(formatCapacityColor(79)).toBe('var(--warning)');
  });

  it('returns danger color for high capacity', () => {
    expect(formatCapacityColor(80)).toBe('var(--danger)');
    expect(formatCapacityColor(100)).toBe('var(--danger)');
  });

  it('returns correct badge for critical severity', () => {
    const badge = formatSeverityBadge('critical');
    expect(badge.label).toBe('CRITICAL SURGE');
    expect(badge.color).toBe('#ef4444');
  });

  it('returns correct badge for high severity', () => {
    const badge = formatSeverityBadge('high');
    expect(badge.label).toBe('HIGH PRIORITY');
    expect(badge.color).toBe('#f59e0b');
  });

  it('returns correct badge for medium severity', () => {
    const badge = formatSeverityBadge('medium');
    expect(badge.label).toBe('MODERATE');
    expect(badge.color).toBe('#00b8d4');
  });

  it('returns correct badge for low severity', () => {
    const badge = formatSeverityBadge('low');
    expect(badge.label).toBe('LOW / RESOLVED');
    expect(badge.color).toBe('#00e599');
  });
});
