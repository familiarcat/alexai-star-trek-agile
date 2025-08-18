#!/usr/bin/env node

/**
 * 🚀 Comprehensive Deployment Testing
 *
 * This script tests both local and Vercel deployments with our enhanced LCARS architecture,
 * connecting to n8n.pbradygeorgen.com backend and Supabase as single source of truth.
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

class ComprehensiveDeploymentTester {
  constructor() {
    this.workflowDir = path.join(__dirname, '..');
    this.outputDir = path.join(this.workflowDir, 'deployment-test-output');
    this.testResults = {
      timestamp: new Date().toISOString(),
      local: {},
      vercel: {},
      n8n: {},
      supabase: {},
      lcars: {},
      summary: {}
    };
  }

  async run() {
    console.log('🚀 Comprehensive Deployment Testing');
    console.log('==================================');
    console.log('');

    try {
      // 1. Test Local Deployment
      console.log('🏠 Step 1: Testing Local Deployment...');
      await this.testLocalDeployment();
      console.log('');

      // 2. Test Vercel Deployment
      console.log('☁️ Step 2: Testing Vercel Deployment...');
      await this.testVercelDeployment();
      console.log('');

      // 3. Test n8n Backend (pbradygeorgen.com)
      console.log('🤖 Step 3: Testing n8n Backend...');
      await this.testN8nBackend();
      console.log('');

      // 4. Test Supabase Integration
      console.log('🗄️ Step 4: Testing Supabase Integration...');
      await this.testSupabaseIntegration();
      console.log('');

      // 5. Test LCARS Central Agent
      console.log('🖥️ Step 5: Testing LCARS Central Agent...');
      await this.testLCARSCentralAgent();
      console.log('');

      // 6. Generate comprehensive report
      console.log('📊 Step 6: Generating Comprehensive Report...');
      await this.generateComprehensiveReport();
      console.log('');

      console.log('🎉 Comprehensive Deployment Testing Complete!');
      console.log(`📁 Check the test results in: ${this.outputDir}`);

    } catch (error) {
      console.error('❌ Testing failed:', error.message);
      process.exit(1);
    }
  }

  async testLocalDeployment() {
    console.log('  🏠 Testing Local Deployment...');
    
    const localTests = {
      port: 3000,
      endpoints: [
        '/',
        '/api/health',
        '/api/crew/captain-picard',
        '/api/crew/commander-data',
        '/api/crew/counselor-troi',
        '/api/crew/chief-engineer-scott',
        '/api/crew/commander-spock',
        '/api/crew/lieutenant-worf',
        '/api/crew/quark',
        '/api/crew/observation-lounge',
        '/ship-computer-demo',
        '/responsive-boundary-demo'
      ],
      results: {}
    };

    for (const endpoint of localTests.endpoints) {
      try {
        const result = await this.testLocalEndpoint(endpoint);
        localTests.results[endpoint] = result;
        console.log(`    ✅ ${endpoint}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        localTests.results[endpoint] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${endpoint}: ${error.message}`);
      }
    }

    this.testResults.local = localTests;
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

  async testVercelDeployment() {
    console.log('  ☁️ Testing Vercel Deployment...');
    
    // Note: Replace with actual Vercel URL when deployed
    const vercelTests = {
      baseUrl: 'https://your-app.vercel.app', // Replace with actual URL
      endpoints: [
        '/',
        '/api/health',
        '/api/crew/captain-picard',
        '/ship-computer-demo'
      ],
      results: {}
    };

    console.log('    ⚠️  Vercel deployment not yet configured');
    console.log('    📝 Please update the baseUrl in the test script after deployment');
    
    this.testResults.vercel = {
      ...vercelTests,
      status: 'NOT_CONFIGURED',
      message: 'Vercel deployment URL needs to be configured'
    };
  }

  async testN8nBackend() {
    console.log('  🤖 Testing n8n Backend (pbradygeorgen.com)...');
    
    const n8nTests = {
      baseUrl: 'https://n8n.pbradygeorgen.com',
      endpoints: [
        '/',
        '/api/webhook/lcars-interface',
        '/api/webhook/crew-request',
        '/api/webhook/ship-computer'
      ],
      workflows: [
        'ship-computer-lcars-central-agent',
        'ship-computer-ai-agent',
        'alexai-complete-crew-workflow'
      ],
      results: {}
    };

    for (const endpoint of n8nTests.endpoints) {
      try {
        const result = await this.testN8nEndpoint(n8nTests.baseUrl + endpoint);
        n8nTests.results[endpoint] = result;
        console.log(`    ✅ ${endpoint}: ${result.status} (${result.responseTime}ms)`);
      } catch (error) {
        n8nTests.results[endpoint] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ ${endpoint}: ${error.message}`);
      }
    }

    // Test workflow availability
    for (const workflow of n8nTests.workflows) {
      try {
        const result = await this.testN8nWorkflow(n8nTests.baseUrl, workflow);
        n8nTests.results[`workflow-${workflow}`] = result;
        console.log(`    ✅ Workflow ${workflow}: ${result.status}`);
      } catch (error) {
        n8nTests.results[`workflow-${workflow}`] = { error: error.message, status: 'ERROR' };
        console.log(`    ❌ Workflow ${workflow}: ${error.message}`);
      }
    }

    this.testResults.n8n = n8nTests;
  }

  async testN8nEndpoint(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const req = https.request(url, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'LCARS-Deployment-Tester/1.0'
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

  async testN8nWorkflow(baseUrl, workflowName) {
    // Test if workflow is accessible via n8n API
    const url = `${baseUrl}/api/workflows/${workflowName}`;
    return this.testN8nEndpoint(url);
  }

  async testSupabaseIntegration() {
    console.log('  🗄️ Testing Supabase Integration...');
    
    const supabaseTests = {
      status: 'TESTING',
      features: [
        'user_stories',
        'test_executions',
        'learning_insights',
        'crew_coordination',
        'lcars_system_status'
      ],
      results: {}
    };

    // Check if Supabase environment variables are configured
    try {
      const envPath = path.join(this.workflowDir, '.env.local');
      const envContent = await fs.readFile(envPath, 'utf-8');
      
      const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
      const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      
      supabaseTests.results.environment = {
        hasSupabaseUrl,
        hasSupabaseKey,
        configured: hasSupabaseUrl && hasSupabaseKey
      };

      if (hasSupabaseUrl && hasSupabaseKey) {
        console.log('    ✅ Supabase environment variables configured');
        supabaseTests.status = 'CONFIGURED';
      } else {
        console.log('    ⚠️  Supabase environment variables not fully configured');
        supabaseTests.status = 'PARTIALLY_CONFIGURED';
      }
    } catch (error) {
      console.log('    ❌ Supabase environment file not found');
      supabaseTests.status = 'NOT_CONFIGURED';
      supabaseTests.results.environment = { error: 'Environment file not found' };
    }

    // Test Supabase schema files
    const schemaPath = path.join(this.workflowDir, 'user-stories/supabase-schema.sql');
    try {
      const schemaContent = await fs.readFile(schemaPath, 'utf-8');
      supabaseTests.results.schema = {
        exists: true,
        tables: this.extractTablesFromSchema(schemaContent),
        timestamp: new Date().toISOString()
      };
      console.log(`    ✅ Supabase schema found with ${supabaseTests.results.schema.tables.length} tables`);
    } catch (error) {
      supabaseTests.results.schema = { error: 'Schema file not found' };
      console.log('    ❌ Supabase schema file not found');
    }

    this.testResults.supabase = supabaseTests;
  }

  extractTablesFromSchema(schemaContent) {
    const tableMatches = schemaContent.match(/CREATE TABLE IF NOT EXISTS (\w+)/g);
    if (tableMatches) {
      return tableMatches.map(match => match.replace('CREATE TABLE IF NOT EXISTS ', ''));
    }
    return [];
  }

  async testLCARSCentralAgent() {
    console.log('  🖥️ Testing LCARS Central Agent...');
    
    const lcarsTests = {
      workflow: 'ship-computer-lcars-central-agent.json',
      capabilities: [
        'crew_coordination',
        'knowledge_query',
        'system_status',
        'mission_analysis',
        'crew_communication',
        'data_analysis',
        'resource_allocation',
        'emergency_protocol'
      ],
      results: {}
    };

    // Check if LCARS workflow exists
    const workflowPath = path.join(this.workflowDir, 'workflows', lcarsTests.workflow);
    try {
      const workflowContent = await fs.readFile(workflowPath, 'utf-8');
      const workflow = JSON.parse(workflowContent);
      
      lcarsTests.results.workflow = {
        exists: true,
        name: workflow.name,
        nodes: workflow.nodes?.length || 0,
        active: workflow.active || false,
        tags: workflow.tags || [],
        timestamp: new Date().toISOString()
      };

      console.log(`    ✅ LCARS workflow found: ${workflow.name}`);
      console.log(`    📊 Workflow has ${workflow.nodes?.length || 0} nodes`);
      console.log(`    🏷️  Tags: ${(workflow.tags || []).join(', ')}`);

      // Test workflow structure
      const hasWebhook = workflow.nodes?.some(node => node.type === 'n8n-nodes-base.webhook');
      const hasCode = workflow.nodes?.some(node => node.type === 'n8n-nodes-base.code');
      const hasResponse = workflow.nodes?.some(node => node.type === 'n8n-nodes-base.respondToWebhook');

      lcarsTests.results.structure = {
        hasWebhook,
        hasCode,
        hasResponse,
        valid: hasWebhook && hasCode && hasResponse
      };

      if (lcarsTests.results.structure.valid) {
        console.log('    ✅ LCARS workflow structure is valid');
      } else {
        console.log('    ⚠️  LCARS workflow structure needs attention');
      }

    } catch (error) {
      lcarsTests.results.workflow = { error: error.message };
      console.log(`    ❌ LCARS workflow error: ${error.message}`);
    }

    this.testResults.lcars = lcarsTests;
  }

  async generateComprehensiveReport() {
    // Ensure output directory exists
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Generate JSON report
    const reportPath = path.join(this.outputDir, 'comprehensive-deployment-test.json');
    await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
    console.log(`  ✅ JSON report saved to: ${reportPath}`);

    // Generate human-readable summary
    const summaryPath = path.join(this.outputDir, 'deployment-test-summary.md');
    const summary = this.createHumanReadableSummary();
    await fs.writeFile(summaryPath, summary);
    console.log(`  ✅ Summary report saved to: ${summaryPath}`);

    // Generate deployment readiness assessment
    const readinessPath = path.join(this.outputDir, 'deployment-readiness-assessment.md');
    const readiness = this.createDeploymentReadinessAssessment();
    await fs.writeFile(readinessPath, readiness);
    console.log(`  ✅ Readiness assessment saved to: ${readinessPath}`);
  }

  createHumanReadableSummary() {
    const { local, vercel, n8n, supabase, lcars } = this.testResults;
    
    return `# 🚀 Comprehensive Deployment Testing Summary

## 📊 Test Overview
- **Timestamp**: ${this.testResults.timestamp}
- **Total Tests**: ${Object.keys(local.results || {}).length + Object.keys(n8n.results || {}).length + 2}

## 🏠 Local Deployment Results
${this.formatLocalResults(local)}

## ☁️ Vercel Deployment Results
${this.formatVercelResults(vercel)}

## 🤖 n8n Backend Results
${this.formatN8nResults(n8n)}

## 🗄️ Supabase Integration Results
${this.formatSupabaseResults(supabase)}

## 🖥️ LCARS Central Agent Results
${this.formatLCARSResults(lcars)}

## 🎯 Next Steps
1. **Configure Vercel deployment URL**
2. **Verify n8n backend connectivity**
3. **Complete Supabase environment setup**
4. **Test LCARS workflow in n8n**
5. **Deploy to production**

## 🏆 Overall Status
${this.getOverallStatus()}
`;
  }

  formatLocalResults(local) {
    if (!local.results) return '- No local tests performed';
    
    const successful = Object.values(local.results).filter(r => r.status === 200).length;
    const total = Object.keys(local.results).length;
    
    return `- **Status**: ${successful}/${total} endpoints successful
- **Port**: ${local.port}
- **Endpoints Tested**: ${total}
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%`;
  }

  formatVercelResults(vercel) {
    if (vercel.status === 'NOT_CONFIGURED') {
      return `- **Status**: ${vercel.status}
- **Message**: ${vercel.message}
- **Action Required**: Update baseUrl in test script`;
    }
    return `- **Status**: ${vercel.status}
- **Base URL**: ${vercel.baseUrl}`;
  }

  formatN8nResults(n8n) {
    if (!n8n.results) return '- No n8n tests performed';
    
    const successful = Object.values(n8n.results).filter(r => r.status === 200).length;
    const total = Object.keys(n8n.results).length;
    
    return `- **Status**: ${successful}/${total} endpoints successful
- **Base URL**: ${n8n.baseUrl}
- **Success Rate**: ${((successful / total) * 100).toFixed(1)}%
- **Workflows Tested**: ${n8n.workflows.length}`;
  }

  formatSupabaseResults(supabase) {
    return `- **Status**: ${supabase.status}
- **Features**: ${supabase.features.join(', ')}
- **Environment**: ${supabase.results.environment?.configured ? 'Configured' : 'Not Configured'}
- **Schema**: ${supabase.results.schema?.exists ? 'Available' : 'Not Found'}`;
  }

  formatLCARSResults(lcars) {
    if (!lcars.results.workflow) return '- LCARS workflow not found';
    
    return `- **Workflow**: ${lcars.results.workflow.name}
- **Status**: ${lcars.results.workflow.active ? 'Active' : 'Inactive'}
- **Nodes**: ${lcars.results.workflow.nodes}
- **Structure**: ${lcars.results.structure?.valid ? 'Valid' : 'Needs Attention'}
- **Tags**: ${lcars.results.workflow.tags.join(', ')}`;
  }

  getOverallStatus() {
    const localSuccess = this.testResults.local.results ? 
      Object.values(this.testResults.local.results).filter(r => r.status === 200).length : 0;
    const localTotal = this.testResults.local.results ? Object.keys(this.testResults.local.results).length : 0;
    const localRate = localTotal > 0 ? (localSuccess / localTotal) * 100 : 0;
    
    const n8nSuccess = this.testResults.n8n.results ? 
      Object.values(this.testResults.n8n.results).filter(r => r.status === 200).length : 0;
    const n8nTotal = this.testResults.n8n.results ? Object.keys(this.testResults.n8n.results).length : 0;
    const n8nRate = n8nTotal > 0 ? (n8nSuccess / n8nTotal) * 100 : 0;
    
    const supabaseReady = this.testResults.supabase.status === 'CONFIGURED';
    const lcarsReady = this.testResults.lcars.results.workflow?.exists && 
                      this.testResults.lcars.results.structure?.valid;
    
    if (localRate >= 80 && n8nRate >= 60 && supabaseReady && lcarsReady) {
      return '🟢 **READY FOR PRODUCTION** - All systems operational';
    } else if (localRate >= 60 && n8nRate >= 40) {
      return '🟡 **PARTIALLY READY** - Some systems need attention';
    } else {
      return '🔴 **NOT READY** - Significant issues need resolution';
    }
  }

  createDeploymentReadinessAssessment() {
    return `# 🚀 Deployment Readiness Assessment

## 📊 Current Status
- **Local Deployment**: ${this.getLocalReadiness()}
- **Vercel Deployment**: ${this.getVercelReadiness()}
- **n8n Backend**: ${this.getN8nReadiness()}
- **Supabase Integration**: ${this.getSupabaseReadiness()}
- **LCARS System**: ${this.getLCARSReadiness()}

## 🎯 Production Readiness Score
${this.calculateReadinessScore()}

## 🚨 Critical Issues
${this.getCriticalIssues()}

## ✅ Ready Components
${this.getReadyComponents()}

## 🔧 Required Actions
${this.getRequiredActions()}

## 🚀 Deployment Checklist
${this.getDeploymentChecklist()}
`;
  }

  getLocalReadiness() {
    if (!this.testResults.local.results) return '❌ Not Tested';
    const successRate = this.calculateSuccessRate(this.testResults.local.results);
    if (successRate >= 90) return '🟢 Ready (90%+)';
    if (successRate >= 70) return '🟡 Partially Ready (70%+)';
    return '🔴 Not Ready (<70%)';
  }

  getVercelReadiness() {
    if (this.testResults.vercel.status === 'NOT_CONFIGURED') return '❌ Not Configured';
    return '🟡 Needs Testing';
  }

  getN8nReadiness() {
    if (!this.testResults.n8n.results) return '❌ Not Tested';
    const successRate = this.calculateSuccessRate(this.testResults.n8n.results);
    if (successRate >= 80) return '🟢 Ready (80%+)';
    if (successRate >= 60) return '🟡 Partially Ready (60%+)';
    return '🔴 Not Ready (<60%)';
  }

  getSupabaseReadiness() {
    if (this.testResults.supabase.status === 'CONFIGURED') return '🟢 Ready';
    if (this.testResults.supabase.status === 'PARTIALLY_CONFIGURED') return '🟡 Partially Ready';
    return '🔴 Not Ready';
  }

  getLCARSReadiness() {
    if (this.testResults.lcars.results.workflow?.exists && 
        this.testResults.lcars.results.structure?.valid) {
      return '🟢 Ready';
    }
    return '🔴 Not Ready';
  }

  calculateSuccessRate(results) {
    const successful = Object.values(results).filter(r => r.status === 200).length;
    const total = Object.keys(results).length;
    return total > 0 ? (successful / total) * 100 : 0;
  }

  calculateReadinessScore() {
    const scores = {
      local: this.getReadinessScore(this.testResults.local.results),
      vercel: this.testResults.vercel.status === 'NOT_CONFIGURED' ? 0 : 50,
      n8n: this.getReadinessScore(this.testResults.n8n.results),
      supabase: this.testResults.supabase.status === 'CONFIGURED' ? 100 : 
                this.testResults.supabase.status === 'PARTIALLY_CONFIGURED' ? 50 : 0,
      lcars: this.testResults.lcars.results.workflow?.exists && 
             this.testResults.lcars.results.structure?.valid ? 100 : 0
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / Object.keys(scores).length;

    return `**Overall Score: ${averageScore.toFixed(1)}/100**

- **Local**: ${scores.local}/100
- **Vercel**: ${scores.vercel}/100
- **n8n**: ${scores.n8n}/100
- **Supabase**: ${scores.supabase}/100
- **LCARS**: ${scores.lcars}/100`;
  }

  getReadinessScore(results) {
    if (!results) return 0;
    const successRate = this.calculateSuccessRate(results);
    if (successRate >= 90) return 100;
    if (successRate >= 80) return 90;
    if (successRate >= 70) return 80;
    if (successRate >= 60) return 70;
    if (successRate >= 50) return 60;
    return 50;
  }

  getCriticalIssues() {
    const issues = [];
    
    if (!this.testResults.local.results || this.calculateSuccessRate(this.testResults.local.results) < 70) {
      issues.push('- Local deployment has significant failures');
    }
    
    if (this.testResults.vercel.status === 'NOT_CONFIGURED') {
      issues.push('- Vercel deployment not configured');
    }
    
    if (!this.testResults.n8n.results || this.calculateSuccessRate(this.testResults.n8n.results) < 60) {
      issues.push('- n8n backend connectivity issues');
    }
    
    if (this.testResults.supabase.status !== 'CONFIGURED') {
      issues.push('- Supabase integration not fully configured');
    }
    
    if (!this.testResults.lcars.results.workflow?.exists) {
      issues.push('- LCARS workflow not found');
    }
    
    return issues.length > 0 ? issues.join('\n') : '- No critical issues found';
  }

  getReadyComponents() {
    const ready = [];
    
    if (this.testResults.local.results && this.calculateSuccessRate(this.testResults.local.results) >= 80) {
      ready.push('- Local deployment');
    }
    
    if (this.testResults.n8n.results && this.calculateSuccessRate(this.testResults.n8n.results) >= 80) {
      ready.push('- n8n backend connectivity');
    }
    
    if (this.testResults.supabase.status === 'CONFIGURED') {
      ready.push('- Supabase integration');
    }
    
    if (this.testResults.lcars.results.workflow?.exists && 
        this.testResults.lcars.results.structure?.valid) {
      ready.push('- LCARS system');
    }
    
    return ready.length > 0 ? ready.join('\n') : '- No components fully ready';
  }

  getRequiredActions() {
    const actions = [];
    
    if (this.testResults.vercel.status === 'NOT_CONFIGURED') {
      actions.push('- Configure Vercel deployment URL');
    }
    
    if (this.testResults.supabase.status !== 'CONFIGURED') {
      actions.push('- Complete Supabase environment setup');
    }
    
    if (!this.testResults.lcars.results.workflow?.exists) {
      actions.push('- Import LCARS workflow to n8n');
    }
    
    if (!this.testResults.n8n.results || this.calculateSuccessRate(this.testResults.n8n.results) < 80) {
      actions.push('- Resolve n8n backend connectivity issues');
    }
    
    return actions.length > 0 ? actions.join('\n') : '- All required actions completed';
  }

  getDeploymentChecklist() {
    return `## ✅ Pre-Deployment Checklist

- [ ] Local deployment tested and working (90%+ success rate)
- [ ] Vercel deployment configured and tested
- [ ] n8n backend accessible and responsive
- [ ] Supabase environment fully configured
- [ ] LCARS workflow imported and active in n8n
- [ ] All crew endpoints responding correctly
- [ ] Ship Computer LCARS system operational
- [ ] Emergency protocols tested
- [ ] Crew coordination verified
- [ ] User story testing system operational

## 🚀 Production Deployment Steps

1. **Final Testing**: Run comprehensive test suite
2. **Environment Setup**: Configure production environment variables
3. **Database Migration**: Apply Supabase schema updates
4. **n8n Activation**: Activate all required workflows
5. **Vercel Deployment**: Deploy to production
6. **Post-Deployment**: Verify all systems operational
7. **Monitoring**: Set up production monitoring
8. **Documentation**: Update deployment documentation`;
  }
}

// Run the comprehensive testing if this script is executed directly
if (require.main === module) {
  const tester = new ComprehensiveDeploymentTester();
  tester.run();
}

module.exports = ComprehensiveDeploymentTester;
