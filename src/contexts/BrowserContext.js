import React, { createContext, useState, useCallback, useEffect, useContext, useRef, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { normalizeUrl, getDisplayTitle, cleanTitle, getQueryFromUrl } from '../utils/urlHelper';
import { DEFAULT_SEARCH_ENGINE } from '../utils/constants';
import { api } from '../services/api';

const BrowserContext = createContext(null);

export const BrowserProvider = ({ children }) => {
    // ... existing state definitions ...
    const { user } = useAuth();

    const [tabs, setTabs] = useState([
        { id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [globalHistory, setGlobalHistory] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [searchEngine, setSearchEngine] = useState(DEFAULT_SEARCH_ENGINE);
    const [shortcuts, setShortcuts] = useState([]);

    const [syncError, setSyncError] = useState(null);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const resetBrowser = useCallback(() => {
        setGlobalHistory([]);
        setBookmarks([]);
        setShortcuts([]);
        setTabs([{ id: 1, title: 'New Tab', url: '', history: [''], currentIndex: 0, lastRefresh: Date.now(), zoom: 1 }]);
        setActiveTabId(1);
        setSearchEngine(DEFAULT_SEARCH_ENGINE);
        setSyncError(null);
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

    const syncTimeouts = React.useRef({});

    const debouncedSync = useCallback((userId, endpoint, body) => {
        if (syncTimeouts.current[endpoint]) {
            clearTimeout(syncTimeouts.current[endpoint]);
        }

        syncTimeouts.current[endpoint] = setTimeout(async () => {
            try {
                await api.sync.update(userId, endpoint, body);
                delete syncTimeouts.current[endpoint];
                setSyncError(null);
            } catch (err) {
                console.error(`Failed to sync ${endpoint}:`, err);
                setSyncError(`Sync failed: ${endpoint}`);
            }
        }, 1000); // 1 second debounce
    }, []);

    const syncData = useCallback((endpoint, body) => {
        const userId = user?._id || user?.id;
        if (!userId) return;
        debouncedSync(userId, endpoint, body);
    }, [user, debouncedSync]);

    const updateActiveTab = useCallback((updates) => {
        setTabs(prevTabs => {
            const newTabs = prevTabs.map(tab => tab.id === activeTabId ? { ...tab, ...updates } : tab);
            if (user) syncData('tabs', newTabs);
            return newTabs;
        });
    }, [activeTabId, user, syncData]);

    const navigate = useCallback((urlInput) => {
        // Smart Search Redirection:
        const potentialQuery = getQueryFromUrl(urlInput);
        let finalUrl;

        if (potentialQuery) {
            finalUrl = normalizeUrl(potentialQuery, searchEngine);
        } else {
            finalUrl = normalizeUrl(urlInput, searchEngine);
        }

        const title = getDisplayTitle(finalUrl);

        if (!activeTab) return;

        if (activeTab.url === finalUrl || (activeTab.history[activeTab.currentIndex] === finalUrl)) {
            updateActiveTab({ url: finalUrl, title });
            return;
        }

        const newHistory = [...activeTab.history.slice(0, activeTab.currentIndex + 1), finalUrl];

        updateActiveTab({
            url: finalUrl,
            title: title,
            history: newHistory,
            currentIndex: newHistory.length - 1,
        });

        if (finalUrl && finalUrl.trim() !== '') {
            const historyItem = { id: Date.now(), url: finalUrl, title: cleanTitle(title), timestamp: new Date().toLocaleTimeString() };
            setGlobalHistory(prev => [historyItem, ...prev]);

            const userId = user?._id || user?.id;
            if (userId) {
                api.sync.history.add(userId, historyItem).catch(err => console.error("Failed to sync history item", err));
            }
        }
    }, [activeTab, activeTabId, searchEngine, user, updateActiveTab]);

    const addTab = useCallback(() => {
        const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
        const newTabs = [...tabs, { id: newId, title: 'New Tab', url: '', history: [''], currentIndex: 0, zoom: 1 }];
        setTabs(newTabs);
        setActiveTabId(newId);
        if (user) syncData('tabs', newTabs);
    }, [tabs, user, syncData]);

    const closeTab = useCallback((id) => {
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
    }, [tabs, activeTabId, user, syncData]);

    const toggleBookmark = useCallback(() => {
        if (!activeTab?.url) return;
        const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
        let newBookmarks;
        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => b.url !== activeTab.url);
        } else {
            const cleaned = cleanTitle(activeTab.title || 'Bookmark');
            newBookmarks = [...bookmarks, { url: activeTab.url, title: cleaned }];
        }
        setBookmarks(newBookmarks);
        if (user) syncData('bookmarks', newBookmarks);
    }, [activeTab, bookmarks, user, syncData]);

    const updateShortcuts = useCallback((newShortcuts) => {
        setShortcuts(newShortcuts);
        if (user) syncData('shortcuts', newShortcuts);
    }, [user, syncData]);

    const updateTitle = useCallback((title) => {
        if (!activeTab || !title) return;
        updateActiveTab({ title });
        setGlobalHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > 0 && newHistory[0].url === activeTab.url) {
                newHistory[0].title = title;
            }
            return newHistory;
        });
    }, [activeTab, updateActiveTab]);

    const updateSearchEngine = useCallback((url) => {
        setSearchEngine(url);
        if (user) syncData('settings', { searchEngine: url });
    }, [user, syncData]);

    const clearHistory = useCallback(() => {
        setGlobalHistory([]);
        const userId = user?._id || user?.id;
        if (userId) {
            api.sync.history.clear(userId).catch(err => console.error("Failed to clear history", err));
        }
    }, [user]);

    const deleteHistoryItem = useCallback((itemId) => {
        setGlobalHistory(prev => prev.filter(item => item.id !== itemId));
        const userId = user?._id || user?.id;
        if (userId) {
            api.sync.history.deleteItem(userId, itemId).catch(err => console.error("Failed to delete history item", err));
        }
    }, [user]);

    const goBack = useCallback(() => {
        if (activeTab && activeTab.currentIndex > 0) {
            const newIndex = activeTab.currentIndex - 1;
            const newUrl = activeTab.history[newIndex];
            updateActiveTab({ currentIndex: newIndex, url: newUrl });
        }
    }, [activeTab, updateActiveTab]);

    const goForward = useCallback(() => {
        if (activeTab && activeTab.currentIndex < activeTab.history.length - 1) {
            const newIndex = activeTab.currentIndex + 1;
            const newUrl = activeTab.history[newIndex];
            updateActiveTab({ currentIndex: newIndex, url: newUrl });
        }
    }, [activeTab, updateActiveTab]);

    const refresh = useCallback(() => updateActiveTab({ lastRefresh: Date.now() }), [updateActiveTab]);

    const handleZoom = useCallback((type) => {
        let newZoom = activeTab.zoom || 1;
        if (type === 'in') newZoom = Math.min(newZoom + 0.1, 3);
        else if (type === 'out') newZoom = Math.max(newZoom - 0.1, 0.25);
        else if (type === 'reset') newZoom = 1;
        updateActiveTab({ zoom: newZoom });
    }, [activeTab, updateActiveTab]);

    const value = useMemo(() => ({
        tabs,
        activeTab,
        activeTabId,
        setActiveTabId,
        globalHistory,
        bookmarks,
        searchEngine,
        setSearchEngine: updateSearchEngine,
        shortcuts,
        syncError,
        isCurrentBookmarked: bookmarks.some(b => b.url === activeTab?.url),
        actions: {
            navigate,
            goBack,
            goForward,
            refresh,
            addTab,
            closeTab,
            clearHistory,
            deleteHistoryItem,
            toggleBookmark,
            handleZoom,
            updateShortcuts,
            updateTitle
        }
    }), [
        tabs, activeTab, activeTabId, globalHistory, bookmarks, searchEngine, shortcuts, syncError,
        navigate, goBack, goForward, refresh, addTab, closeTab, clearHistory, deleteHistoryItem, toggleBookmark, handleZoom, updateShortcuts, updateTitle, updateSearchEngine
    ]);

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
