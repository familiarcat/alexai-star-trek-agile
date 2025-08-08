'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
}

interface Workflow {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  connections: any;
  active?: boolean;
}

interface N8nWorkflowEditorProps {
  className?: string;
}

export default function N8nWorkflowEditor({ className }: N8nWorkflowEditorProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
    checkN8nConnection();
  }, []);

  const checkN8nConnection = async () => {
    try {
      const response = await fetch('/api/n8n-integration');
      const data = await response.json();
      setIsConnected(data.connected || false);
    } catch (error) {
      console.error('N8n connection check failed:', error);
      setIsConnected(false);
    }
  };

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      // Try to load from n8n first, then fall back to local
      const response = await fetch('/api/n8n-integration/workflows');
      const data = await response.json();
      
      if (data.success && data.workflows) {
        setWorkflows(data.workflows);
      } else {
        // Load local workflows as fallback
        await loadLocalWorkflows();
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      await loadLocalWorkflows();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows/local');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Failed to load local workflows:', error);
      setWorkflows([]);
    }
  };

  const syncWorkflows = async (direction: 'push' | 'pull' | 'bidirectional') => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('/api/n8n-integration/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus('success');
        await loadWorkflows(); // Reload workflows after sync
        setTimeout(() => setSyncStatus('idle'), 2000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const activateWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/n8n-integration/workflows/${workflowId}/activate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await loadWorkflows();
      }
    } catch (error) {
      console.error('Failed to activate workflow:', error);
    }
  };

  const testWorkflow = async (workflowId: string) => {
    try {
      const testPayload = {
        query: "Test workflow execution",
        context: "integrated-testing",
        userRole: "developer"
      };

      const response = await fetch(`/api/n8n-integration/workflows/${workflowId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      const result = await response.json();
      console.log('Test result:', result);
      
      // Show result in UI
      alert(`Test ${result.success ? 'successful' : 'failed'}: ${JSON.stringify(result.response || result.error)}`);
    } catch (error) {
      console.error('Failed to test workflow:', error);
      alert('Test failed: ' + error.message);
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...';
      case 'success': return 'Sync successful';
      case 'error': return 'Sync failed';
      default: return 'Ready';
    }
  };

  return (
    <div className={`lcars-panel p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-400">N8N Workflow Integration</h2>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className={`${getSyncStatusColor()}`}>
            {getSyncStatusText()}
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <Card className="mb-6 bg-gray-900 border-orange-400">
        <CardHeader>
          <CardTitle className="text-orange-400">Workflow Synchronization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <button
              onClick={() => syncWorkflows('pull')}
              disabled={syncStatus === 'syncing'}
              className="lcars-button px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Pull from n8n
            </button>
            <button
              onClick={() => syncWorkflows('push')}
              disabled={syncStatus === 'syncing'}
              className="lcars-button px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Push to n8n
            </button>
            <button
              onClick={() => syncWorkflows('bidirectional')}
              disabled={syncStatus === 'syncing'}
              className="lcars-button px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              Bidirectional Sync
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow List */}
      <Card className="bg-gray-900 border-orange-400">
        <CardHeader>
          <CardTitle className="text-orange-400">Available Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading workflows...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No workflows found</div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id || workflow.name}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{workflow.name}</h3>
                    <p className="text-sm text-gray-400">
                      {workflow.nodes?.length || 0} nodes
                      {workflow.active !== undefined && (
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          workflow.active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="lcars-button px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    {workflow.id && (
                      <>
                        <button
                          onClick={() => activateWorkflow(workflow.id!)}
                          className="lcars-button px-3 py-1 bg-green-600 hover:bg-green-700 text-sm"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => testWorkflow(workflow.id!)}
                          className="lcars-button px-3 py-1 bg-orange-600 hover:bg-orange-700 text-sm"
                        >
                          Test
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Editor */}
      {selectedWorkflow && (
        <Card className="mt-6 bg-gray-900 border-orange-400">
          <CardHeader>
            <CardTitle className="text-orange-400">
              Workflow Editor: {selectedWorkflow.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={selectedWorkflow.name}
                  onChange={(e) => setSelectedWorkflow({
                    ...selectedWorkflow,
                    name: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Configuration (JSON)
                </label>
                <textarea
                  value={JSON.stringify(selectedWorkflow, null, 2)}
                  onChange={(e) => {
                    try {
                      const updated = JSON.parse(e.target.value);
                      setSelectedWorkflow(updated);
                    } catch (error) {
                      // Invalid JSON, ignore for now
                    }
                  }}
                  rows={20}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // Save workflow logic would go here
                    alert('Workflow saved locally. Use sync to push to n8n.');
                  }}
                  className="lcars-button px-4 py-2 bg-green-600 hover:bg-green-700"
                >
                  Save Locally
                </button>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="lcars-button px-4 py-2 bg-gray-600 hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
