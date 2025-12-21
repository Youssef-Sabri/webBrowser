import { useState, useEffect } from 'react';
import { getCombinedSuggestions } from '../utils/suggestionHelper';
import { useBrowserContext } from '../contexts/BrowserContext';

const useSearchSuggestions = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { globalHistory, bookmarks, shortcuts, searchEngine } = useBrowserContext();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.trim() === '') {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const localData = { history: globalHistory, bookmarks, shortcuts };
                const results = await getCombinedSuggestions(query, localData, searchEngine);
                setSuggestions(results);
            } catch (err) {
                console.error("Error getting suggestions:", err);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300); // 300ms debounce
        return () => clearTimeout(debounceTimer);
    }, [query, globalHistory, bookmarks, shortcuts, searchEngine]);

    return { suggestions, isLoading };
};

export default useSearchSuggestions;
