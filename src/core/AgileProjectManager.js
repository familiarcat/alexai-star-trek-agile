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
        name: 'Enterprise Mission Control',
        description: 'Central command system for Star Fleet operations',
        project_type: 'infrastructure',
        status: 'active',
        tech_stack: ['Node.js', 'Express', 'React', 'PostgreSQL'],
        team_members: ['Picard', 'Data', 'Worf', 'Troi']
      },
      {
        name: 'LCARS Interface Enhancement',
        description: 'Modernize the LCARS user interface for better UX',
        project_type: 'frontend',
        status: 'active',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
        team_members: ['Data', 'Troi', 'Geordi']
      },
      {
        name: 'Warp Core Monitoring System',
        description: 'Real-time monitoring and alerting for warp core systems',
        project_type: 'infrastructure',
        status: 'planning',
        tech_stack: ['Node.js', 'Socket.IO', 'Redis', 'InfluxDB'],
        team_members: ['Scott', 'Data', 'Geordi']
      },
      {
        name: 'Holodeck Safety Protocols',
        description: 'Enhanced safety systems for holodeck operations',
        project_type: 'security',
        status: 'completed',
        tech_stack: ['Node.js', 'WebRTC', 'Safety Systems'],
        team_members: ['Worf', 'Data', 'Troi']
      }
    ];

    const createdProjects = [];
    for (const projectData of mockProjects) {
      const project = await this.createProject(projectData);
      createdProjects.push(project);
    }

    return {
      created_projects: createdProjects.length,
      created_tasks: '10-15',
      created_sprints: 1,
      created_activities: 1
    };
  }
}

module.exports = AgileProjectManager; 