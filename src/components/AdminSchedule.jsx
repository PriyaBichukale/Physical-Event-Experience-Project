import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Link } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import VenueMap from './VenueMap';

function AdminSchedule() {
  const { schedule, addScheduleItem, removeScheduleItem, zones } = useEventContext();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(zones[0]?.id || '');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !time || !location) return;
    addScheduleItem({ title, time, location });
    setTitle('');
    setTime('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/public/live-event');
    alert('Public Share Link Copied!');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem', height: '100%' }}>
      
      {/* Left Column: Form and Schedule List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
        
        {/* Create Event Slot Form */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--accent-primary)" />
              Add Event
            </h3>
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Event Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Opening Keynote"
                style={inputStyle}
              />
            </div>
            
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time</label>
                <input 
                  type="text" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  placeholder="e.g. 09:00 AM"
                  style={inputStyle}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location Pin</label>
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  style={{...inputStyle, border: '2px solid var(--accent-primary)', background: 'rgba(255,255,255,0.9)', color: 'black' }}
                >
                    {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.id}</option>
                    ))}
                </select>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                   * You can also click a zone on the map to set the pin!
                </p>
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={20} /> Add to Schedule
            </button>
          </form>
        </div>

        {/* Current Schedule List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-primary)" />
            Schedule
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {schedule.length === 0 && (
              <p style={{ color: 'var(--text-secondary)' }}>No scheduled items yet.</p>
            )}
            {schedule.map(item => (
              <div key={item.id} className="animate-fade-in" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {item.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {item.location}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeScheduleItem(item.id)}
                  style={{
                    background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.5rem'
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Visual Pin Mapping */}
      <div style={{ height: '100%' }}>
         <VenueMap activePin={location} onPinSelect={(id) => setLocation(id)} />
      </div>

    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  outline: 'none',
};

export default AdminSchedule;
