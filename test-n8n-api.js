#!/usr/bin/env node
// Test n8n API response structure
// AlexAI NCC-1701-B API Testing

const N8NAPIClient = require('./sync-system/n8n-integration/api-client');

async function testAPI() {
  try {
    const client = new N8NAPIClient(
      process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com',
      process.env.N8N_API_KEY
    );
    
    console.log('🔍 Testing n8n API response structure...');
    
    // Test connection
    const connection = await client.testConnection();
    console.log('Connection test:', connection);
    
    // Get workflows
    const workflows = await client.getWorkflows();
    console.log('Workflows response type:', typeof workflows);
    console.log('Workflows response:', workflows);
    
    if (Array.isArray(workflows)) {
      console.log('✅ Workflows is an array with', workflows.length, 'items');
    } else {
      console.log('❌ Workflows is not an array');
      console.log('Expected array, got:', typeof workflows);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
