import React, { useState, useRef, useEffect } from 'react';
import NavigationControls from './NavigationControls';
import AddressBar from './AddressBar';
import Tabs from './Tabs';
import BrowserView from './BrowserView';
import HistoryModal from './HistoryModal';
import SettingsModal from './SettingsModal'; // Added import
import { 
  Mail, Youtube, Map, MoreHorizontal, 
  ExternalLink, Clock, Settings, Plus, Star,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { useBrowser } from '../hooks/useBrowser';
import '../styles/Browser.css';

function BrowserWindow() {
  const { 
    tabs, activeTab, activeTabId, globalHistory, bookmarks, isCurrentBookmarked,
    searchEngine, setSearchEngine, // Destructure new values
    setActiveTabId, actions 
  } = useBrowser();
  
  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Added state
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        onTabClose={actions.closeTab}
        onAddTab={actions.addTab}
      />

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
          onUrlChange={() => {}} 
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

          <div className="menu-container" ref={menuRef}>
            <button 
              className={`toolbar-btn ${isMenuOpen ? 'active' : ''}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
            >
              <MoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <div className="browser-menu">
                <div className="menu-item" onClick={() => { actions.addTab(); setIsMenuOpen(false); }}>
                  <Plus size={16} /> New Tab
                </div>
                
                {/* Zoom Controls */}
                <div className="menu-row">
                   <span className="menu-label">Zoom: {Math.round(activeTab.zoom * 100)}%</span>
                   <div className="zoom-controls">
                     <button className="menu-icon-btn" onClick={() => actions.handleZoom('out')} title="Zoom Out">
                       <ZoomOut size={16} />
                     </button>
                     <button className="menu-icon-btn" onClick={() => actions.handleZoom('reset')} title="Reset Zoom">
                       <RotateCcw size={14} />
                     </button>
                     <button className="menu-icon-btn" onClick={() => actions.handleZoom('in')} title="Zoom In">
                       <ZoomIn size={16} />
                     </button>
                   </div>
                </div>

                <div className="menu-separator"></div>

                <div className="menu-item" onClick={() => { setShowHistory(true); setIsMenuOpen(false); }}>
                  <Clock size={16} /> History
                </div>
                <div className="menu-item" onClick={() => { setShowSettings(true); setIsMenuOpen(false); }}>
                  <Settings size={16} /> Settings
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bookmarks-bar">
        <BookmarkItem icon={<Mail size={14} />} label="Inbox" url="https://mail.google.com" onNavigate={actions.navigate} />
        <BookmarkItem icon={<Youtube size={14} />} label="Videos" url="https://youtube.com" onNavigate={actions.navigate} />
        <BookmarkItem icon={<Map size={14} />} label="Explore" url="https://maps.google.com" onNavigate={actions.navigate} />
        
        {bookmarks.length > 0 && <div className="bookmarks-separator"></div>}

        {bookmarks.map((bookmark, index) => (
          <div key={`${bookmark.url}-${index}`} className="bookmark-item" onClick={() => actions.navigate(bookmark.url)}>
            <span className="bookmark-icon"><Star size={14} fill="#FFD700" color="#FFD700" /></span>
            <span>{bookmark.title}</span>
          </div>
        ))}
      </div>

      <BrowserView 
        url={activeTab.url} 
        onNavigate={actions.navigate} 
        zoom={activeTab.zoom}
        key={`${activeTab.id}-${activeTab.lastRefresh}`} 
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
    </div>
  );
}

const BookmarkItem = ({ icon, label, url, onNavigate }) => (
  <div className="bookmark-item" onClick={() => onNavigate(url)}>
    <span className="bookmark-icon">{icon}</span>
    <span>{label}</span>
  </div>
);

export default BrowserWindow;