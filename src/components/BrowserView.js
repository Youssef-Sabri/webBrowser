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

  // 3. Attach Event Listeners
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => setIsLoading(false);

    const handleFailLoad = (e) => {
      // Ignore ERR_ABORTED (-3) as it often happens during legitimate rapid navigation
      if (e.errorCode !== -3) {
        console.warn("Page failed to load:", e);
      }
      setIsLoading(false);
    };

    const handleDomReady = () => {
      setIsReady(true);
    };

    // Capture in-page navigation (links, etc.) to update React state
    const handleNavigate = (e) => {
      const currentUrl = urlPropRef.current;
      // If the webview navigates to a URL that is different from what React thinks,
      // we must update React's state.
      if (e.url && e.url !== currentUrl && e.url !== 'about:blank') {
        onNavigate(e.url);
      }
    };

    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('did-fail-load', handleFailLoad);
    webview.addEventListener('dom-ready', handleDomReady);

    // Listen for both main navigation and in-page navigation (SPA links)
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
    // Removed 'url' and 'zoom' from dependency array to prevent listener re-binding churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
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