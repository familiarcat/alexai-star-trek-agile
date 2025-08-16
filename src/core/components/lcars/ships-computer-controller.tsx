'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  ComputerDesktopIcon,
  CogIcon,
  ShieldCheckIcon,
  SignalIcon,
  ChartBarIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Ship's Computer Agent Context
interface ShipsComputerContextType {
  // Layout Control
  showSidebar: boolean;
  sidebarCollapsed: boolean;
  showMiddleSection: boolean;
  showTopFrame: boolean;
  showDataCascade: boolean;
  showNavigationPills: boolean;
  showBarPanels: boolean;
  showLeftFrame: boolean;
  showFooter: boolean;
  
  // Dynamic Content Control
  currentTheme: string;
  systemStatus: string;
  subspaceLink: string;
  databaseStatus: string;
  aiCoreStatus: string;
  quantumMemoryStatus: string;
  
  // Navigation Control
  activeNavigation: string;
  navigationHistory: string[];
  
  // System Functions
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  toggleMiddleSection: () => void;
  toggleTopFrame: () => void;
  toggleDataCascade: () => void;
  toggleNavigationPills: () => void;
  toggleBarPanels: () => void;
  toggleLeftFrame: () => void;
  toggleFooter: () => void;
  
  // Theme Control
  setTheme: (theme: string) => void;
  
  // Status Control
  updateSystemStatus: (status: string) => void;
  updateSubspaceLink: (status: string) => void;
  updateDatabaseStatus: (status: string) => void;
  updateAiCoreStatus: (status: string) => void;
  updateQuantumMemoryStatus: (status: string) => void;
  
  // Navigation Control
  navigateTo: (route: string) => void;
  goBack: () => void;
  
  // Emergency Protocols
  activateEmergencyProtocol: (protocol: string) => void;
  deactivateEmergencyProtocol: (protocol: string) => void;
  
  // System Diagnostics
  runSystemDiagnostics: () => Promise<any>;
  getSystemHealth: () => Promise<any>;
  
  // AI Agent Integration
  sendToAiAgent: (message: string) => Promise<any>;
  getAiAgentStatus: () => Promise<any>;
}

const ShipsComputerContext = createContext<ShipsComputerContextType | undefined>(undefined);

export function useShipsComputer() {
  const context = useContext(ShipsComputerContext);
  if (context === undefined) {
    throw new Error('useShipsComputer must be used within a ShipsComputerProvider');
  }
  return context;
}

interface ShipsComputerProviderProps {
  children: ReactNode;
}

export function ShipsComputerProvider({ children }: ShipsComputerProviderProps) {
  // Layout State
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMiddleSection, setShowMiddleSection] = useState(true);
  const [showTopFrame, setShowTopFrame] = useState(true);
  const [showDataCascade, setShowDataCascade] = useState(true);
  const [showNavigationPills, setShowNavigationPills] = useState(true);
  const [showBarPanels, setShowBarPanels] = useState(true);
  const [showLeftFrame, setShowLeftFrame] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  
  // Dynamic Content State
  const [currentTheme, setCurrentTheme] = useState('ultra-classic');
  const [systemStatus, setSystemStatus] = useState('Online');
  const [subspaceLink, setSubspaceLink] = useState('Established');
  const [databaseStatus, setDatabaseStatus] = useState('Connected');
  const [aiCoreStatus, setAiCoreStatus] = useState('Operational');
  const [quantumMemoryStatus, setQuantumMemoryStatus] = useState('Stable');
  
  // Navigation State
  const [activeNavigation, setActiveNavigation] = useState('/');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['/']);
  
  // Layout Control Functions
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMiddleSection = () => setShowMiddleSection(!showMiddleSection);
  const toggleTopFrame = () => setShowTopFrame(!showTopFrame);
  const toggleDataCascade = () => setShowDataCascade(!showDataCascade);
  const toggleNavigationPills = () => setShowNavigationPills(!showNavigationPills);
  const toggleBarPanels = () => setShowBarPanels(!showBarPanels);
  const toggleLeftFrame = () => setShowLeftFrame(!showLeftFrame);
  const toggleFooter = () => setShowFooter(!showFooter);
  
  // Theme Control
  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    // Apply theme-specific settings
    switch (theme) {
      case 'ultra-classic':
        setShowTopFrame(true);
        setShowDataCascade(true);
        setShowNavigationPills(true);
        setShowBarPanels(true);
        setShowLeftFrame(true);
        break;
      case 'minimal':
        setShowTopFrame(false);
        setShowDataCascade(false);
        setShowNavigationPills(false);
        setShowBarPanels(false);
        setShowLeftFrame(false);
        break;
      case 'focused':
        setShowTopFrame(true);
        setShowDataCascade(false);
        setShowNavigationPills(true);
        setShowBarPanels(false);
        setShowLeftFrame(false);
        break;
      default:
        break;
    }
  };
  
  // Status Control Functions
  const updateSystemStatus = (status: string) => setSystemStatus(status);
  const updateSubspaceLink = (status: string) => setSubspaceLink(status);
  const updateDatabaseStatus = (status: string) => setDatabaseStatus(status);
  const updateAiCoreStatus = (status: string) => setAiCoreStatus(status);
  const updateQuantumMemoryStatus = (status: string) => setQuantumMemoryStatus(status);
  
  // Navigation Control Functions
  const navigateTo = (route: string) => {
    setActiveNavigation(route);
    setNavigationHistory(prev => [...prev, route]);
  };
  
  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setActiveNavigation(newHistory[newHistory.length - 1]);
    }
  };
  
  // Emergency Protocols
  const activateEmergencyProtocol = (protocol: string) => {
    console.log(`🚨 Activating Emergency Protocol: ${protocol}`);
    
    switch (protocol) {
      case 'red-alert':
        setTheme('minimal');
        setShowSidebar(false);
        setShowMiddleSection(false);
        setSystemStatus('RED ALERT');
        break;
      case 'yellow-alert':
        setTheme('focused');
        setSystemStatus('YELLOW ALERT');
        break;
      case 'blue-alert':
        setTheme('ultra-classic');
        setSystemStatus('BLUE ALERT');
        break;
      default:
        break;
    }
  };
  
  const deactivateEmergencyProtocol = (protocol: string) => {
    console.log(`✅ Deactivating Emergency Protocol: ${protocol}`);
    setTheme('ultra-classic');
    setShowSidebar(true);
    setShowMiddleSection(true);
    setSystemStatus('Online');
  };
  
  // System Diagnostics
  const runSystemDiagnostics = async () => {
    console.log('🔍 Running System Diagnostics...');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      systemStatus,
      subspaceLink,
      databaseStatus,
      aiCoreStatus,
      quantumMemoryStatus,
      layoutComponents: {
        sidebar: showSidebar,
        middleSection: showMiddleSection,
        topFrame: showTopFrame,
        dataCascade: showDataCascade,
        navigationPills: showNavigationPills,
        barPanels: showBarPanels,
        leftFrame: showLeftFrame,
        footer: showFooter
      },
      theme: currentTheme,
      navigation: {
        active: activeNavigation,
        history: navigationHistory
      }
    };
    
    return diagnostics;
  };
  
  const getSystemHealth = async () => {
    const health = {
      overall: 'Excellent',
      components: {
        layout: 'Operational',
        navigation: 'Operational',
        ai: 'Operational',
        database: 'Operational'
      },
      recommendations: [] as string[]
    };
    
    if (!showSidebar) health.recommendations.push('Consider enabling sidebar for full navigation');
    if (systemStatus !== 'Online') health.recommendations.push('System status indicates attention required');
    
    return health;
  };
  
  // AI Agent Integration
  const sendToAiAgent = async (message: string) => {
    console.log(`🤖 Sending to AI Agent: ${message}`);
    
    // Simulate AI agent response
    const response = {
      timestamp: new Date().toISOString(),
      message,
      response: `AI Agent acknowledges: ${message}`,
      suggestions: [
        'Run system diagnostics',
        'Check navigation history',
        'Verify system status'
      ]
    };
    
    return response;
  };
  
  const getAiAgentStatus = async () => {
    return {
      status: 'Active',
      lastActivity: new Date().toISOString(),
      capabilities: [
        'Layout Control',
        'Navigation Management',
        'System Monitoring',
        'Emergency Protocols',
        'Theme Management'
      ]
    };
  };
  
  // Auto-update system status
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time status updates
      const statuses = ['Online', 'Operational', 'Active', 'Ready'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      if (Math.random() > 0.95) { // 5% chance to change status
        setSystemStatus(randomStatus);
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const contextValue: ShipsComputerContextType = {
    // Layout Control
    showSidebar,
    sidebarCollapsed,
    showMiddleSection,
    showTopFrame,
    showDataCascade,
    showNavigationPills,
    showBarPanels,
    showLeftFrame,
    showFooter,
    
    // Dynamic Content Control
    currentTheme,
    systemStatus,
    subspaceLink,
    databaseStatus,
    aiCoreStatus,
    quantumMemoryStatus,
    
    // Navigation Control
    activeNavigation,
    navigationHistory,
    
    // System Functions
    toggleSidebar,
    toggleSidebarCollapse,
    toggleMiddleSection,
    toggleTopFrame,
    toggleDataCascade,
    toggleNavigationPills,
    toggleBarPanels,
    toggleLeftFrame,
    toggleFooter,
    
    // Theme Control
    setTheme,
    
    // Status Control
    updateSystemStatus,
    updateSubspaceLink,
    updateDatabaseStatus,
    updateAiCoreStatus,
    updateQuantumMemoryStatus,
    
    // Navigation Control
    navigateTo,
    goBack,
    
    // Emergency Protocols
    activateEmergencyProtocol,
    deactivateEmergencyProtocol,
    
    // System Diagnostics
    runSystemDiagnostics,
    getSystemHealth,
    
    // AI Agent Integration
    sendToAiAgent,
    getAiAgentStatus
  };
  
  return (
    <ShipsComputerContext.Provider value={contextValue}>
      {children}
    </ShipsComputerContext.Provider>
  );
}

// Ship's Computer Control Panel Component
export function ShipsComputerControlPanel() {
  const {
    showSidebar,
    sidebarCollapsed,
    showMiddleSection,
    showTopFrame,
    showDataCascade,
    showNavigationPills,
    showBarPanels,
    showLeftFrame,
    showFooter,
    currentTheme,
    systemStatus,
    toggleSidebar,
    toggleSidebarCollapse,
    toggleMiddleSection,
    toggleTopFrame,
    toggleDataCascade,
    toggleNavigationPills,
    toggleBarPanels,
    toggleLeftFrame,
    toggleFooter,
    setTheme,
    activateEmergencyProtocol,
    deactivateEmergencyProtocol,
    runSystemDiagnostics
  } = useShipsComputer();
  
  return (
    <div className="lcars-panel">
      <h2>SHIP'S COMPUTER CONTROL PANEL</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Layout Control */}
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Layout Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={toggleSidebar}
              className={`lcars-button ${showSidebar ? 'success' : 'secondary'}`}
            >
              {showSidebar ? 'Hide' : 'Show'} Sidebar
            </button>
            
            <button 
              onClick={toggleSidebarCollapse}
              className={`lcars-button ${sidebarCollapsed ? 'success' : 'secondary'}`}
              disabled={!showSidebar}
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
            </button>
            
            <button 
              onClick={toggleMiddleSection}
              className={`lcars-button ${showMiddleSection ? 'success' : 'secondary'}`}
            >
              {showMiddleSection ? 'Hide' : 'Show'} Middle Section
            </button>
            
            <button 
              onClick={toggleTopFrame}
              className={`lcars-button ${showTopFrame ? 'success' : 'secondary'}`}
            >
              {showTopFrame ? 'Hide' : 'Show'} Top Frame
            </button>
          </div>
        </div>
        
        {/* Content Control */}
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Content Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={toggleDataCascade}
              className={`lcars-button ${showDataCascade ? 'success' : 'secondary'}`}
            >
              {showDataCascade ? 'Hide' : 'Show'} Data Cascade
            </button>
            
            <button 
              onClick={toggleNavigationPills}
              className={`lcars-button ${showNavigationPills ? 'success' : 'secondary'}`}
            >
              {showNavigationPills ? 'Hide' : 'Show'} Navigation Pills
            </button>
            
            <button 
              onClick={toggleBarPanels}
              className={`lcars-button ${showBarPanels ? 'success' : 'secondary'}`}
            >
              {showBarPanels ? 'Hide' : 'Show'} Bar Panels
            </button>
            
            <button 
              onClick={toggleLeftFrame}
              className={`lcars-button ${showLeftFrame ? 'success' : 'secondary'}`}
            >
              {showLeftFrame ? 'Hide' : 'Show'} Left Frame
            </button>
          </div>
        </div>
        
        {/* Theme Control */}
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Theme Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => setTheme('ultra-classic')}
              className={`lcars-button ${currentTheme === 'ultra-classic' ? 'success' : 'secondary'}`}
            >
              Ultra Classic
            </button>
            
            <button 
              onClick={() => setTheme('minimal')}
              className={`lcars-button ${currentTheme === 'minimal' ? 'success' : 'secondary'}`}
            >
              Minimal
            </button>
            
            <button 
              onClick={() => setTheme('focused')}
              className={`lcars-button ${currentTheme === 'focused' ? 'success' : 'secondary'}`}
            >
              Focused
            </button>
          </div>
        </div>
        
        {/* Emergency Protocols */}
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>Emergency Protocols</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => activateEmergencyProtocol('red-alert')}
              className="lcars-button primary"
            >
              🚨 RED ALERT
            </button>
            
            <button 
              onClick={() => activateEmergencyProtocol('yellow-alert')}
              className="lcars-button warning"
            >
              ⚠️ YELLOW ALERT
            </button>
            
            <button 
              onClick={() => activateEmergencyProtocol('blue-alert')}
              className="lcars-button secondary"
            >
              🔵 BLUE ALERT
            </button>
            
            <button 
              onClick={() => deactivateEmergencyProtocol('all')}
              className="lcars-button success"
            >
              ✅ CLEAR ALERTS
            </button>
          </div>
        </div>
        
        {/* System Status */}
        <div className="lcars-card">
          <h3 style={{ color: '#000', marginBottom: '15px' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Status:</span>
              <span style={{ 
                color: systemStatus === 'Online' ? 'var(--lcars-green)' : 'var(--lcars-red)',
                fontWeight: 'bold'
              }}>
                {systemStatus}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Theme:</span>
              <span style={{ color: 'var(--lcars-text-purple)' }}>
                {currentTheme.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            
            <button 
              onClick={runSystemDiagnostics}
              className="lcars-button"
            >
              🔍 Run Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
