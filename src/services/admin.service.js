import api from './api';

export const adminService = {
    // Projects
    async createProject(projectData) {
        const response = await api.post('/api/admin/projects', projectData);
        return response.data;
    },
    async updateProject(id, projectData) {
        const response = await api.put(`/api/admin/projects/${id}`, projectData);
        return response.data;
    },
    async deleteProject(id) {
        const response = await api.delete(`/api/admin/projects/${id}`);
        return response.data;
    },

    // Skills
    async createSkill(skillData) {
        const response = await api.post('/api/admin/skills', skillData);
        return response.data;
    },
    async updateSkill(id, skillData) {
        const response = await api.put(`/api/admin/skills/${id}`, skillData);
        return response.data;
    },
    async deleteSkill(id) {
        const response = await api.delete(`/api/admin/skills/${id}`);
        return response.data;
    },

    // Experience
    async createExperience(experienceData) {
        const response = await api.post('/api/admin/experience', experienceData);
        return response.data;
    },
    async updateExperience(id, experienceData) {
        const response = await api.put(`/api/admin/experience/${id}`, experienceData);
        return response.data;
    },
    async deleteExperience(id) {
        const response = await api.delete(`/api/admin/experience/${id}`);
        return response.data;
    },

    // Blogs
    async createBlog(blogData) {
        const response = await api.post('/api/admin/blogs', blogData);
        return response.data;
    },
    async updateBlog(id, blogData) {
        const response = await api.put(`/api/admin/blogs/${id}`, blogData);
        return response.data;
    },
    async deleteBlog(id) {
        const response = await api.delete(`/api/admin/blogs/${id}`);
        return response.data;
    },

    // Resume
    async updateResume(resumeData) {
        const response = await api.put('/api/admin/resume', resumeData);
        return response.data;
    },

    // Reindex
    async reindexKnowledgeBase() {
        const response = await api.post('/api/admin/reindex');
        return response.data;
    },
};
