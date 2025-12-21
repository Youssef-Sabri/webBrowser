import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, Star, Hash } from 'lucide-react';
import useSearchSuggestions from '../hooks/useSearchSuggestions';
import HighlightText from './HighlightText';
import '../styles/SearchInput.css';

const SuggestionIcon = ({ type }) => {
    switch (type) {
        case 'history': return <Clock size={14} className="suggestion-icon history" />;
        case 'bookmark': return <Star size={14} className="suggestion-icon bookmark" />;
        case 'shortcut': return <Hash size={14} className="suggestion-icon shortcut" />;
        default: return <Search size={14} className="suggestion-icon search" />;
    }
};

const SearchInput = ({
    value,
    onChange,
    onSubmit,
    placeholder,
    autoFocus = false,
    variant = 'compact', // 'compact' | 'large'
    leftIcon,
    rightActions,
    className = '',
    autoComplete = 'off',
    spellCheck = 'false',
    onFocus,
    onBlur
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);

    const { suggestions, isLoading } = useSearchSuggestions(isFocused ? value : '');

    // Reset selection when typing
    useEffect(() => {
        setSelectedIndex(-1);
    }, [value]);

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
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSuggestionClick(suggestions[selectedIndex]);
            } else {
                onSubmit(value);
                inputRef.current?.blur();
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const newValue = suggestion.url || suggestion.text;
        onChange(newValue);
        onSubmit(newValue);
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className={`search-input-container ${variant} ${className}`}>
            <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
                {leftIcon && (
                    <div className="search-input-icon left">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="text"
                    className="search-input-field"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        setIsFocused(true);
                        if (onFocus) onFocus();
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setIsFocused(false);
                            if (onBlur) onBlur();
                        }, 200);
                    }}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    spellCheck={spellCheck}
                />

                {rightActions && (
                    <div className="search-input-actions right">
                        {rightActions}
                    </div>
                )}
            </div>

            {isFocused && (suggestions.length > 0 || isLoading) && (
                <div className="suggestions-dropdown">
                    {suggestions.map((item, index) => (
                        <div
                            key={index}
                            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(item)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <span className="suggestion-icon-wrapper">
                                <SuggestionIcon type={item.type} />
                            </span>
                            <div className="suggestion-content">
                                <span className="suggestion-text">
                                    <HighlightText
                                        text={item.text}
                                        highlight={value}
                                        highlightClass={variant === 'large' ? 'sp-highlight-match' : undefined}
                                        normalClass={variant === 'large' ? 'sp-highlight-normal' : undefined}
                                    />
                                </span>
                                <span className="suggestion-secondary">
                                    {item.displayUrl || item.source}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput;
