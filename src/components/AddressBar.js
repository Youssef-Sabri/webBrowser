import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock, Star, Share2, Check, Clock, Hash } from 'lucide-react';
import useSearchSuggestions from '../hooks/useSearchSuggestions';
import '../styles/AddressBar.css';
import HighlightText from './HighlightText';

function AddressBar({ url, onUrlSubmit, isBookmarked, onToggleBookmark }) {
  const [inputValue, setInputValue] = useState(url);
  const [isFocused, setIsFocused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  // Custom hook for suggestions
  const { suggestions, isLoading } = useSearchSuggestions(isFocused ? inputValue : '');

  useEffect(() => {
    // Only update input if we aren't focused to avoid overwriting user interactions
    if (!isFocused) {
      setInputValue(url);
    }
  }, [url, isFocused]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1); // Reset selection on typing
  };

  const handleSuggestionClick = (suggestion) => {
    const value = suggestion.url || suggestion.text;
    setInputValue(value);
    onUrlSubmit(value);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSuggestionClick(suggestions[selectedIndex]);
    } else {
      onUrlSubmit(inputValue);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      setIsFocused(false);
    }
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

  const getIconForSuggestion = (type) => {
    switch (type) {
      case 'history': return <Clock size={14} className="suggestion-icon history" />;
      case 'bookmark': return <Star size={14} className="suggestion-icon bookmark" />;
      case 'shortcut': return <Hash size={14} className="suggestion-icon shortcut" />;
      default: return <Search size={14} className="suggestion-icon search" />;
    }
  };

  const isSecure = url && url.startsWith('https://');

  return (
    <div className="address-bar-container">
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
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          /* Delay blur to allow click on suggestion to register */
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search or enter address"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Action Buttons Container */}
        <div className="address-bar-actions">
          {/* Copy Button */}
          {url && (
            <button
              type="button"
              onClick={handleCopy}
              className="action-btn"
              title="Copy Link"
            >
              {isCopied ? <Check size={16} color="#69F0AE" /> : <Share2 size={16} />}
            </button>
          )}

          {/* Bookmark Toggle */}
          {url && (
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`action-btn ${isBookmarked ? 'active' : ''}`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark this page"}
            >
              <Star size={16} fill={isBookmarked ? "#FFD700" : "none"} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && (suggestions.length > 0 || isLoading) && (
        <div className="suggestions-dropdown">
          {suggestions.map((item, index) => {


            return (
              <div
                key={index}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="suggestion-icon-wrapper">
                  {getIconForSuggestion(item.type)}
                </span>
                <div className="suggestion-content">
                  <span className="suggestion-text">
                    <HighlightText text={item.text} highlight={inputValue} />
                  </span>
                  <span className="suggestion-secondary">
                    {item.displayUrl || item.source}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

export default AddressBar;