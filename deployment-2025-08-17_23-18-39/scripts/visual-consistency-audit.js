#!/usr/bin/env node

/**
 * Visual Consistency Audit Script
 * Systematically captures screenshots and analyzes UI/UX consistency
 * across all pages for forms, navigation, and functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class VisualConsistencyAudit {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:3000';
    this.screenshotDir = 'test-screenshots/visual-consistency-audit';
    this.auditResults = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: 0,
        consistencyIssues: 0,
        criticalIssues: 0,
        moderateIssues: 0,
        minorIssues: 0
      },
      pages: [],
      consistencyIssues: [],
      recommendations: []
    };
  }

  async initialize() {
    console.log('🚀 Initializing Visual Consistency Audit...');
    
    // Create screenshot directory
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error) {
      console.log('Screenshot directory already exists');
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    
    // Set viewport for desktop testing
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    console.log('✅ Browser initialized successfully');
  }

  async capturePageScreenshot(pageName, url, description = '') {
    try {
      console.log(`📸 Capturing ${pageName}...`);
      
      await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Capture full page screenshot
      const screenshotPath = path.join(this.screenshotDir, `${pageName}-desktop.png`);
      await this.page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });

      // Capture mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mobileScreenshotPath = path.join(this.screenshotDir, `${pageName}-mobile.png`);
      await this.page.screenshot({ 
        path: mobileScreenshotPath, 
        fullPage: true 
      });

      // Reset to desktop viewport
      await this.page.setViewport({ width: 1920, height: 1080 });

      return {
        pageName,
        url,
        description,
        screenshots: {
          desktop: screenshotPath,
          mobile: mobileScreenshotPath
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error capturing ${pageName}:`, error.message);
      return {
        pageName,
        url,
        description,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async analyzeVisualConsistency(pageData) {
    const issues = [];
    
    try {
      // Analyze navigation consistency
      const navigationIssues = await this.analyzeNavigation(pageData);
      issues.push(...navigationIssues);

      // Analyze form consistency
      const formIssues = await this.analyzeForms(pageData);
      issues.push(...formIssues);

      // Analyze functionality consistency
      const functionalityIssues = await this.analyzeFunctionality(pageData);
      issues.push(...functionalityIssues);

      // Analyze color scheme consistency
      const colorIssues = await this.analyzeColorScheme(pageData);
      issues.push(...colorIssues);

      // Analyze spacing and layout consistency
      const layoutIssues = await this.analyzeLayout(pageData);
      issues.push(...layoutIssues);

    } catch (error) {
      console.error(`❌ Error analyzing ${pageData.pageName}:`, error.message);
    }

    return issues;
  }

  async analyzeNavigation(pageData) {
    const issues = [];
    
    try {
      // Check for consistent navigation elements
      const navElements = await this.page.$$eval('nav, [role="navigation"], .navigation, .navbar', elements => {
        return elements.map(el => ({
          tag: el.tagName,
          classes: el.className,
          visible: el.offsetParent !== null
        }));
      });

      if (navElements.length === 0) {
        issues.push({
          type: 'critical',
          category: 'navigation',
          description: 'No navigation elements found',
          page: pageData.pageName
        });
      }

      // Check for consistent navigation styling
      const navStyles = await this.page.$$eval('nav, [role="navigation"], .navigation, .navbar', elements => {
        return elements.map(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          };
        });
      });

      // Analyze navigation consistency
      if (navStyles.length > 1) {
        const firstStyle = navStyles[0];
        navStyles.forEach((style, index) => {
          if (style.backgroundColor !== firstStyle.backgroundColor) {
            issues.push({
              type: 'moderate',
              category: 'navigation',
              description: `Inconsistent navigation background color on element ${index + 1}`,
              page: pageData.pageName,
              details: {
                expected: firstStyle.backgroundColor,
                found: style.backgroundColor
              }
            });
          }
        });
      }

    } catch (error) {
      console.error(`❌ Error analyzing navigation:`, error.message);
    }

    return issues;
  }

  async analyzeForms(pageData) {
    const issues = [];
    
    try {
      // Check for form elements
      const formElements = await this.page.$$eval('form, input, select, textarea, button', elements => {
        return elements.map(el => ({
          tag: el.tagName,
          type: el.type || 'N/A',
          classes: el.className,
          visible: el.offsetParent !== null
        }));
      });

      if (formElements.length === 0) {
        issues.push({
          type: 'minor',
          category: 'forms',
          description: 'No form elements found',
          page: pageData.pageName
        });
        return issues;
      }

      // Analyze form styling consistency
      const formStyles = await this.page.$$eval('input, select, textarea, button', elements => {
        return elements.map(el => {
          const styles = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            type: el.type || 'N/A',
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            border: styles.border,
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            fontSize: styles.fontSize
          };
        });
      });

      // Check for consistent form styling
      const inputStyles = formStyles.filter(style => style.tag === 'INPUT');
      if (inputStyles.length > 1) {
        const firstInputStyle = inputStyles[0];
        inputStyles.forEach((style, index) => {
          if (style.backgroundColor !== firstInputStyle.backgroundColor) {
            issues.push({
              type: 'moderate',
              category: 'forms',
              description: `Inconsistent input field background color`,
              page: pageData.pageName,
              details: {
                expected: firstInputStyle.backgroundColor,
                found: style.backgroundColor,
                elementIndex: index
              }
            });
          }
        });
      }

    } catch (error) {
      console.error(`❌ Error analyzing forms:`, error.message);
    }

    return issues;
  }

  async analyzeFunctionality(pageData) {
    const issues = [];
    
    try {
      // Check for interactive elements
      const interactiveElements = await this.page.$$eval('button, a, [role="button"], [tabindex]', elements => {
        return elements.map(el => ({
          tag: el.tagName,
          classes: el.className,
          visible: el.offsetParent !== null,
          hasHover: el.onmouseenter !== null || el.onmouseover !== null
        }));
      });

      // Check for consistent button styling
      const buttonStyles = await this.page.$$eval('button, [role="button"]', elements => {
        return elements.map(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            border: styles.border,
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          };
        });
      });

      if (buttonStyles.length > 1) {
        const firstButtonStyle = buttonStyles[0];
        buttonStyles.forEach((style, index) => {
          if (style.backgroundColor !== firstButtonStyle.backgroundColor) {
            issues.push({
              type: 'moderate',
              category: 'functionality',
              description: `Inconsistent button styling`,
              page: pageData.pageName,
              details: {
                expected: firstButtonStyle.backgroundColor,
                found: style.backgroundColor,
                elementIndex: index
              }
            });
          }
        });
      }

    } catch (error) {
      console.error(`❌ Error analyzing functionality:`, error.message);
    }

    return issues;
  }

  async analyzeColorScheme(pageData) {
    const issues = [];
    
    try {
      // Check for LCARS color consistency
      const lcarsColors = await this.page.$$eval('*', elements => {
        const colors = new Set();
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            colors.add(styles.backgroundColor);
          }
          if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)') {
            colors.add(styles.color);
          }
        });
        return Array.from(colors);
      });

      // Check for expected LCARS colors
      const expectedLcarsColors = [
        'rgb(255, 153, 0)', // Orange
        'rgb(255, 255, 0)', // Yellow
        'rgb(0, 255, 255)', // Cyan
        'rgb(255, 0, 255)', // Magenta
        'rgb(0, 255, 0)',   // Green
        'rgb(0, 0, 255)'    // Blue
      ];

      const foundLcarsColors = lcarsColors.filter(color => 
        expectedLcarsColors.some(expected => 
          color.includes(expected.split('(')[1].split(')')[0])
        )
      );

      if (foundLcarsColors.length < 3) {
        issues.push({
          type: 'moderate',
          category: 'color-scheme',
          description: 'Limited LCARS color palette usage',
          page: pageData.pageName,
          details: {
            expected: 'At least 3 LCARS colors',
            found: foundLcarsColors.length,
            colors: foundLcarsColors
          }
        });
      }

    } catch (error) {
      console.error(`❌ Error analyzing color scheme:`, error.message);
    }

    return issues;
  }

  async analyzeLayout(pageData) {
    const issues = [];
    
    try {
      // Check for consistent spacing
      const spacingAnalysis = await this.page.$$eval('*', elements => {
        const spacings = new Set();
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.margin) spacings.add(styles.margin);
          if (styles.padding) spacings.add(styles.padding);
        });
        return Array.from(spacings);
      });

      // Check for consistent font sizes
      const fontSizeAnalysis = await this.page.$$eval('*', elements => {
        const fontSizes = new Set();
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.fontSize) fontSizes.add(styles.fontSize);
        });
        return Array.from(fontSizes);
      });

      if (fontSizeAnalysis.length > 8) {
        issues.push({
          type: 'minor',
          category: 'layout',
          description: 'Too many different font sizes detected',
          page: pageData.pageName,
          details: {
            expected: '6-8 font sizes maximum',
            found: fontSizeAnalysis.length,
            sizes: fontSizeAnalysis.slice(0, 10)
          }
        });
      }

    } catch (error) {
      console.error(`❌ Error analyzing layout:`, error.message);
    }

    return issues;
  }

  async runComprehensiveAudit() {
    console.log('🔍 Starting Comprehensive Visual Consistency Audit...');

    const pagesToAudit = [
      { name: 'main-dashboard', url: '/', description: 'Main dashboard page' },
      { name: 'tasks', url: '/tasks', description: 'Task management page' },
      { name: 'weekly-execution', url: '/weekly-execution', description: 'Weekly execution planning' },
      { name: 'projects', url: '/projects', description: 'Project management' },
      { name: 'analytics', url: '/analytics', description: 'Analytics dashboard' },
      { name: 'workflow-management', url: '/workflow-management', description: 'Workflow management' },
      { name: 'observation-lounge', url: '/observation-lounge', description: 'Crew coordination' },
      { name: 'crew', url: '/crew', description: 'Crew management' },
      { name: 'workflow', url: '/workflow', description: 'Workflow board' },
      { name: 'project-generator', url: '/project-generator', description: 'Project generation' },
      { name: 'project-review', url: '/project-review', description: 'Project review' },
      { name: 'revenue-workflows', url: '/revenue-workflows', description: 'Revenue workflow management' },
      { name: 'ships-computer', url: '/ships-computer', description: 'Ship computer interface' },
      { name: 'youtube-analyzer', url: '/youtube-analyzer', description: 'YouTube analysis' },
      { name: 'n8n-integration', url: '/n8n-integration', description: 'N8N integration' }
    ];

    this.auditResults.summary.totalPages = pagesToAudit.length;

    for (const pageInfo of pagesToAudit) {
      console.log(`\n📄 Auditing ${pageInfo.name}...`);
      
      // Capture screenshots
      const pageData = await this.capturePageScreenshot(
        pageInfo.name, 
        `${this.baseUrl}${pageInfo.url}`, 
        pageInfo.description
      );

      // Analyze visual consistency
      const issues = await this.analyzeVisualConsistency(pageData);
      
      // Add issues to results
      this.auditResults.consistencyIssues.push(...issues);
      
      // Add page data to results
      this.auditResults.pages.push({
        ...pageData,
        issues: issues.length,
        criticalIssues: issues.filter(i => i.type === 'critical').length,
        moderateIssues: issues.filter(i => i.type === 'moderate').length,
        minorIssues: issues.filter(i => i.type === 'minor').length
      });

      console.log(`✅ ${pageInfo.name} audit completed - ${issues.length} issues found`);
    }

    // Generate summary statistics
    this.auditResults.summary.consistencyIssues = this.auditResults.consistencyIssues.length;
    this.auditResults.summary.criticalIssues = this.auditResults.consistencyIssues.filter(i => i.type === 'critical').length;
    this.auditResults.summary.moderateIssues = this.auditResults.consistencyIssues.filter(i => i.type === 'moderate').length;
    this.auditResults.summary.minorIssues = this.auditResults.consistencyIssues.filter(i => i.type === 'minor').length;

    // Generate recommendations
    this.generateRecommendations();

    // Save audit results
    await this.saveAuditResults();

    console.log('\n🎉 Visual Consistency Audit Completed!');
    console.log(`📊 Summary: ${this.auditResults.summary.consistencyIssues} total issues found`);
    console.log(`🔴 Critical: ${this.auditResults.summary.criticalIssues}`);
    console.log(`🟡 Moderate: ${this.auditResults.summary.moderateIssues}`);
    console.log(`🟢 Minor: ${this.auditResults.summary.minorIssues}`);
  }

  generateRecommendations() {
    const recommendations = [];

    // Navigation recommendations
    const navIssues = this.auditResults.consistencyIssues.filter(i => i.category === 'navigation');
    if (navIssues.length > 0) {
      recommendations.push({
        category: 'Navigation',
        priority: 'High',
        description: 'Standardize navigation styling across all pages',
        actions: [
          'Create consistent navigation component',
          'Implement standardized color scheme',
          'Ensure consistent spacing and typography'
        ]
      });
    }

    // Form recommendations
    const formIssues = this.auditResults.consistencyIssues.filter(i => i.category === 'forms');
    if (formIssues.length > 0) {
      recommendations.push({
        category: 'Forms',
        priority: 'Medium',
        description: 'Standardize form element styling',
        actions: [
          'Create reusable form components',
          'Implement consistent input styling',
          'Standardize button appearance'
        ]
      });
    }

    // Color scheme recommendations
    const colorIssues = this.auditResults.consistencyIssues.filter(i => i.category === 'color-scheme');
    if (colorIssues.length > 0) {
      recommendations.push({
        category: 'Color Scheme',
        priority: 'High',
        description: 'Implement consistent LCARS color palette',
        actions: [
          'Define official LCARS color variables',
          'Create color usage guidelines',
          'Implement CSS custom properties'
        ]
      });
    }

    this.auditResults.recommendations = recommendations;
  }

  async saveAuditResults() {
    const reportPath = path.join(this.screenshotDir, 'visual-consistency-audit-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.auditResults, null, 2));
    console.log(`📋 Audit report saved: ${reportPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Browser cleanup completed');
  }
}

// Main execution
async function main() {
  const audit = new VisualConsistencyAudit();
  
  try {
    await audit.initialize();
    await audit.runComprehensiveAudit();
  } catch (error) {
    console.error('❌ Audit failed:', error);
  } finally {
    await audit.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = VisualConsistencyAudit;
