import React, { useState, useEffect, useRef } from 'react';
import StartPage from './StartPage';
import { DEFAULT_USER_AGENT } from '../utils/constants';
import '../styles/BrowserView.css';

function BrowserView({ url, onNavigate, onTitleUpdate, zoom = 1, user, onAuthRequest, onLogout, shortcuts, onUpdateShortcuts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [srcUrl] = useState(url);

  const urlPropRef = useRef(url);
  useEffect(() => {
    urlPropRef.current = url;
  }, [url]);

  const webviewRef = useRef(null);

  useEffect(() => {
    if (isReady && webviewRef.current) {
      try {
        webviewRef.current.setZoomFactor(zoom);
      } catch (error) {
      }
    }
  }, [zoom, isReady]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (isReady && webview && url) {
      try {
        const currentWebviewUrl = webview.getURL();
        if (currentWebviewUrl !== url) {
          webview.loadURL(url).catch(e => {
            if (e.message && e.message.includes('-3')) return;
            console.warn("webview.loadURL failed:", e);
          });
        }
      } catch (e) {
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
      if (e.errorCode !== -3) {
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
        if (onNavigateRef.current) {
          onNavigateRef.current(e.url);
        }
      }
    };

    const handleTitleUpdate = (e) => {
      if (onTitleUpdate && e.title) {
        onTitleUpdate(e.title);
      }
    };

    // Add listeners
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('did-fail-load', handleFailLoad);
    webview.addEventListener('dom-ready', handleDomReady);
    webview.addEventListener('did-navigate', handleNavigate);
    webview.addEventListener('did-navigate-in-page', handleNavigate);
    webview.addEventListener('page-title-updated', handleTitleUpdate);

    return () => {
      try {
        webview.removeEventListener('did-start-loading', handleStartLoading);
        webview.removeEventListener('did-stop-loading', handleStopLoading);
        webview.removeEventListener('did-fail-load', handleFailLoad);
        webview.removeEventListener('dom-ready', handleDomReady);
        webview.removeEventListener('did-navigate', handleNavigate);
        webview.removeEventListener('did-navigate-in-page', handleNavigate);
        webview.removeEventListener('page-title-updated', handleTitleUpdate);
      } catch (error) {
        // Ignore cleanup errors
      }
    };

  }, [onTitleUpdate]);

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
      <div className="browser-view-content">
        <webview
          ref={webviewRef}
          src={srcUrl}
          className="browser-webview"
          allowpopups="true"
          useragent={DEFAULT_USER_AGENT}
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