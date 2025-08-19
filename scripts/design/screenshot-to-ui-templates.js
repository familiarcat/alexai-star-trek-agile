#!/usr/bin/env node

/**
 * Screenshot to UI Templates Converter
 * Converts screenshots into popular UI development platform templates
 * 
 * Supported Platforms:
 * - Figma (JSON format)
 * - Adobe XD (JSON format)
 * - Sketch (JSON format)
 * - React Components (TSX)
 * - HTML/CSS Templates
 * - Design Tokens (JSON)
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class ScreenshotToUITemplates {
  constructor() {
    this.screenshotDir = 'test-screenshots';
    this.outputDir = 'ui-templates';
    this.templates = {
      figma: 'figma-templates',
      adobeXd: 'adobe-xd-templates',
      sketch: 'sketch-templates',
      react: 'react-components',
      html: 'html-templates',
      designTokens: 'design-tokens'
    };
    this.colorPalette = {
      primary: '#FF9900', // LCARS Orange
      secondary: '#FFFF00', // LCARS Yellow
      accent: '#00FFFF', // LCARS Cyan
      success: '#00FF00', // LCARS Green
      warning: '#FF00FF', // LCARS Magenta
      info: '#0000FF', // LCARS Blue
      dark: '#1a1a1a',
      light: '#f5f5f5'
    };
  }

  async initialize() {
    console.log('🎨 Initializing Screenshot to UI Templates Converter...');
    
    // Create output directories
    for (const [platform, dir] of Object.entries(this.templates)) {
      const fullPath = path.join(this.outputDir, dir);
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${fullPath}`);
    }
    
    console.log('✅ Initialization complete');
  }

  async convertScreenshotsToTemplates() {
    console.log('\n🔄 Starting Screenshot to UI Templates Conversion...');
    
    try {
      // Get all screenshot directories
      const screenshotDirs = await this.getScreenshotDirectories();
      
      for (const dir of screenshotDirs) {
        console.log(`\n📸 Processing directory: ${dir}`);
        await this.processScreenshotDirectory(dir);
      }
      
      // Generate design system documentation
      await this.generateDesignSystemDocumentation();
      
      // Create platform-specific project files
      await this.createPlatformProjectFiles();
      
      console.log('\n🎉 Screenshot to UI Templates conversion complete!');
      
    } catch (error) {
      console.error('❌ Conversion failed:', error);
    }
  }

  async getScreenshotDirectories() {
    try {
      const items = await fs.readdir(this.screenshotDir);
      const directories = [];
      
      for (const item of items) {
        // Skip system files and hidden files
        if (item.startsWith('.') || item === 'Thumbs.db') {
          continue;
        }
        
        const fullPath = path.join(this.screenshotDir, item);
        try {
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            directories.push(item);
          }
        } catch (error) {
          console.warn(`Skipping ${item}: ${error.message}`);
        }
      }
      
      return directories;
    } catch (error) {
      console.error('Error reading screenshot directories:', error);
      return [];
    }
  }

  async processScreenshotDirectory(dirName) {
    const dirPath = path.join(this.screenshotDir, dirName);
    const files = await fs.readdir(dirPath);
    const screenshots = files.filter(file => file.endsWith('.png'));
    
    console.log(`📸 Found ${screenshots.length} screenshots in ${dirName}`);
    
    for (const screenshot of screenshots) {
      const screenshotPath = path.join(dirPath, screenshot);
      const baseName = path.basename(screenshot, '.png');
      
      console.log(`🔄 Converting: ${screenshot}`);
      
      // Analyze screenshot for UI elements
      const uiAnalysis = await this.analyzeScreenshot(screenshotPath);
      
      // Generate templates for each platform
      await this.generateFigmaTemplate(baseName, uiAnalysis);
      await this.generateAdobeXDTemplate(baseName, uiAnalysis);
      await this.generateSketchTemplate(baseName, uiAnalysis);
      await this.generateReactComponent(baseName, uiAnalysis);
      await this.generateHTMLTemplate(baseName, uiAnalysis);
    }
  }

  async analyzeScreenshot(screenshotPath) {
    try {
      // Get image metadata
      const metadata = await sharp(screenshotPath).metadata();
      
      // Basic UI analysis (in a real implementation, you'd use computer vision)
      const analysis = {
        dimensions: {
          width: metadata.width,
          height: metadata.height
        },
        aspectRatio: metadata.width / metadata.height,
        deviceType: this.determineDeviceType(metadata.width, metadata.height),
        layoutType: this.determineLayoutType(metadata.width, metadata.height),
        components: this.extractComponentsFromFilename(path.basename(screenshotPath)),
        colors: this.colorPalette,
        typography: this.generateTypographySystem(),
        spacing: this.generateSpacingSystem()
      };
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing screenshot ${screenshotPath}:`, error);
      return this.getDefaultAnalysis();
    }
  }

  determineDeviceType(width, height) {
    if (width <= 375) return 'mobile';
    if (width <= 768) return 'tablet';
    return 'desktop';
  }

  determineLayoutType(width, height) {
    if (width < height) return 'portrait';
    return 'landscape';
  }

  extractComponentsFromFilename(filename) {
    const components = [];
    
    if (filename.includes('dashboard')) components.push('dashboard', 'navigation', 'cards');
    if (filename.includes('tasks')) components.push('task-list', 'forms', 'buttons');
    if (filename.includes('projects')) components.push('project-grid', 'filters', 'search');
    if (filename.includes('analytics')) components.push('charts', 'metrics', 'data-tables');
    if (filename.includes('workflow')) components.push('workflow-board', 'kanban', 'timeline');
    if (filename.includes('crew')) components.push('crew-cards', 'profiles', 'communication');
    
    return components.length > 0 ? components : ['container', 'content', 'navigation'];
  }

  generateTypographySystem() {
    return {
      fontFamily: {
        primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        secondary: 'Antonio, monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    };
  }

  generateSpacingSystem() {
    return {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    };
  }

  getDefaultAnalysis() {
    return {
      dimensions: { width: 1920, height: 1080 },
      aspectRatio: 16/9,
      deviceType: 'desktop',
      layoutType: 'landscape',
      components: ['container', 'content', 'navigation'],
      colors: this.colorPalette,
      typography: this.generateTypographySystem(),
      spacing: this.generateSpacingSystem()
    };
  }

  async generateFigmaTemplate(baseName, analysis) {
    const figmaTemplate = {
      name: `${baseName}-figma-template`,
      type: 'DOCUMENT',
      children: [
        {
          type: 'PAGE',
          name: baseName,
          children: [
            {
              type: 'FRAME',
              name: 'Main Container',
              width: analysis.dimensions.width,
              height: analysis.dimensions.height,
              backgroundColor: analysis.colors.dark,
              children: this.generateFigmaComponents(analysis)
            }
          ]
        }
      ],
      styles: this.generateFigmaStyles(analysis),
      components: this.generateFigmaComponentLibrary(analysis)
    };
    
    const outputPath = path.join(this.outputDir, this.templates.figma, `${baseName}.json`);
    await fs.writeFile(outputPath, JSON.stringify(figmaTemplate, null, 2));
    console.log(`✅ Generated Figma template: ${outputPath}`);
  }

  generateFigmaComponents(analysis) {
    const components = [];
    
    // Navigation component
    components.push({
      type: 'RECTANGLE',
      name: 'Navigation Bar',
      x: 0,
      y: 0,
      width: analysis.dimensions.width,
      height: 60,
      backgroundColor: analysis.colors.primary,
      cornerRadius: 0
    });
    
    // Content area
    components.push({
      type: 'RECTANGLE',
      name: 'Content Area',
      x: 0,
      y: 60,
      width: analysis.dimensions.width,
      height: analysis.dimensions.height - 60,
      backgroundColor: analysis.colors.light,
      cornerRadius: 0
    });
    
    // Add specific components based on analysis
    analysis.components.forEach((component, index) => {
      components.push({
        type: 'RECTANGLE',
        name: component,
        x: 20 + (index * 200),
        y: 80,
        width: 180,
        height: 120,
        backgroundColor: analysis.colors.secondary,
        cornerRadius: 8
      });
    });
    
    return components;
  }

  generateFigmaStyles(analysis) {
    return {
      colors: Object.entries(analysis.colors).map(([name, value]) => ({
        name: `color/${name}`,
        type: 'PAINT',
        description: `${name} color`,
        paints: [{ type: 'SOLID', color: this.hexToRgb(value) }]
      })),
      typography: Object.entries(analysis.typography.fontSize).map(([name, value]) => ({
        name: `text/${name}`,
        type: 'TEXT',
        description: `${name} text style`,
        style: {
          fontFamily: analysis.typography.fontFamily.primary,
          fontSize: parseFloat(value),
          fontWeight: analysis.typography.fontWeight.normal
        }
      }))
    };
  }

  generateFigmaComponentLibrary(analysis) {
    return {
      buttons: [
        {
          name: 'Primary Button',
          type: 'COMPONENT',
          backgroundColor: analysis.colors.primary,
          cornerRadius: 4,
          padding: { horizontal: 16, vertical: 8 }
        },
        {
          name: 'Secondary Button',
          type: 'COMPONENT',
          backgroundColor: analysis.colors.secondary,
          cornerRadius: 4,
          padding: { horizontal: 16, vertical: 8 }
        }
      ],
      cards: [
        {
          name: 'Info Card',
          type: 'COMPONENT',
          backgroundColor: analysis.colors.light,
          cornerRadius: 8,
          padding: { horizontal: 16, vertical: 12 }
        }
      ]
    };
  }

  async generateAdobeXDTemplate(baseName, analysis) {
    const xdTemplate = {
      artboards: [
        {
          name: baseName,
          width: analysis.dimensions.width,
          height: analysis.dimensions.height,
          elements: this.generateAdobeXDElements(analysis),
          styles: this.generateAdobeXDStyles(analysis)
        }
      ],
      components: this.generateAdobeXDComponents(analysis),
      assets: this.generateAdobeXDAssets(analysis)
    };
    
    const outputPath = path.join(this.outputDir, this.templates.adobeXd, `${baseName}.json`);
    await fs.writeFile(outputPath, JSON.stringify(xdTemplate, null, 2));
    console.log(`✅ Generated Adobe XD template: ${outputPath}`);
  }

  generateAdobeXDElements(analysis) {
    return [
      {
        type: 'rectangle',
        name: 'Background',
        x: 0,
        y: 0,
        width: analysis.dimensions.width,
        height: analysis.dimensions.height,
        fill: analysis.colors.dark
      },
      {
        type: 'rectangle',
        name: 'Navigation',
        x: 0,
        y: 0,
        width: analysis.dimensions.width,
        height: 60,
        fill: analysis.colors.primary
      }
    ];
  }

  generateAdobeXDStyles(analysis) {
    return {
      colors: Object.entries(analysis.colors).map(([name, value]) => ({
        name,
        value,
        type: 'color'
      })),
      characterStyles: Object.entries(analysis.typography.fontSize).map(([name, value]) => ({
        name: `text-${name}`,
        fontSize: parseFloat(value),
        fontFamily: analysis.typography.fontFamily.primary
      }))
    };
  }

  generateAdobeXDComponents(analysis) {
    return {
      buttons: [
        {
          name: 'Primary Button',
          width: 120,
          height: 40,
          fill: analysis.colors.primary,
          cornerRadius: 4
        }
      ],
      cards: [
        {
          name: 'Content Card',
          width: 300,
          height: 200,
          fill: analysis.colors.light,
          cornerRadius: 8
        }
      ]
    };
  }

  generateAdobeXDAssets(analysis) {
    return {
      colors: Object.values(analysis.colors),
      gradients: [],
      symbols: []
    };
  }

  async generateSketchTemplate(baseName, analysis) {
    const sketchTemplate = {
      pages: [
        {
          name: baseName,
          artboards: [
            {
              name: baseName,
              frame: {
                x: 0,
                y: 0,
                width: analysis.dimensions.width,
                height: analysis.dimensions.height
              },
              layers: this.generateSketchLayers(analysis)
            }
          ]
        }
      ],
      document: {
        colors: this.generateSketchColors(analysis),
        textStyles: this.generateSketchTextStyles(analysis),
        layerStyles: this.generateSketchLayerStyles(analysis)
      }
    };
    
    const outputPath = path.join(this.outputDir, this.templates.sketch, `${baseName}.json`);
    await fs.writeFile(outputPath, JSON.stringify(sketchTemplate, null, 2));
    console.log(`✅ Generated Sketch template: ${outputPath}`);
  }

  generateSketchLayers(analysis) {
    return [
      {
        type: 'rectangle',
        name: 'Background',
        frame: {
          x: 0,
          y: 0,
          width: analysis.dimensions.width,
          height: analysis.dimensions.height
        },
        style: {
          fills: [{ color: analysis.colors.dark }]
        }
      },
      {
        type: 'rectangle',
        name: 'Navigation',
        frame: {
          x: 0,
          y: 0,
          width: analysis.dimensions.width,
          height: 60
        },
        style: {
          fills: [{ color: analysis.colors.primary }]
        }
      }
    ];
  }

  generateSketchColors(analysis) {
    return Object.entries(analysis.colors).map(([name, value]) => ({
      name,
      color: value,
      _class: 'color'
    }));
  }

  generateSketchTextStyles(analysis) {
    return Object.entries(analysis.typography.fontSize).map(([name, value]) => ({
      name: `text-${name}`,
      fontSize: parseFloat(value),
      fontFamily: analysis.typography.fontFamily.primary,
      _class: 'textStyle'
    }));
  }

  generateSketchLayerStyles(analysis) {
    return [
      {
        name: 'Primary Button',
        fills: [{ color: analysis.colors.primary }],
        borderRadius: 4,
        _class: 'style'
      }
    ];
  }

  async generateReactComponent(baseName, analysis) {
    const componentName = this.toPascalCase(baseName);
    
    const reactComponent = `import React from 'react';
import { useShipComputerLayout } from '@/core/hooks/useShipComputerLayout';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className = '', 
  children 
}) => {
  const { responsiveBoundaries, layoutStrategy } = useShipComputerLayout();
  
  return (
    <div 
      className={\`${componentName.toLowerCase()} \${className}\`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '${analysis.colors.dark}',
        color: '${analysis.colors.light}',
        fontFamily: '${analysis.typography.fontFamily.primary}',
        fontSize: '${analysis.typography.fontSize.base}',
        padding: '${analysis.spacing.md}'
      }}
    >
      {/* Navigation */}
      <nav 
        className="navigation"
        style={{
          backgroundColor: '${analysis.colors.primary}',
          height: '60px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 ${analysis.spacing.md}'
        }}
      >
        <h1 style={{ 
          fontSize: '${analysis.typography.fontSize.xl}',
          fontWeight: '${analysis.typography.fontWeight.bold}',
          color: '${analysis.colors.dark}'
        }}>
          ${componentName}
        </h1>
      </nav>
      
      {/* Content Area */}
      <main 
        className="content"
        style={{
          padding: '${analysis.spacing.md}',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '${analysis.colors.light}',
          color: '${analysis.colors.dark}'
        }}
      >
        {children || (
          <div className="default-content">
            {analysis.components.map((component, index) => (
              <div
                key={component}
                className={\`component \${component.toLowerCase()}\`}
                style={{
                  backgroundColor: '${analysis.colors.secondary}',
                  padding: '${analysis.spacing.md}',
                  margin: '${analysis.spacing.sm}',
                  borderRadius: '8px',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <h3 style={{ 
                  fontSize: '${analysis.typography.fontSize.lg}',
                  fontWeight: '${analysis.typography.fontWeight.medium}'
                }}>
                  {component}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ${componentName};
`;

    const outputPath = path.join(this.outputDir, this.templates.react, `${componentName}.tsx`);
    await fs.writeFile(outputPath, reactComponent);
    console.log(`✅ Generated React component: ${outputPath}`);
  }

  async generateHTMLTemplate(baseName, analysis) {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.toTitleCase(baseName)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${analysis.typography.fontFamily.primary};
            background-color: ${analysis.colors.dark};
            color: ${analysis.colors.light};
            line-height: 1.6;
        }
        
        .navigation {
            background-color: ${analysis.colors.primary};
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 ${analysis.spacing.md};
        }
        
        .navigation h1 {
            font-size: ${analysis.typography.fontSize.xl};
            font-weight: ${analysis.typography.fontWeight.bold};
            color: ${analysis.colors.dark};
        }
        
        .content {
            padding: ${analysis.spacing.md};
            min-height: calc(100vh - 60px);
            background-color: ${analysis.colors.light};
            color: ${analysis.colors.dark};
        }
        
        .component {
            background-color: ${analysis.colors.secondary};
            padding: ${analysis.spacing.md};
            margin: ${analysis.spacing.sm};
            border-radius: 8px;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .component h3 {
            font-size: ${analysis.typography.fontSize.lg};
            font-weight: ${analysis.typography.fontWeight.medium};
        }
        
        .default-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: ${analysis.spacing.md};
        }
        
        @media (max-width: 768px) {
            .default-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navigation">
        <h1>${this.toTitleCase(baseName)}</h1>
    </nav>
    
    <main class="content">
        <div class="default-content">
            ${analysis.components.map(component => `
            <div class="component ${component.toLowerCase()}">
                <h3>${component}</h3>
            </div>`).join('')}
        </div>
    </main>
</body>
</html>`;

    const outputPath = path.join(this.outputDir, this.templates.html, `${baseName}.html`);
    await fs.writeFile(outputPath, htmlTemplate);
    console.log(`✅ Generated HTML template: ${outputPath}`);
  }

  async generateDesignSystemDocumentation() {
    const designSystem = {
      name: 'LCARS Design System',
      version: '1.0.0',
      description: 'Design system generated from screenshot analysis',
      colors: this.colorPalette,
      typography: this.generateTypographySystem(),
      spacing: this.generateSpacingSystem(),
      components: {
        buttons: {
          primary: {
            backgroundColor: this.colorPalette.primary,
            color: this.colorPalette.dark,
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '1rem'
          },
          secondary: {
            backgroundColor: this.colorPalette.secondary,
            color: this.colorPalette.dark,
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '1rem'
          }
        },
        cards: {
          default: {
            backgroundColor: this.colorPalette.light,
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        },
        navigation: {
          height: '60px',
          backgroundColor: this.colorPalette.primary,
          padding: '0 16px'
        }
      },
      breakpoints: {
        mobile: '375px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px'
      }
    };
    
    const outputPath = path.join(this.outputDir, this.templates.designTokens, 'design-system.json');
    await fs.writeFile(outputPath, JSON.stringify(designSystem, null, 2));
    console.log(`✅ Generated design system: ${outputPath}`);
  }

  async createPlatformProjectFiles() {
    // Create Figma project file
    const figmaProject = {
      name: 'LCARS UI Kit',
      version: '1.0.0',
      description: 'Figma UI kit generated from screenshots',
      components: this.generateFigmaComponentLibrary(this.getDefaultAnalysis()),
      styles: this.generateFigmaStyles(this.getDefaultAnalysis())
    };
    
    const figmaProjectPath = path.join(this.outputDir, this.templates.figma, 'project.json');
    await fs.writeFile(figmaProjectPath, JSON.stringify(figmaProject, null, 2));
    
    // Create React project structure
    const reactProjectStructure = {
      components: 'src/components',
      hooks: 'src/hooks',
      styles: 'src/styles',
      utils: 'src/utils'
    };
    
    for (const [key, dir] of Object.entries(reactProjectStructure)) {
      const fullPath = path.join(this.outputDir, this.templates.react, dir);
      await fs.mkdir(fullPath, { recursive: true });
    }
    
    // Create index file for React components
    const reactIndex = `// Auto-generated React Components Index
// Generated from screenshot analysis

${this.getScreenshotNames().map(name => {
  const componentName = this.toPascalCase(name);
  return `export { ${componentName} } from './${componentName}';`;
}).join('\n')}

export default {
  ${this.getScreenshotNames().map(name => {
    const componentName = this.toPascalCase(name);
    return `${componentName}`;
  }).join(',\n  ')}
};
`;

    const reactIndexPath = path.join(this.outputDir, this.templates.react, 'index.ts');
    await fs.writeFile(reactIndexPath, reactIndex);
    
    console.log('✅ Created platform project files');
  }

  async getScreenshotNames() {
    const dirs = await this.getScreenshotDirectories();
    const names = [];
    
    for (const dir of dirs) {
      const dirPath = path.join(this.screenshotDir, dir);
      const files = await fs.readdir(dirPath);
      const screenshots = files.filter(file => file.endsWith('.png'));
      
      screenshots.forEach(screenshot => {
        const baseName = path.basename(screenshot, '.png');
        if (!names.includes(baseName)) {
          names.push(baseName);
        }
      });
    }
    
    return names;
  }

  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  toTitleCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }
}

// Main execution
async function main() {
  const converter = new ScreenshotToUITemplates();
  
  try {
    await converter.initialize();
    await converter.convertScreenshotsToTemplates();
  } catch (error) {
    console.error('❌ Main execution failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ScreenshotToUITemplates;
