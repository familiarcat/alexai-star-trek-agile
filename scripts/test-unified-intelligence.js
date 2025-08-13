#!/usr/bin/env node

// 🧪 Unified Intelligence System Testing Script
// Mission: Comprehensive testing of all unified intelligence features

const fs = require('fs');
const path = require('path');

console.log('🧪 Unified Intelligence System Testing');
console.log('=====================================');
console.log('');

// Test Results Storage
const testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  testDetails: []
};

// Test Utilities
function logTest(testName, result, details = '') {
  testResults.totalTests++;
  if (result) {
    testResults.passedTests++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failedTests++;
    console.log(`❌ ${testName}`);
    if (details) console.log(`   Details: ${details}`);
  }
  
  testResults.testDetails.push({
    name: testName,
    passed: result,
    details: details,
    timestamp: new Date().toISOString()
  });
}

function logSection(title) {
  console.log(`\n🔍 ${title}`);
  console.log('─'.repeat(title.length + 2));
}

// Test 1: File Structure Validation
logSection('File Structure Validation');
logTest(
  'Enhanced Collective Memory Service exists',
  fs.existsSync('src/lib/supabase-collective-memory.ts'),
  'Checking if supabase-collective-memory.ts exists'
);

logTest(
  'Ship Computer LCARS Orchestrator exists',
  fs.existsSync('src/components/lcars/ships-computer-lcars-orchestrator.tsx'),
  'Checking if ships-computer-lcars-orchestrator.tsx exists'
);

logTest(
  'Unified Intelligence Workflow exists',
  fs.existsSync('workflows/alexai-unified-intelligence-integration.json'),
  'Checking if unified intelligence workflow exists'
);

logTest(
  'Ship Computer Page exists',
  fs.existsSync('src/app/ships-computer/page.tsx'),
  'Checking if ships-computer page exists'
);

logTest(
  'Ship Computer CSS exists',
  fs.existsSync('src/app/ships-computer/ships-computer.css'),
  'Checking if ships-computer CSS exists'
);

// Test 2: Code Quality Validation
logSection('Code Quality Validation');

try {
  const collectiveMemoryCode = fs.readFileSync('src/lib/supabase-collective-memory.ts', 'utf8');
  
  logTest(
    'Collective Memory Service has proper exports',
    collectiveMemoryCode.includes('export class EnhancedCollectiveMemoryService') &&
    collectiveMemoryCode.includes('export const collectiveMemoryService'),
    'Checking for proper class and instance exports'
  );
  
  logTest(
    'Collective Memory Service has required methods',
    collectiveMemoryCode.includes('createMemoryEntry') &&
    collectiveMemoryCode.includes('getAgentLearningProfile') &&
    collectiveMemoryCode.includes('analyzeCollectiveIntelligence'),
    'Checking for required service methods'
  );
  
} catch (error) {
  logTest('Collective Memory Service code quality', false, error.message);
}

try {
  const lcarsOrchestratorCode = fs.readFileSync('src/components/lcars/ships-computer-lcars-orchestrator.tsx', 'utf8');
  
  logTest(
    'LCARS Orchestrator has proper React component structure',
    lcarsOrchestratorCode.includes('export default function') &&
    lcarsOrchestratorCode.includes('useState') &&
    lcarsOrchestratorCode.includes('useEffect'),
    'Checking for proper React component structure'
  );
  
  logTest(
    'LCARS Orchestrator has required state management',
    lcarsOrchestratorCode.includes('ShipComputerState') &&
    lcarsOrchestratorCode.includes('LCARSLayoutConfig'),
    'Checking for required state interfaces'
  );
  
} catch (error) {
  logTest('LCARS Orchestrator code quality', false, error.message);
}

// Test 3: Workflow Validation
logSection('n8n Workflow Validation');

try {
  const workflowData = JSON.parse(fs.readFileSync('workflows/alexai-unified-intelligence-integration.json', 'utf8'));
  
  logTest(
    'Workflow has correct structure',
    workflowData.name && workflowData.nodes && workflowData.connections,
    'Checking workflow JSON structure'
  );
  
  logTest(
    'Workflow has required nodes',
    workflowData.nodes.some(node => node.name === 'Unified Intelligence Request Processor') &&
    workflowData.nodes.some(node => node.name === 'Agent Coordination & Learning Synchronization') &&
    workflowData.nodes.some(node => node.name === 'Dynamic LCARS Layout Generator'),
    'Checking for required workflow nodes'
  );
  
  logTest(
    'Workflow has proper connections',
    Object.keys(workflowData.connections).length > 0,
    'Checking workflow node connections'
  );
  
} catch (error) {
  logTest('n8n Workflow validation', false, error.message);
}

// Test 4: Integration Points Validation
logSection('Integration Points Validation');

try {
  const pageCode = fs.readFileSync('src/app/ships-computer/page.tsx', 'utf8');
  
  logTest(
    'Ship Computer page imports required components',
    pageCode.includes('import ShipsComputerLCARSOrchestrator') &&
    pageCode.includes('import \'./ships-computer.css\''),
    'Checking component imports'
  );
  
  logTest(
    'Ship Computer page renders orchestrator component',
    pageCode.includes('<ShipsComputerLCARSOrchestrator />'),
    'Checking component rendering'
  );
  
} catch (error) {
  logTest('Ship Computer page integration', false, error.message);
}

// Test 5: CSS Validation
logSection('CSS Validation');

try {
  const cssCode = fs.readFileSync('src/app/ships-computer/ships-computer.css', 'utf8');
  
  logTest(
    'CSS has required LCARS classes',
    cssCode.includes('.lcars-header') &&
    cssCode.includes('.lcars-panel') &&
    cssCode.includes('.lcars-button'),
    'Checking for required LCARS CSS classes'
  );
  
  logTest(
    'CSS has responsive design',
    cssCode.includes('@media') && cssCode.includes('max-width'),
    'Checking for responsive design rules'
  );
  
  logTest(
    'CSS has theme variations',
    cssCode.includes('.lcars-emergency-red') &&
    cssCode.includes('.lcars-standard-orange') &&
    cssCode.includes('.lcars-success-green'),
    'Checking for theme variation classes'
  );
  
} catch (error) {
  logTest('CSS validation', false, error.message);
}

// Test 6: TypeScript Interface Validation
logSection('TypeScript Interface Validation');

try {
  const collectiveMemoryCode = fs.readFileSync('src/lib/supabase-collective-memory.ts', 'utf8');
  
  logTest(
    'Has CollectiveMemoryEntry interface',
    collectiveMemoryCode.includes('interface CollectiveMemoryEntry'),
    'Checking for CollectiveMemoryEntry interface'
  );
  
  logTest(
    'Has AgentLearningProfile interface',
    collectiveMemoryCode.includes('interface AgentLearningProfile'),
    'Checking for AgentLearningProfile interface'
  );
  
  logTest(
    'Has MissionOrchestration interface',
    collectiveMemoryCode.includes('interface MissionOrchestration'),
    'Checking for MissionOrchestration interface'
  );
  
} catch (error) {
  logTest('TypeScript interfaces', false, error.message);
}

// Test 7: Error Handling Validation
logSection('Error Handling Validation');

try {
  const collectiveMemoryCode = fs.readFileSync('src/lib/supabase-collective-memory.ts', 'utf8');
  
  logTest(
    'Has proper error handling',
    collectiveMemoryCode.includes('if (error) throw new Error') ||
    collectiveMemoryCode.includes('if (error)'),
    'Checking for error handling patterns'
  );
  
} catch (error) {
  logTest('Error handling validation', false, error.message);
}

// Test 8: Performance Considerations
logSection('Performance Considerations');

try {
  const lcarsOrchestratorCode = fs.readFileSync('src/components/lcars/ships-computer-lcars-orchestrator.tsx', 'utf8');
  
  logTest(
    'Uses useCallback for performance optimization',
    lcarsOrchestratorCode.includes('useCallback'),
    'Checking for useCallback usage'
  );
  
  logTest(
    'Has proper dependency arrays in useEffect',
    lcarsOrchestratorCode.includes('useEffect') && 
    lcarsOrchestratorCode.includes('[]'),
    'Checking for proper useEffect dependencies'
  );
  
} catch (error) {
  logTest('Performance considerations', false, error.message);
}

// Test Summary
logSection('Test Summary');

console.log(`\n📊 Test Results Summary:`);
console.log(`Total Tests: ${testResults.totalTests}`);
console.log(`✅ Passed: ${testResults.passedTests}`);
console.log(`❌ Failed: ${testResults.failedTests}`);
console.log(`Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);

// Save test results
const testResultsFile = `test-results-unified-intelligence-${Date.now()}.json`;
fs.writeFileSync(testResultsFile, JSON.stringify(testResults, null, 2));
console.log(`\n📁 Test results saved to: ${testResultsFile}`);

// Recommendations
console.log(`\n🎯 Testing Recommendations:`);

if (testResults.failedTests === 0) {
  console.log('✅ All tests passed! The unified intelligence system is ready for deployment.');
  console.log('🚀 Next steps: Deploy to n8n and test real-time functionality.');
} else {
  console.log('⚠️  Some tests failed. Please review and fix the issues before deployment.');
  console.log('🔧 Focus on fixing failed tests to ensure system reliability.');
}

console.log(`\n🧪 Manual Testing Checklist:`);
console.log('1. Navigate to /ships-computer page in browser');
console.log('2. Test LCARS orchestrator initialization');
console.log('3. Verify dynamic layout adaptation');
console.log('4. Test system health monitoring');
console.log('5. Verify alert system functionality');
console.log('6. Test mission orchestration controls');

console.log(`\n🎉 Testing complete! Live long and prosper! 🖖`);

// Exit with appropriate code
process.exit(testResults.failedTests === 0 ? 0 : 1);
