const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  // Onboarding Tasks
  getOnboardingTasks() {
    return this.request('/onboarding-tasks');
  }

  createOnboardingTask(task) {
    return this.request('/onboarding-tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  updateOnboardingTask(id, updates) {
    return this.request(`/onboarding-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  deleteOnboardingTask(id) {
    return this.request(`/onboarding-tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Surveys
  getSurveys() {
    return this.request('/surveys');
  }

  getSurveyStats() {
    return this.request('/surveys/stats');
  }

  createSurvey(survey) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
  }

  // Documentation Tasks
  getDocTasks() {
    return this.request('/doc-tasks');
  }

  createDocTask(task) {
    return this.request('/doc-tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  updateDocTask(id, updates) {
    return this.request(`/doc-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  deleteDocTask(id) {
    return this.request(`/doc-tasks/${id}`, {
      method: 'DELETE',
    });
  }

  generateAISuggestion(data) {
    return this.request('/doc-tasks/ai-suggestion', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Work Items
  getWorkItems() {
    return this.request('/work-items');
  }

  createWorkItem(item) {
    return this.request('/work-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  updateWorkItem(id, updates) {
    return this.request(`/work-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  deleteWorkItem(id) {
    return this.request(`/work-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Governance Checks
  getGovernanceChecks() {
    return this.request('/governance-checks');
  }

  createGovernanceCheck(check) {
    return this.request('/governance-checks', {
      method: 'POST',
      body: JSON.stringify(check),
    });
  }

  updateGovernanceCheck(id, updates) {
    return this.request(`/governance-checks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  deleteGovernanceCheck(id) {
    return this.request(`/governance-checks/${id}`, {
      method: 'DELETE',
    });
  }

  // SharePoint Migration
  getSharePointSites() {
    return this.request('/sharepoint-migration/sites');
  }

  getSharePointSiteContent(siteId) {
    return this.request(`/sharepoint-migration/sites/${siteId}/content`);
  }

  getGraphConfig() {
    return this.request('/sharepoint-migration/config');
  }

  // Summary/Dashboard
  getDashboardSummary() {
    return this.request('/summary');
  }
}

export default new ApiService();
