import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import '../styles/WindowControls.css';

const WindowControls = () => {
    const handleMinimize = () => {
        if (window.electron) window.electron.minimize();
    };

    const handleMaximize = () => {
        if (window.electron) window.electron.maximize();
    };

    const handleClose = () => {
        if (window.electron) window.electron.close();
    };

    // If we are not in Electron (e.g. standard browser dev), these won't work
    if (!window.electron) return null;

    return (
        <div className="window-controls">
            <button className="control-btn minimize" onClick={handleMinimize} title="Minimize">
                <Minus size={12} />
            </button>
            <button className="control-btn maximize" onClick={handleMaximize} title="Maximize">
                <Square size={12} />
            </button>
            <button className="control-btn close" onClick={handleClose} title="Close">
                <X size={12} />
            </button>
        </div>
    );
};

export default WindowControls;
