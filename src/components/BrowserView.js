import React, { useState, useEffect, useRef } from 'react';
import StartPage from './StartPage';
import '../styles/BrowserView.css';

function BrowserView({ url, onNavigate, zoom = 1, user, onAuthRequest, onLogout, shortcuts, onUpdateShortcuts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // CRITICAL FIX 1: Use a stable initial URL for the 'src' prop.
  const [srcUrl] = useState(url);

  // Keep a ref to the latest URL so event handlers can access it without re-binding
  const urlPropRef = useRef(url);
  useEffect(() => {
    urlPropRef.current = url;
  }, [url]);

  const webviewRef = useRef(null);

  // 1. Sync Zoom Level (Safe execution)
  useEffect(() => {
    if (isReady && webviewRef.current) {
      try {
        webviewRef.current.setZoomFactor(zoom);
      } catch (error) {
        // Silently fail if webview isn't ready
      }
    }
  }, [zoom, isReady]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (isReady && webview && url) {
      try {
        // CRITICAL FIX 2: Wrap getURL in try-catch to prevent "WebView must be attached" errors
        const currentWebviewUrl = webview.getURL();
        if (currentWebviewUrl !== url) {
          webview.loadURL(url);
        }
      } catch (e) {
        // Webview might be transitioning or detached; ignore this cycle
      }
    }
  }, [url, isReady]);

  const onNavigateRef = useRef(onNavigate);
  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => setIsLoading(false);

    const handleFailLoad = (e) => {
      if (e.errorCode !== -3) { // Ignore ERR_ABORTED
        console.warn("Page failed to load:", e);
      }
      setIsLoading(false);
    };

    const handleDomReady = () => {
      setIsReady(true);
    };

    const handleNavigate = (e) => {
      const currentUrl = urlPropRef.current;
      if (e.url && e.url !== currentUrl && e.url !== 'about:blank') {
        // Use the ref to call the latest handler
        if (onNavigateRef.current) {
          onNavigateRef.current(e.url);
        }
      }
    };

    // Add listeners
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('did-fail-load', handleFailLoad);
    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('did-navigate', handleNavigate);
    webview.addEventListener('did-navigate-in-page', handleNavigate);

    return () => {
      try {
        webview.removeEventListener('did-start-loading', handleStartLoading);
        webview.removeEventListener('did-stop-loading', handleStopLoading);
        webview.removeEventListener('did-fail-load', handleFailLoad);
        webview.removeEventListener('dom-ready', handleDomReady);
        webview.removeEventListener('did-navigate', handleNavigate);
        webview.removeEventListener('did-navigate-in-page', handleNavigate);
      } catch (error) {
        // Ignore cleanup errors
      }
    };
    // Empty dependency array ensures listeners are attached ONLY ONCE when the component mounts/webview ref is stable.
    // We intentionally ignore 'url' changes here for the listeners themselves.
  }, []);

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
          src={srcUrl}
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