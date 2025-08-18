'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { useEnhancedLCARS } from '../../providers/enhanced-lcars-provider';

// Error Boundary Props
interface EnhancedLCARSErrorBoundaryProps {
  children: ReactNode;
  componentName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  retryCount?: number;
  maxRetries?: number;
}

// Error Boundary State
interface EnhancedLCARSErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  lastErrorTime: number;
}

// Enhanced LCARS Error Boundary Component
export class EnhancedLCARSErrorBoundary extends Component<
  EnhancedLCARSErrorBoundaryProps,
  EnhancedLCARSErrorBoundaryState
> {
  constructor(props: EnhancedLCARSErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedLCARSErrorBoundaryState> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error information
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error(`🚨 Enhanced LCARS Error Boundary caught an error in ${this.props.componentName}:`, error, errorInfo);

    // Try to report error to LCARS system if available
    this.reportErrorToLCARS(error, errorInfo);
  }

  // Report error to LCARS system
  private reportErrorToLCARS(error: Error, errorInfo: ErrorInfo) {
    try {
      // Access LCARS context through a wrapper component
      const errorReport = {
        componentName: this.props.componentName,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        timestamp: new Date().toISOString(),
        retryCount: this.state.retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Store error in localStorage for persistence
      const errorKey = `lcars-error-${this.props.componentName}-${Date.now()}`;
      localStorage.setItem(errorKey, JSON.stringify(errorReport));

      // Try to send error to LCARS system via postMessage
      if (typeof window !== 'undefined') {
        window.postMessage({
          type: 'LCARS_ERROR_REPORT',
          payload: errorReport,
        }, '*');
      }
    } catch (reportError) {
      console.error('Failed to report error to LCARS system:', reportError);
    }
  }

  // Retry component rendering
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Max retries reached, show permanent error
      console.error(`Max retries (${maxRetries}) reached for ${this.props.componentName}`);
    }
  };

  // Reset error boundary
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: 0,
    });
  };

  // Get error details for debugging
  private getErrorDetails() {
    const { error, errorInfo, retryCount, lastErrorTime } = this.state;
    const { componentName, maxRetries = 3 } = this.props;
    
    return {
      componentName,
      errorName: error?.name || 'Unknown Error',
      errorMessage: error?.message || 'An unexpected error occurred',
      errorStack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      retryCount,
      maxRetries,
      lastErrorTime: new Date(lastErrorTime).toLocaleString(),
      canRetry: retryCount < maxRetries,
      timeSinceError: Date.now() - lastErrorTime,
    };
  }

  render() {
    if (this.state.hasError) {
      const errorDetails = this.getErrorDetails();
      
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render enhanced error UI
      return (
        <EnhancedLCARSErrorUI
          errorDetails={errorDetails}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Enhanced LCARS Error UI Component
interface EnhancedLCARSErrorUIProps {
  errorDetails: ReturnType<EnhancedLCARSErrorBoundary['getErrorDetails']>;
  onRetry: () => void;
  onReset: () => void;
}

function EnhancedLCARSErrorUI({ errorDetails, onRetry, onReset }: EnhancedLCARSErrorUIProps) {
  const { state, actions } = useEnhancedLCARS();

  // Report error to LCARS system
  React.useEffect(() => {
    actions.setErrorBoundary(errorDetails.componentName, {
      error: errorDetails.errorName,
      message: errorDetails.errorMessage,
      timestamp: new Date().toISOString(),
      retryCount: errorDetails.retryCount,
    });

    // Increment error count
    actions.incrementErrorCount();
  }, [errorDetails.componentName, errorDetails.errorName, errorDetails.errorMessage, errorDetails.retryCount, actions]);

  return (
    <div className="enhanced-lcars-error-boundary">
      <div className="error-container">
        <div className="error-header">
          <div className="error-icon">🚨</div>
          <h2 className="error-title">Component Error Detected</h2>
          <p className="error-subtitle">
            {errorDetails.componentName} has encountered an error
          </p>
        </div>

        <div className="error-details">
          <div className="error-section">
            <h3>Error Information</h3>
            <div className="error-info">
              <p><strong>Type:</strong> {errorDetails.errorName}</p>
              <p><strong>Message:</strong> {errorDetails.errorMessage}</p>
              <p><strong>Component:</strong> {errorDetails.componentName}</p>
              <p><strong>Retry Count:</strong> {errorDetails.retryCount} / {errorDetails.maxRetries}</p>
              <p><strong>Time:</strong> {errorDetails.lastErrorTime}</p>
            </div>
          </div>

          {errorDetails.errorStack && (
            <div className="error-section">
              <h3>Stack Trace</h3>
              <div className="error-stack">
                <pre>{errorDetails.errorStack}</pre>
              </div>
            </div>
          )}

          {errorDetails.componentStack && (
            <div className="error-section">
              <h3>Component Stack</h3>
              <div className="error-stack">
                <pre>{errorDetails.componentStack}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="error-actions">
          {errorDetails.canRetry && (
            <button 
              className="error-btn retry-btn"
              onClick={onRetry}
            >
              🔄 Retry Component
            </button>
          )}
          
          <button 
            className="error-btn reset-btn"
            onClick={onReset}
          >
            🔧 Reset Error Boundary
          </button>
          
          <button 
            className="error-btn report-btn"
            onClick={() => {
              // Copy error details to clipboard
              navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
              alert('Error details copied to clipboard');
            }}
          >
            📋 Copy Error Details
          </button>
        </div>

        <div className="error-footer">
          <div className="system-status">
            <p><strong>LCARS System Status:</strong> {state.system.status}</p>
            <p><strong>Total Errors:</strong> {state.system.errorCount}</p>
            <p><strong>Memory Usage:</strong> {state.performance.memoryUsage}MB</p>
          </div>
          
          <div className="error-help">
            <p>💡 <strong>Tip:</strong> If this error persists, try refreshing the page or contact system support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced LCARS Error Boundary Styles
const enhancedLCARSErrorBoundaryStyles = `
  .enhanced-lcars-error-boundary {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: 'Courier New', monospace;
    color: #ffffff;
  }

  .error-container {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #ff6b6b;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
  }

  .error-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #ff6b6b;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  .error-title {
    font-size: 2rem;
    font-weight: bold;
    color: #ff6b6b;
    margin-bottom: 0.5rem;
  }

  .error-subtitle {
    font-size: 1.1rem;
    color: #cccccc;
    margin: 0;
  }

  .error-details {
    margin-bottom: 2rem;
  }

  .error-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    border-left: 4px solid #ff6b6b;
  }

  .error-section h3 {
    color: #ff6b6b;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .error-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  .error-stack {
    background: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    max-height: 200px;
  }

  .error-stack pre {
    margin: 0;
    font-size: 0.8rem;
    color: #ff9999;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .error-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .error-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .retry-btn {
    background: #4ecdc4;
    color: #000;
  }

  .retry-btn:hover {
    background: #45b7aa;
  }

  .reset-btn {
    background: #ffd93d;
    color: #000;
  }

  .reset-btn:hover {
    background: #e6c200;
  }

  .report-btn {
    background: #6c5ce7;
    color: #fff;
  }

  .report-btn:hover {
    background: #5a4fcf;
  }

  .error-footer {
    border-top: 1px solid #ff6b6b;
    padding-top: 1rem;
  }

  .system-status {
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
  }

  .system-status p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #cccccc;
  }

  .error-help {
    text-align: center;
    padding: 1rem;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 0.5rem;
    border-left: 4px solid #4caf50;
  }

  .error-help p {
    margin: 0;
    font-size: 0.9rem;
    color: #4caf50;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .enhanced-lcars-error-boundary {
      padding: 1rem;
    }

    .error-container {
      padding: 1rem;
    }

    .error-title {
      font-size: 1.5rem;
    }

    .error-actions {
      flex-direction: column;
    }

    .error-btn {
      width: 100%;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = enhancedLCARSErrorBoundaryStyles;
  document.head.appendChild(styleElement);
}

// Export the error boundary component
export default EnhancedLCARSErrorBoundary;
