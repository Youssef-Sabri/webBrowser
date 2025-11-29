import React, { useState } from 'react';
import NavigationControls from './NavigationControls';
import AddressBar from './AddressBar';
import Tabs from './Tabs';
import BrowserView from './BrowserView';
import '../styles/Browser.css';

function BrowserWindow() {
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: '', active: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleBack = () => {
    // Placeholder for back functionality
    console.log('Back button clicked');
  };

  const handleForward = () => {
    // Placeholder for forward functionality
    console.log('Forward button clicked');
  };

  const handleRefresh = () => {
    // Placeholder for refresh functionality
    console.log('Refresh button clicked');
  };

  const handleHome = () => {
    // Placeholder for home functionality
    setCurrentUrl('');
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.active ? { ...tab, url: '' } : tab
    ));
    console.log('Home button clicked');
  };

  const handleUrlChange = (url) => {
    setCurrentUrl(url);
  };

  const handleUrlSubmit = (url) => {
    // Update the active tab with the new URL
    setCurrentUrl(url);
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.active ? { ...tab, url: url } : tab
    ));
    console.log('Navigating to:', url);
  };

  const handleTabChange = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prevTabs => {
      const activeTab = prevTabs.find(tab => tab.id === tabId);
      if (activeTab) {
        setCurrentUrl(activeTab.url || '');
      }
      return prevTabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      }));
    });
  };

  const handleTabClose = (tabId) => {
    setTabs(prevTabs => {
      if (prevTabs.length === 1) return prevTabs; // Don't close the last tab
      
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      const wasActive = prevTabs.find(tab => tab.id === tabId)?.active;
      
      if (wasActive && newTabs.length > 0) {
        newTabs[0].active = true;
        setActiveTabId(newTabs[0].id);
        setCurrentUrl(newTabs[0].url || '');
      }
      
      return newTabs;
    });
  };

  const handleAddTab = () => {
    setTabs(prevTabs => {
      const newTabId = Math.max(...prevTabs.map(t => t.id), 0) + 1;
      const newTabs = prevTabs.map(tab => ({ ...tab, active: false }));
      newTabs.push({ id: newTabId, title: 'New Tab', url: '', active: true });
      setActiveTabId(newTabId);
      setCurrentUrl('');
      return newTabs;
    });
  };

  const activeTab = tabs.find(tab => tab.active) || tabs[0];

  return (
    <div className="browser-window" role="application" aria-label="Web Browser">
      <div className="browser-toolbar">
        <NavigationControls
          onBack={handleBack}
          onForward={handleForward}
          onRefresh={handleRefresh}
          onHome={handleHome}
        />
        <AddressBar
          url={currentUrl}
          onUrlChange={handleUrlChange}
          onUrlSubmit={handleUrlSubmit}
        />
      </div>
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        onAddTab={handleAddTab}
      />
      <BrowserView url={activeTab?.url || currentUrl} />
    </div>
  );
}

export default BrowserWindow;

