import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { useAssistant } from '../hooks/useAssistant';

function Assistant({ publicMode = false }) {
  const { askAssistant, loading, error } = useAssistant();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: publicMode 
        ? "Hi! I'm your Event Guide. You can ask me what is happening, where events are located, or for directions to food and restrooms." 
        : "Hello! I'm your Smart Event Assistant. How can I help you improve the flow of today's event or find anything you need?" 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    const aiResponse = await askAssistant(userMessage);

    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', background: 'var(--accent-primary)', color: 'white' }}>
        <Sparkles size={24} />
        <div>
          <h3 style={{ margin: 0, color: 'white' }}>Event AI Assistant</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.875rem' }}>Ask me about crowds, wait times, or event management.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        
        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className="animate-fade-in" style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-full)',
                background: msg.role === 'user' ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                color: msg.role === 'user' ? 'var(--text-primary)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div style={{
                background: msg.role === 'user' ? 'var(--bg-secondary)' : 'rgba(37,99,235,0.05)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: msg.role === 'user' ? '1px solid var(--border-subtle)' : '1px solid var(--accent-glow)',
                maxWidth: '80%',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)', flexShrink: 0
                }}>
                  <Bot size={20} />
                </div>
                <div style={{
                  background: 'rgba(37,99,235,0.05)', padding: '1rem', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--accent-glow)', color: 'var(--text-secondary)'
                }}>
                  Thinking...
                </div>
             </div>
          )}
          {error && (
            <div style={{ textAlign: 'center', color: '#EF4444', fontSize: '0.875rem' }}>{error}</div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.5)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crowd flow, wait times, etc..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', opacity: loading ? 0.7 : 1 }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Assistant;
