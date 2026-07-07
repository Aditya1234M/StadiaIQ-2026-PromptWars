/**
 * @description Main application navigation bar featuring stadium selection, dual-mode toggle, multilingual switcher, and navigation tabs.
 */
import React from 'react';
import { useApp } from '../context/AppContext';
import { STADIUMS } from '../data/stadiumData';
import type { LanguageCode } from '../types/stadium';
import { Trophy, ShieldAlert, Globe, MapPin, Sparkles, LayoutDashboard, Map, MessageSquare, Bus, Sliders } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { state, t, setMode, setLanguage, setSelectedStadium } = useApp();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  const handleStadiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStadium(e.target.value);
  };

  const toggleMode = () => {
    const nextMode = state.mode === 'fan' ? 'staff' : 'fan';
    setMode(nextMode);
    if (nextMode === 'staff' && activeTab !== 'staff') {
      setActiveTab('staff');
    } else if (nextMode === 'fan' && activeTab === 'staff') {
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="navbar-container" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(8, 13, 20, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="app-layout" style={{ minHeight: 'auto', paddingBottom: 0 }}>
        {/* Top Bar */}
        <div className="flex justify-between items-center" style={{ padding: '12px 0', flexWrap: 'wrap', gap: '12px' }}>
          {/* Brand */}
          <div className="flex items-center gap-sm" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')} role="banner">
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '8px', borderRadius: '12px', display: 'flex' }}>
              <Trophy size={22} color="#080d14" />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>StadiaIQ</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginLeft: '6px', background: 'var(--primary-subtle)', padding: '2px 8px', borderRadius: '99px' }}>2026</span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>FIFA World Cup Smart Stadium AI</div>
            </div>
          </div>

          {/* Controls: Stadium, Mode, Language */}
          <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
            {/* Stadium Selector */}
            <div className="flex items-center gap-xs" style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <MapPin size={14} color="var(--primary)" />
              <select value={state.selectedStadiumId} onChange={handleStadiumChange} style={{ background: 'transparent', border: 'none', padding: '4px 0', width: 'auto', fontWeight: 600, fontSize: '0.8rem', color: '#fff', cursor: 'pointer' }} aria-label="Select FIFA World Cup Stadium">
                {STADIUMS.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: '#0f1724' }}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Dual-Mode Toggle */}
            <button
              onClick={toggleMode}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                background: state.mode === 'staff' ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-subtle)',
                color: state.mode === 'staff' ? '#ef4444' : 'var(--primary-light)',
                border: `1px solid ${state.mode === 'staff' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 229, 153, 0.4)'}`,
              }}
              aria-label={`Current mode: ${state.mode}. Click to switch.`}
            >
              {state.mode === 'staff' ? <ShieldAlert size={14} /> : <Sparkles size={14} />}
              <span>{state.mode === 'staff' ? t('switchFan') : t('switchStaff')}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-xs" style={{ background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <Globe size={14} color="var(--accent)" />
              <select value={state.language} onChange={handleLanguageChange} style={{ background: 'transparent', border: 'none', padding: '4px 0', width: 'auto', fontSize: '0.8rem', color: '#fff', cursor: 'pointer' }} aria-label="Select Language">
                <option value="en" style={{ background: '#0f1724' }}>EN</option>
                <option value="es" style={{ background: '#0f1724' }}>ES</option>
                <option value="fr" style={{ background: '#0f1724' }}>FR</option>
                <option value="ar" style={{ background: '#0f1724' }}>AR</option>
                <option value="de" style={{ background: '#0f1724' }}>DE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-xs" style={{ overflowX: 'auto', paddingBottom: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }} role="navigation" aria-label="Main navigation">
          <button onClick={() => setActiveTab('dashboard')} className="btn" style={{ padding: '8px 14px', background: activeTab === 'dashboard' ? 'var(--primary-subtle)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--primary-light)' : 'var(--text-secondary)', borderBottom: activeTab === 'dashboard' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '6px 6px 0 0' }}>
            <LayoutDashboard size={16} />
            <span>{t('dashboard')}</span>
          </button>
          <button onClick={() => setActiveTab('navigate')} className="btn" style={{ padding: '8px 14px', background: activeTab === 'navigate' ? 'var(--primary-subtle)' : 'transparent', color: activeTab === 'navigate' ? 'var(--primary-light)' : 'var(--text-secondary)', borderBottom: activeTab === 'navigate' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '6px 6px 0 0' }}>
            <Map size={16} />
            <span>{t('navigate')}</span>
          </button>
          <button onClick={() => setActiveTab('copilot')} className="btn" style={{ padding: '8px 14px', background: activeTab === 'copilot' ? 'var(--primary-subtle)' : 'transparent', color: activeTab === 'copilot' ? 'var(--primary-light)' : 'var(--text-secondary)', borderBottom: activeTab === 'copilot' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '6px 6px 0 0' }}>
            <MessageSquare size={16} />
            <span>{t('copilot')}</span>
            <span style={{ fontSize: '0.65rem', background: 'var(--accent)', color: '#000', padding: '1px 6px', borderRadius: '99px', fontWeight: 800 }}>AI</span>
          </button>
          <button onClick={() => setActiveTab('transit')} className="btn" style={{ padding: '8px 14px', background: activeTab === 'transit' ? 'var(--primary-subtle)' : 'transparent', color: activeTab === 'transit' ? 'var(--primary-light)' : 'var(--text-secondary)', borderBottom: activeTab === 'transit' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '6px 6px 0 0' }}>
            <Bus size={16} />
            <span>{t('transit')}</span>
          </button>
          {state.mode === 'staff' && (
            <button onClick={() => setActiveTab('staff')} className="btn" style={{ padding: '8px 14px', background: activeTab === 'staff' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', color: activeTab === 'staff' ? '#ef4444' : 'var(--text-secondary)', borderBottom: activeTab === 'staff' ? '2px solid #ef4444' : '2px solid transparent', borderRadius: '6px 6px 0 0' }}>
              <Sliders size={16} />
              <span>{t('staff')}</span>
              <span style={{ fontSize: '0.65rem', background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '99px', fontWeight: 800 }}>OPS</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
