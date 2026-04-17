import React, { useState } from 'react';
import { Calendar, Map as MapIcon, MessageSquare, MapPin, Clock, ArrowLeft, X } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import VenueMap from './VenueMap';
import Assistant from './Assistant';

function PublicView() {
  const { eventInfo, schedule } = useEventContext();
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      
      {/* Public Header */}
      <header style={{ 
        background: 'var(--accent-primary)', 
        color: 'white', 
        padding: '1.5rem', 
        boxShadow: 'var(--shadow-md)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {eventInfo.logo && (
           <img src={eventInfo.logo} alt="Event Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', padding: '5px' }} />
        )}
        <div>
           <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 700 }}>{eventInfo.name}</h1>
           <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>{eventInfo.description}</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
        <div className="animate-fade-in" style={{ height: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Half: Interactive Map */}
          <div style={{ flexShrink: 0 }}>
             <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <MapIcon size={20} /> Live Routing & Navigation
             </h2>
             <div style={{ height: '400px' }}>
                <VenueMap readOnly />
             </div>
          </div>

          {/* Bottom Half: Schedule */}
          <div style={{ paddingBottom: '4rem' }}>
              <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} /> Today's Schedule
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {schedule.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No events scheduled. Check back later!</p>
                  ) : (
                    schedule.map(item => (
                      <div key={item.id} style={{ 
                        background: 'var(--bg-secondary)', 
                        padding: '1rem', 
                        borderRadius: 'var(--radius-md)', 
                        boxShadow: 'var(--shadow-sm)',
                        borderLeft: '4px solid var(--accent-primary)'
                      }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16}/> {item.time}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16}/> {item.location}</span>
                        </div>
                      </div>
                    ))
                  )}
              </div>
          </div>

        </div>
      </main>

      {/* Floating AI Assistant Node */}
      <div style={{ position: 'fixed', bottom: '2rem', right: window.innerWidth > 768 ? '2rem' : '1rem', zIndex: 50 }}>
          {showAssistant && (
             <div className="glass-panel animate-fade-in" style={{ 
                 position: 'absolute', bottom: '5rem', right: 0, 
                 width: window.innerWidth > 768 ? '400px' : 'calc(100vw - 2rem)', 
                 height: '500px', padding: 0, display: 'flex', flexDirection: 'column', 
                 overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' 
             }}>
                 <div style={{ background: 'var(--accent-primary)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <MessageSquare size={18} /> Virtual Assistant
                    </h3>
                    <button onClick={() => setShowAssistant(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20}/></button>
                 </div>
                 <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                       <Assistant publicMode />
                    </div>
                 </div>
             </div>
          )}
          <button 
             className="btn-primary" 
             style={{ 
                 width: '64px', height: '64px', borderRadius: '50%', padding: 0, 
                 display: 'flex', alignItems: 'center', justifyContent: 'center', 
                 boxShadow: '0 4px 14px rgba(59, 130, 246, 0.5)',
                 transition: 'transform 0.2s ease',
                 transform: showAssistant ? 'scale(0.9)' : 'scale(1)'
             }}
             onClick={() => setShowAssistant(!showAssistant)}
          >
             {showAssistant ? <X size={28} /> : <MessageSquare size={28} />}
          </button>
      </div>

    </div>
  );
}

export default PublicView;
