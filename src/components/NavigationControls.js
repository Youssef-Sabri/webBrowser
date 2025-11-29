import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react';
import '../styles/NavigationControls.css';

function NavigationControls({ onBack, onForward, onRefresh, onHome, canGoBack, canGoForward }) {
  return (
    <div className="navigation-controls" role="toolbar" aria-label="Navigation controls">
      <button
        className="nav-button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeft size={18} aria-hidden="true" />
      </button>
      <button
        className="nav-button"
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Go forward"
        title="Go forward"
      >
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      <button
        className="nav-button"
        onClick={onRefresh}
        aria-label="Refresh page"
        title="Refresh page"
      >
        <RotateCw size={18} aria-hidden="true" />
      </button>
      <button
        className="nav-button"
        onClick={onHome}
        aria-label="Go to home page"
        title="Go to home page"
      >
        <Home size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export default NavigationControls;