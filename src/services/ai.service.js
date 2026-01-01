import api from './api';

export const aiService = {
    /**
     * Send chat message
     */
    async chat(message, chatHistory = []) {
        const response = await api.post('/api/ai/chat', {
            message,
            chat_history: chatHistory,
        });
        return response.data;
    },

    /**
     * Perform AI search
     */
    async search(query, filters = null) {
        const response = await api.post('/api/ai/search', {
            query,
            filters,
        });
        return response.data;
    },

    /**
     * Get search suggestions
     */
    async getSuggestions(query, limit = 5) {
        const response = await api.get('/api/ai/suggestions', {
            params: { q: query, limit },
        });
        return response.data.suggestions;
    },
};
