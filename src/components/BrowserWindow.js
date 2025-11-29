import React, { useState, useEffect } from 'react';

import NavigationControls from './NavigationControls';

import AddressBar from './AddressBar';

import Tabs from './Tabs';

import BrowserView from './BrowserView';

import { Mail, Youtube, Map, FolderHeart, MoreHorizontal } from 'lucide-react';

import '../styles/Browser.css';



function BrowserWindow() {

  const [tabs, setTabs] = useState([

    { id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0 }

  ]);

  const [activeTabId, setActiveTabId] = useState(1);



  // Find active tab using the ID directly

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];



  const updateActiveTab = (updates) => {

    setTabs(prevTabs => prevTabs.map(tab => 

      tab.id === activeTabId ? { ...tab, ...updates } : tab

    ));

  };



  // --- Navigation Logic ---

  const handleNavigate = (url) => {

    // Normalize URL (add https if missing)

    let finalUrl = url;

    if (url && !url.startsWith('http') && !url.startsWith('file')) {

        if (url.includes('.') && !url.includes(' ')) {

            finalUrl = `https://${url}`;

        } else {

            // Treat as search query if it doesn't look like a domain

            finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;

        }

    }



    const newHistory = [...activeTab.history.slice(0, activeTab.currentIndex + 1), finalUrl];

    updateActiveTab({ 

      url: finalUrl, 

      title: finalUrl || 'New Tab', 

      history: newHistory, 

      currentIndex: newHistory.length - 1 

    });

  };



  const handleBack = () => {

    if (activeTab.currentIndex > 0) {

      const newIndex = activeTab.currentIndex - 1;

      const newUrl = activeTab.history[newIndex];

      updateActiveTab({ currentIndex: newIndex, url: newUrl, title: newUrl || 'New Tab' });

    }

  };



  const handleForward = () => {

    if (activeTab.currentIndex < activeTab.history.length - 1) {

      const newIndex = activeTab.currentIndex + 1;

      const newUrl = activeTab.history[newIndex];

      updateActiveTab({ currentIndex: newIndex, url: newUrl, title: newUrl || 'New Tab' });

    }

  };



  const handleRefresh = () => { 

    // Force iframe reload by updating a refresh timestamp

    updateActiveTab({ lastRefresh: Date.now() });

  };



  const handleHome = () => {

    handleNavigate('');

  };



  // --- Tab Management ---

  const handleTabChange = (id) => setActiveTabId(id);

  

  const handleTabClose = (id) => {

    setTabs(prev => {

      if (prev.length === 1) return prev; // Don't close last tab

      const newTabs = prev.filter(t => t.id !== id);

      if (id === activeTabId) {

        // If closing active tab, switch to the one before it

        const index = prev.findIndex(t => t.id === id);

        const newActive = newTabs[index - 1] || newTabs[0];

        setActiveTabId(newActive.id);

      }

      return newTabs;

    });

  };



  const handleAddTab = () => {

    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;

    const newTab = { id: newId, title: 'New Tab', url: '', history: [''], currentIndex: 0 };

    

    setTabs(prev => [...prev, newTab]);

    setActiveTabId(newId);

  };



  return (

    <div className="browser-window">

      <Tabs

        tabs={tabs}

        activeTabId={activeTabId}

        onTabChange={handleTabChange}

        onTabClose={handleTabClose}

        onAddTab={handleAddTab}

      />



      <div className="browser-toolbar">

        <NavigationControls

          onBack={handleBack}

          onForward={handleForward}

          onRefresh={handleRefresh}

          onHome={handleHome}

          canGoBack={activeTab?.currentIndex > 0}

          canGoForward={activeTab?.currentIndex < activeTab?.history.length - 1}

        />

        <AddressBar

          url={activeTab?.url || ''}

          onUrlSubmit={handleNavigate}

        />

        <div 

          style={{ padding: '0 8px', color: 'var(--text-secondary)', cursor: 'pointer' }}

          onClick={() => alert("Browser Settings Menu (Simulation)")}

          title="Settings"

        >

          <MoreHorizontal size={20} />

        </div>

      </div>



      {/* Interactive Bookmarks Bar */}

      <div className="bookmarks-bar">

        <div className="bookmark-item" onClick={() => handleNavigate('https://mail.google.com')}>

          <span className="bookmark-icon"><Mail size={14} /></span>

          <span>Inbox</span>

        </div>

        <div className="bookmark-item" onClick={() => handleNavigate('https://youtube.com')}>

          <span className="bookmark-icon"><Youtube size={14} /></span>

          <span>Videos</span>

        </div>

        <div className="bookmark-item" onClick={() => handleNavigate('https://maps.google.com')}>

          <span className="bookmark-icon"><Map size={14} /></span>

          <span>Explore</span>

        </div>

        <div className="bookmarks-separator"></div>

        <div className="bookmark-item" onClick={() => alert("Import Bookmarks Feature")}>

          <span className="bookmark-icon"><FolderHeart size={14} /></span>

          <span>Imported</span>

        </div>

      </div>



      <BrowserView 

        url={activeTab?.url} 

        onNavigate={handleNavigate} 

        // Key includes tab ID to ensure isolation of iframe state between tabs

        key={`${activeTab?.id}-${activeTab?.lastRefresh || ''}`}

      />

    </div>

  );

}



export default BrowserWindow;