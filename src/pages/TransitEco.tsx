/**
 * @description Smart transportation hub featuring real-time departure countdowns, crowd diversion routes, and venue sustainability metrics.
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bus, Train, Footprints, Zap, Recycle, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const TransitEco: React.FC = () => {
  const { currentStadium, state, t, addEcoPoints } = useApp();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    if (claimed) return;
    addEcoPoints(50);
    setClaimed(true);
  };

  const getTransitIcon = (type: string) => {
    switch (type) {
      case 'metro': return <Train size={20} color="var(--primary)" />;
      case 'walk': return <Footprints size={20} color="var(--success)" />;
      case 'shuttle':
      case 'bus':
      default: return <Bus size={20} color="var(--accent)" />;
    }
  };

  return (
    <div className="page animate-fade-in" role="region" aria-label="Smart Transit and Sustainability Hub">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('transit')}</h1>
          <p className="page-subtitle">Zero-carbon transportation routing, live metro countdowns, and venue sustainability meters at {currentStadium.name}.</p>
        </div>
        <div className="flex items-center gap-xs" style={{ background: 'var(--primary-subtle)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--primary)' }}>
          <Award size={20} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>YOUR ECO REWARD BALANCE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{state.profile.ecoPoints} <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>PTS</span></div>
          </div>
        </div>
      </div>

      {/* Live Sustainability Meters Grid */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '14px', borderRadius: '14px' }}>
            <Award size={28} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FIFA 2026 ECO RATING</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{currentStadium.ecoRating}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Certified Zero-Carbon Venue</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--warning-subtle)', padding: '14px', borderRadius: '14px' }}>
            <Zap size={28} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SOLAR GRID GENERATION</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{currentStadium.solarPowerKw.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>kW</span></div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>100% Stadium Canopy Solar</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--accent-subtle)', padding: '14px', borderRadius: '14px' }}>
            <Recycle size={28} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WASTE RECYCLING RATE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{currentStadium.recyclingPercent}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Compost & Reusable Cup Program</div>
          </div>
        </div>
      </div>

      {/* Live Transit Departures & AI Crowd Diversion */}
      <div className="grid-2" style={{ gridTemplateColumns: '3fr 2fr' }}>
        <div className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Live Transit & Metro Departures</h2>
            <span className="badge" style={{ background: 'var(--success)', color: '#080d14', fontWeight: 800 }}>LIVE GPS TELEMETRY</span>
          </div>
          <div className="flex flex-col gap-sm">
            {currentStadium.transit.map((route) => (
              <div key={route.id} style={{ background: 'var(--bg-tertiary)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div className="flex items-center gap-md">
                  <div style={{ background: 'rgba(8, 13, 20, 0.6)', padding: '10px', borderRadius: '10px' }}>
                    {getTransitIcon(route.type)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{route.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Heading to: <strong style={{ color: '#fff' }}>{route.destination}</strong></div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '2px' }}>🌿 Earns +{route.ecoPoints} Eco Points</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: route.departureInMinutes <= 5 ? 'var(--warning)' : '#fff' }}>
                    {route.departureInMinutes === 0 ? 'NOW' : `${route.departureInMinutes} min`}
                  </div>
                  <span className="badge" style={{ fontSize: '0.65rem', background: route.status === 'on-time' ? 'rgba(0, 229, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: route.status === 'on-time' ? 'var(--primary)' : 'var(--warning)', border: 'none' }}>
                    {route.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eco Rewards & Crowd Diversion Card */}
        <div className="flex flex-col gap-md">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 153, 0.15), rgba(0, 184, 212, 0.1))', borderColor: 'var(--primary)' }}>
            <div className="flex items-center gap-sm" style={{ marginBottom: '12px' }}>
              <Sparkles size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Claim Matchday Eco Reward</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '16px' }}>
              By taking public transit or walking to {currentStadium.name}, you reduce tournament carbon emissions! Claim your +50 Eco Points now.
            </p>
            <button
              onClick={handleClaim}
              disabled={claimed}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', background: claimed ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--primary), var(--accent))', color: claimed ? 'var(--text-secondary)' : '#080d14', cursor: claimed ? 'default' : 'pointer' }}
            >
              {claimed ? (
                <>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>Reward Claimed (+50 PTS Added)</span>
                </>
              ) : (
                <>
                  <Award size={18} />
                  <span>Claim +50 Matchday Eco Points</span>
                </>
              )}
            </button>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: '#fff' }}>AI Post-Match Crowd Diversion</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              To prevent gridlock after the final whistle, StadiaIQ AI staggers pedestrian flow across 4 greenway corridors. Express shuttles depart every 3 minutes from Plaza East.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
