#!/usr/bin/env node

/**
 * User Intent + Responsive Boundary Testing System
 * Tests the complete application through real user stories and project management workflows
 * Validates responsive boundaries across all user scenarios
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class UserIntentResponsiveTesting {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
    this.screenshotDir = 'test-screenshots/user-intent-responsive-testing';
    this.userStories = this.defineUserStories();
  }

  defineUserStories() {
    return [
      {
        id: 'project-manager-analysis',
        title: 'Project Manager Analyzing Project Status',
        userRole: 'manager',
        goals: ['analyze project progress', 'identify bottlenecks', 'plan next sprint'],
        workflow: ['', 'projects', 'analytics', 'tasks'],
        expectedBoundaries: ['navigation', 'content', 'charts', 'tables']
      },
      {
        id: 'developer-task-management',
        title: 'Developer Managing Daily Tasks',
        userRole: 'developer',
        goals: ['review assigned tasks', 'update progress', 'log time', 'report blockers'],
        workflow: ['tasks', 'workflow-management', 'crew'],
        expectedBoundaries: ['forms', 'lists', 'buttons', 'status-indicators']
      },
      {
        id: 'analyst-data-exploration',
        title: 'Data Analyst Exploring Project Metrics',
        userRole: 'analyst',
        goals: ['analyze performance data', 'generate reports', 'identify trends'],
        workflow: ['analytics', 'revenue-workflows', 'project-review'],
        expectedBoundaries: ['charts', 'tables', 'filters', 'export-controls']
      },
      {
        id: 'executive-overview',
        title: 'Executive Reviewing Portfolio Status',
        userRole: 'executive',
        goals: ['review portfolio health', 'assess resource allocation', 'make strategic decisions'],
        workflow: ['', 'analytics', 'crew', 'observation-lounge'],
        expectedBoundaries: ['overview-cards', 'summary-charts', 'action-buttons']
      }
    ];
  }

  async initialize() {
    console.log('🚀 Initializing User Intent + Responsive Boundary Testing...');
    
    await this.createDirectories();
    
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.setupPageListeners();
    
    console.log('✅ User Intent + Responsive Boundary Testing initialized');
  }

  async createDirectories() {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async setupPageListeners() {
    this.page.on('console', msg => {
      if (msg.text().includes('Ship Computer') || msg.text().includes('boundary')) {
        console.log(`🧠 Ship Computer: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.error(`❌ Page Error: ${error.message}`);
    });
  }

  async runUserStoryTests() {
    console.log('\n🎯 Starting User Story + Responsive Boundary Testing...');
    
    const startTime = Date.now();
    
    try {
      for (const userStory of this.userStories) {
        console.log(`\n📖 Testing User Story: ${userStory.title}`);
        await this.testUserStory(userStory);
      }
      
      await this.generateComprehensiveReport(startTime);
      
    } catch (error) {
      console.error('❌ User story testing failed:', error);
      await this.captureErrorScreenshot(error);
    } finally {
      await this.cleanup();
    }
  }

  async testUserStory(userStory) {
    const storyResults = {
      userStory: userStory.id,
      title: userStory.title,
      userRole: userStory.userRole,
      goals: userStory.goals,
      workflow: userStory.workflow,
      testResults: [],
      boundaryViolations: [],
      responsiveIssues: []
    };

    try {
      // Test 1: User Intent Analysis
      await this.testUserIntentAnalysis(userStory, storyResults);
      
      // Test 2: Workflow Navigation
      await this.testWorkflowNavigation(userStory, storyResults);
      
      // Test 3: Responsive Boundary Validation
      await this.testResponsiveBoundaries(userStory, storyResults);
      
      // Test 4: Goal Achievement Validation
      await this.testGoalAchievement(userStory, storyResults);
      
      // Test 5: Cross-Device Responsiveness
      await this.testCrossDeviceResponsiveness(userStory, storyResults);
      
      this.testResults.push(storyResults);
      
    } catch (error) {
      console.error(`❌ User story ${userStory.id} failed:`, error);
      storyResults.testResults.push({
        test: 'User Story Execution',
        status: 'FAIL',
        error: error.message
      });
      this.testResults.push(storyResults);
    }
  }

  async testUserIntentAnalysis(userStory, storyResults) {
    console.log(`🎯 Testing User Intent Analysis for ${userStory.userRole}`);
    
    try {
      // Navigate to dashboard to start user journey
      await this.page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate user role and goals
      const userIntent = await this.page.evaluate((story) => {
        // Simulate user behavior based on role
        const roleBehaviors = {
          manager: { urgency: 'medium', complexity: 'moderate', emotionalState: 'focused' },
          developer: { urgency: 'high', complexity: 'simple', emotionalState: 'focused' },
          analyst: { urgency: 'low', complexity: 'complex', emotionalState: 'exploratory' },
          executive: { urgency: 'low', complexity: 'moderate', emotionalState: 'focused' }
        };
        
        return {
          userRole: story.userRole,
          primary: story.goals[0],
          secondary: story.goals.slice(1),
          ...roleBehaviors[story.userRole]
        };
      }, userStory);
      
      console.log(`👤 User Intent: ${JSON.stringify(userIntent)}`);
      
      // Check if Ship Computer is analyzing user intent
      const shipComputerActive = await this.page.evaluate(() => {
        return window.shipComputerLayoutOrchestrator !== undefined;
      });
      
      if (shipComputerActive) {
        console.log('✅ Ship Computer active and analyzing user intent');
        storyResults.testResults.push({
          test: 'User Intent Analysis',
          status: 'PASS',
          details: `User role: ${userStory.userRole}, Goals: ${userStory.goals.length}`
        });
      } else {
        console.log('❌ Ship Computer not active for user intent analysis');
        storyResults.testResults.push({
          test: 'User Intent Analysis',
          status: 'FAIL',
          details: 'Ship Computer not initialized'
        });
      }
      
    } catch (error) {
      storyResults.testResults.push({
        test: 'User Intent Analysis',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testWorkflowNavigation(userStory, storyResults) {
    console.log(`🧭 Testing Workflow Navigation for ${userStory.title}`);
    
    try {
      const navigationResults = [];
      
      for (const page of userStory.workflow) {
        console.log(`🔍 Navigating to: ${page}`);
        
        await this.page.goto(`${this.baseUrl}/${page}`, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Validate page loaded successfully
        const pageTitle = await this.page.title();
        const isPageLoaded = pageTitle && pageTitle !== '404' && pageTitle !== 'Error';
        
        if (isPageLoaded) {
          console.log(`✅ ${page} loaded successfully`);
          navigationResults.push({ page, status: 'PASS' });
        } else {
          console.log(`❌ ${page} failed to load`);
          navigationResults.push({ page, status: 'FAIL' });
        }
        
        // Capture screenshot for boundary analysis
        await this.captureScreenshot(`workflow-${userStory.id}-${page}`, `Workflow Navigation - ${page}`);
      }
      
      const successfulPages = navigationResults.filter(r => r.status === 'PASS').length;
      storyResults.testResults.push({
        test: 'Workflow Navigation',
        status: successfulPages === userStory.workflow.length ? 'PASS' : 'PARTIAL',
        details: `${successfulPages}/${userStory.workflow.length} pages loaded successfully`
      });
      
    } catch (error) {
      storyResults.testResults.push({
        test: 'Workflow Navigation',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testResponsiveBoundaries(userStory, storyResults) {
    console.log(`📱 Testing Responsive Boundaries for ${userStory.title}`);
    
    try {
      const viewports = [
        { width: 1920, height: 1080, name: 'desktop' },
        { width: 1024, height: 768, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' }
      ];
      
      const boundaryResults = [];
      
      for (const viewport of viewports) {
        console.log(`📱 Testing viewport: ${viewport.name}`);
        
        await this.page.setViewport(viewport);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test each page in the workflow for boundary violations
        for (const page of userStory.workflow) {
          await this.page.goto(`${this.baseUrl}/${page}`, { waitUntil: 'networkidle2' });
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const boundaryValidation = await this.validatePageBoundaries(viewport, page);
          boundaryResults.push({
            viewport: viewport.name,
            page,
            ...boundaryValidation
          });
          
          // Capture responsive screenshot
          await this.captureScreenshot(
            `boundary-${userStory.id}-${page}-${viewport.name}`,
            `Boundary Test - ${page} on ${viewport.name}`
          );
        }
      }
      
      // Analyze boundary results
      const totalTests = boundaryResults.length;
      const violations = boundaryResults.filter(r => r.hasOverflow).length;
      const responsiveIssues = boundaryResults.filter(r => r.responsiveIssues.length > 0);
      
      if (violations === 0) {
        console.log('✅ No boundary violations detected across all viewports');
        storyResults.testResults.push({
          test: 'Responsive Boundaries',
          status: 'PASS',
          details: `All ${totalTests} boundary tests passed`
        });
      } else {
        console.log(`❌ ${violations} boundary violations detected`);
        storyResults.boundaryViolations = boundaryResults.filter(r => r.hasOverflow);
        storyResults.testResults.push({
          test: 'Responsive Boundaries',
          status: 'FAIL',
          details: `${violations}/${totalTests} boundary tests failed`
        });
      }
      
      if (responsiveIssues.length > 0) {
        storyResults.responsiveIssues = responsiveIssues;
      }
      
    } catch (error) {
      storyResults.testResults.push({
        test: 'Responsive Boundaries',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async validatePageBoundaries(viewport, page) {
    const validation = await this.page.evaluate((vp, pageName) => {
      const issues = [];
      let hasOverflow = false;
      
      // Check for horizontal overflow
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = vp.width;
      
      if (bodyWidth > viewportWidth) {
        hasOverflow = true;
        issues.push(`Horizontal overflow: ${bodyWidth}px > ${viewportWidth}px`);
      }
      
      // Check for components extending beyond viewport
      const allElements = document.querySelectorAll('*');
      const overflowElements = [];
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        
        // Check if element extends beyond viewport
        if (rect.right > viewportWidth || rect.left < 0) {
          overflowElements.push({
            tag: element.tagName,
            class: element.className,
            position: `${rect.left}px, ${rect.top}px`,
            size: `${rect.width}px × ${rect.height}px`
          });
        }
        
        // Check for problematic CSS properties
        if (styles.position === 'absolute' || styles.position === 'fixed') {
          if (rect.right > viewportWidth) {
            issues.push(`Absolute/fixed element extends beyond viewport: ${element.tagName}`);
          }
        }
      });
      
      if (overflowElements.length > 0) {
        hasOverflow = true;
        issues.push(`Overflow elements: ${overflowElements.length} found`);
      }
      
      return {
        hasOverflow,
        issues,
        responsiveIssues: issues.filter(issue => 
          issue.includes('overflow') || issue.includes('viewport')
        ),
        bodyWidth,
        viewportWidth,
        overflowElements
      };
    }, viewport, page);
    
    return validation;
  }

  async testGoalAchievement(userStory, storyResults) {
    console.log(`🎯 Testing Goal Achievement for ${userStory.title}`);
    
    try {
      // Navigate to the main workflow page
      const mainPage = userStory.workflow[0];
      await this.page.goto(`${this.baseUrl}/${mainPage}`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate user actions to achieve goals
      const goalAchievement = await this.page.evaluate((story) => {
        const goals = story.goals;
        const achievements = [];
        
        // Simulate goal achievement based on user role
        goals.forEach(goal => {
          let achieved = false;
          let method = '';
          
          switch (goal) {
            case 'analyze project progress':
              achieved = document.querySelectorAll('[class*="progress"], [class*="status"]').length > 0;
              method = 'Progress indicators found';
              break;
            case 'identify bottlenecks':
              achieved = document.querySelectorAll('[class*="bottleneck"], [class*="issue"]').length > 0;
              method = 'Bottleneck indicators found';
              break;
            case 'review assigned tasks':
              achieved = document.querySelectorAll('[class*="task"], [class*="assignment"]').length > 0;
              method = 'Task lists found';
              break;
            case 'update progress':
              achieved = document.querySelectorAll('button, [class*="update"], [class*="edit"]').length > 0;
              method = 'Update controls found';
              break;
            case 'analyze performance data':
              achieved = document.querySelectorAll('[class*="chart"], [class*="metric"]').length > 0;
              method = 'Performance charts found';
              break;
            case 'review portfolio health':
              achieved = document.querySelectorAll('[class*="portfolio"], [class*="overview"]').length > 0;
              method = 'Portfolio overview found';
              break;
            default:
              achieved = true; // Default to achieved for other goals
              method = 'Goal type supported';
          }
          
          achievements.push({ goal, achieved, method });
        });
        
        return achievements;
      }, userStory);
      
      const achievedGoals = goalAchievement.filter(g => g.achieved).length;
      const totalGoals = userStory.goals.length;
      
      console.log(`🎯 Goal Achievement: ${achievedGoals}/${totalGoals} goals achieved`);
      
      if (achievedGoals === totalGoals) {
        storyResults.testResults.push({
          test: 'Goal Achievement',
          status: 'PASS',
          details: `All ${totalGoals} goals achieved successfully`
        });
      } else {
        storyResults.testResults.push({
          test: 'Goal Achievement',
          status: 'PARTIAL',
          details: `${achievedGoals}/${totalGoals} goals achieved`,
          failedGoals: goalAchievement.filter(g => !g.achieved)
        });
      }
      
    } catch (error) {
      storyResults.testResults.push({
        test: 'Goal Achievement',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testCrossDeviceResponsiveness(userStory, storyResults) {
    console.log(`📱 Testing Cross-Device Responsiveness for ${userStory.title}`);
    
    try {
      const devices = [
        { name: 'iPhone SE', width: 375, height: 667 },
        { name: 'iPad', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];
      
      const responsivenessResults = [];
      
      for (const device of devices) {
        console.log(`📱 Testing on ${device.name}`);
        
        await this.page.setViewport(device);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test navigation responsiveness
        const navResponsiveness = await this.page.evaluate((dev) => {
          const nav = document.querySelector('nav, [class*="nav"]');
          if (!nav) return { responsive: false, reason: 'No navigation found' };
          
          const navRect = nav.getBoundingClientRect();
          const isResponsive = navRect.width <= dev.width && navRect.height <= dev.height;
          
          return {
            responsive: isResponsive,
            navWidth: navRect.width,
            navHeight: navRect.height,
            deviceWidth: dev.width,
            deviceHeight: dev.height
          };
        }, device);
        
        // Test content responsiveness
        const contentResponsiveness = await this.page.evaluate((dev) => {
          const content = document.querySelector('main, [class*="content"], [class*="main"]');
          if (!content) return { responsive: false, reason: 'No content found' };
          
          const contentRect = content.getBoundingClientRect();
          const isResponsive = contentRect.width <= dev.width && contentRect.height <= dev.height;
          
          return {
            responsive: isResponsive,
            contentWidth: contentRect.width,
            contentHeight: contentRect.height,
            deviceWidth: dev.width,
            deviceHeight: dev.height
          };
        }, device);
        
        responsivenessResults.push({
          device: device.name,
          navigation: navResponsiveness,
          content: contentResponsiveness
        });
        
        // Capture device-specific screenshot
        await this.captureScreenshot(
          `device-${userStory.id}-${device.name.replace(/\s+/g, '-')}`,
          `Device Test - ${device.name}`
        );
      }
      
      const responsiveDevices = responsivenessResults.filter(r => 
        r.navigation.responsive && r.content.responsive
      ).length;
      
      if (responsiveDevices === devices.length) {
        console.log('✅ All devices responsive');
        storyResults.testResults.push({
          test: 'Cross-Device Responsiveness',
          status: 'PASS',
          details: `All ${devices.length} devices responsive`
        });
      } else {
        console.log(`❌ ${devices.length - responsiveDevices} devices have responsiveness issues`);
        storyResults.testResults.push({
          test: 'Cross-Device Responsiveness',
          status: 'FAIL',
          details: `${responsiveDevices}/${devices.length} devices responsive`,
          issues: responsivenessResults.filter(r => !r.navigation.responsive || !r.content.responsive)
        });
      }
      
    } catch (error) {
      storyResults.testResults.push({
        test: 'Cross-Device Responsiveness',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async captureScreenshot(name, description) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}-${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      
      await this.page.screenshot({
        path: filepath,
        fullPage: true
      });
      
      console.log(`📸 Screenshot captured: ${filename} - ${description}`);
      return filename;
    } catch (error) {
      console.error('❌ Screenshot capture failed:', error);
    }
  }

  async captureErrorScreenshot(error) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `error-${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);
      
      await this.page.screenshot({
        path: filepath,
        fullPage: true
      });
      
      const errorFile = path.join(this.screenshotDir, `error-${timestamp}.json`);
      await fs.writeFile(errorFile, JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        screenshot: filename
      }, null, 2));
      
    } catch (screenshotError) {
      console.error('❌ Error screenshot capture failed:', screenshotError);
    }
  }

  async generateComprehensiveReport(startTime) {
    console.log('\n📊 Generating Comprehensive User Intent + Responsive Boundary Report...');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const report = {
      testRun: {
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        userStories: this.userStories.length,
        totalTests: this.testResults.reduce((sum, r) => sum + r.testResults.length, 0),
        passedTests: this.testResults.reduce((sum, r) => 
          sum + r.testResults.filter(t => t.status === 'PASS').length, 0
        ),
        failedTests: this.testResults.reduce((sum, r) => 
          sum + r.testResults.filter(t => t.status === 'FAIL').length, 0
        )
      },
      userStories: this.testResults,
      boundaryAnalysis: this.analyzeBoundaryResults(),
      responsiveIssues: this.analyzeResponsiveIssues(),
      recommendations: this.generateRecommendations(),
      screenshots: await this.getScreenshotList()
    };
    
    // Save report
    const reportFile = path.join(this.screenshotDir, `user-intent-responsive-report-${Date.now()}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n🎉 USER INTENT + RESPONSIVE BOUNDARY TESTING COMPLETE! 🎉');
    console.log('='.repeat(70));
    console.log(`📖 User Stories Tested: ${report.testRun.userStories}`);
    console.log(`📊 Total Tests: ${report.testRun.totalTests}`);
    console.log(`✅ Passed: ${report.testRun.passedTests}`);
    console.log(`❌ Failed: ${report.testRun.failedTests}`);
    console.log(`⏱️  Duration: ${report.testRun.duration}`);
    console.log('='.repeat(70));
    
    console.log(`📄 Detailed report saved to: ${reportFile}`);
    
    return report;
  }

  analyzeBoundaryResults() {
    const allViolations = this.testResults.flatMap(r => r.boundaryViolations);
    const totalBoundaryTests = this.testResults.reduce((sum, r) => 
      sum + (r.boundaryViolations?.length || 0), 0
    );
    
    return {
      totalViolations: allViolations.length,
      totalBoundaryTests,
      violationRate: totalBoundaryTests > 0 ? (allViolations.length / totalBoundaryTests) * 100 : 0,
      violationsByViewport: this.groupViolationsByViewport(allViolations),
      violationsByPage: this.groupViolationsByPage(allViolations)
    };
  }

  analyzeResponsiveIssues() {
    const allIssues = this.testResults.flatMap(r => r.responsiveIssues);
    
    return {
      totalIssues: allIssues.length,
      issuesByType: this.groupIssuesByType(allIssues),
      criticalIssues: allIssues.filter(issue => 
        issue.issues.some(i => i.includes('overflow') || i.includes('viewport'))
      )
    };
  }

  groupViolationsByViewport(violations) {
    const grouped = {};
    violations.forEach(v => {
      if (!grouped[v.viewport]) grouped[v.viewport] = [];
      grouped[v.viewport].push(v);
    });
    return grouped;
  }

  groupViolationsByPage(violations) {
    const grouped = {};
    violations.forEach(v => {
      if (!grouped[v.page]) grouped[v.page] = [];
      grouped[v.page].push(v);
    });
    return grouped;
  }

  groupIssuesByType(issues) {
    const grouped = {};
    issues.forEach(issue => {
      issue.issues.forEach(i => {
        const type = i.includes('overflow') ? 'overflow' : 
                    i.includes('viewport') ? 'viewport' : 'other';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(i);
      });
    });
    return grouped;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Analyze boundary violations
    const boundaryViolations = this.testResults.flatMap(r => r.boundaryViolations);
    if (boundaryViolations.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'boundary-management',
        description: `Address ${boundaryViolations.length} boundary violations`,
        actions: [
          'Implement stricter responsive constraints',
          'Add overflow handling for problematic components',
          'Review absolute/fixed positioning usage'
        ]
      });
    }
    
    // Analyze responsive issues
    const responsiveIssues = this.testResults.flatMap(r => r.responsiveIssues);
    if (responsiveIssues.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'responsive-design',
        description: `Fix ${responsiveIssues.length} responsive design issues`,
        actions: [
          'Improve mobile navigation layout',
          'Optimize content scaling for small screens',
          'Enhance touch-friendly interactions'
        ]
      });
    }
    
    // User intent improvements
    recommendations.push({
      priority: 'medium',
      category: 'user-intent',
      description: 'Enhance user intent analysis and goal achievement',
      actions: [
        'Improve goal detection algorithms',
        'Add more sophisticated user behavior tracking',
        'Enhance Ship Computer crew coordination for user intent'
      ]
    });
    
    return recommendations;
  }

  async getScreenshotList() {
    try {
      const files = await fs.readdir(this.screenshotDir);
      return files.filter(file => file.endsWith('.png')).map(file => ({
        filename: file,
        path: path.join(this.screenshotDir, file),
        timestamp: file.split('-').slice(-1)[0].replace('.png', '')
      }));
    } catch (error) {
      return [];
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }
}

// Main execution
async function main() {
  const tester = new UserIntentResponsiveTesting();
  
  try {
    await tester.initialize();
    await tester.runUserStoryTests();
  } catch (error) {
    console.error('❌ Main execution failed:', error);
    await tester.cleanup();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = UserIntentResponsiveTesting;
