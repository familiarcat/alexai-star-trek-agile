#!/usr/bin/env python3
"""
AlexAI Agile Project Management Web Interface
A modern Flask-based web application for managing projects with multi-agent insights
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_socketio import SocketIO, emit
import asyncio
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from app.core.agile_project_manager import AgileProjectManager, Project, Task, TaskStatus, Priority, ProjectType
from app.core.alexai_core_agent import alexai_core, AlexAIMode

# Get the absolute path to the project root
project_root = Path(__file__).parent.parent.parent
template_folder = project_root / "app" / "frontend" / "pages"
static_folder = project_root / "app" / "frontend" / "assets"

app = Flask(__name__, 
           template_folder=str(template_folder),
           static_folder=str(static_folder))
app.config['SECRET_KEY'] = 'alexai-agile-secret-key'

# Fix SocketIO for Python 3.13 compatibility
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

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

@app.route('/observation-lounge')
def observation_lounge():
    """LCARS-style Observation Lounge with AlexAI consultation"""
    crew_status = alexai_core.get_crew_status()
    latest_analysis = alexai_core.get_latest_analysis()
    return render_template('observation_lounge.html', 
                         crew_status=crew_status, 
                         latest_analysis=latest_analysis)

@app.route('/agent/<agent_name>')
def agent_detail(agent_name):
    """Individual agent detail page"""
    agents = {
        'picard': {
            'name': 'Captain Jean-Luc Picard',
            'role': 'Strategic Leadership',
            'icon': 'fas fa-crown',
            'color': 'from-red-500 to-orange-600',
            'description': 'Strategic leadership and decision making for all project initiatives.',
            'stats': {
                'active_decisions': 12,
                'risk_assessments': 8,
                'strategic_reviews': 15
            }
        },
        'troi': {
            'name': 'Counselor Deanna Troi',
            'role': 'UX & Team Morale',
            'icon': 'fas fa-heart',
            'color': 'from-green-400 to-teal-500',
            'description': 'User experience analysis and team morale monitoring.',
            'stats': {
                'ux_reviews': 15,
                'morale_reports': 6,
                'user_feedback': 23
            }
        },
        'spock': {
            'name': 'Mr. Spock',
            'role': 'Logical Analysis',
            'icon': 'fas fa-brain',
            'color': 'from-yellow-400 to-orange-500',
            'description': 'Logical reasoning and time management optimization.',
            'stats': {
                'analyses': 23,
                'efficiency_reports': 11,
                'optimizations': 7
            }
        },
        'data': {
            'name': 'Lt. Commander Data',
            'role': 'UI Systems',
            'icon': 'fas fa-microchip',
            'color': 'from-purple-500 to-indigo-600',
            'description': 'Technical implementation and code quality assurance.',
            'stats': {
                'system_reviews': 18,
                'code_quality': 94,
                'technical_decisions': 9
            }
        },
        'scott': {
            'name': 'Chief Engineer Montgomery Scott',
            'role': 'Infrastructure',
            'icon': 'fas fa-cogs',
            'color': 'from-pink-500 to-rose-600',
            'description': 'Infrastructure management and deployment strategies.',
            'stats': {
                'deployments': 7,
                'system_health': 98,
                'infrastructure_updates': 12
            }
        }
    }
    
    agent = agents.get(agent_name.lower())
    if not agent:
        return redirect(url_for('observation_lounge'))
    
    return render_template('agent_detail.html', agent=agent, agent_name=agent_name)

@app.route('/projects')
def projects():
    """Projects list view"""
    projects = manager.get_projects()
    
    # Add project metrics to each project
    for project in projects:
        project.metrics = manager.get_project_metrics(project.id)
    
    # Calculate overall metrics
    total_projects = len(projects)
    active_projects = len([p for p in projects if p.status == 'active'])
    completed_projects = len([p for p in projects if p.status == 'completed'])
    
    metrics = {
        'total_projects': total_projects,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
        'completion_rate': (completed_projects / total_projects * 100) if total_projects > 0 else 0
    }
    
    return render_template('projects.html', projects=projects, metrics=metrics, get_project_metrics=manager.get_project_metrics)

@app.route('/project/<project_id>')
def project_detail(project_id):
    """Individual project view with Kanban board"""
    projects = manager.get_projects()
    project = next((p for p in projects if p.id == project_id), None)
    
    if not project:
        return redirect(url_for('projects'))
    
    kanban_board = manager.create_kanban_board(project_id)
    metrics = manager.get_project_metrics(project_id)
    
    return render_template('project_detail.html', 
                         project=project, 
                         kanban_board=kanban_board,
                         metrics=metrics)

@app.route('/api/projects', methods=['GET'])
def api_get_projects():
    """API endpoint to get all projects"""
    projects = manager.get_projects()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'project_type': p.project_type.value,
        'status': p.status,
        'tech_stack': p.tech_stack,
        'team_members': p.team_members
    } for p in projects])

@app.route('/api/projects', methods=['POST'])
def api_create_project():
    """API endpoint to create a new project"""
    data = request.json
    
    project = Project(
        id=str(uuid.uuid4()),
        name=data['name'],
        description=data.get('description', ''),
        project_type=ProjectType(data['project_type']),
        status='active',
        tech_stack=data.get('tech_stack', []),
        team_members=data.get('team_members', [])
    )
    
    if manager.create_project(project):
        return jsonify({'success': True, 'project': {
            'id': project.id,
            'name': project.name,
            'project_type': project.project_type.value
        }})
    else:
        return jsonify({'success': False, 'error': 'Failed to create project'}), 400

@app.route('/api/tasks', methods=['GET'])
def api_get_tasks():
    """API endpoint to get tasks"""
    project_id = request.args.get('project_id')
    tasks = manager.get_tasks(project_id)
    
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'status': t.status.value,
        'priority': t.priority.value,
        'assignee': t.assignee,
        'project_id': t.project_id,
        'due_date': t.due_date.isoformat() if t.due_date else None,
        'story_points': t.story_points,
        'tags': t.tags
    } for t in tasks])

@app.route('/api/tasks', methods=['POST'])
def api_create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        
        # Create task with proper status enum
        status = TaskStatus(data.get('status', 'todo'))
        priority = Priority(data.get('priority', 'medium'))
        
        task = manager.create_task(
            project_id=data.get('project_id'),
            title=data.get('title'),
            description=data.get('description', ''),
            priority=priority,
            status=status,
            assignee=data.get('assignee')
        )
        
        if task:
            # Emit real-time update
            socketio.emit('task_created', {
                'task': {
                    'id': task.id,
                    'title': task.title,
                    'status': task.status.value,
                    'project_id': task.project_id
                }
            })
            
            return jsonify({
                'success': True,
                'task': {
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'status': task.status.value,
                    'priority': task.priority.value,
                    'assignee': task.assignee,
                    'project_id': task.project_id,
                    'story_points': task.story_points
                }
            })
        else:
            return jsonify({'success': False, 'error': 'Failed to create task'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['GET'])
def api_get_task(task_id):
    """Get a specific task by ID"""
    try:
        tasks = manager.get_tasks()
        task = next((t for t in tasks if t.id == task_id), None)
        
        if task:
            return jsonify({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': task.status.value,
                'priority': task.priority.value,
                'assignee': task.assignee,
                'project_id': task.project_id,
                'story_points': task.story_points,
                'created_at': task.created_at.isoformat() if task.created_at else None,
                'updated_at': task.updated_at.isoformat() if task.updated_at else None
            })
        else:
            return jsonify({'error': 'Task not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def api_update_task(task_id):
    """Update a task"""
    try:
        data = request.get_json()
        tasks = manager.get_tasks()
        task = next((t for t in tasks if t.id == task_id), None)
        
        if not task:
            return jsonify({'success': False, 'error': 'Task not found'}), 404
        
        # Update task fields
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'priority' in data:
            task.priority = Priority(data['priority'])
        if 'status' in data:
            task.status = TaskStatus(data['status'])
        if 'assignee' in data:
            task.assignee = data['assignee']
        if 'story_points' in data:
            task.story_points = data['story_points']
        
        task.updated_at = datetime.now()
        
        # Update in database
        success = manager.update_task(task)
        
        if success:
            # Emit real-time update
            socketio.emit('task_updated', {
                'task': {
                    'id': task.id,
                    'title': task.title,
                    'status': task.status.value,
                    'project_id': task.project_id
                }
            })
            
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to update task'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>/status', methods=['PUT'])
def api_update_task_status(task_id):
    """Update task status (for drag and drop)"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'success': False, 'error': 'Status is required'}), 400
        
        tasks = manager.get_tasks()
        task = next((t for t in tasks if t.id == task_id), None)
        
        if not task:
            return jsonify({'success': False, 'error': 'Task not found'}), 404
        
        # Update status
        task.status = TaskStatus(new_status)
        task.updated_at = datetime.now()
        
        # Update in database
        success = manager.update_task(task)
        
        if success:
            # Emit real-time update
            socketio.emit('task_status_updated', {
                'task_id': task.id,
                'new_status': new_status,
                'project_id': task.project_id
            })
            
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to update task status'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def api_delete_task(task_id):
    """Delete a task"""
    try:
        tasks = manager.get_tasks()
        task = next((t for t in tasks if t.id == task_id), None)
        
        if not task:
            return jsonify({'success': False, 'error': 'Task not found'}), 404
        
        # Delete from database
        success = manager.delete_task(task_id)
        
        if success:
            # Emit real-time update
            socketio.emit('task_deleted', {
                'task_id': task_id,
                'project_id': task.project_id
            })
            
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete task'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/projects/<project_id>/insights')
def api_get_project_insights(project_id):
    """Get AI insights for a specific project"""
    try:
        projects = manager.get_projects()
        project = next((p for p in projects if p.id == project_id), None)
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Get project tasks for context
        tasks = manager.get_tasks(project_id)
        completed_tasks = len([t for t in tasks if t.status == TaskStatus.DONE])
        total_tasks = len(tasks)
        
        context = f"""
        Project: {project.name}
        Type: {project.project_type.value}
        Status: {project.status}
        Progress: {completed_tasks}/{total_tasks} tasks completed
        
        Tasks by status:
        - Todo: {len([t for t in tasks if t.status == TaskStatus.TODO])}
        - In Progress: {len([t for t in tasks if t.status == TaskStatus.IN_PROGRESS])}
        - Review: {len([t for t in tasks if t.status == TaskStatus.REVIEW])}
        - Done: {len([t for t in tasks if t.status == TaskStatus.DONE])}
        """
        
        # Get insights from AlexAI
        insights = asyncio.run(alexai_core.conduct_comprehensive_analysis(context))
        
        # Format insights for display
        insights_html = f"""
        <div class="space-y-4">
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h4 class="font-semibold text-blue-800">Captain Picard - Strategic Leadership</h4>
                <p class="text-blue-700 mt-2">{insights.strategic_vision}</p>
            </div>
            <div class="bg-green-50 border-l-4 border-green-400 p-4">
                <h4 class="font-semibold text-green-800">Counselor Troi - UX & Team Morale</h4>
                <p class="text-green-700 mt-2">{insights.insights.get('team_dynamics', 'Analysis in progress...')}</p>
            </div>
            <div class="bg-purple-50 border-l-4 border-purple-400 p-4">
                <h4 class="font-semibold text-purple-800">Mr. Spock - Logic & Time Management</h4>
                <p class="text-purple-700 mt-2">{insights.insights.get('system_optimization', 'Analysis in progress...')}</p>
            </div>
            <div class="bg-orange-50 border-l-4 border-orange-400 p-4">
                <h4 class="font-semibold text-orange-800">Lt. Commander Data - UI Systems</h4>
                <p class="text-orange-700 mt-2">{insights.insights.get('code_review', 'Analysis in progress...')}</p>
            </div>
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <h4 class="font-semibold text-red-800">Chief Engineer Scott - Infrastructure</h4>
                <p class="text-red-700 mt-2">{insights.insights.get('risk_assessment', 'Analysis in progress...')}</p>
            </div>
        </div>
        """
        
        return jsonify({'insights': insights_html})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/agents/insights', methods=['POST'])
def api_get_agent_insights():
    """API endpoint to get multi-agent insights with AlexAI augmentation"""
    data = request.json
    context = data.get('context', '')
    
    # Run async function in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        insights = loop.run_until_complete(manager.get_multi_agent_insights(context))
    finally:
        loop.close()
    
    return jsonify({'success': True, 'insights': insights})

@app.route('/api/alexai/consultation', methods=['POST'])
def api_alexai_consultation():
    """Get comprehensive AlexAI consultation"""
    try:
        data = request.get_json()
        context = data.get('context', 'Comprehensive system analysis')
        
        # Conduct comprehensive AlexAI analysis
        analysis = asyncio.run(alexai_core.conduct_comprehensive_analysis(context))
        
        return jsonify({
            'success': True,
            'analysis': {
                'timestamp': analysis.timestamp.isoformat(),
                'mode': analysis.mode.value,
                'context': analysis.context,
                'insights': analysis.insights,
                'recommendations': analysis.recommendations,
                'risk_assessment': analysis.risk_assessment,
                'performance_metrics': analysis.performance_metrics,
                'crew_coordination': analysis.crew_coordination,
                'strategic_vision': analysis.strategic_vision
            },
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alexai/mode', methods=['POST'])
def api_alexai_mode():
    """Switch AlexAI operational mode"""
    try:
        data = request.get_json()
        mode_name = data.get('mode', 'orchestrator')
        
        # Convert string to enum
        mode = AlexAIMode(mode_name)
        alexai_core.switch_mode(mode)
        
        return jsonify({
            'success': True,
            'mode': mode.value,
            'message': f'AlexAI switched to {mode.value} mode'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alexai/status')
def api_alexai_status():
    """Get AlexAI system status"""
    try:
        crew_status = alexai_core.get_crew_status()
        latest_analysis = alexai_core.get_latest_analysis()
        
        return jsonify({
            'success': True,
            'crew_status': crew_status,
            'latest_analysis': {
                'timestamp': latest_analysis.timestamp.isoformat() if latest_analysis else None,
                'mode': latest_analysis.mode.value if latest_analysis else None,
                'context': latest_analysis.context if latest_analysis else None
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/workspace/scan', methods=['POST'])
def api_scan_workspace():
    """API endpoint to scan workspace and create projects"""
    try:
        from pathlib import Path
        
        workspace_path = Path.home() / "Documents" / "workspace"
        created_projects = []
        scanned_dirs = []
        
        if not workspace_path.exists():
            return jsonify({
                'success': False, 
                'error': 'Workspace directory not found',
                'fallback_message': 'No workspace directory found. You can still create projects manually.'
            })
        
        for project_dir in workspace_path.iterdir():
            if project_dir.is_dir() and not project_dir.name.startswith('.'):
                scanned_dirs.append(project_dir.name)
                try:
                    project = manager.generate_project_from_workspace(str(project_dir))
                    if manager.create_project(project):
                        created_projects.append({
                            'id': project.id,
                            'name': project.name,
                            'project_type': project.project_type.value,
                            'tech_stack': project.tech_stack
                        })
                except Exception as e:
                    print(f"Error processing {project_dir.name}: {e}")
                    continue
        
        if not created_projects:
            return jsonify({
                'success': False,
                'error': 'No projects could be created from workspace',
                'scanned_dirs': scanned_dirs,
                'fallback_message': f'Scanned {len(scanned_dirs)} directories but no projects were created. You can create projects manually.'
            })
        
        return jsonify({
            'success': True,
            'created_projects': created_projects,
            'scanned_dirs': scanned_dirs,
            'message': f'Successfully created {len(created_projects)} projects from {len(scanned_dirs)} directories'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e),
            'fallback_message': 'Workspace scanning failed. You can still create projects manually or try again later.'
        })

@app.route('/api/database/mock', methods=['POST'])
def api_create_mock_data():
    """API endpoint to create comprehensive mock data"""
    try:
        from app.database.mock import create_mock_data
        
        create_mock_data()
        
        return jsonify({
            'success': True,
            'message': 'Database mock system completed successfully!',
            'created_projects': 4,
            'created_tasks': '10-15',
            'created_sprints': 1,
            'created_activities': 1
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'fallback_message': 'Database mock creation failed. Please try again.'
        })

@app.route('/api/metrics/<project_id>')
def api_get_metrics(project_id):
    """API endpoint to get project metrics"""
    metrics = manager.get_project_metrics(project_id)
    return jsonify({'success': True, 'metrics': metrics})

@app.route('/api/dashboard/recent-tasks')
def api_get_recent_tasks():
    """API endpoint to get recent tasks for dashboard"""
    try:
        # Get all tasks and sort by creation date
        all_tasks = []
        projects = manager.get_projects()
        
        for project in projects:
            project_tasks = manager.get_tasks(project.id)
            for task in project_tasks:
                all_tasks.append({
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'status': task.status.value,
                    'priority': task.priority.value,
                    'assignee': task.assignee,
                    'project_name': project.name,
                    'project_id': project.id,
                    'created_at': task.created_at.isoformat() if task.created_at else None,
                    'due_date': task.due_date.isoformat() if task.due_date else None,
                    'story_points': task.story_points
                })
        
        # Sort by creation date (most recent first) and take top 10
        all_tasks.sort(key=lambda x: x['created_at'] or '', reverse=True)
        recent_tasks = all_tasks[:10]
        
        return jsonify({
            'success': True,
            'tasks': recent_tasks,
            'total_tasks': len(all_tasks)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/dashboard/stats')
def api_get_dashboard_stats():
    """API endpoint to get dashboard statistics"""
    try:
        projects = manager.get_projects()
        all_tasks = []
        
        for project in projects:
            project_tasks = manager.get_tasks(project.id)
            all_tasks.extend(project_tasks)
        
        # Calculate stats
        active_tasks = len([t for t in all_tasks if t.status.value in ['todo', 'in_progress', 'review']])
        completed_tasks = len([t for t in all_tasks if t.status.value == 'done'])
        
        # Count tasks completed today (mock data for now)
        completed_today = len([t for t in all_tasks if t.status.value == 'done'])
        
        return jsonify({
            'success': True,
            'stats': {
                'total_projects': len(projects),
                'active_tasks': active_tasks,
                'completed_tasks': completed_tasks,
                'completed_today': completed_today,
                'total_tasks': len(all_tasks)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection"""
    emit('connected', {'message': 'Connected to AlexAI Agile Manager'})

@socketio.on('task_update')
def handle_task_update(data):
    """Handle real-time task updates"""
    # Broadcast to all connected clients
    emit('task_updated', data, broadcast=True)

@socketio.on('project_update')
def handle_project_update(data):
    """Handle real-time project updates"""
    # Broadcast to all connected clients
    emit('project_updated', data, broadcast=True)

# WSGI application for Vercel
# app.wsgi_app = app  # This was causing recursion

if __name__ == '__main__':
    print("🚀 Starting AlexAI Agile Project Management System")
    print("Multi-agent system: Picard, Troi, Spock, Data, Scott")
    print("Web interface available at: http://localhost:8000")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=8000) 