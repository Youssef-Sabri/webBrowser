import { SEARCH_ENGINES } from './constants';
import { cleanTitle, getQueryFromUrl } from './urlHelper';

export const fetchApiSuggestions = async (query, searchEngineUrl) => {
    if (!query || query.trim().length < 2) return [];
    const engine = SEARCH_ENGINES.GOOGLE;

    try {
        const BACKEND_URL = process.env.REACT_APP_API_URL;

        const response = await fetch(`${BACKEND_URL}/suggestions?q=${encodeURIComponent(query)}&engine=${encodeURIComponent(engine.id)}`);

        if (!response.ok) return [];

        const data = await response.json();
        if (Array.isArray(data) && data.length >= 2 && Array.isArray(data[1])) {
            return data[1].map(item => ({
                type: 'search',
                text: typeof item === 'string' ? item : item.phrase,
            }));
        }

        return [];
    } catch (error) {
        console.warn('Failed to fetch suggestions:', error);
        return [];
    }
};

export const getLocalSuggestions = (query, { history = [], bookmarks = [], shortcuts = [] }) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    const processItem = (item, source) => {
        const searchQuery = getQueryFromUrl(item.url);

        const rawTitle = item.title || '';
        const cleanedTitle = cleanTitle(rawTitle);

        // If cleanTitle shortened the string, it means it stripped a search suffix
        const titleImpliesSearch = rawTitle.length > cleanedTitle.length;
        const effectiveQuery = searchQuery || (titleImpliesSearch ? cleanedTitle : null);

        const displayText = effectiveQuery || cleanedTitle || item.url;
        const isSearch = !!effectiveQuery;

        const urlToUse = isSearch ? null : item.url;
        const displayUrlToUse = isSearch ? null : item.url;

        return {
            type: source.toLowerCase(),
            text: displayText,
            url: urlToUse,
            displayUrl: displayUrlToUse,
            source: source
        };
    };




    const filterAndMap = (items, source, limit) => {
        return items
            .map(item => processItem(item, source))
            .filter(processed => processed.text && processed.text.toLowerCase().startsWith(lowerQuery));
    };

    const historyMatches = filterAndMap(history, 'History', 5);
    const bookmarkMatches = filterAndMap(bookmarks, 'Bookmark', 5);
    const shortcutMatches = filterAndMap(shortcuts, 'Shortcut', 5);

    const allMatches = [...shortcutMatches, ...bookmarkMatches, ...historyMatches];

    // De-duplicate local suggestions based on the DISPLAY TEXT mainly, or URL
    const uniqueMatches = [];
    const seenText = new Set();
    const seenUrl = new Set();

    for (const item of allMatches) {
        if (uniqueMatches.length >= 5) break;

        const textKey = item.text.toLowerCase();
        // Use a unique value for null/empty URLs to avoid collapsing them all
        // Or simply don't check seenUrl if it's empty
        const urlKey = (item.url || '').toLowerCase();

        if (seenText.has(textKey)) {
            continue;
        }

        // Only check URL uniqueness if we actually have a URL
        if (urlKey && seenUrl.has(urlKey)) {
            continue;
        }

        seenText.add(textKey);
        if (urlKey) seenUrl.add(urlKey);
        uniqueMatches.push(item);
    }

    return uniqueMatches;
};

export const getCombinedSuggestions = async (query, localData, searchEngineUrl) => {
    if (!query) return [];

    const local = getLocalSuggestions(query, localData);
    const api = await fetchApiSuggestions(query, searchEngineUrl);

    // De-duplicate based on text/url
    const seen = new Set();
    const combined = [...local, ...api].filter(item => {
        const key = (item.url || item.text).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return combined.slice(0, 8); // Limit total suggestions
};
