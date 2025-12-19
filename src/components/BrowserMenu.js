import React, { useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, ZoomIn, ZoomOut, RotateCcw, Clock, Settings } from 'lucide-react';
import '../styles/Browser.css';

const BrowserMenu = ({
    isOpen,
    onClose,
    onToggle,
    activeTab,
    actions,
    onShowHistory,
    onShowSettings
}) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className="menu-container" ref={menuRef}>
            <button
                className={`toolbar-btn ${isOpen ? 'active' : ''}`}
                onClick={onToggle}
                title="Menu"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <div className="browser-menu">
                    <div className="menu-item" onClick={() => { actions.addTab(); onClose(); }}>
                        <Plus size={16} /> New Tab
                    </div>

                    <div className="menu-row">
                        <div className="zoom-controls" style={{ width: '100%', justifyContent: 'space-between', paddingLeft: '12px', paddingRight: '4px' }}>
                            <span className="menu-label">Zoom: {Math.round(activeTab.zoom * 100)}%</span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <button className="menu-icon-btn" onClick={() => actions.handleZoom('out')} title="Zoom Out">
                                    <ZoomOut size={16} />
                                </button>
                                <button className="menu-icon-btn" onClick={() => actions.handleZoom('reset')} title="Reset Zoom">
                                    <RotateCcw size={14} />
                                </button>
                                <button className="menu-icon-btn" onClick={() => actions.handleZoom('in')} title="Zoom In">
                                    <ZoomIn size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="menu-separator"></div>

                    <div className="menu-item" onClick={() => { onShowHistory(); onClose(); }}>
                        <Clock size={16} /> History
                    </div>
                    <div className="menu-item" onClick={() => { onShowSettings(); onClose(); }}>
                        <Settings size={16} /> Settings
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowserMenu;
