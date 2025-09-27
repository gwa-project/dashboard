// Authentication utilities
import { backend } from "../../url/config.js";

export class AuthManager {
    constructor() {
        this.tokenKey = 'gwa_access_token';
        this.refreshTokenKey = 'gwa_refresh_token';
        this.userKey = 'gwa_user_data';
    }

    // Store tokens securely
    setTokens(tokens) {
        if (tokens.access_token) {
            localStorage.setItem(this.tokenKey, tokens.access_token);
        }
        if (tokens.refresh_token) {
            localStorage.setItem(this.refreshTokenKey, tokens.refresh_token);
        }
    }

    // Get access token
    getAccessToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Get refresh token
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    // Store user data
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    // Get user data
    getUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getAccessToken();
    }

    // Clear all auth data
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
    }

    // Make authenticated request
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // If token expired, try to refresh
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    const newToken = this.getAccessToken();
                    const retryResponse = await fetch(url, {
                        ...options,
                        headers: {
                            ...headers,
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                    return retryResponse;
                }
                throw new Error('Authentication failed');
            }

            return response;
        } catch (error) {
            console.error('Authenticated request failed:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return false;
        }

        try {
            const response = await fetch(backend.auth.refresh, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.setTokens(result.data);
                    return true;
                }
            }

            // Refresh failed, logout user
            this.logout();
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            return false;
        }
    }

    // Regular login
    async login(email, password, rememberMe = false) {
        try {
            const response = await fetch(backend.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    remember_me: rememberMe
                })
            });

            const result = await response.json();

            if (result.success) {
                this.setTokens(result.data.tokens);
                this.setUser(result.data.user);
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Google OAuth login
    async googleLogin(googleToken, rememberMe = false) {
        try {
            const response = await fetch(backend.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    google_auth: true,
                    google_token: googleToken,
                    remember_me: rememberMe
                })
            });

            const result = await response.json();

            if (result.success) {
                this.setTokens(result.data.tokens);
                this.setUser(result.data.user);
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error || 'Google login failed' };
            }
        } catch (error) {
            console.error('Google login error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Register new user
    async register(name, email, password, phoneNumber = '') {
        try {
            const response = await fetch(backend.auth.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phonenumber: phoneNumber
                })
            });

            const result = await response.json();

            if (result.success) {
                this.setTokens(result.data.tokens);
                this.setUser(result.data.user);
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Server logout
    async serverLogout() {
        try {
            await this.makeAuthenticatedRequest(backend.auth.logout, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Server logout error:', error);
        } finally {
            this.logout();
        }
    }

    // Get user profile from server
    async getUserProfile() {
        try {
            const response = await this.makeAuthenticatedRequest(backend.user.data);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.setUser(result.data);
                    return result.data;
                }
            }
            return null;
        } catch (error) {
            console.error('Get user profile error:', error);
            return null;
        }
    }
}

// Create global auth manager instance
export const authManager = new AuthManager();