import api from './api';

export const authService = {
    /**
     * Login admin user
     */
    async login(email, password) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/api/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { access_token, refresh_token, user } = response.data;

        // Store tokens
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
