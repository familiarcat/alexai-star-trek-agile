'use client';

import Phase3LLMOptimizationDemo from '../../components/phase-3-llm-optimization-demo';

export default function Phase3LLMOptimizationDemoPage() {
  return (
    <div className="phase-3-demo-page">
      <div className="page-header">
        <h1>🧠 Phase 3 Demo - LLM Optimization Strategy</h1>
        <p>Demonstrating our intelligent LLM switching and crew coordination system</p>
      </div>
      
      <Phase3LLMOptimizationDemo />
      
      <div className="page-footer">
        <p>Phase 3: LLM Optimization & Execution Coordination</p>
        <a href="/" className="back-link">← Back to Dashboard</a>
      </div>
    </div>
  );
}
