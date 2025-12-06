// src/utils/constants.js

export const SEARCH_ENGINES = {
  GOOGLE: {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?hl=en&q='
  },
  BING: {
    id: 'bing',
    name: 'Microsoft Bing',
    url: 'https://www.bing.com/search?setlang=en-us&q='
  },
  DUCKDUCKGO: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?kl=us-en&q='
  }
};

// Set the default engine here
export const DEFAULT_SEARCH_ENGINE = SEARCH_ENGINES.GOOGLE.url;