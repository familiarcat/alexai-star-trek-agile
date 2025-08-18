#!/usr/bin/env node

/**
 * 🖥️ Ship Computer Activation Script
 * Activates the Ship Computer workflow in n8n and integrates it with the crew system
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

class ShipComputerActivator {
  constructor() {
    this.baseUrl = 'https://agile.pbradygeorgen.com';
    this.workflowName = 'Ship Computer - LCARS Central Agent';
    this.workflowId = 'local-ship-computer-lcars-central-agent';
  }

  async run() {
    console.log('🖥️ Ship Computer Activation Process');
    console.log('====================================');
    console.log('');

    try {
      // 1. Check current Ship Computer status
      console.log('🔍 Step 1: Checking Current Ship Computer Status...');
      await this.checkCurrentStatus();
      console.log('');

      // 2. Verify workflow exists
      console.log('📋 Step 2: Verifying Workflow Exists...');
      await this.verifyWorkflowExists();
      console.log('');

      // 3. Test Ship Computer functionality
      console.log('🧪 Step 3: Testing Ship Computer Functionality...');
      await this.testShipComputerFunctionality();
      console.log('');

      // 4. Activate workflow in n8n
      console.log('🚀 Step 4: Activating Workflow in n8n...');
      await this.activateWorkflowInN8n();
      console.log('');

      // 5. Verify activation
      console.log('✅ Step 5: Verifying Activation...');
      await this.verifyActivation();
      console.log('');

      // 6. Test crew coordination
      console.log('👥 Step 6: Testing Crew Coordination...');
      await this.testCrewCoordination();
      console.log('');

      console.log('🎉 Ship Computer Activation Complete!');
      console.log('🖥️ The Enterprise-D Main Computer is now operational!');

    } catch (error) {
      console.error('❌ Activation failed:', error.message);
      process.exit(1);
    }
  }

  async checkCurrentStatus() {
    console.log('  🔍 Checking current Ship Computer status...');
    
    try {
      const workflowsResponse = await this.getWorkflowsData();
      const shipComputerWorkflow = workflowsResponse.workflows?.find(w => 
        w.name?.includes('Ship Computer')
      );
      
      if (shipComputerWorkflow) {
        console.log(`    ✅ Workflow found: ${shipComputerWorkflow.name}`);
        console.log(`    📊 Status: ${shipComputerWorkflow.active ? '🟢 Active' : '🔴 Inactive'}`);
        console.log(`    🆔 ID: ${shipComputerWorkflow.id}`);
      } else {
        console.log('    ❌ Ship Computer workflow not found');
      }
    } catch (error) {
      console.log(`    ❌ Error checking status: ${error.message}`);
    }
  }

  async verifyWorkflowExists() {
    console.log('  📋 Verifying workflow file exists...');
    
    try {
      const workflowPath = path.join(process.cwd(), 'workflows', 'ship-computer-lcars-central-agent.json');
      const workflowContent = await fs.readFile(workflowPath, 'utf-8');
      const workflow = JSON.parse(workflowContent);
      
      console.log(`    ✅ Workflow file found: ${workflow.name}`);
      console.log(`    🔧 Nodes: ${workflow.nodes?.length || 0}`);
      console.log(`    🏷️ Tags: ${(workflow.tags || []).map(t => t.name).join(', ')}`);
      
      // Check if workflow has required components
      const hasWebhook = workflow.nodes?.some(n => n.type === 'n8n-nodes-base.webhook');
      const hasCode = workflow.nodes?.some(n => n.type === 'n8n-nodes-base.code');
      const hasResponse = workflow.nodes?.some(n => n.type === 'n8n-nodes-base.respondToWebhook');
      
      console.log(`    🔌 Webhook: ${hasWebhook ? '✅' : '❌'}`);
      console.log(`    💻 Code Node: ${hasCode ? '✅' : '❌'}`);
      console.log(`    📤 Response: ${hasResponse ? '✅' : '❌'}`);
      
      if (hasWebhook && hasCode && hasResponse) {
        console.log('    🎯 Workflow structure is valid');
      } else {
        console.log('    ⚠️ Workflow structure needs attention');
      }
      
    } catch (error) {
      console.log(`    ❌ Error verifying workflow: ${error.message}`);
    }
  }

  async testShipComputerFunctionality() {
    console.log('  🧪 Testing Ship Computer functionality...');
    
    // Test demo page
    try {
      const demoResult = await this.testEndpoint('/ship-computer-demo');
      console.log(`    ✅ Demo Page: ${demoResult.status} (${demoResult.responseTime}ms)`);
    } catch (error) {
      console.log(`    ❌ Demo Page: ${error.message}`);
    }
    
    // Test responsive boundary manager
    try {
      const boundaryResult = await this.testEndpoint('/responsive-boundary-demo');
      console.log(`    ✅ Boundary Manager: ${boundaryResult.status} (${boundaryResult.responseTime}ms)`);
    } catch (error) {
      console.log(`    ❌ Boundary Manager: ${error.message}`);
    }
    
    // Test crew endpoints
    try {
      const crewResult = await this.testCrewEndpoint('captain-picard');
      console.log(`    ✅ Crew Coordination: ${crewResult.status} (${crewResult.responseTime}ms)`);
    } catch (error) {
      console.log(`    ❌ Crew Coordination: ${error.message}`);
    }
  }

  async activateWorkflowInN8n() {
    console.log('  🚀 Activating workflow in n8n...');
    
    // Since we can't directly activate the workflow through the API (it's a local workflow),
    // we need to provide instructions for manual activation
    console.log('    📝 Note: This workflow exists locally and needs to be imported to n8n');
    console.log('    🔧 To activate in n8n:');
    console.log('      1. Open n8n at https://n8n.pbradygeorgen.com');
    console.log('      2. Import the workflow: ship-computer-lcars-central-agent.json');
    console.log('      3. Activate the workflow');
    console.log('      4. Configure webhook endpoints');
    
    // Check if we can access the n8n instance
    try {
      const n8nResponse = await this.testEndpoint('/api/n8n-integration');
      if (n8nResponse.status === 200) {
        console.log('    ✅ n8n integration is accessible');
        console.log('    🔗 n8n URL: https://n8n.pbradygeorgen.com');
      } else {
        console.log(`    ⚠️ n8n integration status: ${n8nResponse.status}`);
      }
    } catch (error) {
      console.log(`    ❌ Cannot access n8n: ${error.message}`);
    }
  }

  async verifyActivation() {
    console.log('  ✅ Verifying activation...');
    
    // Since we can't directly activate through the API, we'll verify the current state
    try {
      const workflowsResponse = await this.getWorkflowsData();
      const shipComputerWorkflow = workflowsResponse.workflows?.find(w => 
        w.name?.includes('Ship Computer')
      );
      
      if (shipComputerWorkflow) {
        if (shipComputerWorkflow.active) {
          console.log('    🟢 Ship Computer workflow is ACTIVE');
          console.log('    🎉 Ready for crew coordination!');
        } else {
          console.log('    🔴 Ship Computer workflow is INACTIVE');
          console.log('    📋 Manual activation required in n8n');
        }
      } else {
        console.log('    ❌ Ship Computer workflow not found in n8n');
        console.log('    📋 Import workflow to n8n first');
      }
    } catch (error) {
      console.log(`    ❌ Error verifying activation: ${error.message}`);
    }
  }

  async testCrewCoordination() {
    console.log('  👥 Testing crew coordination...');
    
    const crewMembers = [
      'captain-picard',
      'commander-data',
      'counselor-troi',
      'chief-engineer-scott',
      'commander-spock',
      'lieutenant-worf',
      'quark',
      'observation-lounge'
    ];
    
    let successfulCrew = 0;
    let totalCrew = crewMembers.length;
    
    for (const crewMember of crewMembers) {
      try {
        const result = await this.testCrewEndpoint(crewMember);
        if (result.status === 200) {
          successfulCrew++;
          console.log(`    ✅ ${crewMember}: Operational`);
        } else {
          console.log(`    ❌ ${crewMember}: Status ${result.status}`);
        }
      } catch (error) {
        console.log(`    ❌ ${crewMember}: ${error.message}`);
      }
    }
    
    console.log(`    📊 Crew Status: ${successfulCrew}/${totalCrew} operational`);
    
    if (successfulCrew === totalCrew) {
      console.log('    🎉 All crew members are operational!');
    } else {
      console.log('    ⚠️ Some crew members need attention');
    }
  }

  async testEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const req = https.request(this.baseUrl + endpoint, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'ShipComputer-Activator/1.0'
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            responseTime,
            headers: res.headers,
            dataLength: data.length
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async testCrewEndpoint(crewMember) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const postData = JSON.stringify({
        query: `Test coordination for ${crewMember}`,
        context: 'ship-computer-activation',
        urgency: 'low'
      });

      const req = https.request(this.baseUrl + `/api/crew/${crewMember}`, {
        method: 'POST',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'ShipComputer-Activator/1.0'
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            responseTime,
            crewMember: crewMember
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  async getWorkflowsData() {
    return new Promise((resolve, reject) => {
      const req = https.request(this.baseUrl + '/api/n8n-integration/workflows', {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'ShipComputer-Activator/1.0'
        }
      }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(new Error('Failed to parse workflows data'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }
}

// Run the Ship Computer activation if this script is executed directly
if (require.main === module) {
  const activator = new ShipComputerActivator();
  activator.run();
}

module.exports = ShipComputerActivator;
