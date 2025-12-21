import React, { useState } from 'react';
import { Search, Plus, Compass, X, Trash2, LogIn, LogOut, User } from 'lucide-react';
import SearchInput from './SearchInput';
import '../styles/BrowserView.css';
import '../styles/AddressBar.css';
import '../styles/StartPage.css';

const GRADIENTS = ['gradient-1', 'gradient-2', 'gradient-3'];

function StartPage({ onNavigate, user, onAuthRequest, onLogout, shortcuts, onUpdateShortcuts }) {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ title: '', url: '' });

  const handleAddShortcut = (e) => {
    e.preventDefault();
    if (!newShortcut.title || !newShortcut.url) return;

    let formatUrl = newShortcut.url;
    if (!formatUrl.startsWith('http')) {
      formatUrl = `https://${formatUrl}`;
    }

    const shortcut = {
      id: Date.now().toString(),
      title: newShortcut.title,
      url: formatUrl,
      icon: newShortcut.title.charAt(0).toUpperCase(),
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      isCustom: true
    };

    onUpdateShortcuts([...shortcuts, shortcut]);
    setNewShortcut({ title: '', url: '' });
    setIsModalOpen(false);
  };

  const handleDeleteShortcut = (e, id) => {
    e.stopPropagation();
    onUpdateShortcuts(shortcuts.filter(s => s.id !== id));
  };





  return (
    <div className="browser-view start-page" role="region" aria-label="New Tab">
      <div className="sp-header">
        <div className="sp-actions sp-actions-container">
          {user ? (
            <div className="sp-pill sp-user-pill">
              <User size={14} />
              <span className="sp-username">{user.username}</span>
              <div
                className="sp-avatar sp-avatar-logout"
                title="Logout"
                onClick={onLogout}
              >
                <LogOut size={14} color="#fff" />
              </div>
            </div>
          ) : (
            <button
              className="sp-pill sp-signin-btn"
              onClick={onAuthRequest}
            >
              <LogIn size={14} /> Sign In
            </button>
          )}
        </div>
      </div>

      <div className="sp-content">
        <div className="sp-brand">
          <Compass size={64} className="sp-brand-icon" />
          <h1 className="sp-logo">ATLAS</h1>
          {user && <p className="sp-welcome-text">Welcome back, {user.username}</p>}
        </div>

        <div className="sp-search-wrapper sp-search-container">
          <SearchInput
            variant="large"
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={onNavigate}
            placeholder={`Search the web${user ? ', ' + user.username : ''}...`}
            autoFocus={true}
            leftIcon={<Search size={20} />}
          />
        </div>

        <div className="sp-shortcuts-grid">
          {shortcuts.map(shortcut => (
            <div
              key={shortcut.id}
              className="sp-shortcut-card"
              onClick={() => onNavigate(shortcut.url)}
            >
              <button
                className="shortcut-delete-btn"
                onClick={(e) => handleDeleteShortcut(e, shortcut.id)}
                title="Remove shortcut"
              >
                <Trash2 size={14} />
              </button>

              <div className={`card-icon ${shortcut.gradient}`}>
                {shortcut.isCustom ? (
                  <span className="icon-text">{shortcut.icon}</span>
                ) : (
                  shortcut.icon
                )}
              </div>
              <span className="card-label">{shortcut.title}</span>
            </div>
          ))}

          <div className="sp-shortcut-card add-new" onClick={() => setIsModalOpen(true)}>
            <div className="card-icon"><Plus size={24} /></div>
            <span className="card-label">Add Site</span>
          </div>
        </div>
      </div>

      <div className="sp-footer"><p>Secure Browser Environment v1.0</p></div>

      {isModalOpen && (
        <div className="sp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h3>Add Shortcut</h3>
              <button className="sp-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddShortcut}>
              <div className="sp-modal-body">
                <div className="sp-input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="e.g. GitHub"
                    value={newShortcut.title}
                    onChange={e => setNewShortcut({ ...newShortcut, title: e.target.value })}
                    autoFocus
                    required
                  />
                </div>
                <div className="sp-input-group">
                  <label>URL</label>
                  <input
                    type="text"
                    placeholder="e.g. github.com"
                    value={newShortcut.url}
                    onChange={e => setNewShortcut({ ...newShortcut, url: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="sp-modal-footer">
                <button type="button" className="sp-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="sp-btn-submit">Add Site</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartPage;