'use client';

import React from 'react';
import N8nWorkflowEditor from '@/features/n8n/N8nWorkflowEditor';

export default function WorkflowManagementPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* LCARS Header */}
      <div className="lcars-header bg-orange-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="lcars-corner-left bg-orange-400 w-8 h-8"></div>
            <h1 className="text-2xl font-bold text-black">WORKFLOW MANAGEMENT SYSTEM</h1>
          </div>
          <div className="text-black font-mono">
            NCC-1701-B • STARDATE {new Date().toISOString().split('T')[0].replace(/-/g, '.')}
          </div>
        </div>
      </div>

      {/* Navigation Panels */}
      <div className="flex">
        {/* Left Navigation */}
        <div className="w-64 bg-orange-400 p-4">
          <div className="space-y-4">
            <div className="lcars-button bg-blue-600 text-white p-3 rounded">
              <div className="font-bold">N8N INTEGRATION</div>
              <div className="text-sm">Workflow Coordination</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-orange-400">
              <div className="font-bold">SYNC STATUS</div>
              <div className="text-sm">Bidirectional Sync</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-orange-400">
              <div className="font-bold">CREW COORDINATION</div>
              <div className="text-sm">AI Agent Management</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-orange-400">
              <div className="font-bold">DEPLOYMENT</div>
              <div className="text-sm">Production Control</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Status Bar */}
            <div className="lcars-panel bg-gray-900 border-2 border-orange-400 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-orange-400 font-bold">WORKFLOW STATUS:</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-gray-400">
                    <span className="text-orange-400">CREW MEMBERS:</span> 7
                  </div>
                  <div className="text-gray-400">
                    <span className="text-orange-400">WORKFLOWS:</span> Active
                  </div>
                  <div className="text-gray-400">
                    <span className="text-orange-400">SYNC:</span> Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded N8N Workflow Editor */}
            <N8nWorkflowEditor />

            {/* Additional Information Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Integration Status */}
              <div className="lcars-panel bg-gray-900 border-2 border-orange-400 p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">INTEGRATION STATUS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">CursorAI Development:</span>
                    <span className="text-green-400">✓ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">n8n Production:</span>
                    <span className="text-green-400">✓ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bidirectional Sync:</span>
                    <span className="text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Auto Deployment:</span>
                    <span className="text-blue-400">○ Ready</span>
                  </div>
                </div>
              </div>

              {/* Crew Coordination */}
              <div className="lcars-panel bg-gray-900 border-2 border-orange-400 p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4">CREW COORDINATION</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Captain Picard:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Lieutenant Data:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Counselor Troi:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Chief Engineer Scott:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Commander Spock:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Lieutenant Worf:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Observation Lounge:</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lcars-panel bg-gray-900 border-2 border-orange-400 p-6 mt-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">QUICK ACTIONS</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="lcars-button bg-blue-600 hover:bg-blue-700 text-white p-4 rounded">
                  <div className="font-bold">DEPLOY</div>
                  <div className="text-sm">Push to Production</div>
                </button>
                <button className="lcars-button bg-green-600 hover:bg-green-700 text-white p-4 rounded">
                  <div className="font-bold">SYNC</div>
                  <div className="text-sm">Bidirectional Update</div>
                </button>
                <button className="lcars-button bg-orange-600 hover:bg-orange-700 text-white p-4 rounded">
                  <div className="font-bold">TEST</div>
                  <div className="text-sm">Validate Workflows</div>
                </button>
                <button className="lcars-button bg-purple-600 hover:bg-purple-700 text-white p-4 rounded">
                  <div className="font-bold">MONITOR</div>
                  <div className="text-sm">System Status</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-orange-400 p-4">
          <div className="space-y-4">
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-gray-700">
              <div className="font-bold">SECURITY</div>
              <div className="text-sm">Worf Protocols</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-gray-700">
              <div className="font-bold">PERFORMANCE</div>
              <div className="text-sm">System Metrics</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-gray-700">
              <div className="font-bold">LOGS</div>
              <div className="text-sm">Activity Monitor</div>
            </div>
            <div className="lcars-button bg-gray-700 text-orange-400 p-3 rounded border-2 border-gray-700">
              <div className="font-bold">ALERTS</div>
              <div className="text-sm">System Notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
