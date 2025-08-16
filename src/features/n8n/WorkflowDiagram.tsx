'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  typeVersion?: number;
  webhookId?: string;
}

interface WorkflowConnection {
  node: string;
  type: string;
  index: number;
}

interface WorkflowConnections {
  [nodeId: string]: {
    main: WorkflowConnection[][];
  };
}

interface Workflow {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  active?: boolean;
  settings?: any;
  staticData?: any;
}

interface WorkflowDiagramProps {
  workflow: Workflow;
  onWorkflowChange?: (workflow: Workflow) => void;
  className?: string;
}

export default function WorkflowDiagram({ workflow, onWorkflowChange, className }: WorkflowDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'n8n-nodes-base.webhook':
        return '🪝';
      case 'n8n-nodes-base.httpRequest':
        return '🌐';
      case 'n8n-nodes-base.code':
        return '⚙️';
      case 'n8n-nodes-base.respondToWebhook':
        return '📤';
      default:
        return '📦';
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'n8n-nodes-base.webhook':
        return 'border-green-400 bg-green-900';
      case 'n8n-nodes-base.httpRequest':
        return 'border-blue-400 bg-blue-900';
      case 'n8n-nodes-base.code':
        return 'border-purple-400 bg-purple-900';
      case 'n8n-nodes-base.respondToWebhook':
        return 'border-orange-400 bg-orange-900';
      default:
        return 'border-gray-400 bg-gray-900';
    }
  };

  const getNodeDescription = (node: WorkflowNode) => {
    switch (node.type) {
      case 'n8n-nodes-base.webhook':
        return `Webhook: ${node.parameters?.path || 'undefined'}`;
      case 'n8n-nodes-base.httpRequest':
        if (node.name.includes('Selector') || node.name.includes('AI')) {
          return 'OpenRouter AI Selection';
        } else if (node.name.includes('Response') || node.name.includes('Member')) {
          return 'Crew Member API Call';
        }
        return `HTTP: ${node.parameters?.url ? 'configured' : 'not configured'}`;
      case 'n8n-nodes-base.code':
        return 'JavaScript Logic';
      case 'n8n-nodes-base.respondToWebhook':
        return 'Return Response';
      default:
        return node.type.replace('n8n-nodes-base.', '');
    }
  };

  const calculateConnectionPath = (fromNode: WorkflowNode, toNode: WorkflowNode) => {
    const fromX = fromNode.position[0] + 120; // Node width
    const fromY = fromNode.position[1] + 40;  // Node height / 2
    const toX = toNode.position[0];
    const toY = toNode.position[1] + 40;

    // Create a curved connection
    const midX = (fromX + toX) / 2;
    const deltaY = Math.abs(toY - fromY);
    const curvature = Math.min(deltaY / 2, 50);

    return `M ${fromX} ${fromY} 
            C ${fromX + curvature} ${fromY}, 
              ${toX - curvature} ${toY}, 
              ${toX} ${toY}`;
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    Object.entries(workflow.connections).forEach(([nodeId, nodeConnections]) => {
      const fromNode = workflow.nodes.find(n => n.name === nodeId);
      if (!fromNode) return;

      nodeConnections.main?.[0]?.forEach((connection) => {
        const toNode = workflow.nodes.find(n => n.name === connection.node);
        if (!toNode) return;

        const path = calculateConnectionPath(fromNode, toNode);
        connections.push(
          <g key={`${fromNode.id}-${toNode.id}`}>
            <path
              d={path}
              stroke="#ff9900"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="connection-path"
            />
          </g>
        );
      });
    });

    return connections;
  };

  const handleNodeMouseDown = (nodeId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setSelectedNode(nodeId);
    setIsDragging(true);
    
    const rect = (event.target as Element).closest('.workflow-node')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const newX = event.clientX - svgRect.left - dragOffset.x;
    const newY = event.clientY - svgRect.top - dragOffset.y;

    const updatedNodes = workflow.nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, position: [Math.max(0, newX), Math.max(0, newY)] as [number, number] }
        : node
    );

    const updatedWorkflow = { ...workflow, nodes: updatedNodes };
    onWorkflowChange?.(updatedWorkflow);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const selectedNodeData = selectedNode ? workflow.nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className={`workflow-diagram ${className}`}>
      <div className="flex h-96">
        {/* Main workflow canvas */}
        <div className="flex-1 relative overflow-auto bg-gray-950 border border-gray-700 rounded">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            style={{ minWidth: '1400px', minHeight: '600px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#ff9900"
                />
              </marker>
            </defs>

            {/* Render connections first (behind nodes) */}
            {renderConnections()}

            {/* Render nodes */}
            {workflow.nodes.map((node) => (
              <g key={node.id}>
                <foreignObject
                  x={node.position[0]}
                  y={node.position[1]}
                  width="240"
                  height="80"
                >
                  <div
                    className={`workflow-node relative w-60 h-20 rounded border-2 p-2 cursor-pointer transition-all duration-200 ${
                      getNodeTypeColor(node.type)
                    } ${
                      selectedNode === node.id ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                    } hover:shadow-md hover:scale-105`}
                    onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <div className="flex items-center space-x-2 h-full">
                      <div className="text-2xl">{getNodeTypeIcon(node.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm truncate">
                          {node.name}
                        </div>
                        <div className="text-xs text-gray-300 truncate">
                          {getNodeDescription(node)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection points */}
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-400"></div>
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-400"></div>
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>

        {/* Node details panel */}
        {selectedNodeData && (
          <div className="w-80 bg-gray-900 border-l border-gray-700 p-4 overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-orange-400 flex items-center space-x-2">
                  <span>{getNodeTypeIcon(selectedNodeData.type)}</span>
                  <span>{selectedNodeData.name}</span>
                </h3>
                <p className="text-sm text-gray-400">{selectedNodeData.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Node Name
                </label>
                <input
                  type="text"
                  value={selectedNodeData.name}
                  onChange={(e) => {
                    const updatedNodes = workflow.nodes.map(node =>
                      node.id === selectedNodeData.id
                        ? { ...node, name: e.target.value }
                        : node
                    );
                    onWorkflowChange?.({ ...workflow, nodes: updatedNodes });
                  }}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Position
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={selectedNodeData.position[0]}
                    onChange={(e) => {
                      const newX = parseInt(e.target.value) || 0;
                      const updatedNodes = workflow.nodes.map(node =>
                        node.id === selectedNodeData.id
                          ? { ...node, position: [newX, node.position[1]] as [number, number] }
                          : node
                      );
                      onWorkflowChange?.({ ...workflow, nodes: updatedNodes });
                    }}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={selectedNodeData.position[1]}
                    onChange={(e) => {
                      const newY = parseInt(e.target.value) || 0;
                      const updatedNodes = workflow.nodes.map(node =>
                        node.id === selectedNodeData.id
                          ? { ...node, position: [node.position[0], newY] as [number, number] }
                          : node
                      );
                      onWorkflowChange?.({ ...workflow, nodes: updatedNodes });
                    }}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    placeholder="Y"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Parameters
                </label>
                <textarea
                  value={JSON.stringify(selectedNodeData.parameters, null, 2)}
                  onChange={(e) => {
                    try {
                      const newParams = JSON.parse(e.target.value);
                      const updatedNodes = workflow.nodes.map(node =>
                        node.id === selectedNodeData.id
                          ? { ...node, parameters: newParams }
                          : node
                      );
                      onWorkflowChange?.({ ...workflow, nodes: updatedNodes });
                    } catch (error) {
                      // Invalid JSON, ignore for now
                    }
                  }}
                  rows={8}
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs font-mono"
                />
              </div>

              {selectedNodeData.type === 'n8n-nodes-base.httpRequest' && (
                <div className="p-3 bg-blue-900 rounded border border-blue-400">
                  <h4 className="font-bold text-blue-200 mb-2">HTTP Request Details</h4>
                  <div className="text-xs text-blue-100 space-y-1">
                    <div><strong>URL:</strong> {selectedNodeData.parameters?.url || 'Not configured'}</div>
                    <div><strong>Method:</strong> {selectedNodeData.parameters?.method || 'GET'}</div>
                    {selectedNodeData.parameters?.sendHeaders && (
                      <div><strong>Headers:</strong> Yes</div>
                    )}
                    {selectedNodeData.parameters?.sendBody && (
                      <div><strong>Body:</strong> {selectedNodeData.parameters?.bodyContentType || 'text'}</div>
                    )}
                  </div>
                </div>
              )}

              {selectedNodeData.type === 'n8n-nodes-base.webhook' && (
                <div className="p-3 bg-green-900 rounded border border-green-400">
                  <h4 className="font-bold text-green-200 mb-2">Webhook Details</h4>
                  <div className="text-xs text-green-100 space-y-1">
                    <div><strong>Path:</strong> {selectedNodeData.parameters?.path || 'Not configured'}</div>
                    <div><strong>Method:</strong> {selectedNodeData.parameters?.httpMethod || 'GET'}</div>
                    <div><strong>Response Mode:</strong> {selectedNodeData.parameters?.responseMode || 'responseNode'}</div>
                    {selectedNodeData.webhookId && (
                      <div><strong>Webhook ID:</strong> {selectedNodeData.webhookId}</div>
                    )}
                  </div>
                </div>
              )}

              {selectedNodeData.type === 'n8n-nodes-base.code' && (
                <div className="p-3 bg-purple-900 rounded border border-purple-400">
                  <h4 className="font-bold text-purple-200 mb-2">JavaScript Code</h4>
                  <div className="text-xs text-purple-100">
                    <div className="bg-purple-950 p-2 rounded font-mono text-xs overflow-auto max-h-32">
                      {selectedNodeData.parameters?.jsCode ? 
                        selectedNodeData.parameters.jsCode.substring(0, 200) + '...' : 
                        'No code configured'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Workflow overview */}
      <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded">
        <h4 className="font-bold text-orange-400 mb-2">Workflow Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Nodes:</span>
            <span className="ml-2 text-white">{workflow.nodes.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Connections:</span>
            <span className="ml-2 text-white">
              {Object.values(workflow.connections).reduce((acc, conn) => 
                acc + (conn.main?.[0]?.length || 0), 0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className={`ml-2 ${workflow.active ? 'text-green-400' : 'text-gray-400'}`}>
              {workflow.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Execution:</span>
            <span className="ml-2 text-white">{workflow.settings?.executionOrder || 'v1'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
