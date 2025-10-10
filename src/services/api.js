// API Service untuk connect ke GO-GCP Backend
const API_BASE_URL = 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function';

// Helper function untuk handle response
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Helper function untuk get token
const getToken = () => {
  return localStorage.getItem('gwa_access_token');
};

// Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        remember_me: true
      })
    });

    const data = await handleResponse(response);

    // Store tokens
    if (data.success && data.data?.tokens) {
      localStorage.setItem('gwa_access_token', data.data.tokens.access_token);
      if (data.data.tokens.refresh_token) {
        localStorage.setItem('gwa_refresh_token', data.data.tokens.refresh_token);
      }
      localStorage.setItem('gwa_user', JSON.stringify(data.data.user));
    }

    return data;
  },

  // Register
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const token = getToken();
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear local storage
    localStorage.removeItem('gwa_access_token');
    localStorage.removeItem('gwa_refresh_token');
    localStorage.removeItem('gwa_user');
  },

  // Get user profile
  getProfile: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Login': token,
        'Content-Type': 'application/json'
      }
    });

    return handleResponse(response);
  }
};

// User API
export const userAPI = {
  // Get all users
  getUsers: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Login': token
      }
    });

    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Login': token
      },
      body: JSON.stringify(userData)
    });

    return handleResponse(response);
  }
};

// QRIS Payment API
export const qrisAPI = {
  // Get user info for QRIS
  getUserInfo: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/userinfo`, {
      headers: {
        'Login': token
      }
    });

    return handleResponse(response);
  },

  // Check queue status
  checkQueueStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/queueStatus`);
    return handleResponse(response);
  },

  // Create QRIS order
  createOrder: async (amount) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/qris/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Login': token
      },
      body: JSON.stringify({ amount })
    });

    return handleResponse(response);
  },

  // Check payment status
  checkPaymentStatus: async (orderId) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/checkPayment/${orderId}`, {
      headers: {
        'Login': token
      }
    });

    return handleResponse(response);
  },

  // Get totals
  getTotals: async () => {
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/totals`);
    return handleResponse(response);
  }
};

// Export default API object
export default {
  auth: authAPI,
  user: userAPI,
  qris: qrisAPI,
  baseURL: API_BASE_URL
};
