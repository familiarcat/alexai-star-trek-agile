'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Progress } from '@/core/components/ui/progress';

interface AgentStatus {
  agent: string;
  status: 'healthy' | 'warning' | 'error';
  apiEndpoint: string;
  workflowIntegration: string;
  llmConfig: string;
  bilateralSync: string;
  lastResponse: string;
  performance: number;
  errors: number;
}

interface SystemHealth {
  overall: string;
  healthyAgents: number;
  warningAgents: number;
  totalAgents: number;
  healthPercentage: number;
  recommendations: string[];
}

export default function AgentMonitoringPage() {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agent-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validationType: 'all', includeSpecialized: true })
      });
      
      if (response.ok) {
        const data = await response.json();
        const statuses = Object.values(data.agentHealthChecks);
        setAgentStatuses(statuses as AgentStatus[]);
        setSystemHealth(data.systemHealth);
      }
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading agent status...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Monitoring Dashboard</h1>
        <Button onClick={fetchAgentStatus}>Refresh Status</Button>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{systemHealth.healthyAgents}</div>
                <div className="text-sm text-gray-600">Healthy Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{systemHealth.warningAgents}</div>
                <div className="text-sm text-gray-600">Warning Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemHealth.totalAgents}</div>
                <div className="text-sm text-gray-600">Total Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{systemHealth.healthPercentage}%</div>
                <div className="text-sm text-gray-600">Health Score</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={systemHealth.healthPercentage} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentStatuses.map((agent) => (
          <Card key={agent.agent} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {agent.agent.replace('-', ' ')}
                </CardTitle>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Performance:</span> {agent.performance}%
              </div>
              <div className="text-sm">
                <span className="font-medium">Errors:</span> {agent.errors}
              </div>
              <div className="text-sm">
                <span className="font-medium">Last Response:</span> {new Date(agent.lastResponse).toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">API Endpoint:</span> {agent.apiEndpoint}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      {systemHealth?.recommendations && systemHealth.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {systemHealth.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
