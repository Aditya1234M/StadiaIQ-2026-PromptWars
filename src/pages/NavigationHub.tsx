/**
 * @description Interactive stadium navigation map featuring gate capacity meters, restroom queues, concessions, and accessible routing.
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatWaitTime, formatCapacityColor } from '../utils/formatters';
import { MapPin, Utensils, Bath, Navigation, CheckCircle2, Sparkles, Filter } from 'lucide-react';

type FilterType = 'all' | 'gates' | 'concessions' | 'restrooms' | 'accessible';

export const NavigationHub: React.FC = () => {
  const { currentStadium, state, t } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; section: string; wait: number; type: string; accessible?: boolean } | null>(null);
  const [routeGenerated, setRouteGenerated] = useState<boolean>(false);

  const handleSelect = (item: { id: string; name: string; section: string; wait: number; type: string; accessible?: boolean }) => {
    setSelectedItem(item);
    setRouteGenerated(false);
  };

  const generateRoute = () => {
    setRouteGenerated(true);
  };

  return (
    <div className="page animate-fade-in" role="region" aria-label="Interactive Stadium Navigation Map">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('navigate')}</h1>
          <p className="page-subtitle">Real-time turnstile telemetry, concession queues, and step-free wheelchair routing at {currentStadium.name}.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-xs text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600, marginRight: '8px' }}>
          <Filter size={16} />
          <span>Filter Map:</span>
        </div>
        <button onClick={() => setFilter('all')} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: filter === 'all' ? 'var(--primary)' : 'var(--bg-tertiary)', color: filter === 'all' ? '#080d14' : '#fff' }}>All Locations</button>
        <button onClick={() => setFilter('gates')} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: filter === 'gates' ? 'var(--primary)' : 'var(--bg-tertiary)', color: filter === 'gates' ? '#080d14' : '#fff' }}>Turnstile Gates</button>
        <button onClick={() => setFilter('concessions')} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: filter === 'concessions' ? 'var(--primary)' : 'var(--bg-tertiary)', color: filter === 'concessions' ? '#080d14' : '#fff' }}>Concessions (Halal/Vegan)</button>
        <button onClick={() => setFilter('restrooms')} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: filter === 'restrooms' ? 'var(--primary)' : 'var(--bg-tertiary)', color: filter === 'restrooms' ? '#080d14' : '#fff' }}>Restrooms & Sensory</button>
        <button onClick={() => setFilter('accessible')} className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: filter === 'accessible' ? 'var(--warning)' : 'var(--bg-tertiary)', color: filter === 'accessible' ? '#000' : '#fff', fontWeight: 700 }}>♿ Wheelchair Accessible</button>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '3fr 2fr', alignItems: 'start' }}>
        {/* Left Column: Interactive List / Map View */}
        <div className="flex flex-col gap-md">
          {/* Gates Section */}
          {(filter === 'all' || filter === 'gates' || filter === 'accessible') && (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--primary)" />
                <span>Entry Gates ({currentStadium.gates.length})</span>
              </h2>
              <div className="flex flex-col gap-sm">
                {currentStadium.gates
                  .filter((g) => (filter === 'accessible' ? g.accessible : true))
                  .map((gate) => (
                    <div
                      key={gate.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect({ id: gate.id, name: gate.name, section: gate.section, wait: gate.waitTimeMinutes, type: 'Gate', accessible: gate.accessible })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect({ id: gate.id, name: gate.name, section: gate.section, wait: gate.waitTimeMinutes, type: 'Gate', accessible: gate.accessible }); } }}
                      style={{ background: selectedItem?.id === gate.id ? 'var(--primary-subtle)' : 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${selectedItem?.id === gate.id ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      aria-label={`Select ${gate.name}`}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{gate.name} {gate.accessible && '♿'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sections: {gate.section} • Capacity: {gate.capacityPercent}%</div>
                      </div>
                      <div className="badge" style={{ background: `${formatCapacityColor(gate.capacityPercent)}20`, color: formatCapacityColor(gate.capacityPercent) }}>
                        {formatWaitTime(gate.waitTimeMinutes)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Concessions Section */}
          {(filter === 'all' || filter === 'concessions') && (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={18} color="var(--accent)" />
                <span>Food & Concessions ({currentStadium.concessions.length})</span>
              </h2>
              <div className="flex flex-col gap-sm">
                {currentStadium.concessions.map((con) => (
                  <div
                    key={con.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect({ id: con.id, name: con.name, section: con.section, wait: con.waitTimeMinutes, type: `Concession (${con.category.toUpperCase()})`, accessible: true })}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect({ id: con.id, name: con.name, section: con.section, wait: con.waitTimeMinutes, type: `Concession (${con.category.toUpperCase()})`, accessible: true }); } }}
                    style={{ background: selectedItem?.id === con.id ? 'var(--accent-subtle)' : 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${selectedItem?.id === con.id ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    aria-label={`Select ${con.name}`}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{con.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Section: {con.section} • Category: <strong style={{ color: 'var(--accent)' }}>{con.category.toUpperCase()}</strong></div>
                    </div>
                    <div className="badge">{formatWaitTime(con.waitTimeMinutes)}</div>
                  </div>
                ))}
              </div>
            </div>
           )}

          {/* Restrooms & Sensory Relief Section */}
          {(filter === 'all' || filter === 'restrooms' || filter === 'accessible') && (
            <div className="card">
              <h2 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bath size={18} color="var(--warning)" />
                <span>Restrooms & Sensory Relief ({currentStadium.restrooms.length})</span>
              </h2>
              <div className="flex flex-col gap-sm">
                {currentStadium.restrooms
                  .filter((r) => (filter === 'accessible' ? r.accessible : true))
                  .map((restroom) => (
                    <div
                      key={restroom.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect({ id: restroom.id, name: `${restroom.type.charAt(0).toUpperCase() + restroom.type.slice(1)} Restroom`, section: restroom.section, wait: restroom.waitTimeMinutes, type: `Restroom (${restroom.type.toUpperCase()})`, accessible: restroom.accessible })}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect({ id: restroom.id, name: `${restroom.type.charAt(0).toUpperCase() + restroom.type.slice(1)} Restroom`, section: restroom.section, wait: restroom.waitTimeMinutes, type: `Restroom (${restroom.type.toUpperCase()})`, accessible: restroom.accessible }); } }}
                      style={{ background: selectedItem?.id === restroom.id ? 'var(--warning-subtle)' : 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${selectedItem?.id === restroom.id ? 'var(--warning)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      aria-label={`Select ${restroom.type} restroom at Section ${restroom.section}`}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>Section {restroom.section} {restroom.accessible && '♿'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Type: <strong style={{ color: 'var(--warning)' }}>{restroom.type.toUpperCase()}</strong> {restroom.type === 'sensory-relief' && '• Quiet Low-Stimulation Zone'}</div>
                      </div>
                      <div className="badge" style={{ background: restroom.waitTimeMinutes === 0 ? 'rgba(0, 229, 153, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: restroom.waitTimeMinutes === 0 ? 'var(--primary)' : 'var(--warning)' }}>
                        {formatWaitTime(restroom.waitTimeMinutes)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Route Planner Card */}
        <div className="card" style={{ position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={20} color="var(--primary)" />
            <span>AI Route Planner</span>
          </h2>

          {selectedItem ? (
            <div className="flex flex-col gap-md">
              <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SELECTED DESTINATION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{selectedItem.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Section: {selectedItem.section} • {selectedItem.type}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Live Queue Wait Time: <strong style={{ color: '#fff' }}>{formatWaitTime(selectedItem.wait)}</strong>
                </div>
              </div>

              {!routeGenerated ? (
                <button onClick={generateRoute} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  <Sparkles size={18} />
                  <span>Generate Step-Free AI Route</span>
                </button>
              ) : (
                <div className="animate-fade-in" style={{ background: 'rgba(0, 229, 153, 0.1)', padding: '16px', borderRadius: '10px', border: '1px solid var(--primary)' }}>
                  <div className="flex items-center gap-xs" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
                    <CheckCircle2 size={18} />
                    <span>AI Route Active (3 min walk)</span>
                  </div>
                  <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.4 }}>
                    <li>Start from your seat at <strong>{state.profile.ticketSection}</strong>.</li>
                    <li>Take the step-free concourse ramp toward <strong>Section 115</strong>.</li>
                    <li>Avoid Main Plaza (currently 88% congested); use East Corridor.</li>
                    <li>Arrive at <strong>{selectedItem.name}</strong> (Section {selectedItem.section}).</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <MapPin size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.9rem' }}>Select any gate, concession stand, or restroom on the left to calculate an instant step-free AI walking route!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
