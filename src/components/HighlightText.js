import React from 'react';
import '../styles/AddressBar.css';

const HighlightText = ({ text, highlight, highlightClass = "suggestion-highlight", normalClass = "suggestion-normal" }) => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span className={normalClass}>{text}</span>;

    const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${safeHighlight})`, 'gi'));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className={highlightClass}>{part}</span>
                ) : (
                    <span key={i} className={normalClass}>{part}</span>
                )
            )}
        </>
    );
};

export default HighlightText;
