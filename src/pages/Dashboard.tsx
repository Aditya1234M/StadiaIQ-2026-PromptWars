/**
 * @description Main dashboard displaying live attendance, AI crowd routing recommendations, gate congestion summary, and quick actions.
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAICrowdRecommendation } from '../utils/aiEngine';
import { formatWaitTime, formatCapacityColor } from '../utils/formatters';
import { Users, Sparkles, MapPin, ArrowRight, MessageSquare, Bus, HeartHandshake, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { currentStadium, state, t, updateProfile } = useApp();

  const aiRec = getAICrowdRecommendation(currentStadium, state.profile.accessibleNeeds, state.language);

  const toggleAccessible = () => {
    updateProfile({ accessibleNeeds: !state.profile.accessibleNeeds });
  };

  const capacityPercent = Math.round((currentStadium.currentAttendance / currentStadium.capacity) * 100);

  // Live countdown timer
  const [countdown, setCountdown] = useState({ h: 2, m: 45, s: 10 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const totalSecs = prev.h * 3600 + prev.m * 60 + prev.s - 1;
        if (totalSecs <= 0) return { h: 0, m: 0, s: 0 };
        return {
          h: Math.floor(totalSecs / 3600),
          m: Math.floor((totalSecs % 3600) / 60),
          s: totalSecs % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="page animate-fade-in" role="main" aria-label="Stadium Dashboard">
      {/* Staff Mode Banner Alert */}
      {state.mode === 'staff' && (
        <div className="card" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="flex items-center gap-sm">
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <div style={{ fontWeight: 700, color: '#ef4444' }}>Staff Command Mode Active</div>
              <div style={{ fontSize: '0.8rem', color: '#fff' }}>3 predictive AI bottleneck alerts require operational review at {currentStadium.name}.</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('staff')} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <span>Open Command Center</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Hero Match Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 153, 0.12), rgba(0, 184, 212, 0.08))', borderColor: 'rgba(0, 229, 153, 0.3)' }}>
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <span className="badge" style={{ marginBottom: '8px' }}>{currentStadium.city}</span>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>{currentStadium.matchTitle}</h1>
            <p className="page-subtitle">{currentStadium.matchTime} • Kickoff Countdown: <strong>{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</strong></p>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(8, 13, 20, 0.6)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-xs" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', justifyContent: 'flex-end' }}>
              <Users size={14} />
              <span>{t('attendance')}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
              {currentStadium.currentAttendance.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {currentStadium.capacity.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: capacityPercent >= 90 ? 'var(--warning)' : 'var(--success)', marginTop: '2px' }}>● {capacityPercent}% Capacity (Live Telemetry)</div>
          </div>
        </div>

        {/* AI Crowd Routing Recommendation Banner */}
        <div style={{ background: 'rgba(8, 13, 20, 0.8)', padding: '16px', borderRadius: '12px', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="flex items-center gap-md" style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ background: 'var(--primary-subtle)', padding: '10px', borderRadius: '10px' }}>
              <Sparkles size={24} color="var(--primary)" />
            </div>
            <div>
              <div className="flex items-center gap-xs">
                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.9rem' }}>{t('aiRecommendation')}</span>
                {state.profile.accessibleNeeds && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Wheelchair Accessible</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '4px', lineHeight: 1.4 }}>{aiRec.message}</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('navigate')} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <span>View on Live Map</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid-3">
        <button onClick={() => setActiveTab('copilot')} className="card card-interactive" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex justify-between items-center">
            <div style={{ background: 'var(--accent-subtle)', padding: '10px', borderRadius: '10px' }}>
              <MessageSquare size={20} color="var(--accent)" />
            </div>
            <span className="badge" style={{ background: 'var(--accent)', color: '#000', fontWeight: 800 }}>AI Copilot</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{t('copilot')}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Ask in any language about halal/vegan food, restrooms, or stadium policies.</p>
          </div>
        </button>

        <button onClick={toggleAccessible} className="card card-interactive" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', borderColor: state.profile.accessibleNeeds ? 'var(--warning)' : 'var(--border)' }}>
          <div className="flex justify-between items-center">
            <div style={{ background: 'var(--warning-subtle)', padding: '10px', borderRadius: '10px' }}>
              <HeartHandshake size={20} color="var(--warning)" />
            </div>
            <span className="badge badge-warning">{state.profile.accessibleNeeds ? 'ACTIVE' : 'OFF'}</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{t('accessibleOnly')}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Toggle step-free wheelchair routing, elevator priority, and sensory relief rooms.</p>
          </div>
        </button>

        <button onClick={() => setActiveTab('transit')} className="card card-interactive" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex justify-between items-center">
            <div style={{ background: 'var(--primary-subtle)', padding: '10px', borderRadius: '10px' }}>
              <Bus size={20} color="var(--primary)" />
            </div>
            <span className="badge" style={{ background: 'var(--success)', color: '#000', fontWeight: 800 }}>+{state.profile.ecoPoints} PTS</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{t('transit')}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Live metro/train departure timers, post-match crowd diversion, and eco rewards.</p>
          </div>
        </button>
      </div>

      {/* Gate Congestion Overview Grid */}
      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Live Gate Congestion ({currentStadium.gates.length} Gates)</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time turnstile telemetry and AI wait time estimation.</p>
          </div>
          <button onClick={() => setActiveTab('navigate')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <span>Full Interactive Map</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-2">
          {currentStadium.gates.slice(0, 4).map((gate) => (
            <div key={gate.id} style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-xs">
                  <MapPin size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 700, color: '#fff' }}>{gate.name}</span>
                </div>
                <span className="badge" style={{ background: `${formatCapacityColor(gate.capacityPercent)}20`, color: formatCapacityColor(gate.capacityPercent), border: 'none' }}>
                  {formatWaitTime(gate.waitTimeMinutes)}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Serving Sections: {gate.section} {gate.accessible && '♿ Wheelchair Accessible'}</div>
              {/* Capacity Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${gate.capacityPercent}%`, height: '100%', background: formatCapacityColor(gate.capacityPercent), transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
