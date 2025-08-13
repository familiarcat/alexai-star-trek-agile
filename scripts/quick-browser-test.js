#!/usr/bin/env node

// 🧪 Quick Browser Testing Script for Unified Intelligence System
// Mission: Verify browser functionality of our new features

const { exec } = require('child_process');
const fs = require('fs');

console.log('🧪 Quick Browser Testing - Unified Intelligence System');
console.log('=====================================================');
console.log('');

// Test configuration
const testConfig = {
  baseUrl: 'http://localhost:3000',
  testPages: [
    '/ships-computer',
    '/api/health'
  ],
  expectedElements: [
    'SHIP\'S COMPUTER - LCARS ORCHESTRATOR',
    'System Health Dashboard',
    'Mission Control',
    'LCARS Layout Configuration',
    'System Alerts',
    'Orchestration Controls'
  ]
};

// Test utilities
function logTest(testName, result, details = '') {
  if (result) {
    console.log(`✅ ${testName}`);
  } else {
    console.log(`❌ ${testName}`);
    if (details) console.log(`   Details: ${details}`);
  }
}

function logSection(title) {
  console.log(`\n🔍 ${title}`);
  console.log('─'.repeat(title.length + 2));
}

// Test 1: Server Health Check
logSection('Server Health Check');

exec(`curl -s ${testConfig.baseUrl}/api/health`, (error, stdout, stderr) => {
  if (error) {
    logTest('Server Health Endpoint', false, `Server not responding: ${error.message}`);
  } else {
    try {
      const response = JSON.parse(stdout);
      if (response.status === 'ok') {
        logTest('Server Health Endpoint', true, 'Server is healthy and responding');
      } else {
        logTest('Server Health Endpoint', false, `Unexpected response: ${stdout}`);
      }
    } catch (parseError) {
      logTest('Server Health Endpoint', false, `Invalid JSON response: ${stdout}`);
    }
  }
  
  // Continue with other tests
  runPageTests();
});

// Test 2: Page Accessibility Tests
function runPageTests() {
  logSection('Page Accessibility Tests');
  
  testConfig.testPages.forEach(page => {
    const url = `${testConfig.baseUrl}${page}`;
    
    exec(`curl -s -I "${url}"`, (error, stdout, stderr) => {
      if (error) {
        logTest(`Page ${page}`, false, `Failed to access: ${error.message}`);
      } else {
        if (stdout.includes('HTTP/1.1 200') || stdout.includes('HTTP/2 200')) {
          logTest(`Page ${page}`, true, `Page accessible (${url})`);
        } else {
          logTest(`Page ${page}`, false, `Unexpected response: ${stdout.split('\n')[0]}`);
        }
      }
    });
  });
  
  // Wait a moment for async tests to complete
  setTimeout(() => {
    runFileValidationTests();
  }, 2000);
}

// Test 3: File Validation Tests
function runFileValidationTests() {
  logSection('File Validation Tests');
  
  // Check if all required files exist and are readable
  const requiredFiles = [
    'src/lib/supabase-collective-memory.ts',
    'src/components/lcars/ships-computer-lcars-orchestrator.tsx',
    'src/app/ships-computer/page.tsx',
    'src/app/ships-computer/ships-computer.css',
    'workflows/alexai-unified-intelligence-integration.json'
  ];
  
  requiredFiles.forEach(file => {
    try {
      const stats = fs.statSync(file);
      if (stats.isFile()) {
        logTest(`File ${file}`, true, `File exists (${stats.size} bytes)`);
      } else {
        logTest(`File ${file}`, false, 'Not a regular file');
      }
    } catch (error) {
      logTest(`File ${file}`, false, `File not accessible: ${error.message}`);
    }
  });
  
  // Check file content quality
  runContentQualityTests();
}

// Test 4: Content Quality Tests
function runContentQualityTests() {
  logSection('Content Quality Tests');
  
  try {
    // Check TypeScript compilation
    exec('npm run type-check', (error, stdout, stderr) => {
      if (error) {
        logTest('TypeScript Compilation', false, 'TypeScript errors found');
        console.log('   TypeScript Output:', stdout);
      } else {
        logTest('TypeScript Compilation', true, 'No TypeScript errors');
      }
      
      // Final summary
      runFinalSummary();
    });
  } catch (error) {
    logTest('TypeScript Compilation', false, `Failed to run type-check: ${error.message}`);
    runFinalSummary();
  }
}

// Test 5: Final Summary
function runFinalSummary() {
  logSection('Testing Summary');
  
  console.log('🎯 Browser Testing Instructions:');
  console.log('');
  console.log('1. Start development server: npm run dev');
  console.log('2. Open browser and navigate to: http://localhost:3000/ships-computer');
  console.log('3. Verify the following elements are visible:');
  
  testConfig.expectedElements.forEach(element => {
    console.log(`   - ${element}`);
  });
  
  console.log('');
  console.log('4. Test interactive features:');
  console.log('   - Click "🚀 INITIALIZE SYSTEM" button');
  console.log('   - Click "🎨 UPDATE LAYOUT" button');
  console.log('   - Click "🧪 TEST ALERT" button');
  console.log('');
  console.log('5. Check browser console for any errors');
  console.log('6. Test responsive design by resizing browser window');
  console.log('');
  console.log('🎉 Quick browser testing complete!');
  console.log('🚀 Ready for manual testing and deployment!');
  console.log('');
  console.log('Live long and prosper! 🖖');
}

// Start testing
console.log('🚀 Starting quick browser tests...');
console.log(`📍 Testing against: ${testConfig.baseUrl}`);
console.log('⏳ Please ensure your development server is running (npm run dev)');
console.log('');
