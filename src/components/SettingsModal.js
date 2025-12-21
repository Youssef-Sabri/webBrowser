import React from 'react';
import { Settings, Search } from 'lucide-react';
import { SEARCH_ENGINES } from '../utils/constants';
import Modal from './Modal';
import '../styles/Browser.css';
import '../styles/SettingsModal.css';

function SettingsModal({ currentEngine, onSetEngine, onClose }) {
  // Convert the object to an array for mapping
  const enginesList = Object.values(SEARCH_ENGINES);

  const footer = (
    <button className="clear-btn sm-clear-btn" onClick={onClose}>
      Done
    </button>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Settings" icon={Settings} footer={footer}>
      <div className="settings-body">
        <div className="sm-section-header">
          <Search size={16} />
          <h3 className="sm-section-title">Default Search Engine</h3>
        </div>

        <div className="sm-engine-options">
          {enginesList.map(engine => (
            <label
              key={engine.id}
              className={`sm-engine-option ${currentEngine === engine.url ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="searchEngine"
                checked={currentEngine === engine.url}
                onChange={() => onSetEngine(engine.url)}
                className="sm-radio-input"
              />
              <span className="sm-engine-name">{engine.name}</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;
