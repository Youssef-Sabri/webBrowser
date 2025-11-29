import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock } from 'lucide-react';
import '../styles/AddressBar.css';

function AddressBar({ url, onUrlChange, onUrlSubmit }) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onUrlChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = inputValue.trim();
    if (trimmedUrl) {
      // Basic URL validation - add protocol if missing
      let formattedUrl = trimmedUrl;
      if (!trimmedUrl.match(/^https?:\/\//i)) {
        formattedUrl = 'https://' + trimmedUrl;
      }
      onUrlSubmit(formattedUrl);
      setInputValue(formattedUrl);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
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
    }
  };

  const isSecure = url && url.startsWith('https://');
  const displayUrl = url || '';

  return (
    <form 
      className={`address-bar ${isFocused ? 'focused' : ''}`}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Address bar"
    >
      <div className="address-bar-icon">
        {isSecure ? (
          <Lock size={16} aria-hidden="true" />
        ) : (
          <Search size={16} aria-hidden="true" />
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
        placeholder="Enter URL or search"
        aria-label="Address bar input"
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  );
}

export default AddressBar;

