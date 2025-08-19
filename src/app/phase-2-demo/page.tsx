'use client';

import Phase2Demo from '../../components/phase-2-demo';

export default function Phase2DemoPage() {
  return (
    <div className="phase-2-demo-page">
      <div className="page-header">
        <h1>🚀 Phase 2 Demo - Enhanced Modern Components</h1>
        <p>Showcasing our enhanced modern UI components with advanced interactions and performance monitoring</p>
      </div>
      
      <Phase2Demo />
      
      <div className="page-footer">
        <p>Phase 2: Enhanced Components & Performance Monitoring</p>
        <a href="/" className="back-link">← Back to Dashboard</a>
      </div>
    </div>
  );
}
