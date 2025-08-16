'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  CpuChipIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CogIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline';

interface KnowledgeBaseExpanderProps {
  onKnowledgeExpanded?: (knowledge: any) => void;
}

interface VideoContent {
  id: string;
  url: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResult?: any;
  crewInsights?: any[];
  businessOpportunities?: any[];
  knowledgeConnections?: any[];
}

interface KnowledgeConnection {
  sourceVideo: string;
  targetVideo: string;
  connectionType: 'complementary' | 'competitive' | 'related' | 'expansion';
  strength: number;
  description: string;
  crewRecommendations: string[];
}

interface AgentKnowledge {
  agentId: string;
  agentName: string;
  expertise: string[];
  knowledgeAreas: string[];
  recentInsights: string[];
  connections: string[];
  recommendations: string[];
}

export function KnowledgeBaseExpander({ onKnowledgeExpanded }: KnowledgeBaseExpanderProps) {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [knowledgeConnections, setKnowledgeConnections] = useState<KnowledgeConnection[]>([]);
  const [agentKnowledge, setAgentKnowledge] = useState<AgentKnowledge[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'input' | 'analysis' | 'connection' | 'integration'>('input');

  // Pre-populated with relevant YouTube content for knowledge expansion
  const suggestedVideos = [
    {
      id: '1',
      url: 'https://www.youtube.com/watch?v=S8a7gkFhoBA&t=398s',
      title: 'AI Automation Business Opportunities',
      description: 'Analysis of AI automation market and business opportunities',
      duration: '15:30',
      category: 'AI & Automation',
      status: 'completed' as const
    },
    {
      id: '2',
      url: 'https://www.youtube.com/watch?v=example2',
      title: 'Multi-LLM Orchestration Strategies',
      description: 'Advanced strategies for orchestrating multiple language models',
      duration: '22:15',
      category: 'AI Architecture',
      status: 'pending' as const
    },
    {
      id: '3',
      url: 'https://www.youtube.com/watch?v=example3',
      title: 'Enterprise AI Implementation',
      description: 'Best practices for implementing AI in enterprise environments',
      duration: '18:45',
      category: 'Enterprise AI',
      status: 'pending' as const
    },
    {
      id: '4',
      url: 'https://www.youtube.com/watch?v=example4',
      title: 'AI-Powered Workflow Automation',
      description: 'Creating intelligent workflows with AI and n8n integration',
      duration: '25:20',
      category: 'Workflow Automation',
      status: 'pending' as const
    },
    {
      id: '5',
      url: 'https://www.youtube.com/watch?v=example5',
      title: 'AI Consulting Business Models',
      description: 'Profitable business models for AI consulting services',
      duration: '20:10',
      category: 'Business Strategy',
      status: 'pending' as const
    }
  ];

  useEffect(() => {
    setVideos(suggestedVideos);
    initializeAgentKnowledge();
  }, []);

  const initializeAgentKnowledge = () => {
    const initialAgents: AgentKnowledge[] = [
      {
        agentId: 'captain-picard',
        agentName: 'Captain Picard',
        expertise: ['Strategic Leadership', 'Enterprise Consulting', 'Business Development'],
        knowledgeAreas: ['AI Strategy', 'Market Analysis', 'Partnership Development'],
        recentInsights: ['AI automation market growing 300% YoY', 'Enterprise consulting rates $150-300/hour'],
        connections: ['Commander Data', 'Chief Communications Officer'],
        recommendations: ['Focus on enterprise AI consulting', 'Develop strategic partnerships']
      },
      {
        agentId: 'commander-data',
        agentName: 'Commander Data',
        expertise: ['AI Architecture', 'Technical Analysis', 'System Design'],
        knowledgeAreas: ['Multi-LLM Integration', 'Technical Architecture', 'Performance Optimization'],
        recentInsights: ['Multi-LLM orchestration requires intelligent routing', 'Claude + OpenAI combination optimal'],
        connections: ['Chief Engineer Scott', 'Captain Picard'],
        recommendations: ['Build intelligent routing algorithms', 'Focus on technical competitive advantage']
      },
      {
        agentId: 'chief-engineer-scott',
        agentName: 'Chief Engineer Scott',
        expertise: ['Infrastructure', 'Scalability', 'System Engineering'],
        knowledgeAreas: ['Cloud Architecture', 'Performance Engineering', 'Security'],
        recentInsights: ['Cloud-native architecture essential for scaling', 'Security framework needed for enterprise'],
        connections: ['Commander Data', 'Chief Security Officer'],
        recommendations: ['Design cloud-native architecture', 'Implement security framework']
      }
    ];
    setAgentKnowledge(initialAgents);
  };

  const addVideo = (url: string) => {
    const newVideo: VideoContent = {
      id: Date.now().toString(),
      url,
      title: 'Analyzing...',
      description: 'Content analysis in progress',
      duration: 'Unknown',
      category: 'Pending Analysis',
      status: 'pending'
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const expandKnowledgeBase = async () => {
    setIsExpanding(true);
    setCurrentPhase('analysis');

    try {
      // Simulate processing all pending videos
      for (const video of videos.filter(v => v.status === 'pending')) {
        await processVideo(video);
      }

      setCurrentPhase('connection');
      await createKnowledgeConnections();
      
      setCurrentPhase('integration');
      await integrateAgentKnowledge();
      
      onKnowledgeExpanded?.({
        videos: videos.filter(v => v.status === 'completed'),
        connections: knowledgeConnections,
        agentKnowledge
      });

    } catch (error) {
      console.error('Knowledge expansion failed:', error);
    } finally {
      setIsExpanding(false);
    }
  };

  const processVideo = async (video: VideoContent) => {
    // Simulate video processing
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, status: 'processing' } : v
    ));

    // Simulate API call to YouTube analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAnalysis = {
      title: `Enhanced ${video.title}`,
      description: `Comprehensive analysis of ${video.category} content`,
      businessOpportunities: generateMockOpportunities(video.category),
      crewInsights: generateMockCrewInsights(video.category),
      knowledgeAreas: generateMockKnowledgeAreas(video.category)
    };

    setVideos(prev => prev.map(v => 
      v.id === video.id ? { 
        ...v, 
        status: 'completed',
        analysisResult: mockAnalysis,
        title: mockAnalysis.title,
        description: mockAnalysis.description
      } : v
    ));
  };

  const generateMockOpportunities = (category: string) => {
    const opportunities = {
      'AI & Automation': [
        { title: 'AI Process Automation Platform', roi: 450, complexity: 'High' },
        { title: 'Intelligent Workflow Engine', roi: 380, complexity: 'Medium' }
      ],
      'AI Architecture': [
        { title: 'Multi-LLM Orchestration Framework', roi: 520, complexity: 'High' },
        { title: 'AI Model Management System', roi: 410, complexity: 'Medium' }
      ],
      'Enterprise AI': [
        { title: 'Enterprise AI Consulting Services', roi: 600, complexity: 'Low' },
        { title: 'AI Implementation Framework', roi: 480, complexity: 'Medium' }
      ],
      'Workflow Automation': [
        { title: 'n8n AI Integration Platform', roi: 390, complexity: 'Medium' },
        { title: 'Intelligent Workflow Designer', roi: 340, complexity: 'Low' }
      ],
      'Business Strategy': [
        { title: 'AI Business Model Consulting', roi: 550, complexity: 'Low' },
        { title: 'AI Market Analysis Services', roi: 420, complexity: 'Medium' }
      ]
    };
    return opportunities[category as keyof typeof opportunities] || [];
  };

  const generateMockCrewInsights = (category: string) => {
    const insights = {
      'AI & Automation': [
        { agent: 'Commander Data', insight: 'Multi-LLM orchestration essential for automation' },
        { agent: 'Chief Engineer Scott', insight: 'Scalable infrastructure required for enterprise deployment' }
      ],
      'AI Architecture': [
        { agent: 'Commander Data', insight: 'Intelligent routing algorithms needed for optimal performance' },
        { agent: 'Captain Picard', insight: 'Strategic architecture decisions impact market positioning' }
      ],
      'Enterprise AI': [
        { agent: 'Captain Picard', insight: 'Enterprise consulting requires proven methodologies' },
        { agent: 'Chief Communications Officer', insight: 'Clear value propositions essential for sales' }
      ]
    };
    return insights[category as keyof typeof insights] || [];
  };

  const generateMockKnowledgeAreas = (category: string) => {
    const areas = {
      'AI & Automation': ['Process Automation', 'Workflow Optimization', 'AI Integration'],
      'AI Architecture': ['Model Orchestration', 'Performance Optimization', 'Scalability'],
      'Enterprise AI': ['Implementation Strategy', 'Change Management', 'ROI Measurement'],
      'Workflow Automation': ['n8n Integration', 'AI Workflow Design', 'Process Mapping'],
      'Business Strategy': ['Market Analysis', 'Business Model Design', 'Go-to-Market Strategy']
    };
    return areas[category as keyof typeof areas] || [];
  };

  const createKnowledgeConnections = async () => {
    const connections: KnowledgeConnection[] = [];
    
    // Create connections between related videos
    for (let i = 0; i < videos.length; i++) {
      for (let j = i + 1; j < videos.length; j++) {
        const video1 = videos[i];
        const video2 = videos[j];
        
        if (video1.status === 'completed' && video2.status === 'completed') {
          const connection = analyzeConnection(video1, video2);
          if (connection) {
            connections.push(connection);
          }
        }
      }
    }
    
    setKnowledgeConnections(connections);
  };

  const analyzeConnection = (video1: VideoContent, video2: VideoContent): KnowledgeConnection | null => {
    // Simple connection analysis based on categories and content
    const categorySimilarity = video1.category === video2.category ? 0.8 : 0.3;
    const contentOverlap = calculateContentOverlap(video1, video2);
    
    if (categorySimilarity > 0.5 || contentOverlap > 0.4) {
      return {
        sourceVideo: video1.id,
        targetVideo: video2.id,
        connectionType: determineConnectionType(video1, video2),
        strength: (categorySimilarity + contentOverlap) / 2,
        description: `Strong connection between ${video1.category} and ${video2.category} content`,
        crewRecommendations: generateCrewRecommendations(video1, video2)
      };
    }
    
    return null;
  };

  const calculateContentOverlap = (video1: VideoContent, video2: VideoContent): number => {
    // Simple content overlap calculation
    const words1 = video1.description.toLowerCase().split(' ');
    const words2 = video2.description.toLowerCase().split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const determineConnectionType = (video1: VideoContent, video2: VideoContent): 'complementary' | 'competitive' | 'related' | 'expansion' => {
    if (video1.category === video2.category) {
      return 'complementary';
    } else if (video1.category.includes('AI') && video2.category.includes('AI')) {
      return 'related';
    } else {
      return 'expansion';
    }
  };

  const generateCrewRecommendations = (video1: VideoContent, video2: VideoContent): string[] => {
    return [
      `Combine insights from ${video1.title} and ${video2.title}`,
      'Create integrated solution combining both approaches',
      'Develop cross-category expertise for competitive advantage'
    ];
  };

  const integrateAgentKnowledge = async () => {
    // Update agent knowledge based on new video analysis
    const updatedAgents = agentKnowledge.map(agent => {
      const relevantVideos = videos.filter(v => 
        v.status === 'completed' && 
        v.analysisResult?.knowledgeAreas.some((area: string) => 
          agent.expertise.some(exp => exp.toLowerCase().includes(area.toLowerCase()))
        )
      );

      const newInsights = relevantVideos.flatMap(v => 
        v.analysisResult?.crewInsights
          ?.filter((insight: any) => insight.agent === agent.agentName)
          ?.map((insight: any) => insight.insight) || []
      );

      const newConnections = relevantVideos.flatMap(v => 
        v.analysisResult?.knowledgeAreas || []
      );

      return {
        ...agent,
        recentInsights: [...agent.recentInsights, ...newInsights].slice(-5),
        knowledgeAreas: [...new Set([...agent.knowledgeAreas, ...newConnections])],
        recommendations: generateAgentRecommendations(agent, relevantVideos)
      };
    });

    setAgentKnowledge(updatedAgents);
  };

  const generateAgentRecommendations = (agent: AgentKnowledge, relevantVideos: VideoContent[]): string[] => {
    const recommendations = [];
    
    if (agent.agentName === 'Captain Picard') {
      recommendations.push('Focus on strategic AI consulting opportunities');
      recommendations.push('Develop enterprise AI implementation methodologies');
    } else if (agent.agentName === 'Commander Data') {
      recommendations.push('Build advanced multi-LLM orchestration capabilities');
      recommendations.push('Develop AI performance optimization frameworks');
    } else if (agent.agentName === 'Chief Engineer Scott') {
      recommendations.push('Design scalable cloud-native AI infrastructure');
      recommendations.push('Implement enterprise-grade security frameworks');
    }

    return recommendations;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'processing': return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <CogIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPhaseProgress = () => {
    const totalVideos = videos.length;
    const completedVideos = videos.filter(v => v.status === 'completed').length;
    const processingVideos = videos.filter(v => v.status === 'processing').length;
    
    return {
      total: totalVideos,
      completed: completedVideos,
      processing: processingVideos,
      pending: totalVideos - completedVideos - processingVideos
    };
  };

  return (
    <div className="lcars-panel">
      <h2>🧠 KNOWLEDGE BASE EXPANSION SYSTEM</h2>
      
      {/* Phase Progress */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Knowledge Expansion Progress</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lcars-green)' }}>
              {getPhaseProgress().completed}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Completed</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lcars-blue)' }}>
              {getPhaseProgress().processing}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Processing</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lcars-orange)' }}>
              {getPhaseProgress().pending}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Pending</div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lcars-violet)' }}>
              {knowledgeConnections.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>Connections</div>
          </div>
        </div>
      </div>

      {/* Video Input */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Add YouTube Content for Analysis</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter YouTube URL"
            style={{
              flex: 1,
              padding: '10px',
              border: '2px solid var(--lcars-orange)',
              borderRadius: '4px',
              backgroundColor: 'var(--lcars-bg)',
              color: 'var(--lcars-text)'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                addVideo(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder="Enter YouTube URL"]') as HTMLInputElement;
              if (input?.value) {
                addVideo(input.value);
                input.value = '';
              }
            }}
            className="lcars-button primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
        
        <button
          onClick={expandKnowledgeBase}
          disabled={isExpanding || videos.filter(v => v.status === 'pending').length === 0}
          className="lcars-button success"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            opacity: videos.filter(v => v.status === 'pending').length === 0 ? 0.5 : 1
          }}
        >
          <ServerStackIcon className="w-4 h-4" />
          {isExpanding ? 'Expanding Knowledge...' : 'Expand Knowledge Base'}
        </button>
      </div>

      {/* Video List */}
      <div className="lcars-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#000', marginBottom: '15px' }}>Content Analysis Queue</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {videos.map((video) => (
            <div
              key={video.id}
              className="lcars-card"
              style={{ 
                padding: '15px',
                border: '2px solid',
                borderColor: video.status === 'completed' ? 'var(--lcars-green)' : 
                           video.status === 'processing' ? 'var(--lcars-blue)' : 
                           video.status === 'failed' ? 'var(--lcars-red)' : 'var(--lcars-orange)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#000', margin: 0, marginBottom: '5px' }}>{video.title}</h4>
                  <p style={{ color: 'var(--lcars-text-purple)', margin: 0, fontSize: '0.9rem' }}>
                    {video.description}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>
                      📹 {video.duration}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>
                      🏷️ {video.category}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getStatusIcon(video.status)}
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </span>
                </div>
              </div>

              {video.analysisResult && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'var(--lcars-bg-light)', borderRadius: '4px' }}>
                  <h5 style={{ color: '#000', margin: 0, marginBottom: '10px' }}>Analysis Results</h5>
                  
                  {video.analysisResult.businessOpportunities?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--lcars-text-purple)' }}>Business Opportunities:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                        {video.analysisResult.businessOpportunities.map((opp: any, index: number) => (
                          <span key={index} className="lcars-status success" style={{ fontSize: '0.8rem' }}>
                            {opp.title} (ROI: {opp.roi}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {video.analysisResult.crewInsights?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--lcars-text-purple)' }}>Crew Insights:</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                        {video.analysisResult.crewInsights.map((insight: any, index: number) => (
                          <div key={index} style={{ fontSize: '0.8rem', color: 'var(--lcars-text)' }}>
                            <strong>{insight.agent}:</strong> {insight.insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Connections */}
      {knowledgeConnections.length > 0 && (
        <div className="lcars-card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Knowledge Connections</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {knowledgeConnections.map((connection, index) => (
              <div key={index} className="lcars-card" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: connection.connectionType === 'complementary' ? 'var(--lcars-green)' :
                                   connection.connectionType === 'competitive' ? 'var(--lcars-red)' :
                                   connection.connectionType === 'related' ? 'var(--lcars-blue)' : 'var(--lcars-orange)',
                    color: '#000'
                  }}>
                    {connection.connectionType.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--lcars-text-purple)' }}>
                    Strength: {Math.round(connection.strength * 100)}%
                  </span>
                </div>
                
                <p style={{ color: 'var(--lcars-text)', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {connection.description}
                </p>
                
                <div style={{ fontSize: '0.8rem', color: 'var(--lcars-text-purple)' }}>
                  <strong>Crew Recommendations:</strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                    {connection.crewRecommendations.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Knowledge Integration */}
      {agentKnowledge.length > 0 && (
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Agent Knowledge Integration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {agentKnowledge.map((agent) => (
              <div key={agent.agentId} className="lcars-card" style={{ padding: '15px' }}>
                <h4 style={{ color: '#000', margin: 0, marginBottom: '10px' }}>{agent.agentName}</h4>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Expertise:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {agent.expertise.map((exp, index) => (
                      <span key={index} className="lcars-status info" style={{ fontSize: '0.8rem' }}>
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Recent Insights:</strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0, fontSize: '0.8rem' }}>
                    {agent.recentInsights.map((insight, index) => (
                      <li key={index} style={{ marginBottom: '3px', color: 'var(--lcars-text)' }}>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <strong style={{ color: 'var(--lcars-text-purple)', fontSize: '0.9rem' }}>Recommendations:</strong>
                  <ul style={{ margin: '5px 0 0 20px', padding: 0, fontSize: '0.8rem' }}>
                    {agent.recommendations.map((rec, index) => (
                      <li key={index} style={{ marginBottom: '3px', color: 'var(--lcars-text)' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
