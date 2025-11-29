// src/components/SettingsModal.js
import React from 'react';
import { X, Settings, Search } from 'lucide-react';
import { SEARCH_ENGINES } from '../utils/constants'; // Import from constants
import '../styles/Browser.css';

function SettingsModal({ currentEngine, onSetEngine, onClose }) {
  // Convert the object to an array for mapping
  const enginesList = Object.values(SEARCH_ENGINES);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={20} />
            <h2>Settings</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="settings-body" style={{ padding: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
             <Search size={16} />
             <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default Search Engine</h3>
           </div>
           
           <div className="engine-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             {enginesList.map(engine => (
               <label 
                  key={engine.id} 
                  className="engine-option"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: currentEngine === engine.url ? 'var(--bg-tertiary)' : 'transparent',
                    border: '1px solid',
                    borderColor: currentEngine === engine.url ? 'var(--accent-color)' : 'var(--border-color)',
                    transition: 'all 0.2s'
                  }}
               >
                 <input 
                   type="radio" 
                   name="searchEngine" 
                   checked={currentEngine === engine.url} 
                   onChange={() => onSetEngine(engine.url)}
                   style={{ accentColor: 'var(--accent-color)' }}
                 />
                 <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{engine.name}</span>
               </label>
             ))}
           </div>
        </div>
        
        <div className="modal-footer">
          <button className="clear-btn" onClick={onClose} style={{ 
            color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)' 
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;