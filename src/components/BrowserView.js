import React, { useState, useEffect } from 'react';
import StartPage from './StartPage';
import '../styles/BrowserView.css';

function BrowserView({ url, onNavigate, zoom = 1 }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(!!(url && url.trim()));
  }, [url]);

  // Logic: The Start Page should ALWAYS be 100% scale (unzoomed).
  const isStartPage = !url || url.trim() === '';

  if (isStartPage) {
    return <StartPage onNavigate={onNavigate} />;
  }

  const validUrl = url.startsWith('http') ? url : `https://${url}`;

  // CSS Logic for Zooming an Iframe
  // We scale the container, but we must increase the size of the internal 
  // frame so that when scaled down/up it fills the space correctly.
  const zoomStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: '0 0',
    width: `${100 / zoom}%`,
    height: `${100 / zoom}%`,
    border: 'none',
    position: 'absolute',
    top: 0,
    left: 0
  };

  return (
    <div className="browser-view" role="region" aria-label="Browser content">
      <div className="browser-view-content" style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={zoomStyle}>
          <iframe 
            src={validUrl} 
            title="Browser Content"
            className="browser-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setIsLoading(false)}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        
        {isLoading && (
          <div className="iframe-overlay">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowserView;