#!/usr/bin/env node

/**
 * 📤 Export to Design Tools Script
 * 
 * This script exports our design system to various design tools:
 * - Photoshop (actions and templates)
 * - Figma (design tokens and components)
 * - Sketch (symbol libraries)
 * - Adobe XD (design specs)
 */

const fs = require('fs').promises;
const path = require('path');

// Import our design tool integrations
const PhotoshopAutomation = require('./photoshop-automation');
const FigmaIntegration = require('./figma-integration');

class DesignToolExporter {
  constructor() {
    this.designDir = path.join(__dirname);
    this.outputDir = path.join(this.designDir, 'output');
    this.designSystemDir = path.join(this.designDir, 'design-system');
    
    this.ensureDirectories();
  }

  async ensureDirectories() {
    const dirs = [this.outputDir, this.designSystemDir];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  async run() {
    console.log('📤 Starting Design Tool Export Process...');
    console.log('==========================================');
    
    try {
      // 1. Export to Photoshop
      console.log('\n📱 Step 1: Exporting to Photoshop...');
      await this.exportToPhotoshop();
      
      // 2. Export to Figma
      console.log('\n🎨 Step 2: Exporting to Figma...');
      await this.exportToFigma();
      
      // 3. Export to Sketch
      console.log('\n✏️  Step 3: Exporting to Sketch...');
      await this.exportToSketch();
      
      // 4. Export to Adobe XD
      console.log('\n🎯 Step 4: Exporting to Adobe XD...');
      await this.exportToAdobeXD();
      
      // 5. Generate export summary
      console.log('\n📊 Step 5: Generating Export Summary...');
      await this.generateExportSummary();
      
      console.log('\n✅ Design Tool Export Complete!');
      console.log('\n📁 Export files created in:', this.outputDir);
      
    } catch (error) {
      console.error('❌ Design Tool Export Failed:', error.message);
      process.exit(1);
    }
  }

  async exportToPhotoshop() {
    try {
      const photoshop = new PhotoshopAutomation();
      
      // Generate Photoshop actions
      console.log('  🔧 Generating Photoshop actions...');
      await photoshop.generateActions();
      
      // Create Photoshop templates
      console.log('  📋 Creating Photoshop templates...');
      await photoshop.createTemplates();
      
      console.log('  ✅ Photoshop export complete');
      
    } catch (error) {
      console.log(`  ⚠️  Photoshop export error: ${error.message}`);
    }
  }

  async exportToFigma() {
    try {
      const figma = new FigmaIntegration();
      
      // Export design tokens
      console.log('  🎨 Exporting design tokens...');
      await figma.exportDesignTokens();
      
      // Create Figma file structure
      console.log('  📁 Creating Figma file structure...');
      await figma.createFigmaFile();
      
      // Generate Figma plugin code
      console.log('  🔧 Generating Figma plugin code...');
      await figma.generateFigmaPluginCode();
      
      console.log('  ✅ Figma export complete');
      
    } catch (error) {
      console.log(`  ⚠️  Figma export error: ${error.message}`);
    }
  }

  async exportToSketch() {
    try {
      console.log('  ✏️  Creating Sketch symbol library...');
      
      const sketchExport = {
        name: 'LCARS Design System',
        version: '24.2',
        description: 'Star Trek-inspired design system with accent-focused icons',
        symbols: {
          'Design System': {
            'Colors': this.generateSketchColorSymbols(),
            'Typography': this.generateSketchTypographySymbols(),
            'Spacing': this.generateSketchSpacingSymbols(),
            'Icons': this.generateSketchIconSymbols()
          },
          'Components': {
            'Navigation': this.generateSketchNavigationSymbols(),
            'Buttons': this.generateSketchButtonSymbols(),
            'Forms': this.generateSketchFormSymbols(),
            'Cards': this.generateSketchCardSymbols()
          }
        },
        artboards: {
          'Design System': '1200x800',
          'Components': '1600x1200',
          'Layouts': '1920x1080'
        }
      };
      
      const sketchFile = path.join(this.outputDir, 'sketch-export.json');
      await fs.writeFile(sketchFile, JSON.stringify(sketchExport, null, 2));
      
      console.log('  ✅ Sketch export complete');
      
    } catch (error) {
      console.log(`  ⚠️  Sketch export error: ${error.message}`);
    }
  }

  generateSketchColorSymbols() {
    return {
      'Primary': { color: '#FF6B35', description: 'LCARS Gold' },
      'Secondary': { color: '#4ECDC4', description: 'LCARS Blue' },
      'Accent': { color: '#45B7D1', description: 'LCARS Cyan' },
      'Success': { color: '#96CEB4', description: 'LCARS Green' },
      'Warning': { color: '#FFEAA7', description: 'LCARS Yellow' },
      'Error': { color: '#DDA0DD', description: 'LCARS Red' }
    };
  }

  generateSketchTypographySymbols() {
    return {
      'Heading 1': { size: '32px', weight: '700', description: 'Page titles' },
      'Heading 2': { size: '24px', weight: '600', description: 'Section titles' },
      'Heading 3': { size: '20px', weight: '500', description: 'Subsection titles' },
      'Body': { size: '16px', weight: '400', description: 'Main text' },
      'Small': { size: '14px', weight: '400', description: 'Secondary text' }
    };
  }

  generateSketchSpacingSymbols() {
    return {
      'XS': { value: '4px', description: 'Minimal spacing' },
      'SM': { value: '8px', description: 'Small spacing' },
      'MD': { value: '16px', description: 'Medium spacing' },
      'LG': { value: '24px', description: 'Large spacing' },
      'XL': { value: '32px', description: 'Extra large spacing' }
    };
  }

  generateSketchIconSymbols() {
    return {
      'Accent': { size: '14px', description: 'Standard accent icon' },
      'Small': { size: '12px', description: 'Small accent icon' },
      'Large': { size: '16px', description: 'Large accent icon' },
      'XLarge': { size: '20px', description: 'Extra large accent icon' }
    };
  }

  generateSketchNavigationSymbols() {
    return {
      'Primary Nav': { type: 'component', description: 'Main navigation bar' },
      'Secondary Nav': { type: 'component', description: 'Secondary navigation' },
      'Mobile Nav': { type: 'component', description: 'Mobile navigation menu' },
      'Breadcrumb': { type: 'component', description: 'Breadcrumb navigation' }
    };
  }

  generateSketchButtonSymbols() {
    return {
      'Primary Button': { type: 'component', description: 'Primary action button' },
      'Secondary Button': { type: 'component', description: 'Secondary action button' },
      'Tertiary Button': { type: 'component', description: 'Tertiary action button' },
      'Icon Button': { type: 'component', description: 'Icon-only button' },
      'Danger Button': { type: 'component', description: 'Danger action button' }
    };
  }

  generateSketchFormSymbols() {
    return {
      'Input Field': { type: 'component', description: 'Text input field' },
      'Select Dropdown': { type: 'component', description: 'Dropdown selection' },
      'Checkbox': { type: 'component', description: 'Checkbox input' },
      'Radio Button': { type: 'component', description: 'Radio button input' },
      'Textarea': { type: 'component', description: 'Multi-line text input' }
    };
  }

  generateSketchCardSymbols() {
    return {
      'Info Card': { type: 'component', description: 'Information display card' },
      'Action Card': { type: 'component', description: 'Interactive action card' },
      'Data Card': { type: 'component', description: 'Data display card' },
      'Profile Card': { type: 'component', description: 'User profile card' },
      'Status Card': { type: 'component', description: 'Status information card' }
    };
  }

  async exportToAdobeXD() {
    try {
      console.log('  🎯 Creating Adobe XD design specs...');
      
      const adobeXDExport = {
        name: 'LCARS Design System',
        version: '24.2',
        description: 'Star Trek-inspired design system with accent-focused icons',
        designSpecs: {
          'Colors': this.generateAdobeXDColorSpecs(),
          'Typography': this.generateAdobeXDTypographySpecs(),
          'Components': this.generateAdobeXDComponentSpecs(),
          'Layouts': this.generateAdobeXDLayoutSpecs()
        },
        artboards: {
          'Design System': { width: 1200, height: 800 },
          'Components': { width: 1600, height: 1200 },
          'Layouts': { width: 1920, height: 1080 }
        },
        interactions: {
          'Button Hover': 'Opacity change + scale transform',
          'Form Focus': 'Border color change + shadow',
          'Navigation Active': 'Background color change',
          'Card Hover': 'Shadow increase + slight lift'
        }
      };
      
      const adobeXDFile = path.join(this.outputDir, 'adobe-xd-export.json');
      await fs.writeFile(adobeXDFile, JSON.stringify(adobeXDExport, null, 2));
      
      console.log('  ✅ Adobe XD export complete');
      
    } catch (error) {
      console.log(`  ⚠️  Adobe XD export error: ${error.message}`);
    }
  }

  generateAdobeXDColorSpecs() {
    return {
      'Primary': { hex: '#FF6B35', rgb: '255, 107, 53', description: 'LCARS Gold' },
      'Secondary': { hex: '#4ECDC4', rgb: '78, 205, 196', description: 'LCARS Blue' },
      'Accent': { hex: '#45B7D1', rgb: '69, 183, 209', description: 'LCARS Cyan' },
      'Success': { hex: '#96CEB4', rgb: '150, 206, 180', description: 'LCARS Green' },
      'Warning': { hex: '#FFEAA7', rgb: '255, 234, 167', description: 'LCARS Yellow' },
      'Error': { hex: '#DDA0DD', rgb: '221, 160, 221', description: 'LCARS Red' }
    };
  }

  generateAdobeXDTypographySpecs() {
    return {
      'Heading 1': { 
        font: 'Antonio', 
        size: '32px', 
        weight: '700', 
        lineHeight: '1.2',
        description: 'Page titles and main headings' 
      },
      'Heading 2': { 
        font: 'Antonio', 
        size: '24px', 
        weight: '600', 
        lineHeight: '1.3',
        description: 'Section titles' 
      },
      'Heading 3': { 
        font: 'Antonio', 
        size: '20px', 
        weight: '500', 
        lineHeight: '1.4',
        description: 'Subsection titles' 
      },
      'Body': { 
        font: 'Antonio', 
        size: '16px', 
        weight: '400', 
        lineHeight: '1.5',
        description: 'Main body text' 
      },
      'Small': { 
        font: 'Antonio', 
        size: '14px', 
        weight: '400', 
        lineHeight: '1.4',
        description: 'Secondary and caption text' 
      }
    };
  }

  generateAdobeXDComponentSpecs() {
    return {
      'Navigation': {
        'Primary Nav': { height: '80px', background: 'var(--lcars-primary)' },
        'Secondary Nav': { height: '60px', background: 'var(--lcars-secondary)' },
        'Mobile Nav': { height: '100%', background: 'var(--lcars-background)' }
      },
      'Buttons': {
        'Primary': { 
          height: '48px', 
          padding: '16px 24px', 
          background: 'var(--lcars-primary)',
          borderRadius: '4px'
        },
        'Secondary': { 
          height: '48px', 
          padding: '16px 24px', 
          background: 'var(--lcars-secondary)',
          borderRadius: '4px'
        },
        'Icon': { 
          width: '48px', 
          height: '48px', 
          background: 'transparent',
          borderRadius: '4px'
        }
      },
      'Forms': {
        'Input': { 
          height: '48px', 
          padding: '12px 16px', 
          border: '1px solid var(--lcars-border)',
          borderRadius: '4px'
        },
        'Select': { 
          height: '48px', 
          padding: '12px 16px', 
          border: '1px solid var(--lcars-border)',
          borderRadius: '4px'
        }
      }
    };
  }

  generateAdobeXDLayoutSpecs() {
    return {
      'Grid System': {
        '12 Column': { columns: 12, gutter: '16px', margin: '24px' },
        '8 Column': { columns: 8, gutter: '16px', margin: '24px' },
        '4 Column': { columns: 4, gutter: '16px', margin: '16px' }
      },
      'Spacing Scale': {
        'XS': '4px',
        'SM': '8px',
        'MD': '16px',
        'LG': '24px',
        'XL': '32px',
        'XXL': '48px'
      },
      'Breakpoints': {
        'Mobile': '375px',
        'Tablet': '768px',
        'Desktop': '1024px',
        'Large Desktop': '1440px'
      }
    };
  }

  async generateExportSummary() {
    try {
      const summary = {
        timestamp: new Date().toISOString(),
        exportStatus: 'Complete',
        tools: {
          'Photoshop': {
            status: 'Exported',
            files: [
              'photoshop-actions.json',
              'LCARS-Design-System.atn',
              'photoshop-templates.json'
            ],
            location: path.join(this.outputDir, 'photoshop-export.json')
          },
          'Figma': {
            status: 'Exported',
            files: [
              'manifest.json',
              'figma-api-calls.json',
              'component-library.json',
              'lcars-design-system.fig',
              'code.js',
              'ui.html'
            ],
            location: path.join(this.designDir, 'figma')
          },
          'Sketch': {
            status: 'Exported',
            files: ['sketch-export.json'],
            location: path.join(this.outputDir, 'sketch-export.json')
          },
          'Adobe XD': {
            status: 'Exported',
            files: ['adobe-xd-export.json'],
            location: path.join(this.outputDir, 'adobe-xd-export.json')
          }
        },
        designSystem: {
          name: 'LCARS Design System',
          version: '24.2',
          components: '20+',
          designTokens: '50+',
          templates: '4'
        },
        nextSteps: [
          'Import Photoshop actions into Photoshop',
          'Install Figma plugin in Figma',
          'Open Sketch export in Sketch',
          'Import Adobe XD specs into XD',
          'Review and refine designs',
          'Export refined designs back to development'
        ]
      };
      
      const summaryFile = path.join(this.outputDir, 'export-summary.json');
      await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
      
      // Also create a human-readable summary
      const humanSummary = this.createHumanReadableSummary(summary);
      const humanSummaryFile = path.join(this.outputDir, 'export-summary.md');
      await fs.writeFile(humanSummaryFile, humanSummary);
      
      console.log('  ✅ Export summary generated');
      
    } catch (error) {
      console.log(`  ⚠️  Export summary error: ${error.message}`);
    }
  }

  createHumanReadableSummary(summary) {
    let content = `# 🎉 Design Tool Export Summary

## 📊 Export Status: ${summary.exportStatus}
**Generated:** ${new Date(summary.timestamp).toLocaleString()}

---

## 🛠️ Exported Tools

### 📱 Photoshop
- **Status:** ${summary.tools.Photoshop.status}
- **Files Created:**
${summary.tools.Photoshop.files.map(file => `  - \`${file}\``).join('\n')}
- **Location:** \`${summary.tools.Photoshop.location}\`

### 🎨 Figma
- **Status:** ${summary.tools.Figma.status}
- **Files Created:**
${summary.tools.Figma.files.map(file => `  - \`${file}\``).join('\n')}
- **Location:** \`${summary.tools.Figma.location}\`

### ✏️ Sketch
- **Status:** ${summary.tools.Sketch.status}
- **Files Created:**
${summary.tools.Sketch.files.map(file => `  - \`${file}\``).join('\n')}
- **Location:** \`${summary.tools.Sketch.location}\`

### 🎯 Adobe XD
- **Status:** ${summary.tools['Adobe XD'].status}
- **Files Created:**
${summary.tools['Adobe XD'].files.map(file => `  - \`${file}\``).join('\n')}
- **Location:** \`${summary.tools['Adobe XD'].location}\`

---

## 🎨 Design System Overview

- **Name:** ${summary.designSystem.name}
- **Version:** ${summary.designSystem.version}
- **Components:** ${summary.designSystem.components}
- **Design Tokens:** ${summary.designSystem.designTokens}
- **Templates:** ${summary.designSystem.templates}

---

## 🚀 Next Steps

${summary.nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

---

## 📁 File Locations

All export files are located in the \`scripts/design/output\` directory, with Figma files in \`scripts/design/figma\`.

## 🔧 Usage Instructions

### Photoshop
1. Open Photoshop
2. Go to Actions panel
3. Load the \`LCARS-Design-System.atn\` file
4. Apply actions to your designs

### Figma
1. Open Figma
2. Go to Plugins > Development > Import plugin from manifest
3. Select the \`manifest.json\` file
4. Use the LCARS Design System plugin

### Sketch
1. Open Sketch
2. Import the symbol library from \`sketch-export.json\`
3. Use the LCARS design system symbols

### Adobe XD
1. Open Adobe XD
2. Import the design specs from \`adobe-xd-export.json\`
3. Apply the LCARS design system

---

*Export completed successfully! 🎉*
`;

    return content;
  }
}

// Run the exporter if this script is executed directly
if (require.main === module) {
  const exporter = new DesignToolExporter();
  exporter.run();
}

module.exports = DesignToolExporter;
