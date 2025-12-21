// src/utils/constants.js

export const SEARCH_ENGINES = {
  GOOGLE: {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?hl=en&q=',
    suggestionUrl: 'https://suggestqueries.google.com/complete/search?client=firefox&q='
  },
  BING: {
    id: 'bing',
    name: 'Microsoft Bing',
    url: 'https://www.bing.com/search?setlang=en-us&q=',
    suggestionUrl: 'https://api.bing.com/osjson.aspx?query='
  },
  DUCKDUCKGO: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?kl=us-en&q=',
    suggestionUrl: 'https://duckduckgo.com/ac/?q='
  }
};

export const DEFAULT_SEARCH_ENGINE = SEARCH_ENGINES.GOOGLE.url;

export const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";