#!/usr/bin/env node
// Push workflows to n8n.pbradygeorgen.com
// AlexAI NCC-1701-B Automated Workflow Sync System

const N8NAPIClient = require('../n8n-integration/api-client');
const fs = require('fs').promises;
const path = require('path');

class WorkflowPusher {
  constructor() {
    this.n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
    this.n8nApiKey = process.env.N8N_API_KEY;
    this.workflowsDir = path.join(__dirname, '../../workflows');
    
    if (!this.n8nApiKey) {
      throw new Error('N8N_API_KEY environment variable is required');
    }
    
    this.client = new N8NAPIClient(this.n8nBaseUrl, this.n8nApiKey);
  }

  async run() {
    console.log('🚀 PUSHING WORKFLOWS TO N8N');
    console.log(`Target: ${this.n8nBaseUrl}`);
    console.log(`Date: ${new Date().toISOString()}`);
    console.log('');

    try {
      // Test connection first
      console.log('🔍 Testing n8n connection...');
      const connectionTest = await this.client.testConnection();
      
      if (!connectionTest.connected) {
        throw new Error(`Cannot connect to n8n: ${connectionTest.error || connectionTest.statusText}`);
      }
      
      console.log('✅ Connected to n8n successfully');
      console.log('');

      // Ensure workflows directory exists
      try {
        await fs.access(this.workflowsDir);
      } catch (error) {
        console.log('📁 Creating workflows directory...');
        await fs.mkdir(this.workflowsDir, { recursive: true });
      }

      // Get workflow files
      const workflowFiles = await this.getWorkflowFiles();
      
      if (workflowFiles.length === 0) {
        console.log('ℹ️  No workflow files found to push');
        return;
      }

      console.log(`📋 Found ${workflowFiles.length} workflow file(s) to push`);
      console.log('');

      // Push each workflow
      let successCount = 0;
      let errorCount = 0;

      for (const file of workflowFiles) {
        try {
          await this.pushWorkflow(file);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to push ${file}:`, error.message);
          errorCount++;
        }
      }

      console.log('');
      console.log('📊 PUSH SUMMARY:');
      console.log(`✅ Successfully pushed: ${successCount}`);
      console.log(`❌ Failed to push: ${errorCount}`);
      console.log(`📁 Total workflows: ${workflowFiles.length}`);

      if (errorCount > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error('❌ Push failed:', error.message);
      process.exit(1);
    }
  }

  async getWorkflowFiles() {
    const files = await fs.readdir(this.workflowsDir);
    return files.filter(file => file.endsWith('.json'));
  }

  async pushWorkflow(fileName) {
    const filePath = path.join(this.workflowsDir, fileName);
    console.log(`🔄 Processing ${fileName}...`);

    try {
      // Read workflow file
      const workflowData = JSON.parse(await fs.readFile(filePath, 'utf8'));
      
      // Validate workflow data
      if (!workflowData.name) {
        throw new Error('Workflow must have a name');
      }

      if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
        throw new Error('Workflow must have nodes array');
      }

      // Check if workflow exists on n8n
      const existingWorkflows = await this.client.getWorkflows();
      const existingWorkflow = existingWorkflows.find(w => w.name === workflowData.name);

      let result;
      if (existingWorkflow) {
        // Update existing workflow
        console.log(`   📝 Updating existing workflow: ${workflowData.name}`);
        result = await this.client.updateWorkflow(existingWorkflow.id, workflowData);
        
        // Update local file with ID if not present
        if (!workflowData.id) {
          workflowData.id = existingWorkflow.id;
          await fs.writeFile(filePath, JSON.stringify(workflowData, null, 2));
        }
      } else {
        // Create new workflow
        console.log(`   ➕ Creating new workflow: ${workflowData.name}`);
        result = await this.client.createWorkflow(workflowData);
        
        // Update local file with new ID
        workflowData.id = result.id;
        await fs.writeFile(filePath, JSON.stringify(workflowData, null, 2));
      }

      // Activate workflow if specified
      if (workflowData.active !== false) {
        console.log(`   ⚡ Activating workflow: ${workflowData.name}`);
        await this.client.activateWorkflow(workflowData.id || result.id);
      }

      console.log(`   ✅ Successfully pushed: ${workflowData.name}`);

    } catch (error) {
      console.error(`   ❌ Error pushing ${fileName}:`, error.message);
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const pusher = new WorkflowPusher();
  pusher.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = WorkflowPusher;
