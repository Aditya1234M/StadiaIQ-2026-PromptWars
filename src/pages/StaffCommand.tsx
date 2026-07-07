/**
 * @description Operational command center for stadium staff featuring AI predictive bottleneck alerts and volunteer dispatch.
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAIPredictiveAlerts } from '../utils/aiEngine';
import { formatSeverityBadge } from '../utils/formatters';
import { CheckCircle2, PlusCircle, Radio, Sparkles } from 'lucide-react';
import type { Incident } from '../types/stadium';

export const StaffCommand: React.FC = () => {
  const { currentStadium, state, t, addIncident, updateIncidentStatus } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Incident['type']>('crowd');
  const [severity, setSeverity] = useState<Incident['severity']>('high');

  const predictiveAlerts = getAIPredictiveAlerts(currentStadium);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const assignedTeam =
      type === 'medical' ? 'Medical Response Delta (4 EMTs)' :
      type === 'security' ? 'Security Patrol Bravo (6 officers)' :
      type === 'crowd' ? 'Steward Team Alpha (8 stewards)' : 'Tech Ops Beta';

    addIncident({
      title,
      location,
      type,
      severity,
      status: 'assigned',
      assignedTeam,
    });

    setTitle('');
    setLocation('');
    setShowModal(false);
  };

  return (
    <div className="page animate-fade-in" role="region" aria-label="Staff Operational Command Center">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-xs">
            <h1 className="page-title" style={{ color: '#ef4444' }}>{t('staff')}</h1>
            <span className="badge badge-danger">OPERATIONAL INTELLIGENCE</span>
          </div>
          <p className="page-subtitle">Real-time predictive simulation alerts and volunteer team dispatch for {currentStadium.name}.</p>
        </div>
        <button onClick={() => setShowModal(!showModal)} className="btn btn-primary" style={{ background: '#ef4444', color: '#fff', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
          <PlusCircle size={16} />
          <span>{t('logIncident')}</span>
        </button>
      </div>

      {/* Log Incident Form Modal Card */}
      {showModal && (
        <form onSubmit={handleCreateIncident} className="card animate-fade-in-up" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#ef4444' }}>Log New Operational Incident</h2>
          <div className="grid-2" style={{ marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Incident Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Turnstile scanner glitch" required />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Location / Gate</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Gate B, Turnstile 12" required />
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
              <select value={type} onChange={(e) => setType(e.target.value as Incident['type'])}>
                <option value="crowd" style={{ background: '#0f1724' }}>Crowd Surge</option>
                <option value="medical" style={{ background: '#0f1724' }}>Medical / First Aid</option>
                <option value="security" style={{ background: '#0f1724' }}>Security Patrol</option>
                <option value="maintenance" style={{ background: '#0f1724' }}>Maintenance / Tech</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as Incident['severity'])}>
                <option value="critical" style={{ background: '#0f1724' }}>Critical (Immediate Surge)</option>
                <option value="high" style={{ background: '#0f1724' }}>High Priority</option>
                <option value="medium" style={{ background: '#0f1724' }}>Moderate</option>
                <option value="low" style={{ background: '#0f1724' }}>Low / Minor</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>⚡ AI will automatically assign nearest volunteer response unit!</span>
            <div className="flex gap-sm">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#ef4444', color: '#fff' }}>Dispatch Unit</button>
            </div>
          </div>
        </form>
      )}

      {/* AI Predictive Bottleneck Alerts Grid */}
      <div className="card" style={{ background: 'rgba(19, 29, 46, 0.9)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--warning)" />
          <span>AI Predictive Bottleneck Simulations ({predictiveAlerts.length})</span>
        </h2>
        <div className="grid-3">
          {predictiveAlerts.map((alert) => {
            const badge = formatSeverityBadge(alert.severity);
            return (
              <div key={alert.id} style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px', border: `1px solid ${badge.color}40`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                    <span className="badge" style={{ background: badge.bg, color: badge.color, border: 'none' }}>{badge.label}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{alert.location}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>{alert.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{alert.prediction}</p>
                </div>
                <div style={{ background: 'rgba(8, 13, 20, 0.6)', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${badge.color}` }}>
                  <div style={{ fontSize: '0.7rem', color: badge.color, fontWeight: 700 }}>AI RECOMMENDED ACTION:</div>
                  <div style={{ fontSize: '0.75rem', color: '#fff', marginTop: '2px' }}>{alert.recommendation}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Incident & Volunteer Dispatch Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={20} color="var(--primary)" />
          <span>Active Incident Dispatch & Volunteer Units ({state.incidents.length})</span>
        </h2>
        <div className="flex flex-col gap-sm">
          {state.incidents.map((inc) => {
            const badge = formatSeverityBadge(inc.severity);
            return (
              <div key={inc.id} style={{ background: 'var(--bg-tertiary)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div className="flex items-center gap-md" style={{ flex: 1, minWidth: '240px' }}>
                  <span className="badge" style={{ background: badge.bg, color: badge.color, border: 'none' }}>{inc.severity.toUpperCase()}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{inc.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location: {inc.location} • Type: <strong style={{ color: 'var(--primary)' }}>{inc.type.toUpperCase()}</strong> • Reported: {inc.timestamp}</div>
                    {inc.assignedTeam && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '2px', fontWeight: 600 }}>
                        👥 Assigned Unit: {inc.assignedTeam}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-xs">
                  {inc.status !== 'resolved' ? (
                    <>
                      {inc.status === 'reported' && (
                        <button onClick={() => updateIncidentStatus(inc.id, 'assigned', 'Steward Rapid Unit 1')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Assign Unit
                        </button>
                      )}
                      <button onClick={() => updateIncidentStatus(inc.id, 'resolved')} className="btn" style={{ background: 'var(--success)', color: '#080d14', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle2 size={14} />
                        <span>Mark Resolved</span>
                      </button>
                    </>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>RESOLVED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
