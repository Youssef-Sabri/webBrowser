import React from 'react';
import { X, Plus } from 'lucide-react';
import '../styles/Tabs.css';

function Tabs({ tabs, activeTabId, onTabChange, onTabClose, onAddTab }) {
  const handleTabClick = (tabId, e) => {
    if (e.target.closest('.tab-close-button')) {
      return; // Don't switch tabs if clicking close button
    }
    onTabChange(tabId);
  };

  const handleTabClose = (tabId, e) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  const getTabTitle = (tab) => {
    if (tab.url) {
      try {
        const url = new URL(tab.url);
        return url.hostname || 'New Tab';
      } catch {
        return tab.title || 'New Tab';
      }
    }
    return tab.title || 'New Tab';
  };

  return (
    <div className="tabs-container" role="tablist" aria-label="Browser tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.active ? 'active' : ''}`}
          role="tab"
          aria-selected={tab.active}
          aria-controls={`tab-panel-${tab.id}`}
          tabIndex={tab.active ? 0 : -1}
          onClick={(e) => handleTabClick(tab.id, e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTabClick(tab.id, e);
            }
          }}
        >
          <span className="tab-title">{getTabTitle(tab)}</span>
          <button
            className="tab-close-button"
            onClick={(e) => handleTabClose(tab.id, e)}
            aria-label={`Close ${getTabTitle(tab)} tab`}
            tabIndex={-1}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        className="tab-add-button"
        onClick={onAddTab}
        aria-label="Add new tab"
        title="New tab"
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default Tabs;

