"""
Mock database module for AlexAI Star Trek Agile System
Provides sample data for development and testing
"""

from app.core.agile_project_manager import AgileProjectManager, Project, Task, Sprint
import uuid
from datetime import datetime, timedelta

def create_mock_data():
    """Create sample data for the AlexAI Star Trek Agile System"""
    
    manager = AgileProjectManager()
    
    # Create sample projects
    projects = [
        Project(
            id=str(uuid.uuid4()),
            name="Enterprise Mission Control",
            description="Central command system for Star Fleet operations",
            status="active",
            priority="high",
            technology_stack="Python, Flask, React, PostgreSQL",
            start_date=datetime.now() - timedelta(days=30),
            end_date=datetime.now() + timedelta(days=60),
            team_size=8,
            budget=50000
        ),
        Project(
            id=str(uuid.uuid4()),
            name="LCARS Interface Enhancement",
            description="Modernize the LCARS user interface for better UX",
            status="active",
            priority="medium",
            technology_stack="Vue.js, TypeScript, Tailwind CSS",
            start_date=datetime.now() - timedelta(days=15),
            end_date=datetime.now() + timedelta(days=45),
            team_size=4,
            budget=25000
        ),
        Project(
            id=str(uuid.uuid4()),
            name="Warp Core Monitoring System",
            description="Real-time monitoring and alerting for warp core systems",
            status="planning",
            priority="high",
            technology_stack="Python, FastAPI, Redis, InfluxDB",
            start_date=datetime.now() + timedelta(days=7),
            end_date=datetime.now() + timedelta(days=90),
            team_size=6,
            budget=75000
        ),
        Project(
            id=str(uuid.uuid4()),
            name="Holodeck Safety Protocols",
            description="Enhanced safety systems for holodeck operations",
            status="completed",
            priority="medium",
            technology_stack="C++, Unity, Safety Systems",
            start_date=datetime.now() - timedelta(days=90),
            end_date=datetime.now() - timedelta(days=10),
            team_size=5,
            budget=40000
        )
    ]
    
    # Add projects to database
    for project in projects:
        manager.create_project(project)
    
    # Create sample tasks for each project
    for project in projects:
        if project.name == "Enterprise Mission Control":
            tasks = [
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Design Database Schema",
                    description="Create comprehensive database schema for mission data",
                    status="in_progress",
                    priority="high",
                    assignee="Data",
                    story_points=8,
                    due_date=datetime.now() + timedelta(days=7)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Implement Authentication System",
                    description="Secure authentication for mission control access",
                    status="todo",
                    priority="high",
                    assignee="Worf",
                    story_points=5,
                    due_date=datetime.now() + timedelta(days=14)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Create Mission Dashboard",
                    description="Real-time dashboard for mission status monitoring",
                    status="done",
                    priority="medium",
                    assignee="Geordi",
                    story_points=13,
                    due_date=datetime.now() - timedelta(days=5)
                )
            ]
        elif project.name == "LCARS Interface Enhancement":
            tasks = [
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Design New Color Scheme",
                    description="Update LCARS color palette for better accessibility",
                    status="in_progress",
                    priority="medium",
                    assignee="Troi",
                    story_points=3,
                    due_date=datetime.now() + timedelta(days=3)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Implement Responsive Layout",
                    description="Make LCARS interface responsive for all devices",
                    status="todo",
                    priority="high",
                    assignee="Data",
                    story_points=8,
                    due_date=datetime.now() + timedelta(days=10)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Add Voice Commands",
                    description="Integrate voice command functionality",
                    status="todo",
                    priority="low",
                    assignee="Worf",
                    story_points=5,
                    due_date=datetime.now() + timedelta(days=20)
                )
            ]
        elif project.name == "Warp Core Monitoring System":
            tasks = [
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Define System Requirements",
                    description="Document all requirements for warp core monitoring",
                    status="todo",
                    priority="high",
                    assignee="Spock",
                    story_points=5,
                    due_date=datetime.now() + timedelta(days=5)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Design Alert System",
                    description="Design alert and notification system",
                    status="todo",
                    priority="high",
                    assignee="Geordi",
                    story_points=8,
                    due_date=datetime.now() + timedelta(days=12)
                )
            ]
        else:  # Holodeck Safety Protocols
            tasks = [
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Safety Protocol Testing",
                    description="Comprehensive testing of all safety protocols",
                    status="done",
                    priority="high",
                    assignee="Geordi",
                    story_points=13,
                    due_date=datetime.now() - timedelta(days=15)
                ),
                Task(
                    id=str(uuid.uuid4()),
                    project_id=project.id,
                    title="Documentation Update",
                    description="Update all safety documentation",
                    status="done",
                    priority="medium",
                    assignee="Data",
                    story_points=5,
                    due_date=datetime.now() - timedelta(days=8)
                )
            ]
        
        # Add tasks to database
        for task in tasks:
            manager.create_task(task)
    
    print(f"Created {len(projects)} projects with {sum(len(tasks) for tasks in [tasks])} tasks")
    return projects 