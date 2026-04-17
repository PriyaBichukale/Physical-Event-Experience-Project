import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { Calendar, Upload, Building, ArrowRight, LayoutDashboard } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const { eventInfo, setEventInfo, setIsAuthenticated } = useEventContext();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    password: ''
  });

  const [loginPassword, setLoginPassword] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG/JPEG)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.password) {
        alert('Event Name and Admin Password are required!');
        return;
    }

    setEventInfo({
      name: formData.name,
      description: formData.description || 'Welcome to our event!',
      logo: formData.logo,
      password: formData.password,
      isConfigured: true
    });
    setIsAuthenticated(true);
    navigate('/admin/schedule');
  };

  const handleLogin = (e) => {
      e.preventDefault();
      if (loginPassword === eventInfo.password) {
          setIsAuthenticated(true);
          navigate('/admin/schedule');
      } else {
          alert('Incorrect Administrator Password!');
      }
  };

  // If already configured, show login pad
  if (eventInfo.isConfigured) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}>
                <Building size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ marginBottom: '0.5rem' }}>{eventInfo.name} is Active!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please login to access the Admin Dashboard.</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Admin Password"
                        style={{
                            width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                            color: '#0A1930', fontSize: '1rem', textAlign: 'center', fontWeight: 500
                        }}
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <LayoutDashboard size={20} /> Login Context
                    </button>
                </form>
            </div>
        </div>
      )
  }

  return (
    <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, rgba(8,16,40,1) 0%, rgba(13,25,54,1) 100%)',
        padding: '2rem' 
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', 
                background: 'var(--accent-primary)', margin: '0 auto 1.5rem auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--accent-glow)'
            }}>
                <Calendar size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Create Your Event</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Configure your organization's physical experience platform.</p>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Logo Upload */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Event Logo</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ 
                        border: '2px dashed var(--border-subtle)', 
                        padding: '2rem', 
                        borderRadius: 'var(--radius-md)', 
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: formData.logo ? 'transparent' : 'rgba(0,0,0,0.1)'
                    }}
                >
                    {formData.logo ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <img src={formData.logo} alt="Preview" style={{ height: '80px', objectFit: 'contain' }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)' }}>Click to replace logo</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Upload size={24} />
                            <span>Upload PNG or JPEG (Max 2MB)</span>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload}
                />
            </div>

            {/* Event Name */}
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Event Name *</label>
                 <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Stanford Career Fair 2026"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#0A1930',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                 />
            </div>

            {/* Description */}
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Tagline / Description</label>
                 <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="A brief description for your attendees..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#0A1930',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                 />
            </div>

            {/* Password */}
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Admin Password *</label>
                 <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a password for the dashboard"
                    style={{
                        width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                        color: '#0A1930', fontSize: '1rem', fontWeight: 500
                    }}
                 />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', height: '3.5rem', fontSize: '1.1rem' }}>
                Launch Hub & Edit Schedule <ArrowRight size={20} />
            </button>

        </form>

      </div>
    </div>
  );
}

export default LandingPage;
