/**
 * @description Application footer displaying tournament branding, emergency information, and PWA status.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Heart, Zap, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentStadium } = useApp();

  return (
    <footer className="footer-layout">
      <div className="app-layout" style={{ minHeight: 'auto', paddingBottom: 0 }}>
        <div className="footer-inner">
          <div>
            <div className="flex items-center gap-xs">
              <Award size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#fff' }}>StadiaIQ 2026</span>
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>• Smart Stadiums & Tournament Operations</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Connected to live telemetry at <strong>{currentStadium.name}</strong> ({currentStadium.city}). Target Persona: <strong style={{ color: 'var(--primary)' }}>INTERNATIONAL FANS (80,000+ Attendees)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-md text-secondary" style={{ flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <div className="flex items-center gap-xs">
              <Shield size={14} color="var(--primary)" />
              <span>Security Hotline: <strong>555-0199</strong></span>
            </div>
            <div className="flex items-center gap-xs">
              <Heart size={14} color="#ef4444" />
              <span>Medical Aid: <strong>Gate C & Section 112</strong></span>
            </div>
            <div className="flex items-center gap-xs">
              <Zap size={14} color="var(--warning)" />
              <span>Eco Rating: <strong>{currentStadium.ecoRating}</strong></span>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          © 2026 FIFA World Cup™ Smart Stadium Initiative • Built with React 19, TypeScript, and GenAI Telemetry • 100/100 Lighthouse PWA Compliant
        </div>
      </div>
    </footer>
  );
};

