import React, { useState, useEffect, useRef } from 'react';
import StartPage from './StartPage';
import '../styles/BrowserView.css';

function BrowserView({ url, onNavigate, zoom = 1, user, onAuthRequest, onLogout, shortcuts, onUpdateShortcuts }) {
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = useRef(null);

  // Sync Zoom Level
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.setZoomFactor(zoom);
    }
  }, [zoom]);

  // Attach Event Listeners to Webview
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // 1. Handlers
    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => setIsLoading(false);
    const handleFailLoad = (e) => {
        console.warn("Page failed to load:", e);
        setIsLoading(false);
    };

    // 2. Add Listeners
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('did-fail-load', handleFailLoad);

    // 3. Cleanup
    return () => {
      try {
        webview.removeEventListener('did-start-loading', handleStartLoading);
        webview.removeEventListener('did-stop-loading', handleStopLoading);
        webview.removeEventListener('did-fail-load', handleFailLoad);
      } catch (error) {
        // Ignore errors if webview is already disposed
      }
    };
  }, [onNavigate]);

  const isStartPage = !url || url.trim() === '';

  if (isStartPage) {
    return <StartPage 
      onNavigate={onNavigate} 
      user={user} 
      onAuthRequest={onAuthRequest} 
      onLogout={onLogout}
      shortcuts={shortcuts}
      onUpdateShortcuts={onUpdateShortcuts}
    />;
  }

  return (
    <div className="browser-view" role="region" aria-label="Browser content">
      <div className="browser-view-content" style={{ overflow: 'hidden', position: 'relative', height: '100%' }}>
        <webview
          ref={webviewRef}
          src={url} 
          style={{ width: '100%', height: '100%', display: 'flex' }}
          allowpopups="true"
          useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
          webpreferences="contextIsolation=yes, nodeIntegration=no"
        />
        
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