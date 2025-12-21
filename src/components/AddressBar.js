import React, { useState, useEffect } from 'react';
import { Search, Lock, Star, Share2, Check } from 'lucide-react';
import SearchInput from './SearchInput'; // Shared component
import '../styles/AddressBar.css';

function AddressBar({ url, onUrlSubmit, isBookmarked, onToggleBookmark }) {
  const [inputValue, setInputValue] = useState(url);
  const [isCopied, setIsCopied] = useState(false);



  const [isUserTyping, setIsUserTyping] = useState(false);

  useEffect(() => {
    if (!isUserTyping) {
      setInputValue(url);
    }
  }, [url, isUserTyping]);

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

  const leftIcon = isSecure ? (
    <Lock size={14} aria-hidden="true" color="var(--success-color, #69F0AE)" />
  ) : (
    <Search size={14} aria-hidden="true" />
  );

  const rightActions = (
    <>
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
    </>
  );

  return (
    <div className="address-bar-container">
      <SearchInput
        className="address-input"
        variant="compact"
        value={inputValue}
        onChange={(val) => {
          setInputValue(val);
          setIsUserTyping(true);
        }}
        onSubmit={(val) => {
          onUrlSubmit(val);
          setIsUserTyping(false);
        }}
        onFocus={() => setIsUserTyping(true)}
        onBlur={() => setIsUserTyping(false)}
        leftIcon={leftIcon}
        rightActions={rightActions}
        placeholder="Search or enter address"
      />
    </div>
  );
}

export default AddressBar;