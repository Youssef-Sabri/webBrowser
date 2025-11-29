// src/utils/urlHelper.js
import { DEFAULT_SEARCH_ENGINE } from './constants';

export const normalizeUrl = (input, searchUrlBase = DEFAULT_SEARCH_ENGINE) => {
  if (!input) return '';
  
  let url = input.trim();
  if (url === '') return '';

  // Check for standard protocols
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
    return url;
  }
  
  // Handle localhost specifically
  if (url.startsWith('localhost')) {
    return `http://${url}`;
  }

  // Basic domain detection (e.g., example.com)
  const isDomain = url.includes('.') && !url.includes(' ');
  if (isDomain) {
    return `https://${url}`;
  }

  // Use the provided search engine URL base or the default
  return `${searchUrlBase}${encodeURIComponent(url)}`;
};

export const getDisplayTitle = (url) => {
  if (!url || url.trim() === '') return 'New Tab';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};