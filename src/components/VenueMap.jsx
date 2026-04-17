import React, { useState } from 'react';
import { MapPin, Navigation, Info, ShieldAlert, Layout } from 'lucide-react';
import { useEventContext } from '../context/EventContext';

function VenueMap({ readOnly = false, activePin = null, onPinSelect = null }) {
  const { zones } = useEventContext();
  const [selectedZone, setSelectedZone] = useState('Exhibit Hall A');
  const currentMapZone = activePin || selectedZone;

  const getStatusColor = (status) => {
    switch(status) {
      case 'low': return '#10B981'; // Green
      case 'normal': return 'var(--accent-primary)'; // Blue
      case 'high': return '#EF4444'; // Red
      default: return '#ccc';
    }
  };

  const activeZoneData = zones.find(z => z.id === currentMapZone);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '3fr 1fr' : '1fr', gap: '1.5rem', height: '100%' }}>
      
      {/* Real-time Location Intelligence Map Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={20} color="var(--accent-primary)" />
            Live Floor Plan Intelligence
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></div> Bottleneck
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}></div> Flowing
            </span>
          </div>
        </div>

        {/* 2D Interactive Venue Diagram */}
        <div style={{ 
          flex: 1, 
          background: 'var(--bg-primary)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px'
        }}>
          {/* Main Blueprint Background Grid pattern */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            opacity: 0.5
          }}></div>

          {/* Zones */}
          {zones.map((zone) => {
            const isSelected = currentMapZone === zone.id;
            return (
              <div 
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone.id);
                  if (onPinSelect) onPinSelect(zone.id);
                }}
                style={{
                  position: 'absolute',
                  ...zone.geometry,
                  background: isSelected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                  border: isSelected ? `2px solid ${getStatusColor(zone.status)}` : '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  zIndex: isSelected ? 10 : 1
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <span style={{ 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    {zone.id}
                  </span>
                  <div style={{ 
                    color: getStatusColor(zone.status), 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    marginTop: '0.25rem',
                    textShadow: '0 0 2px white'
                  }}>
                    {Math.round((zone.currentOccupancy / zone.fireCodeLimit) * 100)}% CAP
                  </div>
                </div>

                {/* Heatmap Overlay for High Traffic */}
                {zone.status === 'high' && (
                   <div style={{
                     position: 'absolute',
                     top: '50%', left: '50%',
                     transform: 'translate(-50%, -50%)',
                     width: '150%', height: '150%',
                     background: `radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%)`,
                     pointerEvents: 'none',
                     zIndex: -1,
                     opacity: 0.8
                   }}></div>
                )}
              </div>
            )
          })}

          {/* User Wayfinding Blue Dot (Simulated) */}
          {readOnly && (
             <div style={{
               position: 'absolute',
               top: '85%', left: '45%', // Assumes they entered foyer
               width: '16px', height: '16px',
               borderRadius: '50%',
               background: '#3B82F6',
               border: '3px solid white',
               boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
               zIndex: 20
             }}>
               <div style={{
                 position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
                 borderRadius: '50%',
                 background: 'rgba(59, 130, 246, 0.3)',
                 animation: 'pulse-ring 2s infinite'
               }}></div>
             </div>
          )}

        </div>
      </div>

      {/* Analytics / Nav side panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {readOnly ? <Navigation size={20} color="var(--accent-primary)" /> : <ShieldAlert size={20} color="var(--accent-primary)" />}
          {readOnly ? "Routing Guide" : "Zone Intelligence"}
        </h3>
        
        {activeZoneData && (
          <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{activeZoneData.id}</h1>
            
            {/* Visual Capacity Bar */}
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>Fire Code Capacity</span>
                <span style={{ color: getStatusColor(activeZoneData.status), fontWeight: 600 }}>
                  {activeZoneData.currentOccupancy} / {activeZoneData.fireCodeLimit}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(activeZoneData.currentOccupancy / activeZoneData.fireCodeLimit) * 100}%`, 
                  background: getStatusColor(activeZoneData.status), 
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }}></div>
              </div>
            </div>

            {/* Throughput Metric */}
            {!readOnly && (
               <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live Gate Activity</p>
                  <h3 style={{ margin: '0.25rem 0 0 0' }}>{activeZoneData.throughput}</h3>
               </div>
            )}

            {/* Smart Alerts & Re-routing */}
            {activeZoneData.status === 'high' && (
              <div style={{ background: '#EF444415', border: '1px solid #EF4444', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: '#EF4444', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <Info size={18} /> {readOnly ? "High Traffic Warning" : "Capacity Alert"}
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#B91C1C' }}>
                  {readOnly 
                    ? "This area is near capacity. We recommend utilizing the Networking Lounge corridors instead."
                    : "Fire code approaching limits. Suggest pausing check-ins and deploying re-route protocol."
                  }
                </p>
                {!readOnly && (
                  <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#EF4444', boxShadow: 'none' }}>
                    Deploy Re-route Protocol
                  </button>
                )}
              </div>
            )}

            {readOnly && activeZoneData.status !== 'high' && (
               <div style={{ background: '#10B98115', border: '1px solid #10B981', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
                 <div style={{ display: 'flex', gap: '0.5rem', color: '#10B981', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <Navigation size={18} /> Area Clear
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#047857' }}>
                   Traffic is flowing smoothly. Proceed normally.
                </p>
               </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default VenueMap;
