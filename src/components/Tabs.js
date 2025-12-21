import React from 'react';
import { X, Plus } from 'lucide-react';
import { getDisplayTitle } from '../utils/urlHelper';
import '../styles/Tabs.css';

function Tabs({ tabs, activeTabId, onTabChange, onTabClose, onAddTab }) {
  const handleTabClick = (tabId, e) => {
    if (e.target.closest('.tab-close-button')) {
      return;
    }
    onTabChange(tabId);
  };

  const handleTabClose = (tabId, e) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="tabs-container" role="tablist" aria-label="Browser tabs">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={`tab ${isActive ? 'active' : ''}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => handleTabClick(tab.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTabClick(tab.id, e);
              }
            }}
          >
            <span className="tab-title">{tab.title || getDisplayTitle(tab.url)}</span>
            <button
              className="tab-close-button"
              onClick={(e) => handleTabClose(tab.id, e)}
              aria-label="Close tab"
              tabIndex={-1}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
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