#!/usr/bin/env node
// Pull workflows from n8n.pbradygeorgen.com
// AlexAI NCC-1701-B Automated Workflow Sync System

const N8NAPIClient = require('../n8n-integration/api-client');
const fs = require('fs').promises;
const path = require('path');

class WorkflowPuller {
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
    console.log('📥 PULLING WORKFLOWS FROM N8N');
    console.log(`Source: ${this.n8nBaseUrl}`);
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
      await fs.mkdir(this.workflowsDir, { recursive: true });

      // Get all workflows from n8n
      console.log('📋 Fetching workflows from n8n...');
      const workflows = await this.client.getWorkflows();
      
      if (workflows.length === 0) {
        console.log('ℹ️  No workflows found on n8n');
        return;
      }

      console.log(`📋 Found ${workflows.length} workflow(s) on n8n`);
      console.log('');

      // Pull each workflow
      let successCount = 0;
      let errorCount = 0;

      for (const workflow of workflows) {
        try {
          await this.pullWorkflow(workflow);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to pull ${workflow.name}:`, error.message);
          errorCount++;
        }
      }

      console.log('');
      console.log('📊 PULL SUMMARY:');
      console.log(`✅ Successfully pulled: ${successCount}`);
      console.log(`❌ Failed to pull: ${errorCount}`);
      console.log(`📁 Total workflows: ${workflows.length}`);

      if (errorCount > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error('❌ Pull failed:', error.message);
      process.exit(1);
    }
  }

  async pullWorkflow(workflow) {
    console.log(`🔄 Pulling ${workflow.name}...`);

    try {
      // Export full workflow data
      const fullWorkflow = await this.client.exportWorkflow(workflow.id);
      
      // Generate filename
      const fileName = this.generateFileName(workflow.name);
      const filePath = path.join(this.workflowsDir, fileName);
      
      // Check if local file exists and compare
      let needsUpdate = true;
      try {
        const existingContent = await fs.readFile(filePath, 'utf8');
        const existingWorkflow = JSON.parse(existingContent);
        
        // Compare updatedAt timestamps
        if (existingWorkflow.updatedAt === fullWorkflow.updatedAt) {
          console.log(`   ℹ️  ${workflow.name} is up to date`);
          needsUpdate = false;
        }
      } catch (error) {
        // File doesn't exist or is invalid, proceed with update
      }

      if (needsUpdate) {
        // Write workflow to file
        await fs.writeFile(filePath, JSON.stringify(fullWorkflow, null, 2));
        console.log(`   ✅ Pulled: ${workflow.name} → ${fileName}`);
        
        // Log recent executions for monitoring
        await this.logRecentExecutions(workflow.id, workflow.name);
      }

    } catch (error) {
      console.error(`   ❌ Error pulling ${workflow.name}:`, error.message);
      throw error;
    }
  }

  generateFileName(workflowName) {
    // Convert workflow name to valid filename
    return workflowName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '.json';
  }

  async logRecentExecutions(workflowId, workflowName) {
    try {
      const executions = await this.client.getWorkflowExecutions(workflowId, 5);
      
      if (executions && executions.length > 0) {
        console.log(`   📊 Recent executions for ${workflowName}:`);
        executions.forEach(execution => {
          const status = execution.finished ? '✅' : '⏳';
          const startTime = new Date(execution.startedAt).toLocaleString();
          console.log(`      ${status} ${startTime} - ${execution.mode || 'unknown'}`);
        });
      }
    } catch (error) {
      // Don't fail the pull if we can't get executions
      console.log(`   ⚠️  Could not fetch execution history for ${workflowName}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const puller = new WorkflowPuller();
  puller.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = WorkflowPuller;
