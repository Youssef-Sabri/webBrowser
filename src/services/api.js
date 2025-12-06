const BACKEND_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  register: async (username, password, email) => {
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    return handleResponse(res);
  },

  getUser: async (userId) => {
    const res = await fetch(`${BACKEND_URL}/user/${userId}`);
    return handleResponse(res);
  },

  // Sync methods
  sync: {
    history: {
      add: async (userId, item) => {
        return fetch(`${BACKEND_URL}/user/${userId}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      },
      clear: async (userId) => {
        return fetch(`${BACKEND_URL}/user/${userId}/history`, { method: 'DELETE' });
      }
    },
    
    update: async (userId, endpoint, data) => {
      // General purpose sync for tabs, bookmarks, shortcuts, settings
      return fetch(`${BACKEND_URL}/user/${userId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  }
};
