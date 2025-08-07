'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LCARSLayout } from '@/components/lcars/lcars-layout';
import { 
  ArrowLeftIcon,
  FolderIcon,
  EyeIcon,
  CogIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  CalendarIcon,
  ChartBarIcon,
  ServerIcon,
  CpuChipIcon,
  BeakerIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  team_size: number;
  created_at: string;
  deadline: string;
  priority: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  due_date: string;
  tags: string[];
  story_points: number;
  dependencies: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectsRes = await fetch('/api/projects');
        const projectsData = await projectsRes.json();
        const foundProject = projectsData.projects?.find((p: Project) => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
        }

        // Fetch tasks for this project
        const tasksRes = await fetch('/api/tasks');
        const tasksData = await tasksRes.json();
        const projectTasks = tasksData.tasks?.filter((t: Task) => t.project_id === projectId) || [];
        setTasks(projectTasks);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'lcars-status-success';
      case 'completed': return 'lcars-status-success';
      case 'pending': return 'lcars-status-warning';
      default: return 'lcars-status-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'lcars-text-red';
      case 'medium': return 'lcars-text-yellow';
      case 'low': return 'lcars-text-green';
      default: return 'lcars-text-grey';
    }
  };

  const getProjectIcon = (name: string) => {
    if (name.includes('Database')) return ServerIcon;
    if (name.includes('LCARS')) return CpuChipIcon;
    if (name.includes('AI')) return BeakerIcon;
    if (name.includes('Security')) return ShieldCheckIcon;
    if (name.includes('Performance')) return ChartBarIcon;
    return FolderIcon;
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'lcars-text-green';
      case 'in_progress': return 'lcars-text-yellow';
      case 'todo': return 'lcars-text-blue';
      case 'overdue': return 'lcars-text-red';
      default: return 'lcars-text-grey';
    }
  };

  if (loading) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30">
          <div className="lcars-text-xxlarge lcars-text-gold">LOADING MISSION DATA...</div>
          <div className="lcars-text-large lcars-text-white">ACCESSING PROJECT DETAILS</div>
        </div>
      </LCARSLayout>
    );
  }

  if (!project) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30">
          <div className="lcars-text-xxlarge lcars-text-red">MISSION NOT FOUND</div>
          <div className="lcars-text-large lcars-text-white">PROJECT ID: {projectId}</div>
          <Link href="/" className="lcars-action-button lcars-mt-20">
            <ArrowLeftIcon className="lcars-action-icon" />
            <span>RETURN TO MISSION CONTROL</span>
          </Link>
        </div>
      </LCARSLayout>
    );
  }

  const ProjectIcon = getProjectIcon(project.name);

  return (
    <LCARSLayout>
      <div className="lcars-panel lcars-p-30">
        {/* Navigation Header */}
        <div className="lcars-navigation-header">
          <Link href="/" className="lcars-back-button">
            <ArrowLeftIcon className="lcars-back-icon" />
            <span>MISSION CONTROL</span>
          </Link>
          <div className="lcars-breadcrumb">
            <span>MISSIONS</span>
            <span className="lcars-breadcrumb-separator">/</span>
            <span>{project.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Project Header */}
        <div className="lcars-project-header">
          <div className="lcars-project-title-section">
            <ProjectIcon className="lcars-project-icon" />
            <div className="lcars-project-info">
              <div className="lcars-project-name">{project.name}</div>
              <div className="lcars-project-status">
                <div className={`lcars-status-indicator ${getStatusColor(project.status)}`}></div>
                <span className="lcars-status-text">{project.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="lcars-project-meta">
            <div className="lcars-meta-item">
              <UserGroupIcon className="lcars-meta-icon" />
              <span>{project.team_size} CREW MEMBERS</span>
            </div>
            <div className={`lcars-meta-item ${getPriorityColor(project.priority)}`}>
              <FlagIcon className="lcars-meta-icon" />
              <span>{project.priority.toUpperCase()} PRIORITY</span>
            </div>
            <div className="lcars-meta-item">
              <CalendarIcon className="lcars-meta-icon" />
              <span>DEADLINE: {project.deadline}</span>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="lcars-project-progress-section">
          <div className="lcars-section-header">
            <ChartBarIcon className="lcars-icon" />
            <span>MISSION PROGRESS</span>
          </div>
          <div className="lcars-progress-container">
            <div className="lcars-progress-bar">
              <div 
                className="lcars-progress-fill" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="lcars-progress-text">{project.progress}% COMPLETE</div>
          </div>
        </div>

        {/* Mission Tasks */}
        <div className="lcars-mission-tasks-section">
          <div className="lcars-section-header">
            <FlagIcon className="lcars-icon" />
            <span>MISSION TASKS</span>
          </div>
          <div className="lcars-tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="lcars-task-card">
                <div className="lcars-task-header">
                  <div className="lcars-task-status">
                    <div className={`lcars-status-indicator ${getStatusColor(task.status)}`}></div>
                    <span className={`lcars-task-status-text ${getTaskStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <div className={`lcars-task-priority ${getPriorityColor(task.priority)}`}>
                    <FlagIcon className="lcars-meta-icon" />
                    <span>{task.priority.toUpperCase()}</span>
                  </div>
                </div>
                <div className="lcars-task-content">
                  <div className="lcars-task-title">{task.title}</div>
                  <div className="lcars-task-description">{task.description}</div>
                  <div className="lcars-task-meta">
                    <div className="lcars-task-assignee">
                      <UserGroupIcon className="lcars-meta-icon" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="lcars-task-story-points">
                      <StarIcon className="lcars-meta-icon" />
                      <span>{task.story_points} POINTS</span>
                    </div>
                    <div className="lcars-task-due">
                      <ClockIcon className="lcars-meta-icon" />
                      <span>DUE: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="lcars-task-tags">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="lcars-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lcars-quick-actions">
          <div className="lcars-section-header">
            <RocketLaunchIcon className="lcars-icon" />
            <span>MISSION ACTIONS</span>
          </div>
          <div className="lcars-actions-grid">
            <Link href="/tasks" className="lcars-action-button">
              <FlagIcon className="lcars-action-icon" />
              <span>VIEW ALL TASKS</span>
            </Link>
            <Link href="/analytics" className="lcars-action-button">
              <ChartBarIcon className="lcars-action-icon" />
              <span>MISSION ANALYTICS</span>
            </Link>
            <Link href="/observation-lounge" className="lcars-action-button">
              <BeakerIcon className="lcars-action-icon" />
              <span>AI CONSULTATION</span>
            </Link>
            <Link href="/projects" className="lcars-action-button">
              <FolderIcon className="lcars-action-icon" />
              <span>ALL MISSIONS</span>
            </Link>
          </div>
        </div>
      </div>
    </LCARSLayout>
  );
} 