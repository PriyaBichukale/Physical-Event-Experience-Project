import React from 'react';
import { Users, UserCheck, AlertTriangle, Activity, MapPin, Hash } from 'lucide-react';
import { useEventContext } from '../context/EventContext';

function Dashboard() {
  const { zones } = useEventContext();

  const totalCapacity = zones.reduce((acc, zone) => acc + zone.fireCodeLimit, 0);
  const currentTotal = zones.reduce((acc, zone) => acc + zone.currentOccupancy, 0);
  const isHighAlert = zones.some(zone => zone.status === 'high');

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard 
          icon={<Users size={24} />} 
          title="Live Floor Occupancy" 
          value={currentTotal.toLocaleString()} 
          trend={`${Math.round((currentTotal/totalCapacity)*100)}% of Max Capacity`} 
          color="var(--accent-primary)" 
        />
        <MetricCard 
          icon={<Activity size={24} />} 
          title="Venue Throughput" 
          value="325" 
          trend="Scans per minute" 
          color="#10B981" 
        />
        <MetricCard 
          icon={<AlertTriangle size={24} />} 
          title="Active Fire Alerts" 
          value={isHighAlert ? "1" : "0"} 
          trend={isHighAlert ? "Requires attention" : "All clear"} 
          color={isHighAlert ? "#EF4444" : "#10B981"} 
        />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Fire Code Compliance Panel */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={20} color="var(--accent-primary)" />
            Zone Capacity Diagnostics (Fire Code)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {zones.map(zone => (
               <CapacityItem 
                 key={zone.id} 
                 name={zone.id} 
                 current={zone.currentOccupancy} 
                 max={zone.fireCodeLimit} 
                 rate={zone.throughput}
                 status={zone.status} 
               />
            ))}
          </div>
        </div>

        {/* Actionable Intelligence Hub */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--accent-primary)" />
            Location Intelligence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {zones.filter(z => z.status === 'high').map(zone => (
              <div key={zone.id} style={{ background: '#EF444415', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #EF4444' }}>
                 <p style={{ margin: 0, fontWeight: 600, color: '#B91C1C' }}>CRITICAL: {zone.id}</p>
                 <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>Occupancy approaching maximum allowable limits. Dispatching marshals recommended.</p>
              </div>
            ))}

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-secondary)' }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>Flow Optimization</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Throughput at Entrance Foyer is exceeding limits. Preparing push-notification to attendees for rerouting to Gate B.</p>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
               Trigger Mass Notification
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          background: `${color}15`, 
          color: color, 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)' 
        }}>
          {icon}
        </div>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{title}</p>
        <h3 style={{ margin: '0.25rem 0', fontSize: '1.75rem', color: 'var(--text-primary)' }}>{value}</h3>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{trend}</p>
      </div>
    </div>
  );
}

function CapacityItem({ name, current, max, rate, status }) {
  const percent = Math.round((current / max) * 100);
  const color = status === 'high' ? '#EF4444' : (status === 'low' ? '#10B981' : 'var(--accent-primary)');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{name}</p>
        <span style={{ fontSize: '0.875rem', color: color, fontWeight: 600 }}>{current} / {max} Limit</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1, height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${percent}%`, 
            background: color, 
            borderRadius: '4px',
            transition: 'width 0.5s ease-out'
          }}></div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{rate}</span>
      </div>
    </div>
  );
}

export default Dashboard;
