import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { normalizeUrl, getDisplayTitle } from '../utils/urlHelper';
import { DEFAULT_SEARCH_ENGINE } from '../utils/constants';
import { api } from '../services/api';

const BrowserContext = createContext(null);

export const BrowserProvider = ({ children }) => {
    const { user } = useAuth();

    const [tabs, setTabs] = useState([
        { id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [globalHistory, setGlobalHistory] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [searchEngine, setSearchEngine] = useState(DEFAULT_SEARCH_ENGINE);
    const [shortcuts, setShortcuts] = useState([]);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const resetBrowser = useCallback(() => {
        setGlobalHistory([]);
        setBookmarks([]);
        setShortcuts([]);
        setTabs([{ id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }]);
        setActiveTabId(1);
        setSearchEngine(DEFAULT_SEARCH_ENGINE);
    }, []);

    useEffect(() => {
        if (user) {
            if (user.history) setGlobalHistory(user.history);
            if (user.bookmarks) setBookmarks(user.bookmarks);
            if (user.shortcuts) setShortcuts(user.shortcuts);
            if (user.settings?.searchEngine) setSearchEngine(user.settings.searchEngine);
            if (user.tabs && user.tabs.length > 0) {
                setTabs(user.tabs);
                setActiveTabId(user.tabs[0].id);
            }
        } else {
            resetBrowser();
        }
    }, [user, resetBrowser]);

    const syncData = useCallback(async (endpoint, body) => {
        const userId = user?._id || user?.id;
        if (!userId) return;
        try {
            await api.sync.update(userId, endpoint, body);
        } catch (err) {
            console.error(`Failed to sync ${endpoint}:`, err);
        }
    }, [user]);

    const updateActiveTab = useCallback((updates) => {
        setTabs(prevTabs => {
            const newTabs = prevTabs.map(tab => tab.id === activeTabId ? { ...tab, ...updates } : tab);
            if (user) syncData('tabs', newTabs);
            return newTabs;
        });
    }, [activeTabId, user, syncData]);

    const navigate = useCallback((urlInput) => {
        const finalUrl = normalizeUrl(urlInput, searchEngine);
        const title = getDisplayTitle(finalUrl);

        if (!activeTab) return;

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

            const userId = user?._id || user?.id;
            if (userId) {
                api.sync.history.add(userId, historyItem).catch(err => console.error("Failed to sync history item", err));
            }
        }
    }, [activeTab, activeTabId, searchEngine, user, updateActiveTab]);

    const addTab = () => {
        const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
        const newTabs = [...tabs, { id: newId, title: 'New Tab', url: '', history: [''], currentIndex: 0, zoom: 1 }];
        setTabs(newTabs);
        setActiveTabId(newId);
        if (user) syncData('tabs', newTabs);
    };

    const closeTab = (id) => {
        if (tabs.length > 1) {
            const newTabs = tabs.filter(t => t.id !== id);
            let newId = activeTabId;
            if (id === activeTabId) {
                const index = tabs.findIndex(t => t.id === id);
                newId = (newTabs[index - 1] || newTabs[0]).id;
                setActiveTabId(newId);
            }
            setTabs(newTabs);
            if (user) syncData('tabs', newTabs);
        }
    };

    const toggleBookmark = () => {
        if (!activeTab?.url) return;
        const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
        let newBookmarks;
        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => b.url !== activeTab.url);
        } else {
            newBookmarks = [...bookmarks, { url: activeTab.url, title: activeTab.title || 'Bookmark' }];
        }
        setBookmarks(newBookmarks);
        if (user) syncData('bookmarks', newBookmarks);
    };

    const updateShortcuts = (newShortcuts) => {
        setShortcuts(newShortcuts);
        if (user) syncData('shortcuts', newShortcuts);
    };

    const updateSearchEngine = (url) => {
        setSearchEngine(url);
        if (user) syncData('settings', { searchEngine: url });
    };

    const clearHistory = () => {
        setGlobalHistory([]);
        const userId = user?._id || user?.id;
        if (userId) {
            api.sync.history.clear(userId).catch(err => console.error("Failed to clear history", err));
        }
    };

    const goBack = () => {
        if (activeTab && activeTab.currentIndex > 0) {
            const newIndex = activeTab.currentIndex - 1;
            const newUrl = activeTab.history[newIndex];
            updateActiveTab({ currentIndex: newIndex, url: newUrl });
        }
    };

    const goForward = () => {
        if (activeTab && activeTab.currentIndex < activeTab.history.length - 1) {
            const newIndex = activeTab.currentIndex + 1;
            const newUrl = activeTab.history[newIndex];
            updateActiveTab({ currentIndex: newIndex, url: newUrl });
        }
    };

    const refresh = () => updateActiveTab({ lastRefresh: Date.now() });

    const handleZoom = (type) => {
        let newZoom = activeTab.zoom || 1;
        if (type === 'in') newZoom = Math.min(newZoom + 0.1, 3);
        else if (type === 'out') newZoom = Math.max(newZoom - 0.1, 0.25);
        else if (type === 'reset') newZoom = 1;
        updateActiveTab({ zoom: newZoom });
    };

    const value = {
        tabs,
        activeTab,
        activeTabId,
        setActiveTabId,
        globalHistory,
        bookmarks,
        searchEngine,
        setSearchEngine: updateSearchEngine,
        shortcuts,
        isCurrentBookmarked: bookmarks.some(b => b.url === activeTab?.url),
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
            updateShortcuts
        }
    };

    return (
        <BrowserContext.Provider value={value}>
            {children}
        </BrowserContext.Provider>
    );
};

export const useBrowserContext = () => {
    const context = useContext(BrowserContext);
    if (!context) throw new Error('useBrowserContext must be used within BrowserProvider');
    return context;
};
