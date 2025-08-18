#!/usr/bin/env node

/**
 * 🎨 Figma Integration Script
 * 
 * This script provides integration between our design system and Figma:
 * - Export design tokens to Figma styles
 * - Create component libraries
 * - Sync color palettes and typography
 * - Import refined designs back to development
 */

const fs = require('fs').promises;
const path = require('path');

class FigmaIntegration {
  constructor() {
    this.designDir = path.join(__dirname);
    this.outputDir = path.join(this.designDir, 'output');
    this.figmaDir = path.join(this.designDir, 'figma');
    
    this.ensureDirectories();
  }

  async ensureDirectories() {
    const dirs = [this.outputDir, this.figmaDir];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  async exportDesignTokens(designSystem) {
    console.log('🎨 Exporting Design Tokens to Figma...');
    
    try {
      // Load design tokens
      const tokens = await this.loadDesignTokens();
      
      // Generate Figma-compatible format
      const figmaTokens = this.convertToFigmaFormat(tokens);
      
      // Create Figma plugin manifest
      await this.createFigmaPluginManifest(figmaTokens);
      
      // Generate Figma API calls
      await this.generateFigmaAPICalls(figmaTokens);
      
      // Create component library structure
      await this.createComponentLibraryStructure(figmaTokens);
      
      console.log('✅ Design tokens exported to Figma successfully');
      return figmaTokens;
      
    } catch (error) {
      console.error('❌ Failed to export design tokens:', error.message);
      throw error;
    }
  }

  async loadDesignTokens() {
    try {
      const tokensFile = path.join(this.designDir, 'design-system', 'design-tokens.json');
      const content = await fs.readFile(tokensFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.log('⚠️  Could not load design tokens, using defaults');
      return this.getDefaultDesignTokens();
    }
  }

  getDefaultDesignTokens() {
    return {
      colors: {
        primary: '#FF6B35',
        secondary: '#4ECDC4',
        accent: '#45B7D1',
        success: '#96CEB4',
        warning: '#FFEAA7',
        error: '#DDA0DD',
        text: '#2D3436',
        background: '#FFFFFF'
      },
      typography: {
        fontFamily: 'Antonio, "Arial Narrow", "Avenir Next Condensed", sans-serif',
        fontSize: {
          small: '0.875rem',
          base: '1rem',
          large: '1.125rem',
          xlarge: '1.25rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          bold: '700'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem'
      },
      icons: {
        sizes: {
          accent: '0.875rem',
          small: '0.75rem',
          large: '1rem',
          xlarge: '1.25rem'
        },
        opacity: {
          primary: '0.8',
          secondary: '0.6',
          tertiary: '0.4'
        }
      }
    };
  }

  convertToFigmaFormat(tokens) {
    const figmaTokens = {
      colors: {},
      typography: {},
      spacing: {},
      icons: {},
      effects: {},
      grids: {}
    };

    // Convert colors
    for (const [name, value] of Object.entries(tokens.colors)) {
      figmaTokens.colors[name] = {
        value: value,
        type: 'color',
        description: `LCARS ${name} color`,
        category: this.getColorCategory(name)
      };
    }

    // Convert typography
    for (const [name, value] of Object.entries(tokens.typography.fontSize)) {
      figmaTokens.typography[name] = {
        value: value,
        type: 'typography',
        fontFamily: tokens.typography.fontFamily,
        fontWeight: tokens.typography.fontWeight.normal,
        description: `LCARS ${name} text style`,
        category: 'text'
      };
    }

    // Convert spacing
    for (const [name, value] of Object.entries(tokens.spacing)) {
      figmaTokens.spacing[name] = {
        value: value,
        type: 'spacing',
        description: `LCARS ${name} spacing`,
        category: 'layout'
      };
    }

    // Convert icons
    for (const [name, value] of Object.entries(tokens.icons.sizes)) {
      figmaTokens.icons[name] = {
        value: value,
        type: 'icon',
        description: `LCARS ${name} icon size`,
        category: 'icon',
        opacity: tokens.icons.opacity.primary
      };
    }

    return figmaTokens;
  }

  getColorCategory(colorName) {
    const categories = {
      primary: 'brand',
      secondary: 'brand',
      accent: 'accent',
      success: 'semantic',
      warning: 'semantic',
      error: 'semantic',
      text: 'content',
      background: 'content'
    };
    
    return categories[colorName] || 'content';
  }

  async createFigmaPluginManifest(tokens) {
    const manifest = {
      name: 'LCARS Design System',
      id: 'lcars-design-system',
      api: '1.0.0',
      main: 'code.js',
      ui: 'ui.html',
      capabilities: ['inspect'],
      permissions: ['currentuser'],
      networkAccess: {
        allowedDomains: ['none']
      },
      parameters: [
        {
          name: 'Design Token',
          key: 'token',
          description: 'Select a design token to apply'
        }
      ],
      parametersOnly: false,
      menu: [
        {
          name: 'LCARS Design System',
          command: 'apply-token'
        },
        {
          name: 'Import Tokens',
          command: 'import-tokens'
        },
        {
          name: 'Export Components',
          command: 'export-components'
        }
      ]
    };

    const manifestFile = path.join(this.figmaDir, 'manifest.json');
    await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
    
    console.log('  ✅ Figma plugin manifest created');
  }

  async generateFigmaAPICalls(tokens) {
    const apiCalls = {
      colors: this.generateColorAPICalls(tokens.colors),
      typography: this.generateTypographyAPICalls(tokens.typography),
      spacing: this.generateSpacingAPICalls(tokens.spacing),
      icons: this.generateIconAPICalls(tokens.icons)
    };

    const apiFile = path.join(this.figmaDir, 'figma-api-calls.json');
    await fs.writeFile(apiFile, JSON.stringify(apiCalls, null, 2));
    
    console.log('  ✅ Figma API calls generated');
  }

  generateColorAPICalls(colors) {
    const calls = [];
    
    for (const [name, color] of Object.entries(colors)) {
      calls.push({
        method: 'createPaintStyle',
        parameters: {
          name: `LCARS/${name}`,
          description: color.description,
          paints: [{
            type: 'SOLID',
            color: this.hexToRgb(color.value)
          }]
        },
        code: `figma.createPaintStyle().name = "LCARS/${name}";`
      });
    }
    
    return calls;
  }

  generateTypographyAPICalls(typography) {
    const calls = [];
    
    for (const [name, style] of Object.entries(typography)) {
      calls.push({
        method: 'createTextStyle',
        parameters: {
          name: `LCARS/${name}`,
          description: style.description,
          fontSize: this.remToPx(style.value),
          fontName: {
            family: style.fontFamily.split(',')[0].trim(),
            style: 'Regular'
          }
        },
        code: `figma.createTextStyle().name = "LCARS/${name}";`
      });
    }
    
    return calls;
  }

  generateSpacingAPICalls(spacing) {
    const calls = [];
    
    for (const [name, value] of Object.entries(spacing)) {
      calls.push({
        method: 'createEffectStyle',
        parameters: {
          name: `LCARS/Spacing/${name}`,
          description: value.description,
          effects: [{
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: this.remToPx(value.value) },
            radius: 0
          }]
        },
        code: `figma.createEffectStyle().name = "LCARS/Spacing/${name}";`
      });
    }
    
    return calls;
  }

  generateIconAPICalls(icons) {
    const calls = [];
    
    for (const [name, icon] of Object.entries(icons)) {
      calls.push({
        method: 'createComponent',
        parameters: {
          name: `LCARS/Icon/${name}`,
          description: icon.description,
          size: {
            width: this.remToPx(icon.value),
            height: this.remToPx(icon.value)
          }
        },
        code: `figma.createComponent().name = "LCARS/Icon/${name}";`
      });
    }
    
    return calls;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }

  remToPx(rem) {
    return parseFloat(rem) * 16; // Assuming 16px base font size
  }

  async createComponentLibraryStructure(tokens) {
    const componentLibrary = {
      name: 'LCARS Design System',
      version: '24.2',
      description: 'Star Trek-inspired design system with accent-focused icons',
      components: {
        'Design System': this.generateDesignSystemComponents(tokens),
        'Components': this.generateUIComponents(tokens),
        'Layouts': this.generateLayoutComponents(tokens),
        'Icons': this.generateIconComponents(tokens)
      }
    };

    const libraryFile = path.join(this.figmaDir, 'component-library.json');
    await fs.writeFile(libraryFile, JSON.stringify(componentLibrary, null, 2));
    
    console.log('  ✅ Component library structure created');
  }

  generateDesignSystemComponents(tokens) {
    return {
      'Colors': {
        'Primary': { type: 'color', value: tokens.colors.primary?.value },
        'Secondary': { type: 'color', value: tokens.colors.secondary?.value },
        'Accent': { type: 'color', value: tokens.colors.accent?.value },
        'Success': { type: 'color', value: tokens.colors.success?.value },
        'Warning': { type: 'color', value: tokens.colors.warning?.value },
        'Error': { type: 'color', value: tokens.colors.error?.value }
      },
      'Typography': {
        'Heading 1': { type: 'text', style: tokens.typography.xlarge?.value },
        'Heading 2': { type: 'text', style: tokens.typography.large?.value },
        'Heading 3': { type: 'text', style: tokens.typography.base?.value },
        'Body': { type: 'text', style: tokens.typography.base?.value },
        'Small': { type: 'text', style: tokens.typography.small?.value }
      },
      'Spacing': {
        'XS': { type: 'spacing', value: tokens.spacing.xs?.value },
        'SM': { type: 'spacing', value: tokens.spacing.sm?.value },
        'MD': { type: 'spacing', value: tokens.spacing.md?.value },
        'LG': { type: 'spacing', value: tokens.spacing.lg?.value },
        'XL': { type: 'spacing', value: tokens.spacing.xl?.value }
      }
    };
  }

  generateUIComponents(tokens) {
    return {
      'Navigation': {
        'Primary Nav': { type: 'component', description: 'Main navigation bar' },
        'Secondary Nav': { type: 'component', description: 'Secondary navigation' },
        'Mobile Nav': { type: 'component', description: 'Mobile navigation menu' }
      },
      'Buttons': {
        'Primary Button': { type: 'component', description: 'Primary action button' },
        'Secondary Button': { type: 'component', description: 'Secondary action button' },
        'Icon Button': { type: 'component', description: 'Icon-only button' }
      },
      'Forms': {
        'Input Field': { type: 'component', description: 'Text input field' },
        'Select Dropdown': { type: 'component', description: 'Dropdown selection' },
        'Checkbox': { type: 'component', description: 'Checkbox input' }
      },
      'Cards': {
        'Info Card': { type: 'component', description: 'Information display card' },
        'Action Card': { type: 'component', description: 'Interactive action card' },
        'Data Card': { type: 'component', description: 'Data display card' }
      }
    };
  }

  generateLayoutComponents(tokens) {
    return {
      'Page Layouts': {
        'Dashboard': { type: 'layout', description: 'Main dashboard layout' },
        'Form Page': { type: 'layout', description: 'Form-focused page layout' },
        'List Page': { type: 'layout', description: 'List-based page layout' }
      },
      'Grid Systems': {
        '12 Column': { type: 'grid', description: '12-column responsive grid' },
        '8 Column': { type: 'grid', description: '8-column responsive grid' },
        '4 Column': { type: 'grid', description: '4-column mobile grid' }
      },
      'Containers': {
        'Full Width': { type: 'container', description: 'Full-width container' },
        'Centered': { type: 'container', description: 'Centered container' },
        'Sidebar': { type: 'container', description: 'Sidebar container' }
      }
    };
  }

  generateIconComponents(tokens) {
    return {
      'System Icons': {
        'Home': { type: 'icon', size: tokens.icons.accent?.value },
        'Settings': { type: 'icon', size: tokens.icons.accent?.value },
        'User': { type: 'icon', size: tokens.icons.accent?.value }
      },
      'Action Icons': {
        'Add': { type: 'icon', size: tokens.icons.accent?.value },
        'Edit': { type: 'icon', size: tokens.icons.accent?.value },
        'Delete': { type: 'icon', size: tokens.icons.accent?.value }
      },
      'Navigation Icons': {
        'Arrow Left': { type: 'icon', size: tokens.icons.accent?.value },
        'Arrow Right': { type: 'icon', size: tokens.icons.accent?.value },
        'Menu': { type: 'icon', size: tokens.icons.accent?.value }
      }
    };
  }

  async importDesigns(figmaFile, componentMap) {
    console.log('📥 Importing designs from Figma...');
    
    try {
      // This would typically use Figma's API to import designs
      // For now, we'll create a mock import structure
      
      const importedDesigns = {
        timestamp: new Date().toISOString(),
        source: figmaFile,
        components: componentMap,
        designTokens: await this.extractDesignTokens(figmaFile),
        components: await this.extractComponents(figmaFile)
      };
      
      // Save imported designs
      const importFile = path.join(this.outputDir, 'figma-import.json');
      await fs.writeFile(importFile, JSON.stringify(importedDesigns, null, 2));
      
      console.log('✅ Designs imported from Figma successfully');
      return importedDesigns;
      
    } catch (error) {
      console.error('❌ Failed to import designs:', error.message);
      throw error;
    }
  }

  async extractDesignTokens(figmaFile) {
    // Mock extraction - in reality, this would parse Figma file
    return {
      colors: ['#FF6B35', '#4ECDC4', '#45B7D1'],
      typography: ['Antonio', '16px', '24px'],
      spacing: ['4px', '8px', '16px', '24px']
    };
  }

  async extractComponents(figmaFile) {
    // Mock extraction - in reality, this would parse Figma file
    return {
      'Button Primary': { type: 'button', variant: 'primary' },
      'Input Field': { type: 'input', variant: 'text' },
      'Card Info': { type: 'card', variant: 'info' }
    };
  }

  async createFigmaFile() {
    console.log('📁 Creating Figma file structure...');
    
    const figmaFile = {
      name: 'LCARS Design System',
      version: '1.0.0',
      lastModified: new Date().toISOString(),
      thumbnailUrl: '',
      editorType: 'figma',
      linkAccess: 'view',
      currentUserPermission: 'can_edit',
      document: {
        id: 'lcars-design-system',
        name: 'LCARS Design System',
        type: 'DOCUMENT',
        children: [
          {
            id: 'design-system-page',
            name: 'Design System',
            type: 'PAGE',
            children: []
          },
          {
            id: 'components-page',
            name: 'Components',
            type: 'PAGE',
            children: []
          },
          {
            id: 'layouts-page',
            name: 'Layouts',
            type: 'PAGE',
            children: []
          }
        ]
      }
    };

    const filePath = path.join(this.figmaDir, 'lcars-design-system.fig');
    await fs.writeFile(filePath, JSON.stringify(figmaFile, null, 2));
    
    console.log('  ✅ Figma file structure created');
    return figmaFile;
  }

  async generateFigmaPluginCode() {
    console.log('🔧 Generating Figma plugin code...');
    
    const pluginCode = this.generateMainPluginCode();
    const uiCode = this.generatePluginUI();
    
    // Save plugin code files
    const mainCodeFile = path.join(this.figmaDir, 'code.js');
    const uiFile = path.join(this.figmaDir, 'ui.html');
    
    await fs.writeFile(mainCodeFile, pluginCode);
    await fs.writeFile(uiFile, uiCode);
    
    console.log('  ✅ Figma plugin code generated');
  }

  generateMainPluginCode() {
    return `// LCARS Design System Figma Plugin
// Main plugin code

figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-token') {
    await applyDesignToken(msg.token);
  } else if (msg.type === 'import-tokens') {
    await importDesignTokens();
  } else if (msg.type === 'export-components') {
    await exportComponents();
  }
};

async function applyDesignToken(token) {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('Please select an element to apply the token to');
    return;
  }
  
  for (const node of selection) {
    if (token.type === 'color' && 'fills' in node) {
      node.fills = [{ type: 'SOLID', color: hexToRgb(token.value) }];
    } else if (token.type === 'typography' && 'fontSize' in node) {
      node.fontSize = remToPx(token.value);
    }
  }
  
  figma.notify('Design token applied successfully!');
}

async function importDesignTokens() {
  // Import design tokens from our system
  const tokens = await fetchDesignTokens();
  figma.notify('Design tokens imported!');
}

async function exportComponents() {
  // Export components back to our system
  const components = figma.currentPage.findAll(node => node.type === 'COMPONENT');
  figma.notify(\`Exported \${components.length} components!\`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

function remToPx(rem) {
  return parseFloat(rem) * 16;
}

async function fetchDesignTokens() {
  // This would fetch from our design system API
  return {
    colors: ['#FF6B35', '#4ECDC4', '#45B7D1'],
    typography: ['16px', '24px', '32px'],
    spacing: ['4px', '8px', '16px', '24px']
  };
}
`;
  }

  generatePluginUI() {
    return `<!DOCTYPE html>
<html>
<head>
  <title>LCARS Design System</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .header h1 {
      color: #FF6B35;
      margin: 0;
      font-size: 24px;
    }
    
    .section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .section h2 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #333;
    }
    
    .token-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 8px;
    }
    
    .token-item {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .token-item:hover {
      border-color: #FF6B35;
      background: #fff5f0;
    }
    
    .color-token {
      height: 40px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    
    .button {
      background: #FF6B35;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
    }
    
    .button:hover {
      background: #e55a2b;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 LCARS Design System</h1>
    <p>Star Trek-inspired design tokens</p>
  </div>
  
  <div class="section">
    <h2>🎨 Colors</h2>
    <div class="token-grid">
      <div class="token-item" data-token='{"type":"color","value":"#FF6B35"}'>
        <div class="color-token" style="background: #FF6B35;"></div>
        <small>Primary</small>
      </div>
      <div class="token-item" data-token='{"type":"color","value":"#4ECDC4"}'>
        <div class="color-token" style="background: #4ECDC4;"></div>
        <small>Secondary</small>
      </div>
      <div class="token-item" data-token='{"type":"color","value":"#45B7D1"}'>
        <div class="color-token" style="background: #45B7D1;"></div>
        <small>Accent</small>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>📝 Typography</h2>
    <div class="token-grid">
      <div class="token-item" data-token='{"type":"typography","value":"16px"}'>
        <small>Body</small>
      </div>
      <div class="token-item" data-token='{"type":"typography","value":"24px"}'>
        <small>Heading</small>
      </div>
      <div class="token-item" data-token='{"type":"typography","value":"32px"}'>
        <small>Large</small>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>🔧 Actions</h2>
    <button class="button" onclick="importTokens()">Import Tokens</button>
    <button class="button" onclick="exportComponents()">Export Components</button>
  </div>
  
  <script>
    // Handle token selection
    document.querySelectorAll('.token-item').forEach(item => {
      item.addEventListener('click', () => {
        const token = JSON.parse(item.dataset.token);
        parent.postMessage({ pluginMessage: { type: 'apply-token', token } }, '*');
      });
    });
    
    function importTokens() {
      parent.postMessage({ pluginMessage: { type: 'import-tokens' } }, '*');
    }
    
    function exportComponents() {
      parent.postMessage({ pluginMessage: { type: 'export-components' } }, '*');
    }
  </script>
</body>
</html>`;
  }
}

// Run the integration if this script is executed directly
if (require.main === module) {
  const integration = new FigmaIntegration();
  
  // Example usage
  integration.exportDesignTokens()
    .then(() => integration.createFigmaFile())
    .then(() => integration.generateFigmaPluginCode())
    .then(() => {
      console.log('\n🎉 Figma Integration Complete!');
      console.log('📁 Check the figma directory for generated files');
    })
    .catch(console.error);
}

module.exports = FigmaIntegration;
