import { Search, X } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import Modal from './Modal';
import '../styles/Browser.css';
import '../styles/HistoryModal.css';

function HistoryModal({ history, onClose, onClear, onNavigate, onDelete }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const lowerQuery = searchQuery.toLowerCase();
    return history.filter(item =>
      (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
      (item.url && item.url.toLowerCase().includes(lowerQuery))
    );
  }, [history, searchQuery]);

  if (!history) return null;

  const footer = (
    <button className="clear-btn" onClick={onClear} disabled={history.length === 0}>
      <Trash2 size={16} />
      Clear Browsing Data
    </button>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="History" icon={Clock} footer={footer}>
      <div className="history-search hm-search-container">
        <div className="hm-search-input-wrapper">
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hm-search-input"
          />
        </div>
      </div>
      <div className="history-list hm-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">{searchQuery ? 'No matching items found.' : 'No history yet.'}</div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div
                className="history-content hm-item-content"
                onClick={() => {
                  onNavigate(item.url);
                  onClose();
                }}
              >
                <div className="history-info">
                  <span className="history-time">{item.timestamp}</span>
                  <span className="history-url" title={item.title}>{item.title || item.url}</span>
                </div>
                <div className="history-link">{item.url}</div>
              </div>
              <button
                className="history-delete-btn hm-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                title="Remove from history"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}

export default HistoryModal;