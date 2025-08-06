#!/usr/bin/env python3
"""
AlexAI Agile Project Management System
A comprehensive project management platform that integrates with the multi-agent architecture
and supports multiple project types (Next.js, React Native, Terraform, etc.)
"""

import os
import json
import asyncio
import openai
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import sqlite3
from pathlib import Path

# Configure OpenAI with platform-specific handling
import platform
is_macos = platform.system() == 'Darwin'

try:
    if is_macos:
        # On macOS, try to avoid proxy issues
        try:
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        except TypeError as e:
            if 'proxies' in str(e):
                # Use custom HTTP client to avoid proxy issues
                import httpx
                http_client = httpx.Client(timeout=30.0)
                client = openai.OpenAI(
                    api_key=os.getenv('OPENAI_API_KEY'),
                    http_client=http_client
                )
            else:
                raise e
    else:
        # On other platforms (like Vercel), use standard approach
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
except Exception as e:
    print(f"Warning: OpenAI client initialization failed: {e}")
    client = None

class ProjectType(Enum):
    NEXTJS = "nextjs"
    REACT_NATIVE = "react_native"
    TERRAFORM = "terraform"
    PYTHON = "python"
    NODEJS = "nodejs"
    AMPLIFY = "amplify"
    INFRASTRUCTURE = "infrastructure"
    DIPLOMATIC = "diplomatic"
    SECURITY = "security"
    ENTERTAINMENT = "entertainment"
    MEDICAL = "medical"
    RESEARCH = "research"
    TRAINING = "training"

class TaskStatus(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    BLOCKED = "blocked"

class Priority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class Task:
    id: str
    title: str
    description: str
    status: TaskStatus
    priority: Priority
    assignee: Optional[str] = None
    project_id: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None
    due_date: Optional[datetime] = None
    tags: List[str] = None
    story_points: Optional[int] = None
    dependencies: List[str] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()
        if self.tags is None:
            self.tags = []
        if self.dependencies is None:
            self.dependencies = []

@dataclass
class Project:
    id: str
    name: str
    description: str
    project_type: ProjectType
    status: str
    created_at: datetime = None
    updated_at: datetime = None
    team_members: List[str] = None
    tech_stack: List[str] = None
    deployment_url: Optional[str] = None
    repository_url: Optional[str] = None
    environment_variables: Dict[str, str] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()
        if self.team_members is None:
            self.team_members = []
        if self.tech_stack is None:
            self.tech_stack = []
        if self.environment_variables is None:
            self.environment_variables = {}

@dataclass
class Sprint:
    id: str
    name: str
    start_date: datetime
    end_date: datetime
    project_id: str
    goals: List[str] = None
    velocity: Optional[int] = None
    created_at: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.goals is None:
            self.goals = []

class AgentRole(Enum):
    PICARD = "picard"  # Strategic leadership
    TROI = "troi"      # UX and morale
    SPOCK = "spock"    # Logic and time management
    DATA = "data"      # UI systems and type safety
    SCOTT = "scott"    # Infrastructure and build systems

class AgileProjectManager:
    def __init__(self, db_path: str = "agile_manager.db"):
        self.db_path = db_path
        self.init_database()
        self.agents = {
            AgentRole.PICARD: self.picard_agent,
            AgentRole.TROI: self.troi_agent,
            AgentRole.SPOCK: self.spock_agent,
            AgentRole.DATA: self.data_agent,
            AgentRole.SCOTT: self.scott_agent
        }

    def init_database(self):
        """Initialize SQLite database with tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Projects table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                project_type TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP,
                updated_at TIMESTAMP,
                team_members TEXT,
                tech_stack TEXT,
                deployment_url TEXT,
                repository_url TEXT,
                environment_variables TEXT
            )
        ''')
        
        # Tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT NOT NULL,
                priority TEXT NOT NULL,
                assignee TEXT,
                project_id TEXT,
                created_at TIMESTAMP,
                updated_at TIMESTAMP,
                due_date TIMESTAMP,
                tags TEXT,
                story_points INTEGER,
                dependencies TEXT,
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        ''')
        
        # Sprints table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sprints (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                start_date TIMESTAMP,
                end_date TIMESTAMP,
                project_id TEXT,
                goals TEXT,
                velocity INTEGER,
                created_at TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects (id)
            )
        ''')
        
        conn.commit()
        conn.close()

    def create_project(self, project: Project) -> bool:
        """Create a new project"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project.id, project.name, project.description, project.project_type.value,
                project.status, project.created_at, project.updated_at,
                json.dumps(project.team_members), json.dumps(project.tech_stack),
                project.deployment_url, project.repository_url,
                json.dumps(project.environment_variables)
            ))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating project: {e}")
            return False

    def create_task(self, task: Task) -> bool:
        """Create a new task"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                task.id, task.title, task.description, task.status.value,
                task.priority.value, task.assignee, task.project_id,
                task.created_at, task.updated_at, task.due_date,
                json.dumps(task.tags), task.story_points,
                json.dumps(task.dependencies)
            ))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating task: {e}")
            return False

    def get_projects(self) -> List[Project]:
        """Get all projects"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM projects')
        rows = cursor.fetchall()
        
        projects = []
        for row in rows:
            project = Project(
                id=row[0], name=row[1], description=row[2],
                project_type=ProjectType(row[3]), status=row[4],
                created_at=datetime.fromisoformat(row[5]) if row[5] else None,
                updated_at=datetime.fromisoformat(row[6]) if row[6] else None,
                team_members=json.loads(row[7]) if row[7] else [],
                tech_stack=json.loads(row[8]) if row[8] else [],
                deployment_url=row[9], repository_url=row[10],
                environment_variables=json.loads(row[11]) if row[11] else {}
            )
            projects.append(project)
        
        conn.close()
        return projects

    def get_tasks(self, project_id: Optional[str] = None) -> List[Task]:
        """Get tasks, optionally filtered by project"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if project_id:
            cursor.execute('SELECT * FROM tasks WHERE project_id = ?', (project_id,))
        else:
            cursor.execute('SELECT * FROM tasks')
        
        rows = cursor.fetchall()
        
        tasks = []
        for row in rows:
            task = Task(
                id=row[0], title=row[1], description=row[2],
                status=TaskStatus(row[3]), priority=Priority(row[4]),
                assignee=row[5], project_id=row[6],
                created_at=datetime.fromisoformat(row[7]) if row[7] else None,
                updated_at=datetime.fromisoformat(row[8]) if row[8] else None,
                due_date=datetime.fromisoformat(row[9]) if row[9] else None,
                tags=json.loads(row[10]) if row[10] else [],
                story_points=row[11],
                dependencies=json.loads(row[12]) if row[12] else []
            )
            tasks.append(task)
        
        conn.close()
        return tasks

    async def picard_agent(self, context: str) -> str:
        """Strategic leadership agent - makes high-level decisions"""
        if client is None:
            return "Strategic analysis temporarily unavailable due to system configuration."
        
        prompt = f"""
        As Captain Picard, provide strategic leadership guidance for this context:
        
        {context}
        
        Consider:
        - Long-term project vision and goals
        - Resource allocation and priorities
        - Risk assessment and mitigation
        - Team morale and leadership
        
        Provide clear, decisive guidance in your role as strategic leader.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Strategic analysis temporarily unavailable: {str(e)}"

    async def troi_agent(self, context: str) -> str:
        """UX and morale agent - focuses on user experience and team well-being"""
        if client is None:
            return "UX analysis temporarily unavailable due to system configuration."
        
        prompt = f"""
        As Counselor Troi, analyze the UX and morale aspects of this context:
        
        {context}
        
        Consider:
        - User experience implications
        - Team morale and emotional well-being
        - Communication effectiveness
        - User feedback and satisfaction
        
        Provide insights on UX and team morale considerations.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"UX analysis temporarily unavailable: {str(e)}"

    async def spock_agent(self, context: str) -> str:
        """Logical analysis agent - provides logical reasoning and time management"""
        if client is None:
            return "Logical analysis temporarily unavailable due to system configuration."
        
        prompt = f"""
        As Mr. Spock, provide logical analysis and time management insights:
        
        {context}
        
        Consider:
        - Logical consistency and reasoning
        - Time management and efficiency
        - Data-driven decision making
        - Process optimization
        
        Provide logical, analytical insights.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Logical analysis temporarily unavailable: {str(e)}"

    async def data_agent(self, context: str) -> str:
        """UI systems agent - focuses on technical implementation and type safety"""
        if client is None:
            return "Technical analysis temporarily unavailable due to system configuration."
        
        prompt = f"""
        As Lt. Commander Data, provide technical implementation guidance:
        
        {context}
        
        Consider:
        - UI/UX system architecture
        - Type safety and code quality
        - Technical implementation details
        - System integration and APIs
        
        Provide technical implementation guidance.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Technical analysis temporarily unavailable: {str(e)}"

    async def scott_agent(self, context: str) -> str:
        """Infrastructure agent - handles deployment and build systems"""
        if client is None:
            return "Infrastructure analysis temporarily unavailable due to system configuration."
        
        prompt = f"""
        As Chief Engineer Scott, provide infrastructure and deployment guidance:
        
        {context}
        
        Consider:
        - Infrastructure requirements
        - Deployment strategies
        - Build system optimization
        - Performance and scalability
        - DevOps and CI/CD
        
        Provide infrastructure and deployment guidance.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Infrastructure analysis temporarily unavailable: {str(e)}"

    async def get_multi_agent_insights(self, context: str) -> Dict[str, str]:
        """Get insights from all agents"""
        tasks = []
        for role, agent_func in self.agents.items():
            task = asyncio.create_task(agent_func(context))
            tasks.append((role, task))
        
        results = {}
        for role, task in tasks:
            try:
                result = await task
                results[role.value] = result
            except Exception as e:
                results[role.value] = f"Error: {str(e)}"
        
        return results

    def generate_project_from_workspace(self, project_path: str) -> Project:
        """Generate a project from workspace analysis"""
        path = Path(project_path)
        
        # Determine project type based on files
        project_type = ProjectType.PYTHON
        tech_stack = []
        
        if (path / "package.json").exists():
            with open(path / "package.json", 'r') as f:
                package_data = json.load(f)
                if "next" in package_data.get("dependencies", {}):
                    project_type = ProjectType.NEXTJS
                    tech_stack = ["Next.js", "React", "TypeScript"]
                elif "react-native" in package_data.get("dependencies", {}):
                    project_type = ProjectType.REACT_NATIVE
                    tech_stack = ["React Native", "JavaScript"]
                else:
                    project_type = ProjectType.NODEJS
                    tech_stack = ["Node.js", "JavaScript"]
        
        if (path / "main.tf").exists() or (path / "terraform").exists():
            project_type = ProjectType.TERRAFORM
            tech_stack = ["Terraform", "AWS", "Infrastructure"]
        
        if (path / "amplify").exists():
            project_type = ProjectType.AMPLIFY
            tech_stack.extend(["AWS Amplify", "Cloud Services"])
        
        return Project(
            id=str(path.name),
            name=path.name.replace("-", " ").replace("_", " ").title(),
            description=f"Project from {path.name}",
            project_type=project_type,
            status="active",
            tech_stack=tech_stack
        )

    def create_project_from_data(self, project_data: dict) -> Project:
        """Create a project from dictionary data"""
        return Project(
            id=str(uuid.uuid4()),
            name=project_data["name"],
            description=project_data["description"],
            status=project_data["status"],
            project_type=project_data["project_type"],
            tech_stack=project_data["tech_stack"]
        )

    def create_task(self, project_id: str, title: str, description: str, 
                   priority: Priority, status: TaskStatus, assignee: str = None) -> Task:
        """Create a new task with simplified parameters"""
        task = Task(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            status=status,
            priority=priority,
            assignee=assignee,
            project_id=project_id
        )
        
        if self.create_task_db(task):
            return task
        return None

    def create_task_db(self, task: Task) -> bool:
        """Create a task in the database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO tasks (id, title, description, status, priority, assignee, project_id, created_at, updated_at, due_date, tags, story_points, dependencies)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                task.id, task.title, task.description, task.status.value,
                task.priority.value, task.assignee, task.project_id,
                task.created_at, task.updated_at, task.due_date,
                json.dumps(task.tags), task.story_points,
                json.dumps(task.dependencies)
            ))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error creating task: {e}")
            return False

    def create_sprint(self, name: str, start_date: datetime, end_date: datetime, goal: str = None) -> Sprint:
        """Create a new sprint"""
        sprint = Sprint(
            id=str(uuid.uuid4()),
            name=name,
            start_date=start_date,
            end_date=end_date,
            project_id="general",
            goals=[goal] if goal else []
        )
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO sprints VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                sprint.id, sprint.name, sprint.start_date, sprint.end_date,
                sprint.project_id, json.dumps(sprint.goals), sprint.velocity,
                sprint.created_at
            ))
            
            conn.commit()
            conn.close()
            return sprint
        except Exception as e:
            print(f"Error creating sprint: {e}")
            return None

    def create_kanban_board(self, project_id: str) -> Dict[str, List[Task]]:
        """Create a Kanban board for a project"""
        tasks = self.get_tasks(project_id)
        
        board = {
            "todo": [],
            "in_progress": [],
            "review": [],
            "done": []
        }
        
        for task in tasks:
            board[task.status.value].append(task)
        
        return board

    def update_task(self, task: Task) -> bool:
        """Update an existing task in the database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE tasks 
                SET title = ?, description = ?, status = ?, priority = ?, 
                    assignee = ?, updated_at = ?, due_date = ?, tags = ?, 
                    story_points = ?, dependencies = ?
                WHERE id = ?
            ''', (
                task.title, task.description, task.status.value,
                task.priority.value, task.assignee, task.updated_at,
                task.due_date, json.dumps(task.tags), task.story_points,
                json.dumps(task.dependencies), task.id
            ))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error updating task: {e}")
            return False

    def delete_task(self, task_id: str) -> bool:
        """Delete a task from the database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error deleting task: {e}")
            return False

    def get_project_metrics(self, project_id: str) -> Dict[str, Any]:
        """Get project metrics and analytics"""
        tasks = self.get_tasks(project_id)
        
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.status == TaskStatus.DONE])
        in_progress_tasks = len([t for t in tasks if t.status == TaskStatus.IN_PROGRESS])
        
        total_story_points = sum([t.story_points or 0 for t in tasks])
        completed_story_points = sum([t.story_points or 0 for t in tasks if t.status == TaskStatus.DONE])
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
            "total_story_points": total_story_points,
            "completed_story_points": completed_story_points,
            "velocity": completed_story_points
        }

if __name__ == "__main__":
    # Initialize the Agile Project Manager
    manager = AgileProjectManager()
    
    # Example usage
    print("🚀 AlexAI Agile Project Manager Initialized")
    print("Multi-agent system ready: Picard, Troi, Spock, Data, Scott")
    
    # Create sample projects from workspace
    workspace_path = Path.home() / "Documents" / "workspace"
    if workspace_path.exists():
        for project_dir in workspace_path.iterdir():
            if project_dir.is_dir() and not project_dir.name.startswith('.'):
                project = manager.generate_project_from_workspace(str(project_dir))
                if manager.create_project(project):
                    print(f"✅ Created project: {project.name} ({project.project_type.value})") 