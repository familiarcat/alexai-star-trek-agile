'use client';

import { useEffect, useState } from 'react';
import { LCARSLayout } from '@/components/lcars/lcars-layout';
import { 
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface WeeklyPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  revenueTarget: number;
  currentRevenue: number;
  days: DailyPlan[];
  progress: {
    tasksCompleted: number;
    totalTasks: number;
    revenueGenerated: number;
    timeInvested: number;
  };
}

interface DailyPlan {
  day: string;
  focus: string;
  revenueTarget: number;
  timeInvestment: string;
  morningTasks: string[];
  afternoonTasks: string[];
  eveningTasks: string[];
  completed: boolean;
  revenueGenerated: number;
  tasksCompleted: number;
}

export default function WeeklyExecutionPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklyPlan();
  }, []);

  const fetchWeeklyPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/weekly-plan');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.weeklyPlan) {
        // Validate the data structure
        if (!data.weeklyPlan.days || !Array.isArray(data.weeklyPlan.days)) {
          throw new Error('Invalid weekly plan data structure');
        }
        
        // Ensure all required fields are present
        const validatedPlan = {
          ...data.weeklyPlan,
          days: data.weeklyPlan.days.map((day: any) => ({
            day: day.day || 'Unknown',
            focus: day.focus || 'No focus defined',
            revenueTarget: day.revenueTarget || 0,
            timeInvestment: day.timeInvestment || '0 hours',
            morningTasks: Array.isArray(day.morningTasks) ? day.morningTasks : [],
            afternoonTasks: Array.isArray(day.afternoonTasks) ? day.afternoonTasks : [],
            eveningTasks: Array.isArray(day.eveningTasks) ? day.eveningTasks : [],
            completed: Boolean(day.completed),
            revenueGenerated: day.revenueGenerated || 0,
            tasksCompleted: day.tasksCompleted || 0
          }))
        };
        
        setWeeklyPlan(validatedPlan);
      } else {
        setError(data.error || 'Failed to load weekly plan');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weekly execution plan';
      setError(errorMessage);
      console.error('Weekly plan fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskCompletion = async (day: string, taskIndex: number, completed: boolean) => {
    try {
      const response = await fetch('/api/weekly-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day,
          taskIndex,
          completed,
          revenueGenerated: completed ? 100 : 0 // Mock revenue for completed tasks
        }),
      });

      if (response.ok) {
        // Refresh the weekly plan
        fetchWeeklyPlan();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const getRevenueProgress = () => {
    if (!weeklyPlan || !weeklyPlan.revenueTarget) return 0;
    const progress = (weeklyPlan.currentRevenue / weeklyPlan.revenueTarget) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  };

  const getTaskProgress = () => {
    if (!weeklyPlan || !weeklyPlan.progress.totalTasks) return 0;
    const progress = (weeklyPlan.progress.tasksCompleted / weeklyPlan.progress.totalTasks) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  };

  const getDayProgress = (day: DailyPlan) => {
    if (!day) return 0;
    const totalTasks = (day.morningTasks?.length || 0) + (day.afternoonTasks?.length || 0) + (day.eveningTasks?.length || 0);
    if (totalTasks === 0) return 0;
    const progress = ((day.tasksCompleted || 0) / totalTasks) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  };

  if (loading) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-loading-spinner">
            <ChartBarIcon className="lcars-spinner-icon" />
          </div>
          <div className="lcars-text-xlarge lcars-text-gold">Loading Weekly Execution Plan...</div>
          <div className="lcars-text-large lcars-text-white lcars-mt-10">Initializing mission data</div>
          <div className="lcars-loading-progress lcars-mt-20">
            <div className="lcars-progress-bar">
              <div className="lcars-progress-fill"></div>
            </div>
          </div>
        </div>
      </LCARSLayout>
    );
  }

  if (error) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-error-icon">
            <ExclamationTriangleIcon className="w-16 h-16" />
          </div>
          <div className="lcars-text-xlarge lcars-text-orange lcars-mt-10">Mission Control Error</div>
          <div className="lcars-text-large lcars-text-white lcars-mt-10">{error}</div>
          <button 
            onClick={fetchWeeklyPlan}
            className="lcars-button lcars-button-primary lcars-mt-20"
          >
            Retry Mission Data
          </button>
        </div>
      </LCARSLayout>
    );
  }

  if (!weeklyPlan) {
    return (
      <LCARSLayout>
        <div className="lcars-panel lcars-p-30 lcars-text-center">
          <div className="lcars-text-xlarge lcars-text-orange">No Weekly Plan Available</div>
        </div>
      </LCARSLayout>
    );
  }

  return (
    <LCARSLayout>
      <div className="lcars-panel lcars-p-30">
        {/* Header */}
        <div className="lcars-header lcars-mb-20">
          <div className="lcars-text-xlarge lcars-text-gold">WEEKLY EXECUTION PLAN</div>
          <div className="lcars-text-large lcars-text-white">
            Week {weeklyPlan.weekNumber} • {weeklyPlan.startDate} - {weeklyPlan.endDate}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="lcars-progress-overview lcars-mb-30">
          <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-4 lcars-gap-20">
            <div className="lcars-stat-card">
              <div className="lcars-stat-icon">
                <CurrencyDollarIcon className="w-8 h-8 lcars-text-green" />
              </div>
              <div className="lcars-stat-content">
                <div className="lcars-stat-value lcars-text-gold">
                  ${weeklyPlan.currentRevenue.toLocaleString()}
                </div>
                <div className="lcars-stat-label">Revenue Generated</div>
                <div className="lcars-stat-target">
                  Target: ${weeklyPlan.revenueTarget.toLocaleString()}
                </div>
                <div className="lcars-progress-bar lcars-mt-10">
                  <div 
                    className="lcars-progress-fill lcars-bg-green"
                    style={{ width: `${getRevenueProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="lcars-stat-card">
              <div className="lcars-stat-icon">
                <CheckCircleIcon className="w-8 h-8 lcars-text-blue" />
              </div>
              <div className="lcars-stat-content">
                <div className="lcars-stat-value lcars-text-gold">
                  {weeklyPlan.progress.tasksCompleted}/{weeklyPlan.progress.totalTasks}
                </div>
                <div className="lcars-stat-label">Tasks Completed</div>
                <div className="lcars-progress-bar lcars-mt-10">
                  <div 
                    className="lcars-progress-fill lcars-bg-blue"
                    style={{ width: `${getTaskProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="lcars-stat-card">
              <div className="lcars-stat-icon">
                <ClockIcon className="w-8 h-8 lcars-text-orange" />
              </div>
              <div className="lcars-stat-content">
                <div className="lcars-stat-value lcars-text-gold">
                  {weeklyPlan.progress.timeInvested}h
                </div>
                <div className="lcars-stat-label">Time Invested</div>
                <div className="lcars-stat-target">
                  Target: 56h
                </div>
              </div>
            </div>

            <div className="lcars-stat-card">
              <div className="lcars-stat-icon">
                <ArrowTrendingUpIcon className="w-8 h-8 lcars-text-purple" />
              </div>
              <div className="lcars-stat-content">
                <div className="lcars-stat-value lcars-text-gold">
                  {Math.round(getRevenueProgress())}%
                </div>
                <div className="lcars-stat-label">Revenue Progress</div>
                <div className="lcars-stat-target">
                  {getRevenueProgress() >= 100 ? 'Target Achieved!' : 'On Track'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="lcars-weekly-schedule">
          <div className="lcars-text-large lcars-text-gold lcars-mb-20">WEEKLY SCHEDULE</div>
          
          <div className="lcars-grid lcars-grid-cols-1 lcars-md-grid-cols-7 lcars-gap-15">
            {weeklyPlan.days && weeklyPlan.days.length > 0 ? weeklyPlan.days.map((day) => (
              <div 
                key={day.day}
                className={`lcars-day-card ${selectedDay === day.day ? 'lcars-selected' : ''}`}
                onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
              >
                <div className="lcars-day-header">
                  <div className="lcars-day-name">{day.day}</div>
                  <div className="lcars-day-focus">{day.focus}</div>
                </div>
                
                <div className="lcars-day-stats">
                  <div className="lcars-day-revenue">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>${day.revenueTarget}</span>
                  </div>
                  <div className="lcars-day-time">
                    <ClockIcon className="w-4 h-4" />
                    <span>{day.timeInvestment}</span>
                  </div>
                </div>
                
                <div className="lcars-day-progress">
                  <div className="lcars-progress-bar">
                    <div 
                      className="lcars-progress-fill"
                      style={{ width: `${getDayProgress(day)}%` }}
                    ></div>
                  </div>
                  <span className="lcars-progress-text">{Math.round(getDayProgress(day))}%</span>
                </div>
                
                <div className="lcars-day-status">
                  {day.completed ? (
                    <CheckCircleIcon className="w-5 h-5 lcars-text-green" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 lcars-text-orange" />
                  )}
                </div>
              </div>
            )) : (
              <div className="lcars-col-span-7 lcars-text-center lcars-p-20">
                <div className="lcars-text-large lcars-text-orange">No weekly schedule available</div>
                <div className="lcars-text-medium lcars-text-white lcars-mt-10">Please check back later</div>
              </div>
            )}
          </div>
        </div>

        {/* Day Detail View */}
        {selectedDay && (
          <div className="lcars-day-detail lcars-mt-30">
            <div className="lcars-text-large lcars-text-gold lcars-mb-20">
              {selectedDay} - Detailed Tasks
            </div>
            
            {weeklyPlan.days.find(day => day.day === selectedDay) && (
              <div className="lcars-day-tasks">
                {['morningTasks', 'afternoonTasks', 'eveningTasks'].map((session) => (
                  <div key={session} className="lcars-task-session lcars-mb-20">
                    <div className="lcars-session-header">
                      <div className="lcars-text-medium lcars-text-gold">
                        {session.replace('Tasks', '').charAt(0).toUpperCase() + 
                         session.replace('Tasks', '').slice(1)} Session
                      </div>
                    </div>
                    
                    <div className="lcars-task-list">
                      {(() => {
                        const day = weeklyPlan.days.find(day => day.day === selectedDay);
                        if (!day) return null;
                        
                        const tasks = day[session as keyof DailyPlan];
                        if (!Array.isArray(tasks)) return null;
                        
                        return tasks.map((task, index) => (
                          <div key={index} className="lcars-task-item">
                            <div className="lcars-task-checkbox">
                              <input
                                type="checkbox"
                                checked={false} // This would be connected to actual task completion state
                                onChange={() => updateTaskCompletion(selectedDay, index, true)}
                                className="lcars-checkbox"
                              />
                            </div>
                            <div className="lcars-task-text">{task}</div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="lcars-actions lcars-mt-30">
          <div className="lcars-flex lcars-gap-15 lcars-justify-center">
            <button
              onClick={fetchWeeklyPlan}
              className="lcars-button lcars-button-primary"
            >
              <ChartBarIcon className="w-4 h-4 lcars-mr-2" />
              Refresh Progress
            </button>
            <button
              onClick={() => window.print()}
              className="lcars-button lcars-button-secondary"
            >
              <CalendarIcon className="w-4 h-4 lcars-mr-2" />
              Export Plan
            </button>
          </div>
        </div>
      </div>
    </LCARSLayout>
  );
}
