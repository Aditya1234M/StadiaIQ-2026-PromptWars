/**
 * @description Main dashboard displaying live attendance, AI crowd routing recommendations, gate congestion summary, digital ticket pass, and quick actions.
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAICrowdRecommendation } from '../utils/aiEngine';
import { formatWaitTime, formatCapacityColor } from '../utils/formatters';
import { Users, Sparkles, MapPin, ArrowRight, MessageSquare, HeartHandshake, AlertTriangle, QrCode, ShieldAlert, Utensils, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { currentStadium, state, t, updateProfile, toggleQRStatus, triggerSOS, cancelSOS } = useApp();

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
      {/* Active Emergency SOS Alert Banner */}
      {state.activeSOS && (
        <div className="sos-alert-card">
          <div className="flex justify-between items-center gap-md">
            <div className="flex items-center gap-sm">
              <ShieldAlert size={28} color="#ef4444" />
              <div>
                <div className="text-danger" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  ⚠️ EMERGENCY {state.activeSOS.type.toUpperCase()} SOS DISPATCHED
                </div>
                <div className="text-primary" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  Dispatch Status: <strong>{state.activeSOS.dispatchStatus.toUpperCase()}</strong> • Target Location: {state.activeSOS.userLocation}
                </div>
              </div>
            </div>
            <button onClick={cancelSOS} className="btn btn-secondary" style={{ border: '1px solid #ef4444' }}>
              <span>Cancel / All Clear</span>
            </button>
          </div>
          <div className="ticket-section-grid" style={{ marginTop: '14px', background: 'rgba(0,0,0,0.4)', gridTemplateColumns: '1fr' }}>
            <div className="ticket-field-label" style={{ color: '#ef4444' }}>STEP-FREE EVACUATION & SAFETY ROUTE</div>
            <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#fff', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {state.activeSOS.evacuationPath.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Hero Match Card */}
      <div className="card hero-card">
        <div className="hero-header">
          <div>
            <span className="badge" style={{ marginBottom: '8px' }}>{currentStadium.city}</span>
            <h1 className="page-title" style={{ fontSize: '2rem' }}>{currentStadium.matchTitle}</h1>
            <p className="page-subtitle">{currentStadium.matchTime} • Kickoff Countdown: <strong>{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</strong></p>
          </div>
          <div className="stat-box">
            <div className="stat-box-title">
              <Users size={14} />
              <span>{t('attendance')}</span>
            </div>
            <div className="stat-box-number">
              {currentStadium.currentAttendance.toLocaleString()} <span className="stat-box-subtext">/ {currentStadium.capacity.toLocaleString()}</span>
            </div>
            <div className="stat-box-subtext" style={{ color: capacityPercent >= 90 ? 'var(--warning)' : 'var(--success)' }}>
              ● {capacityPercent}% Capacity (Live Telemetry)
            </div>
          </div>
        </div>

        {/* AI Crowd Routing Recommendation Banner */}
        <div className="ai-recommendation-box">
          <div className="ai-rec-content">
            <div className="ai-rec-icon">
              <Sparkles size={24} color="var(--primary)" />
            </div>
            <div>
              <div className="flex items-center gap-xs">
                <span className="text-primary" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('aiRecommendation')}</span>
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

      {/* Digital NFC Smart Ticket Wallet Card */}
      <div className="card ticket-pass-card animate-fade-in-up">
        <div className="ticket-header">
          <div>
            <div className="flex items-center gap-xs">
              <span className="badge badge-primary">⚡ SMART NFC MATCH PASS</span>
              {state.ticketPass.biometricExpress && (
                <span className="badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: 'none', fontSize: '0.7rem' }}>
                  Facial Recognition Express Enabled
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '6px', color: '#fff' }}>{state.ticketPass.matchTitle}</h2>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Matchday Pass ID: <strong>{state.ticketPass.id}</strong></div>
          </div>
          <button
            onClick={toggleQRStatus}
            className={state.ticketPass.qrStatus === 'valid' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            {state.ticketPass.qrStatus === 'valid' ? (
              <>
                <QrCode size={16} />
                <span>Simulate NFC Turnstile Scan</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Checked In via Turnstile</span>
              </>
            )}
          </button>
        </div>

        <div className="ticket-section-grid">
          <div>
            <div className="ticket-field-label">Assigned Seating</div>
            <div className="ticket-field-value">{state.ticketPass.section}, {state.ticketPass.row}, {state.ticketPass.seat}</div>
          </div>
          <div>
            <div className="ticket-field-label">AI Recommended Optimal Turnstile</div>
            <div className="ticket-field-value" style={{ color: 'var(--primary)' }}>{state.ticketPass.assignedGateName}</div>
          </div>
          <div>
            <div className="ticket-field-label">Entry Time Window</div>
            <div className="ticket-field-value">{state.ticketPass.entryTimeWindow}</div>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          <span>🔒 Encrypted FIFA 2026 Telemetry Pass</span>
          <span>Click button above to simulate gate entry check-in</span>
        </div>
      </div>

      {/* Active In-Seat Food Order Tracker Card (If Orders Exist) */}
      {state.activeOrders.length > 0 && (
        <div className="order-tracker-card animate-fade-in-up">
          <div className="flex justify-between items-center" style={{ marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div className="flex items-center gap-sm">
              <div style={{ background: 'rgba(0, 184, 212, 0.15)', padding: '8px', borderRadius: '8px' }}>
                <Utensils size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Active Concession Delivery: {state.activeOrders[0].concessionName}</div>
                <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Target: {state.activeOrders[0].deliveryLocation} • Total: ${state.activeOrders[0].totalAmount}
                </div>
              </div>
            </div>
            <span className="badge" style={{ background: 'var(--accent)', color: '#000', fontWeight: 800 }}>
              {state.activeOrders[0].status.toUpperCase()}
            </span>
          </div>
          <div className="order-progress-bar">
            <div
              className="order-progress-fill"
              style={{
                width:
                  state.activeOrders[0].status === 'received'
                    ? '25%'
                    : state.activeOrders[0].status === 'preparing'
                    ? '55%'
                    : state.activeOrders[0].status === 'delivering'
                    ? '85%'
                    : '100%',
              }}
            />
          </div>
          <div className="flex justify-between items-center" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>
            <span>Order ID: {state.activeOrders[0].id}</span>
            <span>Step-Free Concourse Runner Assigned</span>
          </div>
        </div>
      )}

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

        <button onClick={() => triggerSOS('medical')} className="card card-interactive" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.06)' }}>
          <div className="flex justify-between items-center">
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '10px' }}>
              <AlertTriangle size={20} color="#ef4444" />
            </div>
            <span className="badge" style={{ background: '#ef4444', color: '#fff', fontWeight: 800 }}>EMERGENCY SOS</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ef4444' }}>Fan Safety & SOS Hub</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>One-click medical aid dispatch and step-free emergency evacuation routing.</p>
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
            <span>Full Interactive Map & Concessions</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-2">
          {currentStadium.gates.slice(0, 4).map((gate) => (
            <div key={gate.id} className="gate-card">
              <div className="gate-card-header">
                <div className="flex items-center gap-xs">
                  <MapPin size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 700, color: '#fff' }}>{gate.name}</span>
                </div>
                <span className="badge" style={{ background: `${formatCapacityColor(gate.capacityPercent)}20`, color: formatCapacityColor(gate.capacityPercent), border: 'none' }}>
                  {formatWaitTime(gate.waitTimeMinutes)}
                </span>
              </div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Serving Sections: {gate.section} {gate.accessible && '♿ Wheelchair Accessible'}</div>
              <div className="capacity-bar-track">
                <div className="capacity-bar-fill" style={{ width: `${gate.capacityPercent}%`, background: formatCapacityColor(gate.capacityPercent) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
