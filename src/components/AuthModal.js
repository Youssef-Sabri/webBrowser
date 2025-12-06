import React, { useState } from 'react';
import { User, Mail, Lock, LogIn } from 'lucide-react';
import Modal from './Modal';
import '../styles/Browser.css';

function AuthModal({ onClose, onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await onLogin(formData.username, formData.password);
      } else {
        await onRegister(formData.username, formData.password, formData.email);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isLogin ? 'Sign In' : 'Create Account'} icon={User} width="400px">
      <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && <div style={{ color: 'var(--danger-color)', fontSize: '13px', background: 'rgba(255,82,82,0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}

        <div className="sp-input-group">
          <label>Username</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 12px' }}>
            <User size={16} color="var(--text-secondary)" />
            <input
              type="text"
              required
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '10px', width: '100%', outline: 'none' }}
              placeholder="Enter username"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="sp-input-group">
            <label>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 12px' }}>
              <Mail size={16} color="var(--text-secondary)" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '10px', width: '100%', outline: 'none' }}
                placeholder="Enter email"
              />
            </div>
          </div>
        )}

        <div className="sp-input-group">
          <label>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 12px' }}>
            <Lock size={16} color="var(--text-secondary)" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '10px', width: '100%', outline: 'none' }}
              placeholder="Enter password"
            />
          </div>
        </div>

        <button type="submit" className="sp-btn-submit" style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <LogIn size={16} />
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: '500' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </form>
    </Modal>
  );
}

export default AuthModal;
