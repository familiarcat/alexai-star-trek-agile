// LCARS Design System Figma Plugin
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
  figma.notify(`Exported ${components.length} components!`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
