import { describe, it, expect } from 'vitest';
import { getAICrowdRecommendation, getAIPredictiveAlerts, generateCopilotResponse } from '../utils/aiEngine';
import { STADIUMS } from '../data/stadiumData';

describe('AI Engine & Telemetry Unit Tests', () => {
  const metlife = STADIUMS[0];

  it('calculates optimal gate recommendation with lowest wait time', () => {
    const rec = getAICrowdRecommendation(metlife, false, 'en');
    expect(rec.recommendedGate).toBeDefined();
    expect(rec.recommendedGate.status).toBe('optimal');
    expect(rec.savedMinutes).toBeGreaterThan(0);
    expect(rec.message).toContain('faster entry');
  });

  it('filters for accessible gates when wheelchair routing is toggled', () => {
    const rec = getAICrowdRecommendation(metlife, true, 'en');
    expect(rec.recommendedGate.accessible).toBe(true);
  });

  it('generates operational predictive alerts for staff command center', () => {
    const alerts = getAIPredictiveAlerts(metlife);
    expect(alerts.length).toBeGreaterThanOrEqual(3);
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].recommendation).toContain('turnstiles');
  });

  it('responds accurately to halal food queries in English', () => {
    const response = generateCopilotResponse('Where can I eat halal food?', metlife, 'en');
    expect(response.text).toContain('Crescent Halal Grill');
    expect(response.suggestedAction?.label).toContain('Live Map');
  });

  it('responds in Spanish when queried about metro/transit', () => {
    const response = generateCopilotResponse('necesito el metro para salir', metlife, 'es');
    expect(response.text).toContain('NJ Transit Rail');
    expect(response.text).toContain('Puntos Eco');
  });

  it('responds accurately to vegan food queries in English', () => {
    const response = generateCopilotResponse('Where can I get vegan plant food?', metlife, 'en');
    expect(response.text).toContain('Green Goals Vegan Kitchen');
    expect(response.text).toContain('100% plant-based');
    expect(response.suggestedAction?.label).toContain('Live Map');
  });
});
