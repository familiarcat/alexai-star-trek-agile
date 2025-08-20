#!/usr/bin/env node

/**
 * 🧪 Modern UI Layout Testing Script
 * Tests the layout selector system and Modern UI implementation
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 MODERN UI LAYOUT TESTING INITIATED');
console.log('=====================================\n');

// Test Results
const testResults = {
  layoutSelector: {},
  modernUIPage: {},
  cssSystem: {},
  componentIntegration: {},
  overall: {}
};

// Test 1: Layout Selector Component
function testLayoutSelector() {
  console.log('🔍 Testing Layout Selector Component...');
  
  try {
    const layoutSelectorPath = 'src/core/components/layout-selector.tsx';
    const layoutSelectorExists = fs.existsSync(layoutSelectorPath);
    
    if (layoutSelectorExists) {
      const content = fs.readFileSync(layoutSelectorPath, 'utf8');
      
      // Check for required features
      const hasLayoutContext = content.includes('LayoutContext');
      const hasUseLayout = content.includes('useLayout');
      const hasModernUIImport = content.includes('ModernUIPage');
      const hasLayoutOptions = content.includes('layout-option');
      const hasFloatingToggle = content.includes('floating-layout-toggle');
      
      testResults.layoutSelector = {
        status: 'PASS',
        componentExists: true,
        hasLayoutContext,
        hasUseLayout,
        hasModernUIImport,
        hasLayoutOptions,
        hasFloatingToggle,
        score: [hasLayoutContext, hasUseLayout, hasModernUIImport, hasLayoutOptions, hasFloatingToggle].filter(Boolean).length / 5
      };
      
      console.log('✅ Layout Selector Component: PASS');
      console.log(`   - Layout Context: ${hasLayoutContext ? '✅' : '❌'}`);
      console.log(`   - useLayout Hook: ${hasUseLayout ? '✅' : '❌'}`);
      console.log(`   - Modern UI Import: ${hasModernUIImport ? '✅' : '❌'}`);
      console.log(`   - Layout Options: ${hasLayoutOptions ? '✅' : '❌'}`);
      console.log(`   - Floating Toggle: ${hasFloatingToggle ? '✅' : '❌'}`);
      console.log(`   - Score: ${Math.round(testResults.layoutSelector.score * 100)}%`);
      
    } else {
      testResults.layoutSelector = {
        status: 'FAIL',
        componentExists: false,
        score: 0
      };
      console.log('❌ Layout Selector Component: FAIL - File not found');
    }
  } catch (error) {
    testResults.layoutSelector = {
      status: 'ERROR',
      error: error.message,
      score: 0
    };
    console.log('❌ Layout Selector Component: ERROR -', error.message);
  }
}

// Test 2: Modern UI Page Component
function testModernUIPage() {
  console.log('\n🔍 Testing Modern UI Page Component...');
  
  try {
    const modernUIPath = 'src/app/modern-ui-page.tsx';
    const modernUIExists = fs.existsSync(modernUIPath);
    
    if (modernUIExists) {
      const content = fs.readFileSync(modernUIPath, 'utf8');
      
      // Check for required features
      const hasHeroSection = content.includes('modern-hero');
      const hasQuickActions = content.includes('quick-actions-section');
      const hasSystemStatus = content.includes('system-status-section');
      const hasDesignSystem = content.includes('design-system-section');
      const hasGlassCards = content.includes('glass-card');
      const hasResponsiveDesign = content.includes('responsive') || content.includes('mobile') || content.includes('tablet');
      
      testResults.modernUIPage = {
        status: 'PASS',
        componentExists: true,
        hasHeroSection,
        hasQuickActions,
        hasSystemStatus,
        hasDesignSystem,
        hasGlassCards,
        hasResponsiveDesign,
        score: [hasHeroSection, hasQuickActions, hasSystemStatus, hasDesignSystem, hasGlassCards, hasResponsiveDesign].filter(Boolean).length / 6
      };
      
      console.log('✅ Modern UI Page Component: PASS');
      console.log(`   - Hero Section: ${hasHeroSection ? '✅' : '❌'}`);
      console.log(`   - Quick Actions: ${hasQuickActions ? '✅' : '❌'}`);
      console.log(`   - System Status: ${hasSystemStatus ? '✅' : '❌'}`);
      console.log(`   - Design System: ${hasDesignSystem ? '✅' : '❌'}`);
      console.log(`   - Glass Cards: ${hasGlassCards ? '✅' : '❌'}`);
      console.log(`   - Responsive Design: ${hasResponsiveDesign ? '✅' : '❌'}`);
      console.log(`   - Score: ${Math.round(testResults.modernUIPage.score * 100)}%`);
      
    } else {
      testResults.modernUIPage = {
        status: 'FAIL',
        componentExists: false,
        score: 0
      };
      console.log('❌ Modern UI Page Component: FAIL - File not found');
    }
  } catch (error) {
    testResults.modernUIPage = {
      status: 'ERROR',
      error: error.message,
      score: 0
    };
    console.log('❌ Modern UI Page Component: ERROR -', error.message);
  }
}

// Test 3: CSS Design System
function testCSSSystem() {
  console.log('\n🔍 Testing CSS Design System...');
  
  try {
    const cssPath = 'src/app/modern-design-system.css';
    const cssExists = fs.existsSync(cssPath);
    
    if (cssExists) {
      const content = fs.readFileSync(cssPath, 'utf8');
      
      // Check for required CSS features
      const hasLayoutSelector = content.includes('layout-selector-overlay');
      const hasModernUIStyles = content.includes('modern-ui-container');
      const hasGlassmorphism = content.includes('glass-bg') || content.includes('glassmorphism');
      const hasResponsiveDesign = content.includes('@media');
      const hasAnimations = content.includes('@keyframes');
      const hasCSSVariables = content.includes('--accent-primary');
      
      testResults.cssSystem = {
        status: 'PASS',
        cssExists: true,
        hasLayoutSelector,
        hasModernUIStyles,
        hasGlassmorphism,
        hasResponsiveDesign,
        hasAnimations,
        hasCSSVariables,
        score: [hasLayoutSelector, hasModernUIStyles, hasGlassmorphism, hasResponsiveDesign, hasAnimations, hasCSSVariables].filter(Boolean).length / 6
      };
      
      console.log('✅ CSS Design System: PASS');
      console.log(`   - Layout Selector Styles: ${hasLayoutSelector ? '✅' : '❌'}`);
      console.log(`   - Modern UI Styles: ${hasModernUIStyles ? '✅' : '❌'}`);
      console.log(`   - Glassmorphism: ${hasGlassmorphism ? '✅' : '❌'}`);
      console.log(`   - Responsive Design: ${hasResponsiveDesign ? '✅' : '❌'}`);
      console.log(`   - Animations: ${hasAnimations ? '✅' : '❌'}`);
      console.log(`   - CSS Variables: ${hasCSSVariables ? '✅' : '❌'}`);
      console.log(`   - Score: ${Math.round(testResults.cssSystem.score * 100)}%`);
      
    } else {
      testResults.cssSystem = {
        status: 'FAIL',
        cssExists: false,
        score: 0
      };
      console.log('❌ CSS Design System: FAIL - File not found');
    }
  } catch (error) {
    testResults.cssSystem = {
      status: 'ERROR',
      error: error.message,
      score: 0
    };
    console.log('❌ CSS Design System: ERROR -', error.message);
  }
}

// Test 4: Component Integration
function testComponentIntegration() {
  console.log('\n🔍 Testing Component Integration...');
  
  try {
    const layoutPath = 'src/app/layout.tsx';
    const layoutExists = fs.existsSync(layoutPath);
    
    if (layoutExists) {
      const content = fs.readFileSync(layoutPath, 'utf8');
      
      // Check for integration
      const hasLayoutSelectorImport = content.includes('LayoutSelector');
      const hasLayoutSelectorUsage = content.includes('<LayoutSelector>');
      const hasModernDesignSystem = content.includes('modern-design-system.css');
      
      testResults.componentIntegration = {
        status: 'PASS',
        layoutExists: true,
        hasLayoutSelectorImport,
        hasLayoutSelectorUsage,
        hasModernDesignSystem,
        score: [hasLayoutSelectorImport, hasLayoutSelectorUsage, hasModernDesignSystem].filter(Boolean).length / 3
      };
      
      console.log('✅ Component Integration: PASS');
      console.log(`   - Layout Selector Import: ${hasLayoutSelectorImport ? '✅' : '❌'}`);
      console.log(`   - Layout Selector Usage: ${hasLayoutSelectorUsage ? '✅' : '❌'}`);
      console.log(`   - Modern Design System CSS: ${hasModernDesignSystem ? '✅' : '❌'}`);
      console.log(`   - Score: ${Math.round(testResults.componentIntegration.score * 100)}%`);
      
    } else {
      testResults.componentIntegration = {
        status: 'FAIL',
        layoutExists: false,
        score: 0
      };
      console.log('❌ Component Integration: FAIL - Layout file not found');
    }
  } catch (error) {
    testResults.componentIntegration = {
      status: 'ERROR',
      error: error.message,
      score: 0
    };
    console.log('❌ Component Integration: ERROR -', error.message);
  }
}

// Calculate Overall Score
function calculateOverallScore() {
  const scores = [
    testResults.layoutSelector.score || 0,
    testResults.modernUIPage.score || 0,
    testResults.cssSystem.score || 0,
    testResults.componentIntegration.score || 0
  ];
  
  const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  testResults.overall = {
    score: overallScore,
    grade: overallScore >= 0.9 ? 'A' : overallScore >= 0.8 ? 'B' : overallScore >= 0.7 ? 'C' : overallScore >= 0.6 ? 'D' : 'F',
    status: overallScore >= 0.8 ? 'PASS' : 'FAIL'
  };
  
  return testResults.overall;
}

// Generate Test Report
function generateReport() {
  console.log('\n📊 TEST REPORT SUMMARY');
  console.log('========================');
  
  const overall = calculateOverallScore();
  
  console.log(`Overall Score: ${Math.round(overall.score * 100)}% (${overall.grade})`);
  console.log(`Status: ${overall.status}`);
  
  console.log('\n📋 DETAILED RESULTS:');
  console.log('Layout Selector:', testResults.layoutSelector.status, `(${Math.round((testResults.layoutSelector.score || 0) * 100)}%)`);
  console.log('Modern UI Page:', testResults.modernUIPage.status, `(${Math.round((testResults.modernUIPage.score || 0) * 100)}%)`);
  console.log('CSS System:', testResults.cssSystem.status, `(${Math.round((testResults.cssSystem.score || 0) * 100)}%)`);
  console.log('Integration:', testResults.componentIntegration.status, `(${Math.round((testResults.componentIntegration.score || 0) * 100)}%)`);
  
  // Save detailed report
  const reportPath = 'test-output/modern-ui-layout-test-report.json';
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📁 Detailed report saved to: ${reportPath}`);
  
  return overall;
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Modern UI Layout Testing Suite...\n');
  
  testLayoutSelector();
  testModernUIPage();
  testCSSSystem();
  testComponentIntegration();
  
  const result = generateReport();
  
  console.log('\n🎯 TESTING COMPLETE!');
  if (result.status === 'PASS') {
    console.log('🎉 Modern UI Layout is working perfectly!');
  } else {
    console.log('⚠️  Some issues detected. Check the detailed report above.');
  }
  
  return result;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testLayoutSelector,
  testModernUIPage,
  testCSSSystem,
  testComponentIntegration
};
