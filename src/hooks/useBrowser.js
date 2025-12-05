import { useState, useCallback, useEffect } from 'react';
import { normalizeUrl, getDisplayTitle } from '../utils/urlHelper';
import { DEFAULT_SEARCH_ENGINE } from '../utils/constants';

// Use environment variable for the backend API URL
const BACKEND_URL = process.env.REACT_APP_API_URL;

export const useBrowser = () => {
  // --- Auth State ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('atlas-user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Browser Data State ---
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [globalHistory, setGlobalHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchEngine, setSearchEngine] = useState(DEFAULT_SEARCH_ENGINE);
  const [shortcuts, setShortcuts] = useState([]); // No default mock data

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // --- API Helpers ---
  const syncData = async (endpoint, body) => {
    if (!user) return;
    try {
      await fetch(`${BACKEND_URL}/user/${user._id || user.id}/${endpoint}`, {
        method: endpoint === 'history' ? 'DELETE' : 'POST', // Handle special case for clear history
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.error(`Failed to sync ${endpoint}:`, err);
    }
  };

  // --- Auth Actions ---
  const login = async (username, password) => {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (data.status === 'success') {
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('atlas-user', JSON.stringify(userData));
      
      // Load User Data from DB into State
      if (userData.history) setGlobalHistory(userData.history);
      if (userData.bookmarks) setBookmarks(userData.bookmarks);
      if (userData.shortcuts) setShortcuts(userData.shortcuts);
      if (userData.settings?.searchEngine) setSearchEngine(userData.settings.searchEngine);
      if (userData.tabs && userData.tabs.length > 0) {
        setTabs(userData.tabs);
        setActiveTabId(userData.tabs[0].id);
      }
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (username, password, email) => {
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    const data = await res.json();
    if (data.status === 'success') {
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('atlas-user', JSON.stringify(userData));
      // Initialize with empty shortcuts as per clean state requirement
      setShortcuts(userData.shortcuts || []);
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atlas-user');
    // Reset to defaults (clean state)
    setGlobalHistory([]);
    setBookmarks([]);
    setShortcuts([]);
    setTabs([{ id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }]);
    setActiveTabId(1);
  };

  // --- Data Logic Wrappers (Sync State + DB) ---

  const updateActiveTab = (updates) => {
    const newTabs = tabs.map(tab => tab.id === activeTabId ? { ...tab, ...updates } : tab);
    setTabs(newTabs);
    // Note: Debounce syncing tabs in a real app to avoid excessive writes
    if(user) syncData('tabs', newTabs); 
  };

  const navigate = useCallback((urlInput) => {
    const finalUrl = normalizeUrl(urlInput, searchEngine);
    const title = getDisplayTitle(finalUrl);
    
    const newHistory = [...activeTab.history.slice(0, activeTab.currentIndex + 1), finalUrl];
    
    updateActiveTab({ 
      url: finalUrl, 
      title: title, 
      history: newHistory, 
      currentIndex: newHistory.length - 1,
    });

    if (finalUrl && finalUrl.trim() !== '') {
      const historyItem = { id: Date.now(), url: finalUrl, title, timestamp: new Date().toLocaleTimeString() };
      setGlobalHistory(prev => [historyItem, ...prev]);
      
      // Sync History Item
      if(user) {
        fetch(`${BACKEND_URL}/user/${user._id || user.id}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(historyItem)
        });
      }
    }
  }, [activeTab, activeTabId, searchEngine, user]);

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
    const newTabs = [...tabs, { id: newId, title: 'New Tab', url: '', history: [''], currentIndex: 0, zoom: 1 }];
    setTabs(newTabs);
    setActiveTabId(newId);
    if(user) syncData('tabs', newTabs);
  };

  const closeTab = (id) => {
    let newTabs = tabs;
    let newId = activeTabId;

    if (tabs.length > 1) {
      newTabs = tabs.filter(t => t.id !== id);
      if (id === activeTabId) {
        const index = tabs.findIndex(t => t.id === id);
        newId = (newTabs[index - 1] || newTabs[0]).id;
        setActiveTabId(newId);
      }
      setTabs(newTabs);
      if(user) syncData('tabs', newTabs);
    }
  };

  const toggleBookmark = () => {
    if (!activeTab.url) return;
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(b => b.url !== activeTab.url);
    } else {
      newBookmarks = [...bookmarks, { url: activeTab.url, title: activeTab.title || 'Bookmark' }];
    }
    setBookmarks(newBookmarks);
    if(user) syncData('bookmarks', newBookmarks);
  };

  const updateShortcuts = (newShortcuts) => {
    setShortcuts(newShortcuts);
    if(user) syncData('shortcuts', newShortcuts);
  };

  const updateSearchEngine = (url) => {
    setSearchEngine(url);
    if(user) syncData('settings', { searchEngine: url });
  };

  const clearHistory = () => {
    setGlobalHistory([]);
    if(user) {
       fetch(`${BACKEND_URL}/user/${user._id || user.id}/history`, { method: 'DELETE' });
    }
  };

  // Standard navigation controls
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

  const refresh = () => updateActiveTab({ lastRefresh: Date.now() });

  const handleZoom = (type) => {
    let newZoom = activeTab.zoom;
    if (type === 'in') newZoom = Math.min(newZoom + 0.1, 3);
    else if (type === 'out') newZoom = Math.max(newZoom - 0.1, 0.25);
    else if (type === 'reset') newZoom = 1;
    updateActiveTab({ zoom: newZoom });
  };

  return {
    tabs,
    activeTab,
    activeTabId,
    globalHistory,
    bookmarks,
    searchEngine,
    user,
    shortcuts, 
    setSearchEngine: updateSearchEngine,
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
      handleZoom,
      updateShortcuts,
      login,
      register,
      logout
    }
  };
};