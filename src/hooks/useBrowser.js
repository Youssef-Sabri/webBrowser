import { useState, useCallback } from 'react';
import { normalizeUrl, getDisplayTitle } from '../utils/urlHelper';

export const useBrowser = () => {
  // Tabs State (now includes zoom)
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  // Global History State
  const [globalHistory, setGlobalHistory] = useState([]);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState([]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateActiveTab = (updates) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, ...updates } : tab
    ));
  };

  // --- Actions ---

  const navigate = useCallback((urlInput) => {
    const finalUrl = normalizeUrl(urlInput);
    const title = getDisplayTitle(finalUrl);
    
    // Update Tab History
    const newHistory = [...activeTab.history.slice(0, activeTab.currentIndex + 1), finalUrl];
    
    updateActiveTab({ 
      url: finalUrl, 
      title: title, 
      history: newHistory, 
      currentIndex: newHistory.length - 1,
      // Optional: Reset zoom on navigation? Most browsers keep it per domain, 
      // but per-tab persistence is standard behavior. We'll keep it.
    });

    if (finalUrl && finalUrl.trim() !== '') {
      setGlobalHistory(prev => [
        { id: Date.now(), url: finalUrl, title, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }
  }, [activeTab, activeTabId]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    if (activeTab.currentIndex > 0) {
      const newIndex = activeTab.currentIndex - 1;
      const newUrl = activeTab.history[newIndex];
      updateActiveTab({ currentIndex: newIndex, url: newUrl });
    }
  };

  const goForward = () => {
    if (activeTab.currentIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.currentIndex + 1;
      const newUrl = activeTab.history[newIndex];
      updateActiveTab({ currentIndex: newIndex, url: newUrl });
    }
  };

  const refresh = () => {
    updateActiveTab({ lastRefresh: Date.now() });
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
    // New tabs always start with zoom: 1
    setTabs([...tabs, { id: newId, title: 'New Tab', url: '', history: [''], currentIndex: 0, zoom: 1 }]);
    setActiveTabId(newId);
  };

  const closeTab = (id) => {
    setTabs(prev => {
      if (prev.length === 1) return prev;
      const newTabs = prev.filter(t => t.id !== id);
      if (id === activeTabId) {
        const index = prev.findIndex(t => t.id === id);
        setActiveTabId((newTabs[index - 1] || newTabs[0]).id);
      }
      return newTabs;
    });
  };

  const clearHistory = () => {
    setGlobalHistory([]);
  };

  const toggleBookmark = () => {
    if (!activeTab.url) return;
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      setBookmarks(prev => [...prev, { url: activeTab.url, title: activeTab.title || 'Bookmark' }]);
    }
  };

  // Zoom Logic
  const handleZoom = (type) => {
    let newZoom = activeTab.zoom;
    if (type === 'in') newZoom = Math.min(newZoom + 0.1, 3); // Max 300%
    else if (type === 'out') newZoom = Math.max(newZoom - 0.1, 0.25); // Min 25%
    else if (type === 'reset') newZoom = 1;
    
    updateActiveTab({ zoom: newZoom });
  };

  return {
    tabs,
    activeTab,
    activeTabId,
    globalHistory,
    bookmarks,
    isCurrentBookmarked: bookmarks.some(b => b.url === activeTab.url),
    setActiveTabId,
    actions: {
      navigate,
      goBack,
      goForward,
      refresh,
      addTab,
      closeTab,
      clearHistory,
      toggleBookmark,
      handleZoom // Exported action
    }
  };
};