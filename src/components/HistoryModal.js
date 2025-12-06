import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import Modal from './Modal';
import '../styles/Browser.css';

function HistoryModal({ history, onClose, onClear, onNavigate }) {
  if (!history) return null;

  const footer = (
    <button className="clear-btn" onClick={onClear} disabled={history.length === 0}>
      <Trash2 size={16} />
      Clear Browsing Data
    </button>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="History" icon={Clock} footer={footer}>
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
    </Modal>
  );
}

export default HistoryModal;