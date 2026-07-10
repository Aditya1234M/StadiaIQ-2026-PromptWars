import { describe, it, expect } from 'vitest';
import { getAICrowdRecommendation, getAIPredictiveAlerts, generateCopilotResponse } from '../utils/aiEngine';
import { STADIUMS } from '../data/stadiumData';

describe('AI Engine & Telemetry Unit Tests', () => {
  const metlife = STADIUMS[0];
  const azteca = STADIUMS[1];
  const sofi = STADIUMS[2];

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

  it('generates localized routing message in German', () => {
    const rec = getAICrowdRecommendation(metlife, false, 'de');
    expect(rec.message).toContain('KI-Route');
    expect(rec.message).toContain('Minuten');
  });

  it('generates localized routing message in French', () => {
    const rec = getAICrowdRecommendation(metlife, false, 'fr');
    expect(rec.message).toContain('Routage IA');
    expect(rec.message).toContain('minutes');
  });

  it('generates localized routing message in Arabic', () => {
    const rec = getAICrowdRecommendation(metlife, false, 'ar');
    expect(rec.message).toContain('توجيه الذكاء الاصطناعي');
  });

  it('returns consistent recommendation across multiple calls (deterministic)', () => {
    const rec1 = getAICrowdRecommendation(metlife, false, 'en');
    const rec2 = getAICrowdRecommendation(metlife, false, 'en');
    expect(rec1.recommendedGate.id).toBe(rec2.recommendedGate.id);
    expect(rec1.savedMinutes).toBe(rec2.savedMinutes);
  });

  it('works correctly for Estadio Azteca venue', () => {
    const rec = getAICrowdRecommendation(azteca, false, 'es');
    expect(rec.recommendedGate).toBeDefined();
    expect(rec.message).toContain('Ruta IA');
  });

  it('works correctly for SoFi Stadium venue', () => {
    const rec = getAICrowdRecommendation(sofi, false, 'en');
    expect(rec.recommendedGate).toBeDefined();
    expect(rec.savedMinutes).toBeGreaterThanOrEqual(0);
  });

  it('generates operational predictive alerts for stadium operations', () => {
    const alerts = getAIPredictiveAlerts(metlife);
    expect(alerts.length).toBeGreaterThanOrEqual(3);
    expect(alerts[0].severity).toBe('critical');
    expect(alerts[0].recommendation).toContain('turnstiles');
  });

  it('predictive alerts include concession wait time spike warning', () => {
    const alerts = getAIPredictiveAlerts(metlife);
    const concessionAlert = alerts.find((a) => a.title.includes('Concession'));
    expect(concessionAlert).toBeDefined();
    expect(concessionAlert!.severity).toBe('high');
    expect(concessionAlert!.recommendation).toContain('mobile express');
  });

  it('predictive alerts include transit shuttle congestion prediction', () => {
    const alerts = getAIPredictiveAlerts(metlife);
    const transitAlert = alerts.find((a) => a.title.includes('Transit'));
    expect(transitAlert).toBeDefined();
    expect(transitAlert!.severity).toBe('medium');
    expect(transitAlert!.recommendation).toContain('zero-emission');
  });

  it('responds accurately to halal food queries in English', () => {
    const response = generateCopilotResponse('Where can I eat halal food?', metlife, 'en');
    expect(response.text).toContain('Crescent Halal Grill');
    expect(response.suggestedAction?.label).toContain('Live Map');
  });

  it('responds accurately to vegan food queries in English', () => {
    const response = generateCopilotResponse('Where can I get vegan plant food?', metlife, 'en');
    expect(response.text).toContain('Green Goals Vegan Kitchen');
    expect(response.text).toContain('100% plant-based');
    expect(response.suggestedAction?.label).toContain('Live Map');
  });

  it('responds in Spanish when queried about metro/transit', () => {
    const response = generateCopilotResponse('necesito el metro para salir', metlife, 'es');
    expect(response.text).toContain('NJ Transit Rail');
    expect(response.text).toContain('Puntos Eco');
  });

  it('responds to restroom queries with fastest option', () => {
    const response = generateCopilotResponse('Where is the nearest restroom?', metlife, 'en');
    expect(response.text).toContain('Section');
    expect(response.text).toContain('minutes');
    expect(response.suggestedAction?.label).toContain('Restroom');
  });

  it('responds to restroom queries in French', () => {
    const response = generateCopilotResponse('Où sont les toilettes?', metlife, 'fr');
    expect(response.text).toContain('Section');
    expect(response.text).toContain('minutes');
  });

  it('responds to bag policy and security queries', () => {
    const response = generateCopilotResponse('What is the bag policy?', metlife, 'en');
    expect(response.text).toContain('FIFA World Cup 2026');
    expect(response.text).toContain('clear plastic');
    expect(response.text).toContain('Gate C');
  });

  it('responds to bag policy queries in German', () => {
    const response = generateCopilotResponse('Was ist die Tasche Richtlinie?', metlife, 'de');
    expect(response.text).toContain('FIFA 2026 Richtlinie');
    expect(response.text).toContain('transparente Taschen');
  });

  it('responds to transit queries in German', () => {
    const response = generateCopilotResponse('Ich brauche den Zug nach Hause', metlife, 'de');
    expect(response.text).toContain('Öko-Punkte');
    expect(response.suggestedAction?.label).toContain('Transit');
  });

  it('returns fallback response for unrecognized queries', () => {
    const response = generateCopilotResponse('tell me a joke', metlife, 'en');
    expect(response.text).toContain('live telemetry');
    expect(response.text).toContain(metlife.name);
  });

  it('returns localized fallback in Arabic for unrecognized queries', () => {
    const response = generateCopilotResponse('أخبرني نكتة', metlife, 'ar');
    expect(response.text).toContain('القياسات المباشرة');
  });
});
