import React, { useState } from 'react';
import { Search, Plus, Compass, Command, Mic, Settings } from 'lucide-react';
import '../styles/BrowserView.css';

function BrowserView({ url, onNavigate }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onNavigate(searchValue);
    }
  };

  const handleShortcutClick = (site) => {
    onNavigate(site);
  };

  // If no URL, render the Start Page
  if (!url || url.trim() === '') {
    return (
      <div className="browser-view start-page" role="region" aria-label="Start Page">
        
        {/* Header - Custom Actions */}
        <div className="sp-header">
          <div className="sp-pill">
            <span className="sp-pill-text">Weather: 24°C</span>
          </div>
          <div className="sp-actions">
            <div className="sp-icon-btn" title="Settings" onClick={() => alert("Opening Settings...")}>
              <Settings size={18} />
            </div>
            <div className="sp-profile" title="User Profile" onClick={() => alert("User Profile")}>
              <div className="sp-avatar">U</div>
            </div>
          </div>
        </div>

        {/* Central Content */}
        <div className="sp-content">
          {/* Custom Branding */}
          <div className="sp-brand">
            <Compass size={64} className="sp-brand-icon" />
            <h1 className="sp-logo">Orbit</h1>
          </div>

          {/* Modern Search */}
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
              <div className="sp-search-tools">
                <div className="sp-tool" title="Voice Search" onClick={() => alert("Listening...")}>
                  <Mic size={18} />
                </div>
                <div className="sp-tool kbd-shortcut" title="Command Palette" onClick={() => alert("Command Palette (Ctrl+K)")}>
                  <Command size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Card-style Shortcuts - Now Clickable */}
          <div className="sp-shortcuts-grid">
            <div className="sp-shortcut-card" onClick={() => handleShortcutClick('https://chat.openai.com')}>
              <div className="card-icon gradient-1">🤖</div>
              <span className="card-label">ChatGPT</span>
            </div>
            
            <div className="sp-shortcut-card" onClick={() => handleShortcutClick('https://deepseek.com')}>
              <div className="card-icon gradient-2">🐋</div>
              <span className="card-label">DeepSeek</span>
            </div>

            <div className="sp-shortcut-card" onClick={() => handleShortcutClick('https://react.dev')}>
              <div className="card-icon gradient-3">⚛️</div>
              <span className="card-label">React Docs</span>
            </div>

            <div className="sp-shortcut-card add-new" onClick={() => alert("Add Shortcut Feature")}>
              <div className="card-icon"><Plus size={24} /></div>
              <span className="card-label">Add Site</span>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="sp-footer">
          <p>Secure Browser Environment v1.0</p>
        </div>
      </div>
    );
  }

  // Active Website View
  const validUrl = url.startsWith('http') ? url : `https://${url}`;
  
  return (
    <div className="browser-view" role="region" aria-label="Browser content">
      <div className="browser-view-content">
        {/* Note: Real external sites may refuse to load in an iframe due to X-Frame-Options */}
        <iframe 
          src={validUrl} 
          title="Browser Content"
          className="browser-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <div className="iframe-overlay">
          <div className="loader"></div>
          <p>Loading {url}...</p>
          <small style={{opacity: 0.5}}>(Note: Some sites block embedded viewing)</small>
        </div>
      </div>
    </div>
  );
}

export default BrowserView;