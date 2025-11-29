import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock, Star, Share2, Check } from 'lucide-react';
import '../styles/AddressBar.css';

function AddressBar({ url, onUrlChange, onUrlSubmit, isBookmarked, onToggleBookmark }) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef(null);

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

  const handleCopy = async () => {
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search or enter address"
        autoComplete="off"
        spellCheck="false"
      />

      {/* Action Buttons Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Copy Button */}
        {url && (
          <button
            type="button"
            onClick={handleCopy}
            className="icon-btn"
            title="Copy Link"
            style={{ padding: '4px', display: 'flex', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            {isCopied ? <Check size={16} color="#69F0AE" /> : <Share2 size={16} />}
          </button>
        )}

        {/* Bookmark Toggle */}
        {url && (
          <button
            type="button"
            onClick={onToggleBookmark}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: isBookmarked ? '#FFD700' : 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark this page"}
          >
            <Star size={16} fill={isBookmarked ? "#FFD700" : "none"} />
          </button>
        )}
      </div>
    </form>
  );
}

export default AddressBar;