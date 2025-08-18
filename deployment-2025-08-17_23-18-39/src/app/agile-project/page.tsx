'use client';

import React, { useState, useEffect } from 'react';
import AgileKanbanBoard from '@/core/components/AgileKanbanBoard';

export default function AgileProjectPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [crewStatus, setCrewStatus] = useState('connecting');

  useEffect(() => {
    // Initialize the agile project
    const initializeProject = async () => {
      try {
        // Test crew connection
        const crewResponse = await fetch('/api/crew/observation-lounge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'Initialize agile project coordination system',
            context: 'agile-project-startup',
            urgency: 'normal'
          })
        });

        if (crewResponse.ok) {
          setCrewStatus('connected');
        } else {
          setCrewStatus('disconnected');
        }

        // Load project configuration
        const projectConfig = {
          name: "AlexAI Test Project - Enterprise Dashboard",
          version: "1.0.0",
          type: "agile-test-project",
          created: "2025-08-09",
          status: "active",
          methodology: "agile-scrum",
          currentSprint: {
            id: "sprint-1",
            name: "Foundation Sprint",
            duration: "2 weeks",
            startDate: "2025-08-09",
            endDate: "2025-08-23",
            goals: [
              "Set up Kanban board UI",
              "Integrate AlexAI crew coordination",
              "Implement basic agile workflow",
              "Test end-to-end functionality"
            ]
          },
          team: {
            product_owner: "Captain Picard",
            scrum_master: "Lieutenant Data",
            developers: ["Chief Engineer Scott", "Lieutenant Worf"],
            stakeholders: ["Counselor Troi", "Commander Spock"]
          }
        };

        setProjectData(projectConfig);

      } catch (error) {
        console.error('Failed to initialize agile project:', error);
        setCrewStatus('error');
      } finally {
        // Always set loading to false after initialization attempt
        setIsLoading(false);
      }
    };

    initializeProject();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mb-4"></div>
          <h2 className="text-2xl font-bold text-yellow-400">Initializing Agile Project</h2>
          <p className="text-gray-400">Connecting to AlexAI crew coordination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">
                🚀 AlexAI Agile Project Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Enterprise Dashboard - Full Agile Workflow with Crew Coordination
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                crewStatus === 'connected' ? 'bg-green-600 text-white' : 
                crewStatus === 'connecting' ? 'bg-yellow-600 text-white' : 
                'bg-red-600 text-white'
              }`}>
                Crew: {crewStatus}
              </div>
              <div className="text-sm text-gray-400">
                Sprint 1 - Foundation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">Sprint 1</div>
              <div className="text-sm text-gray-400">Current Sprint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">5 days</div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">26 SP</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">3/8</div>
              <div className="text-sm text-gray-400">Tasks Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">87%</div>
              <div className="text-sm text-gray-400">Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sprint Goals */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-3">🎯 Sprint Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {projectData?.currentSprint?.goals?.map((goal: string, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">{goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-3">👥 Crew Assignments</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-lg">🖖</span>
              <span className="text-sm">
                <span className="text-yellow-400 font-medium">Product Owner:</span>
                <span className="text-white ml-1">{projectData?.team?.product_owner}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-lg">🤖</span>
              <span className="text-sm">
                <span className="text-blue-400 font-medium">Scrum Master:</span>
                <span className="text-white ml-1">{projectData?.team?.scrum_master}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-lg">⚙️</span>
              <span className="text-sm">
                <span className="text-green-400 font-medium">Developers:</span>
                <span className="text-white ml-1">{projectData?.team?.developers?.join(', ')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kanban Board */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AgileKanbanBoard />
        </div>
      </div>

      {/* Footer with Test Actions */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/workflow-management'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                🔧 Workflow Management
              </button>
              <button
                onClick={() => window.location.href = '/observation-lounge'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                👥 Crew Consultation
              </button>
              <button
                onClick={() => window.location.href = '/analytics'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                📊 Analytics
              </button>
            </div>
            <div className="text-sm text-gray-400">
              AlexAI Enterprise Dashboard v{projectData?.version} | Best of Both Worlds Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
