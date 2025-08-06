"""
Supabase Configuration for AlexAI Star Trek Agile Project Manager
Handles database connections for both local development and production
"""

import os
from supabase import create_client, Client
from typing import Optional

class SupabaseManager:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        self.client: Optional[Client] = None
        
        if self.supabase_url and self.supabase_key:
            self.client = create_client(self.supabase_url, self.supabase_key)
    
    def is_connected(self) -> bool:
        """Check if Supabase is connected"""
        return self.client is not None
    
    def create_tables(self):
        """Create necessary tables in Supabase"""
        if not self.is_connected():
            return False
            
        try:
            # Create projects table
            self.client.table('projects').select('*').limit(1).execute()
        except Exception:
            # Table doesn't exist, create it
            self.client.rpc('create_projects_table').execute()
        
        try:
            # Create tasks table
            self.client.table('tasks').select('*').limit(1).execute()
        except Exception:
            # Table doesn't exist, create it
            self.client.rpc('create_tasks_table').execute()
        
        try:
            # Create sprints table
            self.client.table('sprints').select('*').limit(1).execute()
        except Exception:
            # Table doesn't exist, create it
            self.client.rpc('create_sprints_table').execute()
        
        return True
    
    def get_projects(self):
        """Get all projects from Supabase"""
        if not self.is_connected():
            return []
        
        try:
            response = self.client.table('projects').select('*').execute()
            return response.data
        except Exception as e:
            print(f"Error getting projects: {e}")
            return []
    
    def create_project(self, project_data):
        """Create a new project in Supabase"""
        if not self.is_connected():
            return False
        
        try:
            response = self.client.table('projects').insert(project_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating project: {e}")
            return None
    
    def get_tasks(self, project_id=None):
        """Get tasks from Supabase"""
        if not self.is_connected():
            return []
        
        try:
            query = self.client.table('tasks').select('*')
            if project_id:
                query = query.eq('project_id', project_id)
            response = query.execute()
            return response.data
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return []
    
    def create_task(self, task_data):
        """Create a new task in Supabase"""
        if not self.is_connected():
            return False
        
        try:
            response = self.client.table('tasks').insert(task_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating task: {e}")
            return None

# Global Supabase instance
supabase_manager = SupabaseManager() 