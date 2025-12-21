import React, { useState } from 'react';
import { User, Mail, Lock, LogIn } from 'lucide-react';
import Modal from './Modal';
import '../styles/Browser.css';
import '../styles/AuthModal.css';

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
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <div className="sp-input-group">
          <label>Username</label>
          <div className="auth-input-container">
            <User size={16} color="var(--text-secondary)" />
            <input
              type="text"
              required
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="auth-input"
              placeholder="Enter username"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="sp-input-group">
            <label>Email</label>
            <div className="auth-input-container">
              <Mail size={16} color="var(--text-secondary)" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="auth-input"
                placeholder="Enter email"
              />
            </div>
          </div>
        )}

        <div className="sp-input-group">
          <label>Password</label>
          <div className="auth-input-container">
            <Lock size={16} color="var(--text-secondary)" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="auth-input"
              placeholder="Enter password"
            />
          </div>
        </div>

        <button type="submit" className="sp-btn-submit auth-submit-btn">
          <LogIn size={16} />
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>

        <div className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="auth-toggle-link"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </form>
    </Modal>
  );
}

export default AuthModal;
