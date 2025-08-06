#!/usr/bin/env python3
"""
AlexAI Agile Project Management Web Interface - Vercel Compatible
A simplified Flask-based web application for Vercel deployment
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from app.core.agile_project_manager import AgileProjectManager, Project, Task, TaskStatus, Priority, ProjectType

# Get the absolute path to the project root
project_root = Path(__file__).parent.parent.parent
template_folder = project_root / "app" / "frontend" / "pages"
static_folder = project_root / "app" / "frontend" / "assets"

app = Flask(__name__, 
           template_folder=str(template_folder),
           static_folder=str(static_folder))
app.config['SECRET_KEY'] = 'alexai-agile-secret-key'

# Initialize the Agile Project Manager
manager = AgileProjectManager()

# Template helper functions
@app.context_processor
def utility_processor():
    """Add utility functions to template context"""
    def getPriorityColor(priority):
        """Get CSS class for priority color"""
        priority_colors = {
            'low': 'bg-green-100 text-green-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-orange-100 text-orange-800',
            'critical': 'bg-red-100 text-red-800'
        }
        return priority_colors.get(priority, 'bg-gray-100 text-gray-800')

    def getStatusColor(status):
        """Get CSS class for status color"""
        status_colors = {
            'todo': 'bg-gray-100 text-gray-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'review': 'bg-purple-100 text-purple-800',
            'done': 'bg-green-100 text-green-800',
            'blocked': 'bg-red-100 text-red-800'
        }
        return status_colors.get(status, 'bg-gray-100 text-gray-800')

    def getProjectTypeColor(project_type):
        """Get CSS class for project type color"""
        type_colors = {
            'nextjs': 'bg-blue-100 text-blue-800',
            'react_native': 'bg-purple-100 text-purple-800',
            'terraform': 'bg-orange-100 text-orange-800',
            'python': 'bg-yellow-100 text-yellow-800',
            'nodejs': 'bg-green-100 text-green-800',
            'amplify': 'bg-indigo-100 text-indigo-800',
            'infrastructure': 'bg-gray-100 text-gray-800',
            'diplomatic': 'bg-pink-100 text-pink-800',
            'security': 'bg-red-100 text-red-800',
            'entertainment': 'bg-purple-100 text-purple-800',
            'medical': 'bg-green-100 text-green-800',
            'research': 'bg-blue-100 text-blue-800',
            'training': 'bg-yellow-100 text-yellow-800'
        }
        return type_colors.get(project_type, 'bg-gray-100 text-gray-800')

    return {
        'getPriorityColor': getPriorityColor,
        'getStatusColor': getStatusColor,
        'getProjectTypeColor': getProjectTypeColor
    }

@app.route('/')
def index():
    """Main dashboard"""
    projects = manager.get_projects()
    return render_template('dashboard.html', projects=projects)

@app.route('/projects')
def projects():
    """Projects list page"""
    projects = manager.get_projects()
    
    # Calculate metrics
    total_projects = len(projects)
    active_projects = len([p for p in projects if p.status == 'active'])
    completed_projects = len([p for p in projects if p.status == 'completed'])
    
    metrics = {
        'total_projects': total_projects,
        'active_projects': active_projects,
        'completed_projects': completed_projects
    }
    
    return render_template('projects.html', projects=projects, metrics=metrics)

@app.route('/project/<project_id>')
def project_detail(project_id):
    """Individual project detail page"""
    projects = manager.get_projects()
    project = next((p for p in projects if p.id == project_id), None)
    
    if not project:
        return redirect(url_for('projects'))
    
    tasks = manager.get_tasks(project_id)
    return render_template('project_detail.html', project=project, tasks=tasks)

# API Routes
@app.route('/api/projects', methods=['GET'])
def api_get_projects():
    """Get all projects"""
    try:
        projects = manager.get_projects()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'project_type': p.project_type.value,
            'status': p.status,
            'created_at': p.created_at.isoformat() if p.created_at else None,
            'team_members': p.team_members,
            'tech_stack': p.tech_stack
        } for p in projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats')
def api_get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        projects = manager.get_projects()
        tasks = manager.get_tasks()
        
        stats = {
            'total_projects': len(projects),
            'total_tasks': len(tasks),
            'active_tasks': len([t for t in tasks if t.status == TaskStatus.IN_PROGRESS]),
            'completed_tasks': len([t for t in tasks if t.status == TaskStatus.DONE]),
            'completed_today': len([t for t in tasks if t.status == TaskStatus.DONE and 
                                  t.updated_at and t.updated_at.date() == datetime.now().date()])
        }
        
        return jsonify({'success': True, 'stats': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/database/mock', methods=['POST'])
def api_create_mock_data():
    """Create mock data for development"""
    try:
        from app.database.mock import create_mock_data
        projects = create_mock_data()
        
        return jsonify({
            'success': True,
            'message': 'Database mock system completed successfully!',
            'created_projects': len(projects),
            'created_tasks': '10-15',
            'created_sprints': 1,
            'created_activities': 1
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health')
def api_health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == "__main__":
    app.run(debug=True) 