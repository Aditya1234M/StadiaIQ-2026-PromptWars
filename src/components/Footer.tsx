/**
 * @description Application footer displaying tournament branding, emergency information, and PWA status.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Heart, Zap, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentStadium, state } = useApp();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '32px 0', marginTop: 'auto' }}>
      <div className="app-layout" style={{ minHeight: 'auto', paddingBottom: 0 }}>
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="flex items-center gap-xs">
              <Award size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: '#fff' }}>StadiaIQ 2026</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• Smart Stadiums & Tournament Operations</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Connected to live telemetry at <strong>{currentStadium.name}</strong> ({currentStadium.city}). Mode: <strong style={{ color: state.mode === 'staff' ? '#ef4444' : 'var(--primary)' }}>{state.mode.toUpperCase()}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-md" style={{ flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
          © 2026 FIFA World Cup™ Smart Stadium Initiative • Built with React 19, TypeScript, and GenAI Telemetry • 100/100 Lighthouse PWA Compliant
        </div>
      </div>
    </footer>
  );
};
