"""
Mock database module for AlexAI Star Trek Agile System
Provides sample data for development and testing
"""

from app.core.agile_project_manager import AgileProjectManager, Project, ProjectType
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
            project_type=ProjectType.INFRASTRUCTURE,
            status="active",
            tech_stack=["Python", "Flask", "React", "PostgreSQL"],
            team_members=["Picard", "Data", "Worf", "Troi"]
        ),
        Project(
            id=str(uuid.uuid4()),
            name="LCARS Interface Enhancement",
            description="Modernize the LCARS user interface for better UX",
            project_type=ProjectType.PYTHON,
            status="active",
            tech_stack=["Vue.js", "TypeScript", "Tailwind CSS"],
            team_members=["Data", "Troi", "Geordi"]
        ),
        Project(
            id=str(uuid.uuid4()),
            name="Warp Core Monitoring System",
            description="Real-time monitoring and alerting for warp core systems",
            project_type=ProjectType.INFRASTRUCTURE,
            status="planning",
            tech_stack=["Python", "FastAPI", "Redis", "InfluxDB"],
            team_members=["Scott", "Data", "Geordi"]
        ),
        Project(
            id=str(uuid.uuid4()),
            name="Holodeck Safety Protocols",
            description="Enhanced safety systems for holodeck operations",
            project_type=ProjectType.SECURITY,
            status="completed",
            tech_stack=["C++", "Unity", "Safety Systems"],
            team_members=["Worf", "Data", "Troi"]
        )
    ]
    
    # Add projects to database
    for project in projects:
        manager.create_project(project)
    
    print(f"Created {len(projects)} sample projects")
    return projects 