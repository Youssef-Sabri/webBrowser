import React from 'react';
import { X, Clock, Trash2 } from 'lucide-react';
import '../styles/Browser.css'; 

function HistoryModal({ history, onClose, onClear, onNavigate }) {
  if (!history) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Clock size={20} />
            <h2>History</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">No history yet.</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => {
                onNavigate(item.url);
                onClose();
              }}>
                <div className="history-info">
                  <span className="history-time">{item.timestamp}</span>
                  <span className="history-url">{item.title}</span>
                </div>
                <div className="history-link">{item.url}</div>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button className="clear-btn" onClick={onClear} disabled={history.length === 0}>
            <Trash2 size={16} />
            Clear Browsing Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;