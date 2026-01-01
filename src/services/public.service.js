import api from './api';

export const publicService = {
    /**
     * Get all projects
     */
    async getProjects() {
        const response = await api.get('/api/public/projects');
        return response.data;
    },

    /**
     * Get project by ID
     */
    async getProject(id) {
        const response = await api.get(`/api/public/projects/${id}`);
        return response.data;
    },

    /**
     * Get all skills
     */
    async getSkills() {
        const response = await api.get('/api/public/skills');
        return response.data;
    },

    /**
     * Get all experience
     */
    async getExperience() {
        const response = await api.get('/api/public/experience');
        return response.data;
    },

    /**
     * Get all blogs
     */
    async getBlogs(publishedOnly = true) {
        const response = await api.get('/api/public/blogs', {
            params: { published_only: publishedOnly },
        });
        return response.data;
    },

    /**
     * Get blog by slug
     */
    async getBlog(slug) {
        const response = await api.get(`/api/public/blogs/${slug}`);
        return response.data;
    },

    /**
     * Get resume data
     */
    async getResume() {
        const response = await api.get('/api/public/resume');
        return response.data;
    },
};
