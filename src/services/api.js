const BACKEND_URL = process.env.REACT_APP_API_URL;

const request = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const api = {
  // Auth
  login: (username, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  register: (username, password, email) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email })
    }),

  getUser: (userId) =>
    request(`/user/${userId}`),

  // Sync methods
  sync: {
    history: {
      add: (userId, item) =>
        request(`/user/${userId}/history`, {
          method: 'POST',
          body: JSON.stringify(item)
        }),

      clear: (userId) =>
        request(`/user/${userId}/history`, { method: 'DELETE' }),

      deleteItem: (userId, itemId) =>
        request(`/user/${userId}/history/${itemId}`, { method: 'DELETE' })
    },

    update: (userId, endpoint, data) =>
      request(`/user/${userId}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
  }
};
