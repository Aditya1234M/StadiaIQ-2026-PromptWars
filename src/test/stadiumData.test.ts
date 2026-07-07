import { describe, it, expect } from 'vitest';
import { STADIUMS, TRANSLATIONS, INITIAL_INCIDENTS } from '../data/stadiumData';

describe('Stadium Dataset & Translation Integrity Tests', () => {
  it('contains valid data for FIFA World Cup 2026 flagship venues', () => {
    expect(STADIUMS.length).toBe(3);
    const names = STADIUMS.map((s) => s.id);
    expect(names).toContain('metlife');
    expect(names).toContain('azteca');
    expect(names).toContain('sofi');
  });

  it('ensures each stadium has gates, concessions, restrooms, and transit routes', () => {
    STADIUMS.forEach((stadium) => {
      expect(stadium.gates.length).toBeGreaterThan(0);
      expect(stadium.concessions.length).toBeGreaterThan(0);
      expect(stadium.restrooms.length).toBeGreaterThan(0);
      expect(stadium.transit.length).toBeGreaterThan(0);
      expect(stadium.capacity).toBeGreaterThan(60000);
    });
  });

  it('verifies multilingual translation dictionary covers all required languages', () => {
    const langs = Object.keys(TRANSLATIONS);
    expect(langs).toEqual(['en', 'es', 'fr', 'ar', 'de']);
    expect(TRANSLATIONS.en.copilot).toBe('StadiaCopilot AI');
    expect(TRANSLATIONS.es.copilot).toBe('Asistente IA StadiaCopilot');
  });

  it('provides initial operational incidents for Staff Command Mode', () => {
    expect(INITIAL_INCIDENTS.length).toBeGreaterThanOrEqual(3);
    expect(INITIAL_INCIDENTS[0].type).toBe('crowd');
  });
});
