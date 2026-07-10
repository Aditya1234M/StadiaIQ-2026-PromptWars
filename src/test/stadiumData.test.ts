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

  it('provides initial operational incidents for monitoring', () => {
    expect(INITIAL_INCIDENTS.length).toBeGreaterThanOrEqual(3);
    expect(INITIAL_INCIDENTS[0].type).toBe('crowd');
  });

  it('ensures MetLife Stadium has correct capacity and eco rating', () => {
    const metlife = STADIUMS.find((s) => s.id === 'metlife')!;
    expect(metlife.capacity).toBe(82500);
    expect(metlife.ecoRating).toBeDefined();
    expect(metlife.solarPowerKw).toBeGreaterThan(0);
    expect(metlife.recyclingPercent).toBeGreaterThan(0);
  });

  it('ensures each stadium has at least one accessible gate', () => {
    STADIUMS.forEach((stadium) => {
      const accessibleGates = stadium.gates.filter((g) => g.accessible);
      expect(accessibleGates.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('ensures each stadium has at least one optimal gate', () => {
    STADIUMS.forEach((stadium) => {
      const optimalGates = stadium.gates.filter((g) => g.status === 'optimal');
      expect(optimalGates.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('ensures concession categories include halal and vegan options', () => {
    STADIUMS.forEach((stadium) => {
      const categories = stadium.concessions.map((c) => c.category);
      expect(categories).toContain('halal');
      expect(categories).toContain('vegan');
    });
  });

  it('verifies transit routes have positive eco points for sustainability tracking', () => {
    STADIUMS.forEach((stadium) => {
      stadium.transit.forEach((route) => {
        expect(route.ecoPoints).toBeGreaterThan(0);
      });
    });
  });

  it('verifies translation keys are consistent across all 5 languages', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const languages = ['es', 'fr', 'ar', 'de'] as const;
    languages.forEach((lang) => {
      const langKeys = Object.keys(TRANSLATIONS[lang]);
      enKeys.forEach((key) => {
        expect(langKeys).toContain(key);
      });
    });
  });

  it('ensures stadium current attendance is less than capacity', () => {
    STADIUMS.forEach((stadium) => {
      expect(stadium.currentAttendance).toBeLessThanOrEqual(stadium.capacity);
      expect(stadium.currentAttendance).toBeGreaterThan(0);
    });
  });
});
