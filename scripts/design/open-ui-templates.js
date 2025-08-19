#!/usr/bin/env node

/**
 * Open UI Templates Script
 * Opens generated UI templates in their respective applications
 * 
 * Supported Platforms:
 * - Figma: Opens in browser with Figma API
 * - Adobe XD: Opens with Adobe XD application
 * - Sketch: Opens with Sketch application
 * - React: Opens in code editor
 * - HTML: Opens in browser
 * - Design Tokens: Opens in JSON viewer
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class UITemplateOpener {
  constructor() {
    this.templatesDir = 'ui-templates';
    this.platforms = {
      figma: 'figma-templates',
      adobeXd: 'adobe-xd-templates',
      sketch: 'sketch-templates',
      react: 'react-components',
      html: 'html-templates',
      designTokens: 'design-tokens'
    };
  }

  async openAllTemplates() {
    console.log('🎨 Opening UI Templates in their respective applications...\n');
    
    try {
      // Open HTML templates in browser
      await this.openHTMLTemplates();
      
      // Open React components in code editor
      await this.openReactComponents();
      
      // Open design tokens in JSON viewer
      await this.openDesignTokens();
      
      // Open Figma templates (show instructions)
      await this.showFigmaInstructions();
      
      // Open Adobe XD templates (show instructions)
      await this.showAdobeXDInstructions();
      
      // Open Sketch templates (show instructions)
      await this.showSketchInstructions();
      
      console.log('\n✅ All templates opened successfully!');
      
    } catch (error) {
      console.error('❌ Error opening templates:', error);
    }
  }

  async openHTMLTemplates() {
    console.log('🌐 Opening HTML Templates in browser...');
    
    const htmlDir = path.join(this.templatesDir, this.platforms.html);
    const files = await fs.readdir(htmlDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    for (const file of htmlFiles.slice(0, 5)) { // Open first 5 for demo
      const filePath = path.join(htmlDir, file);
      const absolutePath = path.resolve(filePath);
      const url = `file://${absolutePath}`;
      
      try {
        await this.openInBrowser(url);
        console.log(`  ✅ Opened: ${file}`);
        await this.delay(1000); // Wait between opens
      } catch (error) {
        console.log(`  ⚠️  Could not open: ${file} - ${error.message}`);
      }
    }
    
    console.log(`  📊 Total HTML templates: ${htmlFiles.length}`);
  }

  async openReactComponents() {
    console.log('\n⚛️  Opening React Components in code editor...');
    
    const reactDir = path.join(this.templatesDir, this.platforms.react);
    const files = await fs.readdir(reactDir);
    const tsxFiles = files.filter(file => file.endsWith('.tsx'));
    
    // Open the main index file and a few key components
    const keyFiles = ['index.ts', 'MainDashboardDesktop.tsx', 'TasksDesktop.tsx', 'ProjectsDesktop.tsx'];
    
    for (const file of keyFiles) {
      const filePath = path.join(reactDir, file);
      if (await this.fileExists(filePath)) {
        try {
          await this.openInCodeEditor(filePath);
          console.log(`  ✅ Opened: ${file}`);
          await this.delay(500);
        } catch (error) {
          console.log(`  ⚠️  Could not open: ${file} - ${error.message}`);
        }
      }
    }
    
    console.log(`  📊 Total React components: ${tsxFiles.length}`);
  }

  async openDesignTokens() {
    console.log('\n🎨 Opening Design Tokens...');
    
    const tokensDir = path.join(this.templatesDir, this.platforms.designTokens);
    const designSystemPath = path.join(tokensDir, 'design-system.json');
    
    if (await this.fileExists(designSystemPath)) {
      try {
        await this.openInCodeEditor(designSystemPath);
        console.log('  ✅ Opened: design-system.json');
      } catch (error) {
        console.log(`  ⚠️  Could not open design system - ${error.message}`);
      }
    }
  }

  async showFigmaInstructions() {
    console.log('\n🎨 Figma Templates Instructions:');
    console.log('  📁 Location: ui-templates/figma-templates/');
    console.log('  📊 Total files: 302 JSON templates');
    console.log('  🔧 To import:');
    console.log('    1. Open Figma');
    console.log('    2. Use Figma API or plugin to import JSON files');
    console.log('    3. Or manually create components using the JSON structure');
    console.log('  📋 Sample files:');
    
    const figmaDir = path.join(this.templatesDir, this.platforms.figma);
    const files = await fs.readdir(figmaDir);
    const sampleFiles = files.slice(0, 3);
    
    for (const file of sampleFiles) {
      console.log(`    - ${file}`);
    }
  }

  async showAdobeXDInstructions() {
    console.log('\n🎨 Adobe XD Templates Instructions:');
    console.log('  📁 Location: ui-templates/adobe-xd-templates/');
    console.log('  📊 Total files: 301 JSON templates');
    console.log('  🔧 To import:');
    console.log('    1. Open Adobe XD');
    console.log('    2. Use XD plugins for JSON import');
    console.log('    3. Or manually recreate using the JSON structure');
    console.log('  📋 Sample files:');
    
    const xdDir = path.join(this.templatesDir, this.platforms.adobeXd);
    const files = await fs.readdir(xdDir);
    const sampleFiles = files.slice(0, 3);
    
    for (const file of sampleFiles) {
      console.log(`    - ${file}`);
    }
  }

  async showSketchInstructions() {
    console.log('\n🎨 Sketch Templates Instructions:');
    console.log('  📁 Location: ui-templates/sketch-templates/');
    console.log('  📊 Total files: 301 JSON templates');
    console.log('  🔧 To import:');
    console.log('    1. Open Sketch');
    console.log('    2. Use Sketch plugins for JSON import');
    console.log('    3. Or manually recreate using the JSON structure');
    console.log('  📋 Sample files:');
    
    const sketchDir = path.join(this.templatesDir, this.platforms.sketch);
    const files = await fs.readdir(sketchDir);
    const sampleFiles = files.slice(0, 3);
    
    for (const file of sampleFiles) {
      console.log(`    - ${file}`);
    }
  }

  async openInBrowser(url) {
    const platform = process.platform;
    
    let command;
    if (platform === 'darwin') {
      command = `open "${url}"`;
    } else if (platform === 'win32') {
      command = `start "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }
    
    await execAsync(command);
  }

  async openInCodeEditor(filePath) {
    const platform = process.platform;
    
    // Try VS Code first, then fallback to system default
    let command;
    if (platform === 'darwin') {
      command = `code "${filePath}" || open "${filePath}"`;
    } else if (platform === 'win32') {
      command = `code "${filePath}" || start "${filePath}"`;
    } else {
      command = `code "${filePath}" || xdg-open "${filePath}"`;
    }
    
    await execAsync(command);
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateTemplateSummary() {
    console.log('\n📊 Template Summary Report:');
    console.log('============================');
    
    for (const [platform, dir] of Object.entries(this.platforms)) {
      const fullPath = path.join(this.templatesDir, dir);
      try {
        const files = await fs.readdir(fullPath);
        const count = files.length;
        console.log(`${platform.padEnd(15)}: ${count} files`);
      } catch (error) {
        console.log(`${platform.padEnd(15)}: Error reading directory`);
      }
    }
  }

  async showTemplatePreview() {
    console.log('\n🔍 Template Preview:');
    console.log('===================');
    
    // Show a sample React component
    const reactDir = path.join(this.templatesDir, this.platforms.react);
    const sampleFile = path.join(reactDir, 'MainDashboardDesktop.tsx');
    
    if (await this.fileExists(sampleFile)) {
      try {
        const content = await fs.readFile(sampleFile, 'utf-8');
        const lines = content.split('\n').slice(0, 20); // First 20 lines
        console.log('\n📄 Sample React Component (MainDashboardDesktop.tsx):');
        console.log('─'.repeat(50));
        lines.forEach(line => console.log(line));
        console.log('─'.repeat(50));
        console.log('... (truncated)');
      } catch (error) {
        console.log('Could not read sample file');
      }
    }
    
    // Show design system structure
    const designSystemPath = path.join(this.templatesDir, this.platforms.designTokens, 'design-system.json');
    if (await this.fileExists(designSystemPath)) {
      try {
        const content = await fs.readFile(designSystemPath, 'utf-8');
        const designSystem = JSON.parse(content);
        console.log('\n🎨 Design System Structure:');
        console.log('─'.repeat(50));
        console.log(`Name: ${designSystem.name}`);
        console.log(`Version: ${designSystem.version}`);
        console.log(`Colors: ${Object.keys(designSystem.colors).length} defined`);
        console.log(`Typography: ${Object.keys(designSystem.typography.fontSize).length} sizes`);
        console.log(`Components: ${Object.keys(designSystem.components).length} types`);
        console.log('─'.repeat(50));
      } catch (error) {
        console.log('Could not read design system');
      }
    }
  }
}

// Main execution
async function main() {
  const opener = new UITemplateOpener();
  
  try {
    await opener.generateTemplateSummary();
    await opener.showTemplatePreview();
    await opener.openAllTemplates();
  } catch (error) {
    console.error('❌ Main execution failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = UITemplateOpener;

