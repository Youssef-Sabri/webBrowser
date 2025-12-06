import React, { useState } from 'react';
import NavigationControls from './NavigationControls';
import AddressBar from './AddressBar';
import Tabs from './Tabs';
import BrowserView from './BrowserView';
import HistoryModal from './HistoryModal';
import SettingsModal from './SettingsModal';
import AuthModal from './AuthModal';
import BrowserMenu from './BrowserMenu';
import WindowControls from './WindowControls';
import { ExternalLink, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBrowserContext } from '../contexts/BrowserContext';
import '../styles/Browser.css';

function BrowserWindow() {
  const { user, login, register, logout } = useAuth();
  const {
    tabs, activeTab, activeTabId, globalHistory, bookmarks, isCurrentBookmarked,
    searchEngine, setSearchEngine,
    shortcuts,
    setActiveTabId, actions: browserActions
  } = useBrowserContext();

  const actions = { ...browserActions, login, register, logout };

  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);



  const handleHome = () => {
    if (activeTab.url && activeTab.url.trim() !== '') {
      actions.navigate('');
    }
  };

  const handleOpenExternal = () => {
    if (activeTab.url) {
      window.open(activeTab.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="browser-window">
      <div className="titlebar" style={{
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--bg-secondary)',
        WebkitAppRegion: 'drag'
      }}>
        <div style={{ flex: 1, minWidth: 0, WebkitAppRegion: 'no-drag' }}>
          <Tabs
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onTabClose={actions.closeTab}
            onAddTab={actions.addTab}
          />
        </div>
        <WindowControls />
      </div>

      <div className="browser-toolbar">
        <NavigationControls
          onBack={actions.goBack}
          onForward={actions.goForward}
          onRefresh={actions.refresh}
          onHome={handleHome}
          canGoBack={activeTab.currentIndex > 0}
          canGoForward={activeTab.currentIndex < activeTab.history.length - 1}
        />

        <AddressBar
          url={activeTab.url}
          onUrlSubmit={actions.navigate}
          isBookmarked={isCurrentBookmarked}
          onToggleBookmark={actions.toggleBookmark}
        />

        <div className="toolbar-actions">
          {activeTab.url && (
            <button
              className="toolbar-btn"
              onClick={handleOpenExternal}
              title="Open in system browser"
            >
              <ExternalLink size={18} />
            </button>
          )}

          <BrowserMenu
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen(!isMenuOpen)}
            onClose={() => setIsMenuOpen(false)}
            activeTab={activeTab}
            actions={actions}
            onShowHistory={() => setShowHistory(true)}
            onShowSettings={() => setShowSettings(true)}
          />
        </div>
      </div>

      {/* Only render bookmarks bar if there are user bookmarks */}
      {bookmarks.length > 0 && (
        <div className="bookmarks-bar">
          {bookmarks.map((bookmark, index) => (
            <div key={`${bookmark.url}-${index}`} className="bookmark-item" onClick={() => actions.navigate(bookmark.url)}>
              <span className="bookmark-icon"><Star size={14} fill="#FFD700" color="#FFD700" /></span>
              <span>{bookmark.title}</span>
            </div>
          ))}
        </div>
      )}

      <BrowserView
        url={activeTab.url}
        onNavigate={actions.navigate}
        zoom={activeTab.zoom}
        user={user}
        onAuthRequest={() => setShowAuth(true)}
        onLogout={actions.logout}
        shortcuts={shortcuts}
        onUpdateShortcuts={actions.updateShortcuts}
        key={`${activeTab.id}-${activeTab.lastRefresh}-${!!activeTab.url}`}
      />

      {showHistory && (
        <HistoryModal
          history={globalHistory}
          onClose={() => setShowHistory(false)}
          onClear={actions.clearHistory}
          onNavigate={actions.navigate}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentEngine={searchEngine}
          onSetEngine={setSearchEngine}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={actions.login}
          onRegister={actions.register}
        />
      )}
    </div>
  );
}

export default BrowserWindow;
