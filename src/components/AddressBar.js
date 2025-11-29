import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock } from 'lucide-react';
import '../styles/AddressBar.css';

function AddressBar({ url, onUrlChange, onUrlSubmit }) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Sync internal state when parent URL changes (e.g., from Back/Forward navigation)
  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (onUrlChange) {
      onUrlChange(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUrlSubmit(inputValue);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Auto-select text on focus for easier typing
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      // Revert to current page URL on escape
      setInputValue(url);
    }
  };

  const isSecure = url && url.startsWith('https://');

  return (
    <form 
      className={`address-bar ${isFocused ? 'focused' : ''}`}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Address bar"
    >
      <div className="address-bar-icon">
        {isSecure ? (
          <Lock size={14} aria-hidden="true" color="var(--success-color, #69F0AE)" />
        ) : (
          <Search size={14} aria-hidden="true" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="address-bar-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search or enter address"
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  );
}

export default AddressBar;