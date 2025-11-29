import React from 'react';
import '../styles/BrowserView.css';

function BrowserView({ url }) {
  if (!url || url.trim() === '') {
    return (
      <div className="browser-view empty-state" role="region" aria-label="Browser content">
        <div className="empty-state-content">
          <h2>Welcome to Your Browser</h2>
          <p>Enter a URL in the address bar to get started</p>
          <div className="empty-state-icon">🌐</div>
        </div>
      </div>
    );
  }

  return (
    <div className="browser-view" role="region" aria-label="Browser content">
      <div className="browser-view-content">
        <div className="content-placeholder">
          <p>Content area for: <strong>{url}</strong></p>
          <p className="placeholder-note">Page rendering will be implemented in later phases</p>
        </div>
      </div>
    </div>
  );
}

export default BrowserView;

