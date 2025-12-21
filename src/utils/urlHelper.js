export const cleanTitle = (text) => {
  if (!text) return text;
  return text
    .replace(/ - Google Search$/i, '')
    .replace(/ - Search$/i, '')
    .replace(/ - Bing$/i, '')
    .replace(/ - Yahoo Search$/i, '')
    .replace(/ at DuckDuckGo$/i, '')
    .replace(/\s-\s.*Search$/i, '')
    .trim();
};

export const getQueryFromUrl = (urlStr) => {
  try {
    if (!urlStr) return null;
    const url = new URL(urlStr);
    const hostname = url.hostname.toLowerCase();
    const searchParams = url.searchParams;
    if (hostname.includes('google') || hostname.includes('bing') || hostname.includes('duckduckgo') || hostname.includes('yahoo') || hostname.includes('ecosia')) {
      const q = searchParams.get('q') || searchParams.get('query') || searchParams.get('p') || searchParams.get('term');
      if (q) return q;
    }
  } catch (e) {
    // Ignore invalid URLs
  }
  return null;
};

export const normalizeUrl = (input, searchEngineUrl) => {
  if (!input) return '';

  if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('file://')) {
    return input;
  }

  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  const localhostRegex = /^localhost(:\d+)?(\/.*)?$/;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;

  if (domainRegex.test(input) || localhostRegex.test(input) || ipRegex.test(input)) {
    return `https://${input}`;
  }

  // Otherwise treat as search query
  const searchUrl = searchEngineUrl || 'https://www.google.com/search?q=';
  return `${searchUrl}${encodeURIComponent(input)}`;
};

export const getDisplayTitle = (url) => {
  try {
    if (!url) return 'New Tab';
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
};
