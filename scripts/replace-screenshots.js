#!/usr/bin/env node

/**
 * Replace Old Screenshots with New Ones
 * Organizes and replaces old screenshots with newly generated ones from UI tests
 */

const fs = require('fs').promises;
const path = require('path');

class ScreenshotReplacer {
  constructor() {
    this.baseDir = 'test-screenshots';
    this.oldScreenshots = [
      'lcars-responsive-mobile-2025-08-17T23-24-21-380Z.png',
      'lcars-responsive-tablet-2025-08-17T23-24-21-319Z.png',
      'lcars-design-system-2025-08-17T23-24-21-232Z.png',
      'workflow-board-2025-08-17T23-24-20-082Z.png',
      'weekly-execution-day-detail-2025-08-17T23-24-17-044Z.png',
      'weekly-execution-initial-2025-08-17T23-24-15-737Z.png',
      'task-editing-2025-08-17T23-24-13-158Z.png',
      'tasks-initial-2025-08-17T23-24-11-507Z.png',
      'navigation-security-2025-08-17T23-24-10-461Z.png',
      'navigation-crew-2025-08-17T23-24-06-456Z.png',
      'navigation-observation-lounge-2025-08-17T23-24-02-920Z.png',
      'navigation-workflow-management-2025-08-17T23-24-00-267Z.png',
      'navigation-analytics-2025-08-17T23-23-54-843Z.png',
      'navigation-projects-2025-08-17T23-23-50-945Z.png',
      'navigation-weekly-execution-2025-08-17T23-23-47-323Z.png',
      'navigation-tasks-2025-08-17T23-23-43-189Z.png',
      'navigation-main-dashboard-2025-08-17T23-23-39-242Z.png'
    ];
  }

  async initialize() {
    console.log('🚀 Initializing Screenshot Replacement System...');
    
    try {
      // Create backup directory for old screenshots
      const backupDir = path.join(this.baseDir, 'backup-old-screenshots');
      await fs.mkdir(backupDir, { recursive: true });
      console.log('✅ Backup directory created');
      
      return true;
    } catch (error) {
      console.error('❌ Error creating backup directory:', error.message);
      return false;
    }
  }

  async backupOldScreenshots() {
    console.log('\n📦 Backing up old screenshots...');
    
    const backupDir = path.join(this.baseDir, 'backup-old-screenshots');
    let backedUpCount = 0;
    
    for (const screenshot of this.oldScreenshots) {
      const oldPath = path.join(this.baseDir, screenshot);
      const backupPath = path.join(backupDir, screenshot);
      
      try {
        await fs.copyFile(oldPath, backupPath);
        console.log(`✅ Backed up: ${screenshot}`);
        backedUpCount++;
      } catch (error) {
        console.log(`⚠️  Could not backup ${screenshot}: ${error.message}`);
      }
    }
    
    console.log(`📊 Backed up ${backedUpCount} old screenshots`);
    return backedUpCount;
  }

  async organizeNewScreenshots() {
    console.log('\n🎨 Organizing new screenshots...');
    
    const newScreenshots = [];
    
    // Visual Consistency Audit screenshots
    const vcaDir = path.join(this.baseDir, 'visual-consistency-audit');
    try {
      const vcaFiles = await fs.readdir(vcaDir);
      const vcaScreenshots = vcaFiles.filter(file => file.endsWith('.png'));
      newScreenshots.push(...vcaScreenshots.map(file => ({ source: vcaDir, file, category: 'visual-consistency' })));
    } catch (error) {
      console.log('⚠️  Could not read visual-consistency-audit directory');
    }
    
    // User Intent Responsive Testing screenshots
    const uirtDir = path.join(this.baseDir, 'user-intent-responsive-testing');
    try {
      const uirtFiles = await fs.readdir(uirtDir);
      const uirtScreenshots = uirtFiles.filter(file => file.endsWith('.png'));
      newScreenshots.push(...uirtScreenshots.map(file => ({ source: uirtDir, file, category: 'user-intent' })));
    } catch (error) {
      console.log('⚠️  Could not read user-intent-responsive-testing directory');
    }
    
    // Ship Computer UI Testing screenshots
    const scuiDir = path.join(this.baseDir, 'ship-computer-ui-testing');
    try {
      const scuiFiles = await fs.readdir(scuiDir);
      const scuiScreenshots = scuiFiles.filter(file => file.endsWith('.png'));
      newScreenshots.push(...scuiScreenshots.map(file => ({ source: scuiDir, file, category: 'ship-computer' })));
    } catch (error) {
      console.log('⚠️  Could not read ship-computer-ui-testing directory');
    }
    
    console.log(`📊 Found ${newScreenshots.length} new screenshots`);
    return newScreenshots;
  }

  async createOrganizedStructure() {
    console.log('\n🏗️  Creating organized screenshot structure...');
    
    const organizedDirs = [
      'main-dashboard',
      'tasks',
      'projects',
      'analytics',
      'workflow-management',
      'crew',
      'observation-lounge',
      'responsive-design',
      'layout-intelligence',
      'user-intent-analysis'
    ];
    
    for (const dir of organizedDirs) {
      const fullPath = path.join(this.baseDir, 'organized', dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      } catch (error) {
        console.log(`⚠️  Could not create ${dir}: ${error.message}`);
      }
    }
  }

  async categorizeAndMoveScreenshots(newScreenshots) {
    console.log('\n📁 Categorizing and moving screenshots...');
    
    const organizedDir = path.join(this.baseDir, 'organized');
    let movedCount = 0;
    
    for (const screenshot of newScreenshots) {
      const sourcePath = path.join(screenshot.source, screenshot.file);
      let targetDir = '';
      let targetName = '';
      
      // Categorize based on filename and content
      if (screenshot.file.includes('main-dashboard') || screenshot.file.includes('home')) {
        targetDir = 'main-dashboard';
        targetName = 'main-dashboard.png';
      } else if (screenshot.file.includes('tasks')) {
        targetDir = 'tasks';
        targetName = 'tasks.png';
      } else if (screenshot.file.includes('projects')) {
        targetDir = 'projects';
        targetName = 'projects.png';
      } else if (screenshot.file.includes('analytics')) {
        targetDir = 'analytics';
        targetName = 'analytics.png';
      } else if (screenshot.file.includes('workflow-management')) {
        targetDir = 'workflow-management';
        targetName = 'workflow-management.png';
      } else if (screenshot.file.includes('crew')) {
        targetDir = 'crew';
        targetName = 'crew.png';
      } else if (screenshot.file.includes('observation-lounge')) {
        targetDir = 'observation-lounge';
        targetName = 'observation-lounge.png';
      } else if (screenshot.file.includes('responsive') || screenshot.file.includes('mobile') || screenshot.file.includes('tablet') || screenshot.file.includes('desktop')) {
        targetDir = 'responsive-design';
        targetName = screenshot.file;
      } else if (screenshot.file.includes('layout-intelligence')) {
        targetDir = 'layout-intelligence';
        targetName = screenshot.file;
      } else if (screenshot.file.includes('user-intent') || screenshot.file.includes('boundary') || screenshot.file.includes('workflow')) {
        targetDir = 'user-intent-analysis';
        targetName = screenshot.file;
      } else {
        // Default to main-dashboard for uncategorized
        targetDir = 'main-dashboard';
        targetName = screenshot.file;
      }
      
      const targetPath = path.join(organizedDir, targetDir, targetName);
      
      try {
        await fs.copyFile(sourcePath, targetPath);
        console.log(`✅ Moved: ${screenshot.file} → ${targetDir}/${targetName}`);
        movedCount++;
      } catch (error) {
        console.log(`⚠️  Could not move ${screenshot.file}: ${error.message}`);
      }
    }
    
    console.log(`📊 Moved ${movedCount} screenshots to organized structure`);
    return movedCount;
  }

  async createIndexFile() {
    console.log('\n📋 Creating screenshot index file...');
    
    const organizedDir = path.join(this.baseDir, 'organized');
    const indexContent = {
      timestamp: new Date().toISOString(),
      totalScreenshots: 0,
      categories: {},
      summary: 'Organized screenshots from comprehensive UI testing'
    };
    
    try {
      const categories = await fs.readdir(organizedDir);
      
      for (const category of categories) {
        const categoryPath = path.join(organizedDir, category);
        const stats = await fs.stat(categoryPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(categoryPath);
          const screenshots = files.filter(file => file.endsWith('.png'));
          
          indexContent.categories[category] = {
            count: screenshots.length,
            files: screenshots,
            lastUpdated: new Date().toISOString()
          };
          
          indexContent.totalScreenshots += screenshots.length;
        }
      }
      
      const indexPath = path.join(this.baseDir, 'organized', 'screenshot-index.json');
      await fs.writeFile(indexPath, JSON.stringify(indexContent, null, 2));
      
      console.log(`✅ Created index file with ${indexContent.totalScreenshots} screenshots`);
      return indexContent;
    } catch (error) {
      console.error('❌ Error creating index file:', error.message);
      return null;
    }
  }

  async generateSummaryReport() {
    console.log('\n📊 Generating summary report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      operation: 'Screenshot Replacement and Organization',
      oldScreenshots: {
        total: this.oldScreenshots.length,
        backedUp: 0,
        list: this.oldScreenshots
      },
      newScreenshots: {
        total: 0,
        organized: 0,
        categories: {}
      },
      recommendations: [
        'Old screenshots have been backed up to backup-old-screenshots/',
        'New screenshots are organized by category in organized/',
        'Use screenshot-index.json to navigate the organized structure',
        'All screenshots are from comprehensive UI testing with Ship Computer integration'
      ]
    };
    
    // Count backed up screenshots
    const backupDir = path.join(this.baseDir, 'backup-old-screenshots');
    try {
      const backupFiles = await fs.readdir(backupDir);
      report.oldScreenshots.backedUp = backupFiles.filter(file => file.endsWith('.png')).length;
    } catch (error) {
      console.log('⚠️  Could not count backup files');
    }
    
    // Count organized screenshots
    const organizedDir = path.join(this.baseDir, 'organized');
    try {
      const categories = await fs.readdir(organizedDir);
      for (const category of categories) {
        const categoryPath = path.join(organizedDir, category);
        const stats = await fs.stat(categoryPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(categoryPath);
          const screenshots = files.filter(file => file.endsWith('.png'));
          report.newScreenshots.categories[category] = screenshots.length;
          report.newScreenshots.total += screenshots.length;
        }
      }
    } catch (error) {
      console.log('⚠️  Could not count organized screenshots');
    }
    
    const reportPath = path.join(this.baseDir, 'screenshot-replacement-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ Summary report generated');
    return report;
  }

  async run() {
    console.log('🎯 Starting Screenshot Replacement Process...\n');
    
    // Initialize
    const initialized = await this.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize');
      return;
    }
    
    // Backup old screenshots
    const backedUpCount = await this.backupOldScreenshots();
    
    // Organize new screenshots
    const newScreenshots = await this.organizeNewScreenshots();
    
    // Create organized structure
    await this.createOrganizedStructure();
    
    // Move and categorize screenshots
    const movedCount = await this.categorizeAndMoveScreenshots(newScreenshots);
    
    // Create index file
    const indexContent = await this.createIndexFile();
    
    // Generate summary report
    const summaryReport = await this.generateSummaryReport();
    
    console.log('\n🎉 SCREENSHOT REPLACEMENT COMPLETE! 🎉');
    console.log('==========================================');
    console.log(`📦 Old screenshots backed up: ${backedUpCount}`);
    console.log(`🆕 New screenshots organized: ${movedCount}`);
    console.log(`📁 Total organized screenshots: ${summaryReport.newScreenshots.total}`);
    console.log(`📋 Index file created: organized/screenshot-index.json`);
    console.log(`📊 Summary report: screenshot-replacement-report.json`);
    console.log('==========================================');
    console.log('\n📁 New organized structure:');
    console.log('   organized/');
    console.log('   ├── main-dashboard/');
    console.log('   ├── tasks/');
    console.log('   ├── projects/');
    console.log('   ├── analytics/');
    console.log('   ├── workflow-management/');
    console.log('   ├── crew/');
    console.log('   ├── observation-lounge/');
    console.log('   ├── responsive-design/');
    console.log('   ├── layout-intelligence/');
    console.log('   ├── user-intent-analysis/');
    console.log('   └── screenshot-index.json');
    console.log('\n🔍 Check the organized directory for your new screenshots!');
  }
}

// Run the script
const replacer = new ScreenshotReplacer();
replacer.run().catch(console.error);

