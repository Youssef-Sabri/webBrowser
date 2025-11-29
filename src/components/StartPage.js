import React, { useState, useEffect } from 'react';
import { Search, Plus, Compass, X, Trash2 } from 'lucide-react';
import '../styles/BrowserView.css';

const DEFAULT_SHORTCUTS = [
  { id: '1', title: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖', gradient: 'gradient-1' },
  { id: '2', title: 'DeepSeek', url: 'https://deepseek.com', icon: '🐋', gradient: 'gradient-2' },
  { id: '3', title: 'React Docs', url: 'https://react.dev', icon: '⚛️', gradient: 'gradient-3' }
];

const GRADIENTS = ['gradient-1', 'gradient-2', 'gradient-3'];

function StartPage({ onNavigate }) {
  const [searchValue, setSearchValue] = useState('');
  const [shortcuts, setShortcuts] = useState(() => {
    const saved = localStorage.getItem('atlas-shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ title: '', url: '' });

  // Persist shortcuts
  useEffect(() => {
    localStorage.setItem('atlas-shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onNavigate(searchValue);
    }
  };

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
      icon: newShortcut.title.charAt(0).toUpperCase(), // Use first letter as icon
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)], // Random gradient
      isCustom: true // Flag to render letter instead of emoji if needed
    };

    setShortcuts([...shortcuts, shortcut]);
    setNewShortcut({ title: '', url: '' });
    setIsModalOpen(false);
  };

  const handleDeleteShortcut = (e, id) => {
    e.stopPropagation(); // Prevent navigation
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  return (
    <div className="browser-view start-page" role="region" aria-label="New Tab">
      <div className="sp-header">
        <div className="sp-actions" style={{ marginLeft: 'auto' }}>
          <div className="sp-profile"><div className="sp-avatar">U</div></div>
        </div>
      </div>

      <div className="sp-content">
        <div className="sp-brand">
          <Compass size={64} className="sp-brand-icon" />
          <h1 className="sp-logo">ATLAS</h1>
        </div>

        <div className="sp-search-wrapper">
          <div className="sp-search-bar">
            <Search size={20} className="sp-search-icon" />
            <input 
              type="text" 
              placeholder="Search the web..." 
              className="sp-search-input"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
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

      {/* Add Shortcut Modal */}
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
                    onChange={e => setNewShortcut({...newShortcut, title: e.target.value})}
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
                    onChange={e => setNewShortcut({...newShortcut, url: e.target.value})}
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