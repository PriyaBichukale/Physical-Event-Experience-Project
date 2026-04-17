import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Map, MessageSquare, Bell, User, Settings, Activity, Calendar, Share2, LogOut } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import VenueMap from './components/VenueMap';
import Assistant from './components/Assistant';
import AdminSchedule from './components/AdminSchedule';
import PublicView from './components/PublicView';
import { useEventContext } from './context/EventContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/public/:eventId" element={<PublicView />} />
      </Routes>
    </Router>
  );
}

function AdminLayout() {
  const { isAuthenticated } = useEventContext();
  
  if (!isAuthenticated) {
      return <Navigate to="/" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="animate-fade-in" style={{ height: 'calc(100% - 80px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="map" element={<VenueMap />} />
            <Route path="assistant" element={<Assistant />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setIsAuthenticated } = useEventContext();

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
          <Activity size={24} />
        </div>
        <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>EventFlow Staff</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavItem 
          to="/admin"
          icon={<Home size={20} />} 
          label="Overview" 
          active={currentPath === '/admin' || currentPath === '/admin/'} 
        />
        <NavItem 
          to="/admin/schedule"
          icon={<Calendar size={20} />} 
          label="Event Config" 
          active={currentPath === '/admin/schedule'} 
        />
        <NavItem 
          to="/admin/map"
          icon={<Map size={20} />} 
          label="Floor Plan" 
          active={currentPath === '/admin/map'} 
        />
        <NavItem 
          to="/admin/assistant"
          icon={<MessageSquare size={20} />} 
          label="AI Co-pilot" 
          active={currentPath === '/admin/assistant'} 
        />
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <button 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '0.75rem' }}
            onClick={() => {
                const link = `${window.location.origin}/public/live-event`;
                navigator.clipboard.writeText(link);
                alert(`Share Link Copied to Clipboard!\n\nOpen a new tab and paste:\n${link}`);
            }}
        >
            <Share2 size={16} /> Share Event Link
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#EF4444' }} onClick={() => setIsAuthenticated(false)}>
          <div className="btn-icon" style={{ background: '#EF444415' }}>
            <LogOut size={18} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Secure Logout</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  const location = useLocation();
  let title = 'Event Overview';
  if (location.pathname === '/admin/schedule') title = 'Event Configuration & Rules';
  if (location.pathname === '/admin/map') title = 'Live Event Floor Plan';
  if (location.pathname === '/admin/assistant') title = 'Operations Co-pilot';

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{title}</h2>
        <p style={{ margin: 0 }}>Real-time coordination and staff insights</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn-icon" style={{ position: 'relative' }} onClick={() => alert('No new notifications!')}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', top: 0, right: 0, width: 10, height: 10, 
            backgroundColor: 'red', borderRadius: '50%', border: '2px solid white' 
          }}></span>
        </button>
        <button className="btn-icon" onClick={() => alert('Settings menu opened!')}>
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link 
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--accent-glow)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        fontWeight: active ? 600 : 500,
        transition: 'all var(--transition-fast)',
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

export default App;
