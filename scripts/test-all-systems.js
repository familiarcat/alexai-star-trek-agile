#!/usr/bin/env node

/**
 * 🚀 Comprehensive System Testing
 * Tests all systems including Ship Computer, crew members, and n8n integration
 */

const https = require('https');
const http = require('http');

class ComprehensiveSystemTester {
  constructor() {
    this.baseUrl = 'https://agile.pbradygeorgen.com';
    this.localUrl = 'http://localhost:3000';
    this.testResults = {
      timestamp: new Date().toISOString(),
      production: {},
      local: {},
      shipComputer: {},
      crewMembers: {},
      n8n: {},
      summary: {}
    };
  }

  async run() {
    console.log('🚀 Comprehensive System Testing');
    console.log('================================');
    console.log('');

    try {
      // 1. Test Production Systems
      console.log('🌐 Step 1: Testing Production Systems...');
      await this.testProductionSystems();
      console.log('');

      // 2. Test Local Systems
      console.log('🏠 Step 2: Testing Local Systems...');
      await this.testLocalSystems();
      console.log('');

      // 3. Test Ship Computer
      console.log('🖥️ Step 3: Testing Ship Computer...');
      await this.testShipComputer();
      console.log('');

      // 4. Test All Crew Members
      console.log('👥 Step 4: Testing All Crew Members...');
      await this.testAllCrewMembers();
      console.log('');

      // 5. Test n8n Integration
      console.log('🤖 Step 5: Testing n8n Integration...');
      await this.testN8nIntegration();
      console.log('');

      // 6. Generate comprehensive report
      console.log('📊 Step 6: Generating Comprehensive Report...');
      await this.generateComprehensiveReport();
      console.log('');

      console.log('🎉 Comprehensive System Testing Complete!');
      console.log(`📁 Check the test results in: test-output`);

    } catch (error) {
      console.error('❌ Testing failed:', error.message);
      process.exit(1);
    }
  }

  async testProductionSystems() {
    console.log('  🌐 Testing Production Systems...');
    
    const productionTests = {
      health: '/api/health',
      root: '/',
      shipComputerDemo: '/ship-computer-demo',
      responsiveBoundaryDemo: '/responsive-boundary-demo'
    };

    for (const [name, endpoint] of Object.entries(productionTests)) {
      try {
        const result = await this.testProductionEndpoint(endpoint);
        this.testResults.production[name] = result;
        console.log(`    ✅ ${name}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        this.testResults.production[name] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${name}: ${error.message}`);
      }
    }
  }

  async testProductionEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const req = https.request(this.baseUrl + endpoint, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'System-Tester/1.0'
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
            dataLength: data.length,
            timestamp: new Date().toISOString()
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

  async testLocalSystems() {
    console.log('  🏠 Testing Local Systems...');
    
    const localTests = {
      health: '/api/health',
      root: '/',
      shipComputerDemo: '/ship-computer-demo',
      responsiveBoundaryDemo: '/responsive-boundary-demo'
    };

    for (const [name, endpoint] of Object.entries(localTests)) {
      try {
        const result = await this.testLocalEndpoint(endpoint);
        this.testResults.local[name] = result;
        console.log(`    ✅ ${name}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        this.testResults.local[name] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${name}: ${error.message}`);
      }
    }
  }

  async testLocalEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: endpoint,
        method: 'GET',
        timeout: 10000
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
            dataLength: data.length,
            timestamp: new Date().toISOString()
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

  async testShipComputer() {
    console.log('  🖥️ Testing Ship Computer...');
    
    // Test Ship Computer demo page
    try {
      const demoResult = await this.testProductionEndpoint('/ship-computer-demo');
      this.testResults.shipComputer.demo = demoResult;
      console.log(`    ✅ Demo Page: ${demoResult.status} (${demoResult.responseTime}ms)`);
    } catch (error) {
      this.testResults.shipComputer.demo = { error: error.message, status: 'ERROR' };
      console.log(`    ❌ Demo Page: ${error.message}`);
    }

    // Test responsive boundary manager
    try {
      const boundaryResult = await this.testProductionEndpoint('/responsive-boundary-demo');
      this.testResults.shipComputer.boundaryManager = boundaryResult;
      console.log(`    ✅ Boundary Manager: ${boundaryResult.status} (${boundaryResult.responseTime}ms)`);
    } catch (error) {
      this.testResults.shipComputer.boundaryManager = { error: error.message, status: 'ERROR' };
      console.log(`    ❌ Boundary Manager: ${error.message}`);
    }

    // Test Ship Computer workflow
    try {
      const workflowResult = await this.testProductionEndpoint('/api/n8n-integration/workflows');
      this.testResults.shipComputer.workflow = workflowResult;
      console.log(`    ✅ Workflow API: ${workflowResult.status} (${workflowResult.responseTime}ms)`);
    } catch (error) {
      this.testResults.shipComputer.workflow = { error: error.message, status: 'ERROR' };
      console.log(`    ❌ Workflow API: ${error.message}`);
    }
  }

  async testAllCrewMembers() {
    console.log('  👥 Testing All Crew Members...');
    
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

    for (const crewMember of crewMembers) {
      try {
        const result = await this.testCrewMember(crewMember);
        this.testResults.crewMembers[crewMember] = result;
        console.log(`    ✅ ${crewMember}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        this.testResults.crewMembers[crewMember] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${crewMember}: ${error.message}`);
      }
    }
  }

  async testCrewMember(crewMember) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const postData = JSON.stringify({
        query: `Test query for ${crewMember}`,
        context: 'system-testing',
        urgency: 'low'
      });

      const req = https.request(this.baseUrl + `/api/crew/${crewMember}`, {
        method: 'POST',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'System-Tester/1.0'
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              responseTime,
              crewMember: jsonData.crewMember,
              greeting: jsonData.response?.greeting,
              timestamp: new Date().toISOString()
            });
          } catch (parseError) {
            resolve({
              status: res.statusCode,
              responseTime,
              data: data.substring(0, 100),
              timestamp: new Date().toISOString()
            });
          }
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

  async testN8nIntegration() {
    console.log('  🤖 Testing n8n Integration...');
    
    const n8nTests = {
      integration: '/api/n8n-integration',
      workflows: '/api/n8n-integration/workflows'
    };

    for (const [name, endpoint] of Object.entries(n8nTests)) {
      try {
        const result = await this.testProductionEndpoint(endpoint);
        this.testResults.n8n[name] = result;
        console.log(`    ✅ ${name}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        this.testResults.n8n[name] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${name}: ${error.message}`);
      }
    }

    // Test Ship Computer workflow specifically
    try {
      const workflowResult = await this.testProductionEndpoint('/api/n8n-integration/workflows');
      if (workflowResult.status === 200) {
        // Parse the response to check for Ship Computer workflow
        const workflowsResponse = await this.getWorkflowsData();
        const shipComputerWorkflow = workflowsResponse.workflows?.find(w => 
          w.name?.includes('Ship Computer')
        );
        
        if (shipComputerWorkflow) {
          this.testResults.n8n.shipComputerWorkflow = {
            found: true,
            name: shipComputerWorkflow.name,
            active: shipComputerWorkflow.active,
            id: shipComputerWorkflow.id
          };
          console.log(`    ✅ Ship Computer Workflow: Found (${shipComputerWorkflow.active ? 'Active' : 'Inactive'})`);
        } else {
          this.testResults.n8n.shipComputerWorkflow = { found: false };
          console.log(`    ❌ Ship Computer Workflow: Not found`);
        }
      }
    } catch (error) {
      this.testResults.n8n.shipComputerWorkflow = { error: error.message };
      console.log(`    ❌ Ship Computer Workflow: ${error.message}`);
    }
  }

  async getWorkflowsData() {
    return new Promise((resolve, reject) => {
      const req = https.request(this.baseUrl + '/api/n8n-integration/workflows', {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'System-Tester/1.0'
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

  async generateComprehensiveReport() {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure output directory exists
    try {
      await fs.mkdir('test-output', { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Generate JSON report
    const reportPath = path.join('test-output', 'comprehensive-system-test.json');
    await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`  ✅ JSON report saved to: ${reportPath}`);

    // Generate human-readable summary
    const summaryPath = path.join('test-output', 'system-test-summary.md');
    const summary = this.createHumanReadableSummary();
    await fs.writeFile(summaryPath, summary);
    console.log(`  ✅ Summary report saved to: ${summaryPath}`);

    // Generate Ship Computer analysis
    const shipComputerPath = path.join('test-output', 'ship-computer-analysis.md');
    const shipComputerAnalysis = this.createShipComputerAnalysis();
    await fs.writeFile(shipComputerPath, shipComputerAnalysis);
    console.log(`  ✅ Ship Computer analysis saved to: ${shipComputerPath}`);
  }

  createHumanReadableSummary() {
    const { production, local, shipComputer, crewMembers, n8n } = this.testResults;
    
    return `# 🚀 Comprehensive System Testing Summary

## 📊 Test Overview
- **Timestamp**: ${this.testResults.timestamp}
- **Production Tests**: ${Object.keys(production).length}
- **Local Tests**: ${Object.keys(local).length}
- **Crew Members**: ${Object.keys(crewMembers).length}

## 🌐 Production Systems
${this.formatProductionResults(production)}

## 🏠 Local Systems
${this.formatLocalResults(local)}

## 🖥️ Ship Computer
${this.formatShipComputerResults(shipComputer)}

## 👥 Crew Members
${this.formatCrewResults(crewMembers)}

## 🤖 n8n Integration
${this.formatN8nResults(n8n)}

## 🎯 Overall Status
${this.getOverallStatus()}

## 🚨 Issues Found
${this.getIssuesFound()}

## ✅ Recommendations
${this.getRecommendations()}
`;
  }

  createShipComputerAnalysis() {
    const { shipComputer, n8n } = this.testResults;
    
    return `# 🖥️ Ship Computer Analysis Report

## 📊 Current Status
- **Demo Page**: ${shipComputer.demo?.status === 200 ? '✅ Operational' : '❌ Failed'}
- **Boundary Manager**: ${shipComputer.boundaryManager?.status === 200 ? '✅ Operational' : '❌ Failed'}
- **Workflow API**: ${shipComputer.workflow?.status === 200 ? '✅ Operational' : '❌ Failed'}

## 🤖 n8n Integration Status
- **n8n API**: ${n8n.integration?.status === 200 ? '✅ Connected' : '❌ Disconnected'}
- **Workflows API**: ${n8n.workflows?.status === 200 ? '✅ Accessible' : '❌ Inaccessible'}
- **Ship Computer Workflow**: ${n8n.shipComputerWorkflow?.found ? '✅ Found' : '❌ Missing'}

## 🔍 Ship Computer Workflow Details
${n8n.shipComputerWorkflow?.found ? `
- **Name**: ${n8n.shipComputerWorkflow.name}
- **Status**: ${n8n.shipComputerWorkflow.active ? '🟢 Active' : '🔴 Inactive'}
- **ID**: ${n8n.shipComputerWorkflow.id}
` : '- **Status**: Workflow not found in n8n'}

## 🎯 Key Findings
${this.getShipComputerFindings()}

## 🚀 Recommendations
${this.getShipComputerRecommendations()}

## 📋 Action Items
${this.getShipComputerActionItems()}
`;
  }

  formatProductionResults(production) {
    if (!production || Object.keys(production).length === 0) return '- No production tests performed';
    
    const successful = Object.values(production).filter(r => r.status === 200).length;
    const total = Object.keys(production).length;
    
    return `- **Status**: ${successful}/${total} endpoints successful
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Endpoints**: ${Object.keys(production).join(', ')}`;
  }

  formatLocalResults(local) {
    if (!local || Object.keys(local).length === 0) return '- No local tests performed';
    
    const successful = Object.values(local).filter(r => r.status === 200).length;
    const total = Object.keys(local).length;
    
    return `- **Status**: ${successful}/${total} endpoints successful
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Endpoints**: ${Object.keys(local).join(', ')}`;
  }

  formatShipComputerResults(shipComputer) {
    if (!shipComputer || Object.keys(shipComputer).length === 0) return '- No Ship Computer tests performed';
    
    const successful = Object.values(shipComputer).filter(r => r.status === 200).length;
    const total = Object.keys(shipComputer).length;
    
    return `- **Status**: ${successful}/${total} components successful
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Components**: ${Object.keys(shipComputer).join(', ')}`;
  }

  formatCrewResults(crewMembers) {
    if (!crewMembers || Object.keys(crewMembers).length === 0) return '- No crew member tests performed';
    
    const successful = Object.values(crewMembers).filter(r => r.status === 200).length;
    const total = Object.keys(crewMembers).length;
    
    return `- **Status**: ${successful}/${total} crew members operational
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Crew Members**: ${Object.keys(crewMembers).join(', ')}`;
  }

  formatN8nResults(n8n) {
    if (!n8n || Object.keys(n8n).length === 0) return '- No n8n tests performed';
    
    const successful = Object.values(n8n).filter(r => r.status === 200).length;
    const total = Object.keys(n8n).filter(k => k !== 'shipComputerWorkflow').length;
    
    return `- **Status**: ${successful}/${total} endpoints successful
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Endpoints**: ${Object.keys(n8n).filter(k => k !== 'shipComputerWorkflow').join(', ')}`;
  }

  getOverallStatus() {
    const productionSuccess = this.testResults.production ? 
      Object.values(this.testResults.production).filter(r => r.status === 200).length : 0;
    const productionTotal = this.testResults.production ? Object.keys(this.testResults.production).length : 0;
    const productionRate = productionTotal > 0 ? (productionSuccess / productionTotal) * 100 : 0;
    
    const localSuccess = this.testResults.local ? 
      Object.values(this.testResults.local).filter(r => r.status === 200).length : 0;
    const localTotal = this.testResults.local ? Object.keys(this.testResults.local).length : 0;
    const localRate = localTotal > 0 ? (localSuccess / localTotal) * 100 : 0;
    
    const crewSuccess = this.testResults.crewMembers ? 
      Object.values(this.testResults.crewMembers).filter(r => r.status === 200).length : 0;
    const crewTotal = this.testResults.crewMembers ? Object.keys(this.testResults.crewMembers).length : 0;
    const crewRate = crewTotal > 0 ? (crewSuccess / crewTotal) * 100 : 0;
    
    if (productionRate >= 90 && localRate >= 90 && crewRate >= 90) {
      return '🟢 **EXCELLENT** - All systems operational';
    } else if (productionRate >= 80 && localRate >= 80 && crewRate >= 80) {
      return '🟡 **GOOD** - Most systems operational';
    } else if (productionRate >= 70 && localRate >= 70 && crewRate >= 70) {
      return '🟠 **FAIR** - Some systems need attention';
    } else {
      return '🔴 **POOR** - Significant issues need resolution';
    }
  }

  getIssuesFound() {
    const issues = [];
    
    // Check production issues
    if (this.testResults.production) {
      const failedProduction = Object.entries(this.testResults.production)
        .filter(([name, result]) => result.status !== 200);
      if (failedProduction.length > 0) {
        issues.push(`- Production issues: ${failedProduction.map(([name]) => name).join(', ')}`);
      }
    }
    
    // Check local issues
    if (this.testResults.local) {
      const failedLocal = Object.entries(this.testResults.local)
        .filter(([name, result]) => result.status !== 200);
      if (failedLocal.length > 0) {
        issues.push(`- Local issues: ${failedLocal.map(([name]) => name).join(', ')}`);
      }
    }
    
    // Check crew issues
    if (this.testResults.crewMembers) {
      const failedCrew = Object.entries(this.testResults.crewMembers)
        .filter(([name, result]) => result.status !== 200);
      if (failedCrew.length > 0) {
        issues.push(`- Crew issues: ${failedCrew.map(([name]) => name).join(', ')}`);
      }
    }
    
    // Check Ship Computer workflow
    if (this.testResults.n8n?.shipComputerWorkflow?.found === false) {
      issues.push('- Ship Computer workflow not found in n8n');
    }
    
    return issues.length > 0 ? issues.join('\n') : '- No critical issues found';
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.testResults.n8n?.shipComputerWorkflow?.found === false) {
      recommendations.push('- Import Ship Computer workflow to n8n');
    }
    
    if (this.testResults.n8n?.shipComputerWorkflow?.active === false) {
      recommendations.push('- Activate Ship Computer workflow in n8n');
    }
    
    if (this.testResults.crewMembers) {
      const failedCrew = Object.entries(this.testResults.crewMembers)
        .filter(([name, result]) => result.status !== 200);
      if (failedCrew.length > 0) {
        recommendations.push('- Investigate and fix failed crew member endpoints');
      }
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '- All systems are operating optimally';
  }

  getShipComputerFindings() {
    const findings = [];
    
    if (this.testResults.shipComputer.demo?.status === 200) {
      findings.push('- ✅ Ship Computer demo page is operational');
    } else {
      findings.push('- ❌ Ship Computer demo page has issues');
    }
    
    if (this.testResults.shipComputer.boundaryManager?.status === 200) {
      findings.push('- ✅ Responsive boundary manager is operational');
    } else {
      findings.push('- ❌ Responsive boundary manager has issues');
    }
    
    if (this.testResults.n8n?.shipComputerWorkflow?.found) {
      findings.push('- ✅ Ship Computer workflow exists in n8n');
      if (this.testResults.n8n.shipComputerWorkflow.active) {
        findings.push('- ✅ Ship Computer workflow is active');
      } else {
        findings.push('- ⚠️ Ship Computer workflow exists but is inactive');
      }
    } else {
      findings.push('- ❌ Ship Computer workflow not found in n8n');
    }
    
    return findings.join('\n');
  }

  getShipComputerRecommendations() {
    const recommendations = [];
    
    if (!this.testResults.n8n?.shipComputerWorkflow?.found) {
      recommendations.push('- **Immediate**: Import Ship Computer workflow to n8n');
      recommendations.push('- **Priority**: Ensure workflow is properly configured');
    }
    
    if (this.testResults.n8n?.shipComputerWorkflow?.found && !this.testResults.n8n.shipComputerWorkflow.active) {
      recommendations.push('- **Immediate**: Activate Ship Computer workflow in n8n');
      recommendations.push('- **Priority**: Test workflow execution');
    }
    
    recommendations.push('- **Ongoing**: Monitor Ship Computer performance');
    recommendations.push('- **Future**: Enhance workflow with additional crew coordination features');
    
    return recommendations.join('\n');
  }

  getShipComputerActionItems() {
    const actions = [];
    
    if (!this.testResults.n8n?.shipComputerWorkflow?.found) {
      actions.push('- [ ] Import Ship Computer workflow to n8n');
      actions.push('- [ ] Configure workflow webhooks');
      actions.push('- [ ] Test workflow connectivity');
    }
    
    if (this.testResults.n8n?.shipComputerWorkflow?.found && !this.testResults.n8n.shipComputerWorkflow.active) {
      actions.push('- [ ] Activate Ship Computer workflow');
      actions.push('- [ ] Verify webhook endpoints');
      actions.push('- [ ] Test crew coordination');
    }
    
    actions.push('- [ ] Test Ship Computer with all crew members');
    actions.push('- [ ] Verify responsive boundary management');
    actions.push('- [ ] Monitor system performance');
    actions.push('- [ ] Document integration status');
    
    return actions.join('\n');
  }
}

// Run the comprehensive testing if this script is executed directly
if (require.main === module) {
  const tester = new ComprehensiveSystemTester();
  tester.run();
}

module.exports = ComprehensiveSystemTester;
