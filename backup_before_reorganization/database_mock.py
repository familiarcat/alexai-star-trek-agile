#!/usr/bin/env python3
"""
Database Mock System for AlexAI Agile Project Manager
Automatically populates the entire app with realistic Star Trek-themed data
"""

import sqlite3
import json
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from agile_project_manager import AgileProjectManager, ProjectType, TaskStatus, Priority

class DatabaseMock:
    def __init__(self, db_path='agile_manager.db'):
        self.db_path = db_path
        self.manager = AgileProjectManager()
        
    def create_mock_data(self):
        """Create comprehensive mock data for the entire system"""
        print("🚀 Initializing Star Trek Database Mock System...")
        
        # Initialize database first
        self.manager.init_database()
        
        # Clear existing data
        self.clear_existing_data()
        
        # Create mock projects
        projects = self.create_mock_projects()
        
        # Create mock tasks for each project
        for project in projects:
            self.create_mock_tasks(project)
        
        # Create mock sprints
        self.create_mock_sprints()
        
        # Create mock crew activities
        self.create_mock_crew_activities()
        
        print("✅ Database mock system completed successfully!")
        print(f"📊 Created {len(projects)} projects with realistic Star Trek data")
        
    def clear_existing_data(self):
        """Clear existing data from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        tables = ['tasks', 'sprints', 'projects']
        for table in tables:
            try:
                cursor.execute(f"DELETE FROM {table}")
            except sqlite3.OperationalError:
                # Table doesn't exist, that's fine
                pass
        
        conn.commit()
        conn.close()
        print("🧹 Cleared existing data")
    
    def create_mock_projects(self):
        """Create realistic Star Trek-themed projects"""
        projects_data = [
            {
                "name": "USS Enterprise NCC-1701-D Refit",
                "description": "Major refit and upgrade of the Enterprise's systems, including new warp core, enhanced shields, and improved crew quarters. This mission involves coordinating with Starfleet Engineering and ensuring minimal disruption to ongoing operations.",
                "status": "active",
                "project_type": ProjectType.INFRASTRUCTURE,
                "tech_stack": ["Warp Core", "Shield Systems", "Life Support", "Computer Systems"],
                "priority": "high"
            },
            {
                "name": "Diplomatic Mission to Betazed",
                "description": "Establish diplomatic relations with the Betazoid government and negotiate trade agreements. This mission requires careful cultural sensitivity and strategic planning to ensure successful negotiations.",
                "status": "active",
                "project_type": ProjectType.DIPLOMATIC,
                "tech_stack": ["Diplomatic Protocols", "Cultural Analysis", "Translation Systems", "Security Protocols"],
                "priority": "critical"
            },
            {
                "name": "Borg Threat Analysis System",
                "description": "Develop advanced threat analysis and response systems to counter potential Borg incursions. This involves creating sophisticated AI algorithms and tactical response protocols.",
                "status": "active",
                "project_type": ProjectType.SECURITY,
                "tech_stack": ["AI Systems", "Tactical Analysis", "Shield Technology", "Weapons Systems"],
                "priority": "critical"
            },
            {
                "name": "Holodeck Entertainment Suite",
                "description": "Design and implement new holodeck programs for crew recreation and training. This includes historical simulations, adventure programs, and educational experiences.",
                "status": "pending",
                "project_type": ProjectType.ENTERTAINMENT,
                "tech_stack": ["Holographic Technology", "AI Programming", "3D Modeling", "Interactive Systems"],
                "priority": "medium"
            },
            {
                "name": "Medical Bay Automation",
                "description": "Automate routine medical procedures and enhance the sickbay's diagnostic capabilities. This will improve patient care and reduce workload on medical staff.",
                "status": "active",
                "project_type": ProjectType.MEDICAL,
                "tech_stack": ["Medical AI", "Diagnostic Systems", "Automation", "Patient Monitoring"],
                "priority": "high"
            },
            {
                "name": "Quantum Communication Network",
                "description": "Implement quantum entanglement communication system for instant subspace messaging across the Federation. This revolutionary technology will transform interstellar communications.",
                "status": "blocked",
                "project_type": ProjectType.RESEARCH,
                "tech_stack": ["Quantum Physics", "Entanglement Theory", "Communication Protocols", "Network Security"],
                "priority": "critical"
            },
            {
                "name": "Crew Training Simulation",
                "description": "Develop comprehensive training simulations for new crew members covering emergency procedures, ship operations, and away mission protocols.",
                "status": "completed",
                "project_type": ProjectType.TRAINING,
                "tech_stack": ["Simulation Software", "VR Technology", "Educational Content", "Assessment Systems"],
                "priority": "medium"
            },
            {
                "name": "Environmental Control Optimization",
                "description": "Optimize the ship's environmental control systems for maximum efficiency and crew comfort. This includes temperature, humidity, and air quality management.",
                "status": "active",
                "project_type": ProjectType.INFRASTRUCTURE,
                "tech_stack": ["Environmental Systems", "Climate Control", "Energy Management", "Monitoring Systems"],
                "priority": "low"
            },
            {
                "name": "Stellar Cartography Database",
                "description": "Update and expand the stellar cartography database with new discoveries and improved mapping algorithms. This will enhance navigation and exploration capabilities.",
                "status": "active",
                "project_type": ProjectType.RESEARCH,
                "tech_stack": ["Astronomy", "Database Systems", "Mapping Algorithms", "Data Visualization"],
                "priority": "medium"
            },
            {
                "name": "Security Protocol Enhancement",
                "description": "Enhance ship security protocols and implement new access control systems. This includes biometric authentication and advanced surveillance systems.",
                "status": "pending",
                "project_type": ProjectType.SECURITY,
                "tech_stack": ["Biometric Systems", "Access Control", "Surveillance", "Security AI"],
                "priority": "high"
            }
        ]
        
        created_projects = []
        for project_data in projects_data:
            project = self.manager.create_project_from_data(project_data)
            if self.manager.create_project(project):
                created_projects.append(project)
                print(f"✅ Created project: {project.name}")
        
        return created_projects
    
    def create_mock_tasks(self, project):
        """Create realistic tasks for a project"""
        task_templates = {
            ProjectType.INFRASTRUCTURE: [
                {"title": "System Analysis", "description": "Analyze current system performance and identify improvement opportunities", "priority": "high"},
                {"title": "Component Testing", "description": "Test new components and ensure compatibility with existing systems", "priority": "medium"},
                {"title": "Integration Planning", "description": "Plan integration of new systems with existing infrastructure", "priority": "high"},
                {"title": "Documentation Update", "description": "Update technical documentation and operational manuals", "priority": "low"},
                {"title": "Safety Review", "description": "Conduct comprehensive safety review of all modifications", "priority": "critical"},
                {"title": "Performance Optimization", "description": "Optimize system performance and efficiency", "priority": "medium"},
                {"title": "Backup Systems", "description": "Implement redundant backup systems for critical functions", "priority": "high"},
                {"title": "Training Materials", "description": "Create training materials for crew on new systems", "priority": "medium"}
            ],
            ProjectType.DIPLOMATIC: [
                {"title": "Cultural Research", "description": "Research target civilization's culture, customs, and protocols", "priority": "critical"},
                {"title": "Protocol Review", "description": "Review and prepare diplomatic protocols and procedures", "priority": "high"},
                {"title": "Translation Preparation", "description": "Prepare translation systems and cultural context", "priority": "high"},
                {"title": "Security Assessment", "description": "Assess security requirements for diplomatic mission", "priority": "critical"},
                {"title": "Negotiation Strategy", "description": "Develop negotiation strategy and fallback positions", "priority": "high"},
                {"title": "Cultural Sensitivity Training", "description": "Train crew on cultural sensitivity and diplomatic etiquette", "priority": "medium"},
                {"title": "Documentation Review", "description": "Review all diplomatic documents and agreements", "priority": "high"},
                {"title": "Mission Debriefing", "description": "Prepare post-mission debriefing and reporting procedures", "priority": "medium"}
            ],
            ProjectType.SECURITY: [
                {"title": "Threat Assessment", "description": "Conduct comprehensive threat assessment and analysis", "priority": "critical"},
                {"title": "System Vulnerability Scan", "description": "Scan systems for vulnerabilities and security gaps", "priority": "high"},
                {"title": "Security Protocol Design", "description": "Design new security protocols and procedures", "priority": "high"},
                {"title": "Access Control Implementation", "description": "Implement enhanced access control systems", "priority": "critical"},
                {"title": "Monitoring Systems", "description": "Deploy advanced monitoring and surveillance systems", "priority": "high"},
                {"title": "Response Team Training", "description": "Train security response teams on new protocols", "priority": "medium"},
                {"title": "Incident Response Planning", "description": "Develop incident response and containment procedures", "priority": "high"},
                {"title": "Security Audit", "description": "Conduct comprehensive security audit of all systems", "priority": "medium"}
            ],
            ProjectType.RESEARCH: [
                {"title": "Literature Review", "description": "Review existing research and scientific literature", "priority": "medium"},
                {"title": "Hypothesis Development", "description": "Develop research hypotheses and experimental design", "priority": "high"},
                {"title": "Data Collection", "description": "Collect and organize research data and samples", "priority": "high"},
                {"title": "Analysis Framework", "description": "Develop analysis framework and methodology", "priority": "medium"},
                {"title": "Experimental Testing", "description": "Conduct experimental tests and validation", "priority": "critical"},
                {"title": "Results Documentation", "description": "Document research results and findings", "priority": "medium"},
                {"title": "Peer Review", "description": "Submit findings for peer review and validation", "priority": "high"},
                {"title": "Publication Preparation", "description": "Prepare research for publication and dissemination", "priority": "low"}
            ],
            ProjectType.MEDICAL: [
                {"title": "Medical Protocol Review", "description": "Review and update medical protocols and procedures", "priority": "high"},
                {"title": "Equipment Calibration", "description": "Calibrate medical equipment and diagnostic systems", "priority": "critical"},
                {"title": "Staff Training", "description": "Train medical staff on new procedures and equipment", "priority": "high"},
                {"title": "Patient Safety Review", "description": "Review patient safety protocols and procedures", "priority": "critical"},
                {"title": "Emergency Response Planning", "description": "Plan emergency medical response procedures", "priority": "high"},
                {"title": "Quality Assurance", "description": "Implement quality assurance and monitoring systems", "priority": "medium"},
                {"title": "Documentation Update", "description": "Update medical documentation and records", "priority": "medium"},
                {"title": "Equipment Maintenance", "description": "Schedule and perform equipment maintenance", "priority": "low"}
            ]
        }
        
        # Get tasks for this project type, or use a default set
        tasks = task_templates.get(project.project_type, task_templates[ProjectType.INFRASTRUCTURE])
        
        # Create 4-8 tasks per project
        num_tasks = random.randint(4, 8)
        selected_tasks = random.sample(tasks, min(num_tasks, len(tasks)))
        
        for i, task_template in enumerate(selected_tasks):
            # Add project-specific context
            task_title = f"{task_template['title']} - {project.name}"
            task_description = f"{task_template['description']} for the {project.name} project."
            
            # Randomize status based on project status
            if project.status == "completed":
                status = random.choice([TaskStatus.DONE, TaskStatus.DONE, TaskStatus.DONE])
            elif project.status == "blocked":
                status = random.choice([TaskStatus.BLOCKED, TaskStatus.TODO, TaskStatus.IN_PROGRESS])
            elif project.status == "pending":
                status = random.choice([TaskStatus.TODO, TaskStatus.TODO, TaskStatus.IN_PROGRESS])
            else:  # active
                status = random.choice([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
            
            # Randomize priority
            priority = random.choice([Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL])
            
            # Create task
            task = self.manager.create_task(
                project_id=project.id,
                title=task_title,
                description=task_description,
                priority=priority,
                status=status,
                assignee=f"Crew Member {random.randint(1, 5)}"
            )
            
            if task:
                print(f"  📋 Created task: {task_title}")
    
    def create_mock_sprints(self):
        """Create mock sprints for the system"""
        sprint_data = [
            {
                "name": "Alpha Quadrant Operations",
                "start_date": datetime.now() - timedelta(days=14),
                "end_date": datetime.now() + timedelta(days=7),
                "goal": "Complete critical infrastructure upgrades and diplomatic preparations"
            },
            {
                "name": "Beta Quadrant Exploration",
                "start_date": datetime.now() + timedelta(days=8),
                "end_date": datetime.now() + timedelta(days=21),
                "goal": "Focus on research projects and security enhancements"
            },
            {
                "name": "Gamma Quadrant Diplomacy",
                "start_date": datetime.now() + timedelta(days=22),
                "end_date": datetime.now() + timedelta(days=35),
                "goal": "Complete diplomatic missions and cultural exchange programs"
            }
        ]
        
        for sprint_info in sprint_data:
            sprint = self.manager.create_sprint(
                name=sprint_info["name"],
                start_date=sprint_info["start_date"],
                end_date=sprint_info["end_date"],
                goal=sprint_info["goal"]
            )
            if sprint:
                print(f"🏃 Created sprint: {sprint.name}")
    
    def create_mock_crew_activities(self):
        """Create mock crew activity data"""
        activities = [
            {
                "crew_member": "Captain Picard",
                "activity": "Strategic planning session for upcoming diplomatic mission",
                "timestamp": datetime.now() - timedelta(hours=2),
                "status": "completed"
            },
            {
                "crew_member": "Counselor Troi",
                "activity": "Crew morale assessment and psychological evaluation",
                "timestamp": datetime.now() - timedelta(hours=1),
                "status": "in_progress"
            },
            {
                "crew_member": "Mr. Spock",
                "activity": "Logical analysis of quantum communication protocols",
                "timestamp": datetime.now() - timedelta(minutes=30),
                "status": "completed"
            },
            {
                "crew_member": "Lt. Commander Data",
                "activity": "System optimization and performance monitoring",
                "timestamp": datetime.now() - timedelta(minutes=15),
                "status": "in_progress"
            },
            {
                "crew_member": "Chief Engineer Scott",
                "activity": "Warp core maintenance and efficiency review",
                "timestamp": datetime.now(),
                "status": "in_progress"
            }
        ]
        
        # Store activities in a JSON file for the frontend to access
        activities_file = Path("crew_activities.json")
        with open(activities_file, 'w') as f:
            json.dump(activities, f, default=str, indent=2)
        
        print(f"👥 Created {len(activities)} crew activities")
    
    def get_mock_insights(self):
        """Generate mock AI insights for the crew"""
        insights = {
            "picard": {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Decision Making",
                "description": "Experienced captain with deep knowledge of diplomacy and strategic planning",
                "stats": {
                    "strategic_decisions": 15,
                    "diplomatic_missions": 8,
                    "risk_assessments": 12,
                    "crew_leadership": 95
                },
                "recent_insights": [
                    "Recommend prioritizing the Betazed diplomatic mission due to its strategic importance",
                    "Suggest implementing enhanced security protocols for the Borg threat analysis",
                    "Advise scheduling regular crew briefings to maintain mission focus"
                ]
            },
            "troi": {
                "name": "Counselor Deanna Troi",
                "role": "UX Analysis & Team Morale",
                "description": "Empathic counselor focused on crew well-being and user experience",
                "stats": {
                    "ux_reviews": 18,
                    "morale_assessments": 6,
                    "cultural_analyses": 9,
                    "team_satisfaction": 92
                },
                "recent_insights": [
                    "Crew morale is high but could benefit from more recreational activities",
                    "Cultural sensitivity training should be mandatory for diplomatic missions",
                    "Recommend implementing regular team building exercises"
                ]
            },
            "spock": {
                "name": "Mr. Spock",
                "role": "Logical Analysis & Time Management",
                "description": "Vulcan science officer specializing in logical analysis and efficiency",
                "stats": {
                    "logical_analyses": 25,
                    "efficiency_reports": 11,
                    "scientific_reviews": 14,
                    "system_optimization": 88
                },
                "recent_insights": [
                    "Quantum communication project shows 23% efficiency improvement potential",
                    "Current task distribution is logically optimal for maximum productivity",
                    "Recommend implementing automated analysis systems for routine tasks"
                ]
            },
            "data": {
                "name": "Lt. Commander Data",
                "role": "UI Systems & Technical Implementation",
                "description": "Android officer with exceptional technical and analytical capabilities",
                "stats": {
                    "system_reviews": 22,
                    "code_quality": 94,
                    "technical_implementations": 16,
                    "performance_optimization": 96
                },
                "recent_insights": [
                    "Database optimization could improve query performance by 34%",
                    "Security protocols require immediate updates to address new threats",
                    "Recommend implementing automated testing for all critical systems"
                ]
            },
            "scott": {
                "name": "Chief Engineer Scott",
                "role": "Infrastructure & Deployment",
                "description": "Experienced engineer with expertise in ship systems and maintenance",
                "stats": {
                    "deployments": 9,
                    "system_maintenance": 12,
                    "infrastructure_upgrades": 7,
                    "system_reliability": 98
                },
                "recent_insights": [
                    "Warp core efficiency has improved 15% with recent modifications",
                    "Environmental systems require scheduled maintenance within 48 hours",
                    "Recommend implementing predictive maintenance protocols"
                ]
            }
        }
        
        # Store insights in a JSON file
        insights_file = Path("crew_insights.json")
        with open(insights_file, 'w') as f:
            json.dump(insights, f, indent=2)
        
        print("🧠 Generated mock crew insights")
        return insights

def main():
    """Main function to run the database mock system"""
    print("🚀 Starting AlexAI Database Mock System...")
    print("=" * 50)
    
    mock_system = DatabaseMock()
    
    try:
        # Create comprehensive mock data
        mock_system.create_mock_data()
        
        # Generate crew insights
        insights = mock_system.get_mock_insights()
        
        print("=" * 50)
        print("✅ Database mock system completed successfully!")
        print("📊 Your Star Trek-themed Agile Project Manager is now populated with:")
        print("   • 10 realistic projects with different statuses")
        print("   • 40-80 tasks across all projects")
        print("   • 3 active sprints")
        print("   • 5 crew activities")
        print("   • Comprehensive crew insights")
        print("")
        print("🌐 Access your system at: http://localhost:8000")
        print("👥 View the Observation Lounge at: http://localhost:8000/observation-lounge")
        print("📋 Check Mission Log at: http://localhost:8000/projects")
        
    except Exception as e:
        print(f"❌ Error in database mock system: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 