/**
 * AgileProjectManager - JavaScript Version
 * Manages projects, tasks, and database operations
 */

const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class AgileProjectManager {
  constructor(dbPath = 'agile_manager.db') {
    this.dbPath = path.join(__dirname, '..', '..', dbPath);
    this.db = null;
    this.initDatabase();
  }

  initDatabase() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        return;
      }
      console.log('Connected to SQLite database');
      this.createTables();
    });
  }

  createTables() {
    const projectsTable = `
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        project_type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT,
        team_members TEXT,
        tech_stack TEXT,
        deployment_url TEXT,
        repository_url TEXT,
        environment_variables TEXT
      )
    `;

    const tasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        assignee TEXT,
        project_id TEXT,
        created_at TEXT,
        updated_at TEXT,
        due_date TEXT,
        tags TEXT,
        story_points INTEGER,
        dependencies TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `;

    const sprintsTable = `
      CREATE TABLE IF NOT EXISTS sprints (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        start_date TEXT,
        end_date TEXT,
        project_id TEXT,
        goals TEXT,
        velocity INTEGER,
        created_at TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `;

    this.db.serialize(() => {
      this.db.run(projectsTable);
      this.db.run(tasksTable);
      this.db.run(sprintsTable);
    });
  }

  async getProjects() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM projects', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          team_members: row.team_members ? JSON.parse(row.team_members) : [],
          tech_stack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
          environment_variables: row.environment_variables ? JSON.parse(row.environment_variables) : {}
        })));
      });
    });
  }

  async createProject(projectData) {
    const project = {
      id: uuidv4(),
      name: projectData.name,
      description: projectData.description,
      project_type: projectData.project_type,
      status: projectData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      team_members: JSON.stringify(projectData.team_members || []),
      tech_stack: JSON.stringify(projectData.tech_stack || []),
      deployment_url: projectData.deployment_url,
      repository_url: projectData.repository_url,
      environment_variables: JSON.stringify(projectData.environment_variables || {})
    };

    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        Object.values(project),
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ ...project, team_members: JSON.parse(project.team_members), tech_stack: JSON.parse(project.tech_stack) });
        }
      );
    });
  }

  async getTasks(projectId = null) {
    return new Promise((resolve, reject) => {
      const query = projectId ? 'SELECT * FROM tasks WHERE project_id = ?' : 'SELECT * FROM tasks';
      const params = projectId ? [projectId] : [];
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          tags: row.tags ? JSON.parse(row.tags) : [],
          dependencies: row.dependencies ? JSON.parse(row.dependencies) : []
        })));
      });
    });
  }

  async createTask(taskData) {
    const task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      assignee: taskData.assignee,
      project_id: taskData.project_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: taskData.due_date,
      tags: JSON.stringify(taskData.tags || []),
      story_points: taskData.story_points,
      dependencies: JSON.stringify(taskData.dependencies || [])
    };

    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        Object.values(task),
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ ...task, tags: JSON.parse(task.tags), dependencies: JSON.parse(task.dependencies) });
        }
      );
    });
  }

  async updateTask(taskData) {
    const task = {
      ...taskData,
      updated_at: new Date().toISOString(),
      tags: JSON.stringify(taskData.tags || []),
      dependencies: JSON.stringify(taskData.dependencies || [])
    };

    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, assignee = ?, updated_at = ?, due_date = ?, tags = ?, story_points = ?, dependencies = ? WHERE id = ?',
        [task.title, task.description, task.status, task.priority, task.assignee, task.updated_at, task.due_date, task.tags, task.story_points, task.dependencies, task.id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(task);
        }
      );
    });
  }

  async getDashboardStats() {
    const [projects, tasks] = await Promise.all([
      this.getProjects(),
      this.getTasks()
    ]);

    return {
      total_projects: projects.length,
      total_tasks: tasks.length,
      active_tasks: tasks.filter(t => t.status === 'in_progress').length,
      completed_tasks: tasks.filter(t => t.status === 'done').length,
      completed_today: tasks.filter(t => {
        if (t.status !== 'done' || !t.updated_at) return false;
        const today = new Date().toDateString();
        const taskDate = new Date(t.updated_at).toDateString();
        return today === taskDate;
      }).length
    };
  }

  async createMockData() {
    const mockProjects = [
      {
        name: 'LCARS Interface Redesign',
        description: 'Complete redesign of the LCARS interface for the AlexAI system',
        project_type: 'UI/UX',
        status: 'in_progress',
        team_members: ['Captain Picard', 'Commander Data', 'Geordi La Forge'],
        tech_stack: ['JavaScript', 'CSS3', 'HTML5', 'Node.js'],
        deployment_url: 'https://lcars.alexai.starfleet',
        repository_url: 'https://github.com/starfleet/lcars-redesign'
      },
      {
        name: 'Quantum Database Optimization',
        description: 'Optimize database performance using quantum computing principles',
        project_type: 'Backend',
        status: 'planning',
        team_members: ['Commander Data', 'Lieutenant Commander La Forge'],
        tech_stack: ['SQLite', 'Node.js', 'Quantum Algorithms'],
        deployment_url: 'https://quantum.alexai.starfleet',
        repository_url: 'https://github.com/starfleet/quantum-db'
      },
      {
        name: 'Multi-Agent AI Coordination',
        description: 'Implement advanced AI coordination between AlexAI crew members',
        project_type: 'AI/ML',
        status: 'completed',
        team_members: ['Commander Data', 'Counselor Troi', 'Dr. Crusher'],
        tech_stack: ['OpenAI API', 'Python', 'Machine Learning'],
        deployment_url: 'https://ai.alexai.starfleet',
        repository_url: 'https://github.com/starfleet/multi-agent-ai'
      }
    ];

    const mockTasks = [
      {
        title: 'Design LCARS color palette',
        description: 'Create authentic LCARS color scheme based on Star Trek: TNG',
        status: 'completed',
        priority: 'high',
        assignee: 'Captain Picard',
        project_id: null,
        story_points: 5,
        tags: 'design,lcars,ui'
      },
      {
        title: 'Implement L-shaped elements',
        description: 'Create CSS for characteristic LCARS L-shaped panels',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Geordi La Forge',
        project_id: null,
        story_points: 8,
        tags: 'css,lcars,frontend'
      },
      {
        title: 'Database schema optimization',
        description: 'Optimize SQLite schema for better performance',
        status: 'todo',
        priority: 'medium',
        assignee: 'Commander Data',
        project_id: null,
        story_points: 13,
        tags: 'database,optimization'
      },
      {
        title: 'AI agent coordination',
        description: 'Implement coordination between different AI crew members',
        status: 'review',
        priority: 'high',
        assignee: 'Counselor Troi',
        project_id: null,
        story_points: 21,
        tags: 'ai,coordination,ml'
      }
    ];

    try {
      // Create projects
      for (const projectData of mockProjects) {
        await this.createProject(projectData);
      }

      // Create tasks
      for (const taskData of mockTasks) {
        await this.createTask(taskData);
      }

      return {
        projects_created: mockProjects.length,
        tasks_created: mockTasks.length,
        message: 'Mock data created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create mock data: ${error.message}`);
    }
  }

  // Additional methods for complete API support
  async getProject(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Project not found'));
          return;
        }
        resolve({
          ...row,
          team_members: row.team_members ? JSON.parse(row.team_members) : [],
          tech_stack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
          environment_variables: row.environment_variables ? JSON.parse(row.environment_variables) : {}
        });
      });
    });
  }

  async updateProject(projectData) {
    const { id, ...updateData } = projectData;
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE projects SET ${setClause}, updated_at = datetime('now') WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      this.db.run(query, [...values, id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Project not found'));
          return;
        }
        this.getProject(id).then(resolve).catch(reject);
      });
    });
  }

  async getTask(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Task not found'));
          return;
        }
        resolve({
          ...row,
          tags: row.tags ? row.tags.split(',') : [],
          dependencies: row.dependencies ? JSON.parse(row.dependencies) : []
        });
      });
    });
  }

  async deleteTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Task not found'));
          return;
        }
        resolve({ message: 'Task deleted successfully' });
      });
    });
  }

  async getRecentTasks(limit = 5) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?', [limit], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          tags: row.tags ? row.tags.split(',') : [],
          dependencies: row.dependencies ? JSON.parse(row.dependencies) : []
        })));
      });
    });
  }

  async getTasksByStatus(status) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks WHERE status = ?', [status], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          tags: row.tags ? row.tags.split(',') : [],
          dependencies: row.dependencies ? JSON.parse(row.dependencies) : []
        })));
      });
    });
  }

  async getProjectTasks(projectId) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks WHERE project_id = ?', [projectId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          tags: row.tags ? row.tags.split(',') : [],
          dependencies: row.dependencies ? JSON.parse(row.dependencies) : []
        })));
      });
    });
  }

  async getSprints(projectId = null) {
    return new Promise((resolve, reject) => {
      const query = projectId 
        ? 'SELECT * FROM sprints WHERE project_id = ?'
        : 'SELECT * FROM sprints';
      const params = projectId ? [projectId] : [];
      
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => ({
          ...row,
          goals: row.goals ? JSON.parse(row.goals) : []
        })));
      });
    });
  }

  async createSprint(sprintData) {
    const id = uuidv4();
    const { name, start_date, end_date, project_id, goals, velocity } = sprintData;
    
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO sprints (id, name, start_date, end_date, project_id, goals, velocity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))',
        [id, name, start_date, end_date, project_id, JSON.stringify(goals || []), velocity || 0],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id, ...sprintData });
        }
      );
    });
  }

  async getSystemMetrics() {
    try {
      const [projects, tasks, sprints] = await Promise.all([
        this.getProjects(),
        this.getTasks(),
        this.getSprints()
      ]);

      const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      return {
        total_projects: projects.length,
        total_tasks: tasks.length,
        total_sprints: sprints.length,
        tasks_by_status: statusCounts,
        completion_rate: tasks.length > 0 ? (statusCounts.completed || 0) / tasks.length * 100 : 0,
        active_projects: projects.filter(p => p.status === 'in_progress').length
      };
    } catch (error) {
      throw new Error(`Failed to get system metrics: ${error.message}`);
    }
  }
}

module.exports = AgileProjectManager; 