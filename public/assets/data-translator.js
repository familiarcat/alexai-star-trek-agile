/**
 * Data Translator - Unified Data Translation Layer
 * Ensures consistent data presentation across all UI components
 * Handles data fetching, transformation, and rendering
 */

class DataTranslator {
    constructor() {
        this.cache = new Map();
        this.subscribers = new Map();
        this.baseURL = window.location.origin;
        this.socket = null;
        this.initSocket();
    }

    // Initialize Socket.IO connection
    initSocket() {
        if (typeof io !== 'undefined') {
            this.socket = io();
            this.setupSocketListeners();
        }
    }

    // Setup Socket.IO event listeners
    setupSocketListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('DataTranslator: Connected to server');
        });

        this.socket.on('project_updated', (data) => {
            this.notifySubscribers('projects', data);
            this.invalidateCache('projects');
        });

        this.socket.on('task_updated', (data) => {
            this.notifySubscribers('tasks', data);
            this.invalidateCache('tasks');
        });

        this.socket.on('dashboard_updated', (data) => {
            this.notifySubscribers('dashboard', data);
            this.invalidateCache('dashboard');
        });
    }

    // Generic API request method
    async apiRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        try {
            const response = await fetch(url, defaultOptions);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error(`DataTranslator API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // Cache management
    setCache(key, data, ttl = 30000) { // 30 second default TTL
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    invalidateCache(key) {
        this.cache.delete(key);
    }

    // Subscriber management
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(key);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    notifySubscribers(key, data) {
        const callbacks = this.subscribers.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('DataTranslator subscriber error:', error);
                }
            });
        }
    }

    // Dashboard data methods
    async getDashboardStats() {
        const cacheKey = 'dashboard_stats';
        let data = this.getCache(cacheKey);
        
        if (!data) {
            data = await this.apiRequest('/api/dashboard/stats');
            this.setCache(cacheKey, data);
        }
        
        return this.transformDashboardStats(data.stats);
    }

    transformDashboardStats(stats) {
        return {
            total_projects: stats.total_projects || 0,
            total_tasks: stats.total_tasks || 0,
            active_tasks: stats.active_tasks || 0,
            completed_tasks: stats.completed_tasks || 0,
            completed_today: stats.completed_today || 0,
            active_projects: stats.active_projects || 0,
            completed_projects: stats.completed_projects || 0
        };
    }

    // Projects data methods
    async getProjects() {
        const cacheKey = 'projects';
        let data = this.getCache(cacheKey);
        
        if (!data) {
            data = await this.apiRequest('/api/projects');
            this.setCache(cacheKey, data);
        }
        
        return this.transformProjects(data.projects);
    }

    transformProjects(projects) {
        return projects.map(project => ({
            id: project.id,
            name: project.name || 'Unnamed Project',
            description: project.description || 'No description available',
            project_type: project.project_type || 'Unknown',
            status: project.status || 'unknown',
            team_members: Array.isArray(project.team_members) ? project.team_members : [],
            tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
            created_at: project.created_at,
            updated_at: project.updated_at,
            deployment_url: project.deployment_url,
            repository_url: project.repository_url
        }));
    }

    async getProject(id) {
        const cacheKey = `project_${id}`;
        let data = this.getCache(cacheKey);
        
        if (!data) {
            data = await this.apiRequest(`/api/projects/${id}`);
            this.setCache(cacheKey, data);
        }
        
        return this.transformProjects([data.project])[0];
    }

    // Tasks data methods
    async getTasks(projectId = null) {
        const cacheKey = projectId ? `tasks_${projectId}` : 'tasks';
        let data = this.getCache(cacheKey);
        
        if (!data) {
            data = await this.apiRequest('/api/tasks');
            this.setCache(cacheKey, data);
        }
        
        let tasks = this.transformTasks(data.tasks);
        
        if (projectId) {
            tasks = tasks.filter(task => task.project_id === projectId);
        }
        
        return tasks;
    }

    transformTasks(tasks) {
        return tasks.map(task => ({
            id: task.id,
            title: task.title || 'Untitled Task',
            description: task.description || 'No description',
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            assignee: task.assignee || 'Unassigned',
            project_id: task.project_id,
            created_at: task.created_at,
            updated_at: task.updated_at,
            due_date: task.due_date,
            story_points: task.story_points || 0,
            tags: Array.isArray(task.tags) ? task.tags : (task.tags ? task.tags.split(',') : []),
            dependencies: Array.isArray(task.dependencies) ? task.dependencies : []
        }));
    }

    // AlexAI data methods
    async getAlexAIStatus() {
        const cacheKey = 'alexai_status';
        let data = this.getCache(cacheKey);
        
        if (!data) {
            data = await this.apiRequest('/api/alexai/status');
            this.setCache(cacheKey, data);
        }
        
        return this.transformAlexAIStatus(data);
    }

    transformAlexAIStatus(data) {
        return {
            crew_status: data.crew_status || {},
            system_health: data.system_health || {},
            current_mode: data.crew_status?.current_mode || 'collaborative',
            active_crew_members: data.crew_status?.active_crew_members || 0,
            total_consultations: data.crew_status?.total_consultations || 0
        };
    }

    // Project insights
    async getProjectInsights(projectId) {
        try {
            const data = await this.apiRequest(`/api/projects/${projectId}/insights`);
            return this.transformInsights(data.insights);
        } catch (error) {
            console.error('Error getting project insights:', error);
            return { error: 'Unable to get insights at this time' };
        }
    }

    transformInsights(insights) {
        return Object.entries(insights).map(([key, insight]) => ({
            crew_member: key,
            insight: insight,
            timestamp: new Date().toISOString()
        }));
    }

    // Mock data creation
    async createMockData() {
        try {
            const data = await this.apiRequest('/api/database/mock', { method: 'POST' });
            this.invalidateAllCache();
            return data;
        } catch (error) {
            console.error('Error creating mock data:', error);
            throw error;
        }
    }

    // Cache invalidation
    invalidateAllCache() {
        this.cache.clear();
    }

    // UI rendering helpers
    renderMetrics(containerId, metrics) {
        const container = document.getElementById(containerId);
        if (!container) return;

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }

    renderProjectsList(containerId, projects) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = `
                <div class="lcars-text-center lcars-text-grey">
                    <i class="fas fa-inbox lcars-mr-10"></i>
                    No missions available. Initialize data to begin.
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => this.renderProjectCard(project)).join('');
    }

    renderProjectCard(project) {
        return `
            <div class="lcars-panel lcars-mb-10" onclick="dataTranslator.selectProject('${project.id}')">
                <div class="lcars-text lcars-text-large lcars-text-gold lcars-mb-10">
                    <i class="fas fa-project-diagram lcars-mr-10"></i>
                    ${this.escapeHtml(project.name)}
                </div>
                
                <div class="lcars-text lcars-mb-10">
                    ${this.escapeHtml(project.description)}
                </div>
                
                <div class="lcars-data-grid">
                    <div class="lcars-l-shape">
                        <i class="fas fa-tag lcars-mr-10"></i>
                        TYPE: ${project.project_type.toUpperCase()}
                    </div>
                    
                    <div class="lcars-l-shape">
                        <i class="fas fa-signal lcars-mr-10"></i>
                        STATUS: ${project.status.replace('_', ' ').toUpperCase()}
                    </div>
                    
                    <div class="lcars-l-shape">
                        <i class="fas fa-users lcars-mr-10"></i>
                        TEAM: ${project.team_members.length} MEMBERS
                    </div>
                    
                    <div class="lcars-l-shape">
                        <i class="fas fa-code lcars-mr-10"></i>
                        TECH: ${project.tech_stack.length} STACKS
                    </div>
                </div>
                
                <div class="lcars-data-grid lcars-mt-10">
                    <div class="lcars-button secondary" onclick="event.stopPropagation(); dataTranslator.openProjectDetails('${project.id}')">
                        <i class="fas fa-eye lcars-mr-10"></i>
                        DETAILS
                    </div>
                    
                    <div class="lcars-button secondary" onclick="event.stopPropagation(); dataTranslator.getProjectInsights('${project.id}')">
                        <i class="fas fa-robot lcars-mr-10"></i>
                        AI INSIGHTS
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    selectProject(projectId) {
        // Highlight selected project
        document.querySelectorAll('.lcars-panel').forEach(panel => {
            panel.style.borderColor = 'var(--lcars-gold)';
        });
        event.currentTarget.style.borderColor = 'var(--lcars-orange)';
        
        // Store selected project
        this.selectedProjectId = projectId;
    }

    async openProjectDetails(projectId) {
        try {
            const project = await this.getProject(projectId);
            const detailsContainer = document.getElementById('project-details');
            
            if (detailsContainer) {
                detailsContainer.innerHTML = this.renderProjectDetails(project);
                document.getElementById('project-modal').style.display = 'block';
                this.selectedProjectId = projectId;
            }
        } catch (error) {
            console.error('Error loading project details:', error);
        }
    }

    renderProjectDetails(project) {
        return `
            <div class="lcars-text lcars-text-xlarge lcars-text-gold lcars-mb-15">
                ${this.escapeHtml(project.name)}
            </div>
            
            <div class="lcars-text lcars-mb-15">
                ${this.escapeHtml(project.description)}
            </div>
            
            <div class="lcars-data-grid">
                <div class="lcars-l-shape">
                    <i class="fas fa-tag lcars-mr-10"></i>
                    PROJECT TYPE: ${project.project_type.toUpperCase()}
                </div>
                
                <div class="lcars-l-shape">
                    <i class="fas fa-signal lcars-mr-10"></i>
                    STATUS: ${project.status.replace('_', ' ').toUpperCase()}
                </div>
                
                <div class="lcars-l-shape">
                    <i class="fas fa-calendar lcars-mr-10"></i>
                    CREATED: ${new Date(project.created_at).toLocaleDateString()}
                </div>
                
                <div class="lcars-l-shape">
                    <i class="fas fa-clock lcars-mr-10"></i>
                    UPDATED: ${new Date(project.updated_at).toLocaleDateString()}
                </div>
            </div>
            
            ${project.team_members.length > 0 ? `
                <div class="lcars-text lcars-text-large lcars-text-gold lcars-mt-15 lcars-mb-10">
                    <i class="fas fa-users lcars-mr-10"></i>
                    MISSION TEAM
                </div>
                <div class="lcars-text lcars-mb-15">
                    ${project.team_members.join(', ')}
                </div>
            ` : ''}
            
            ${project.tech_stack.length > 0 ? `
                <div class="lcars-text lcars-text-large lcars-text-gold lcars-mb-10">
                    <i class="fas fa-code lcars-mr-10"></i>
                    TECHNOLOGY STACK
                </div>
                <div class="lcars-text lcars-mb-15">
                    ${project.tech_stack.join(', ')}
                </div>
            ` : ''}
        `;
    }
}

// Global instance
window.dataTranslator = new DataTranslator(); 