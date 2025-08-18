#!/usr/bin/env node

/**
 * 👥 Crew User Story Validation Script
 * 
 * This script allows each crew member to validate and enhance user stories
 * based on their expertise, creating a comprehensive test suite for our
 * self-referential learning system.
 */

const fs = require('fs').promises;
const path = require('path');

class CrewUserStoryValidator {
  constructor() {
    this.workflowDir = path.join(__dirname, '..');
    this.outputDir = path.join(this.workflowDir, 'test-screenshots');
    this.storiesDir = path.join(this.workflowDir, 'user-stories');
    
    this.ensureDirectories();
    this.initializeCrewMembers();
  }

  async ensureDirectories() {
    const dirs = [this.storiesDir];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  initializeCrewMembers() {
    this.crewMembers = {
      'captain-picard': {
        name: 'Captain Jean-Luc Picard',
        role: 'Strategic Leadership',
        expertise: ['strategic_planning', 'mission_coordination', 'business_objectives'],
        validationFocus: 'Strategic alignment and business value',
        color: '#FF6B35'
      },
      'commander-data': {
        name: 'Lieutenant Commander Data',
        role: 'Technical Analysis',
        expertise: ['technical_implementation', 'performance_optimization', 'system_capabilities'],
        validationFocus: 'Technical feasibility and performance',
        color: '#4ECDC4'
      },
      'counselor-troi': {
        name: 'Counselor Deanna Troi',
        role: 'User Experience',
        expertise: ['user_empathy', 'emotional_design', 'user_needs'],
        validationFocus: 'User experience and satisfaction',
        color: '#45B7D1'
      },
      'chief-engineer-scott': {
        name: 'Chief Engineer Montgomery Scott',
        role: 'Infrastructure',
        expertise: ['system_reliability', 'implementation', 'system_performance'],
        validationFocus: 'Implementation and reliability',
        color: '#96CEB4'
      },
      'commander-spock': {
        name: 'Commander Spock',
        role: 'Logic & Optimization',
        expertise: ['logical_analysis', 'efficiency', 'process_optimization'],
        validationFocus: 'Logical flow and efficiency',
        color: '#FFEAA7'
      },
      'lieutenant-worf': {
        name: 'Lieutenant Worf',
        role: 'Security & Compliance',
        expertise: ['security', 'regulatory_compliance', 'data_protection'],
        validationFocus: 'Security and compliance',
        color: '#DDA0DD'
      },
      'quark': {
        name: 'Quark',
        role: 'Business Intelligence',
        expertise: ['business_value', 'roi_optimization', 'revenue_generation'],
        validationFocus: 'Business impact and ROI',
        color: '#FF6B35'
      },
      'observation-lounge': {
        name: 'Observation Lounge',
        role: 'Collective Intelligence',
        expertise: ['consensus_building', 'collective_wisdom', 'holistic_integration'],
        validationFocus: 'Holistic integration and consensus',
        color: '#4ECDC4'
      }
    };
  }

  async run() {
    console.log('👥 Starting Crew User Story Validation Process...');
    console.log('================================================');
    
    try {
      // 1. Load base user stories
      console.log('\n📚 Step 1: Loading Base User Stories...');
      const baseStories = await this.loadBaseUserStories();
      
      // 2. Crew validation and enhancement
      console.log('\n🧠 Step 2: Crew Validation and Enhancement...');
      const enhancedStories = await this.crewValidation(baseStories);
      
      // 3. Generate comprehensive test suite
      console.log('\n🎯 Step 3: Generating Comprehensive Test Suite...');
      await this.generateTestSuite(enhancedStories);
      
      // 4. Create n8n integration files
      console.log('\n🔄 Step 4: Creating n8n Integration Files...');
      await this.createN8nIntegration(enhancedStories);
      
      // 5. Generate Supabase schema
      console.log('\n💾 Step 5: Generating Supabase Schema...');
      await this.generateSupabaseSchema(enhancedStories);
      
      console.log('\n✅ Crew User Story Validation Complete!');
      console.log('\n📁 Enhanced stories saved in:', this.storiesDir);
      
    } catch (error) {
      console.error('❌ Crew Validation Failed:', error.message);
      process.exit(1);
    }
  }

  async loadBaseUserStories() {
    try {
      const storiesFile = path.join(this.workflowDir, 'docs', 'CREW_USER_STORY_TEST_SUITE.md');
      const content = await fs.readFile(storiesFile, 'utf-8');
      
      // Parse the markdown to extract user stories
      const stories = this.parseUserStoriesFromMarkdown(content);
      
      console.log(`  ✅ Loaded ${stories.length} base user stories`);
      return stories;
      
    } catch (error) {
      console.log('⚠️  Could not load base stories, using defaults');
      return this.getDefaultUserStories();
    }
  }

  parseUserStoriesFromMarkdown(content) {
    const stories = [];
    const lines = content.split('\n');
    
    let currentStory = null;
    let inStory = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('```') && !inStory) {
        inStory = true;
        currentStory = { content: [], acceptanceCriteria: [] };
        continue;
      }
      
      if (line.startsWith('```') && inStory) {
        inStory = false;
        if (currentStory && currentStory.content.length > 0) {
          stories.push(this.parseStoryContent(currentStory));
        }
        currentStory = null;
        continue;
      }
      
      if (inStory && currentStory) {
        currentStory.content.push(line);
      }
    }
    
    return stories;
  }

  parseStoryContent(storyData) {
    const content = storyData.content.join('\n');
    
    // Extract story components
    const asMatch = content.match(/As a ([^,]+)/);
    const needMatch = content.match(/I need to ([^.]+)/);
    const soMatch = content.match(/So I can ([^.]+)/);
    
    if (asMatch && needMatch && soMatch) {
      return {
        userRole: asMatch[1].trim(),
        task: needMatch[1].trim(),
        businessValue: soMatch[1].trim(),
        acceptanceCriteria: this.extractAcceptanceCriteria(content),
        category: this.categorizeStory(asMatch[1].trim()),
        complexity: this.assessComplexity(content),
        estimatedTime: this.estimateTime(content),
        dependencies: this.identifyDependencies(content)
      };
    }
    
    return null;
  }

  extractAcceptanceCriteria(content) {
    const criteria = [];
    const lines = content.split('\n');
    let inCriteria = false;
    
    for (const line of lines) {
      if (line.includes('Acceptance Criteria:')) {
        inCriteria = true;
        continue;
      }
      
      if (inCriteria && line.trim().startsWith('-')) {
        criteria.push(line.trim().substring(1).trim());
      }
      
      if (inCriteria && line.trim() === '') {
        break;
      }
    }
    
    return criteria;
  }

  categorizeStory(userRole) {
    const categories = {
      'Project Manager': 'project_management',
      'Team Lead': 'team_management',
      'Developer': 'development',
      'Designer': 'design',
      'Stakeholder': 'stakeholder',
      'End User': 'end_user',
      'Administrator': 'administration',
      'Analyst': 'analytics'
    };
    
    return categories[userRole] || 'general';
  }

  assessComplexity(content) {
    const complexity = {
      low: ['view', 'access', 'receive', 'track'],
      medium: ['create', 'assign', 'conduct', 'maintain'],
      high: ['analyze', 'optimize', 'coordinate', 'manage']
    };
    
    for (const [level, keywords] of Object.entries(complexity)) {
      if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
        return level;
      }
    }
    
    return 'medium';
  }

  estimateTime(content) {
    const complexity = this.assessComplexity(content);
    const timeEstimates = {
      low: '15-30 minutes',
      medium: '1-2 hours',
      high: '4-8 hours'
    };
    
    return timeEstimates[complexity];
  }

  identifyDependencies(content) {
    const dependencies = [];
    
    if (content.toLowerCase().includes('team member')) {
      dependencies.push('team_availability');
    }
    
    if (content.toLowerCase().includes('stakeholder')) {
      dependencies.push('stakeholder_approval');
    }
    
    if (content.toLowerCase().includes('design')) {
      dependencies.push('design_specifications');
    }
    
    if (content.toLowerCase().includes('technical')) {
      dependencies.push('technical_requirements');
    }
    
    return dependencies;
  }

  getDefaultUserStories() {
    return [
      {
        userRole: 'Project Manager',
        task: 'view project portfolio status',
        businessValue: 'make strategic decisions about resource allocation',
        acceptanceCriteria: [
          'Can see all active projects with status and timeline',
          'Can identify projects needing attention',
          'Can export portfolio reports'
        ],
        category: 'project_management',
        complexity: 'low',
        estimatedTime: '15-30 minutes',
        dependencies: []
      }
    ];
  }

  async crewValidation(baseStories) {
    console.log('  🧠 Starting crew validation process...');
    
    const enhancedStories = [];
    
    for (const story of baseStories) {
      if (!story) continue;
      
      console.log(`    🔍 Validating story: ${story.task}`);
      
      // Get crew feedback for each story
      const crewFeedback = await this.getCrewFeedback(story);
      
      // Enhance story with crew feedback
      const enhancedStory = {
        ...story,
        crewFeedback,
        validationStatus: 'validated',
        validationDate: new Date().toISOString(),
        priority: this.calculatePriority(story, crewFeedback),
        testScenarios: this.generateTestScenarios(story, crewFeedback)
      };
      
      enhancedStories.push(enhancedStory);
    }
    
    console.log(`  ✅ Enhanced ${enhancedStories.length} stories with crew feedback`);
    return enhancedStories;
  }

  async getCrewFeedback(story) {
    const feedback = {};
    
    for (const [crewId, crewMember] of Object.entries(this.crewMembers)) {
      feedback[crewId] = {
        crewMember: crewMember.name,
        role: crewMember.role,
        validationFocus: crewMember.validationFocus,
        relevance: this.assessRelevance(story, crewMember),
        suggestions: this.generateSuggestions(story, crewMember),
        riskAssessment: this.assessRisks(story, crewMember),
        optimizationOpportunities: this.identifyOptimizations(story, crewMember)
      };
    }
    
    return feedback;
  }

  assessRelevance(story, crewMember) {
    const relevance = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    // Assess based on expertise alignment
    for (const expertise of crewMember.expertise) {
      if (story.task.toLowerCase().includes(expertise.replace('_', ' '))) {
        relevance.high++;
      } else if (story.category === this.mapExpertiseToCategory(expertise)) {
        relevance.medium++;
      } else {
        relevance.low++;
      }
    }
    
    if (relevance.high > 0) return 'high';
    if (relevance.medium > 0) return 'medium';
    return 'low';
  }

  mapExpertiseToCategory(expertise) {
    const mapping = {
      'strategic_planning': 'project_management',
      'technical_implementation': 'development',
      'user_empathy': 'design',
      'system_reliability': 'administration',
      'logical_analysis': 'analytics',
      'security': 'administration',
      'business_value': 'stakeholder',
      'consensus_building': 'team_management'
    };
    
    return mapping[expertise] || 'general';
  }

  generateSuggestions(story, crewMember) {
    const suggestions = [];
    
    switch (crewMember.role) {
      case 'Strategic Leadership':
        suggestions.push('Consider business impact and ROI metrics');
        suggestions.push('Add strategic milestone tracking');
        break;
      case 'Technical Analysis':
        suggestions.push('Include technical feasibility assessment');
        suggestions.push('Add performance requirements');
        break;
      case 'User Experience':
        suggestions.push('Consider user journey and pain points');
        suggestions.push('Add user satisfaction metrics');
        break;
      case 'Infrastructure':
        suggestions.push('Include system requirements and constraints');
        suggestions.push('Add reliability and uptime requirements');
        break;
      case 'Logic & Optimization':
        suggestions.push('Optimize process flow and efficiency');
        suggestions.push('Add automation opportunities');
        break;
      case 'Security & Compliance':
        suggestions.push('Include security and privacy requirements');
        suggestions.push('Add compliance checkpoints');
        break;
      case 'Business Intelligence':
        suggestions.push('Add business value metrics');
        suggestions.push('Include ROI calculations');
        break;
      case 'Collective Intelligence':
        suggestions.push('Consider team collaboration aspects');
        suggestions.push('Add cross-functional coordination');
        break;
    }
    
    return suggestions;
  }

  assessRisks(story, crewMember) {
    const risks = [];
    
    if (story.complexity === 'high') {
      risks.push('High complexity may lead to scope creep');
    }
    
    if (story.dependencies.length > 0) {
      risks.push(`Dependencies on: ${story.dependencies.join(', ')}`);
    }
    
    if (crewMember.role === 'Security & Compliance') {
      risks.push('Ensure data protection and privacy compliance');
    }
    
    if (crewMember.role === 'Infrastructure') {
      risks.push('Consider system performance and scalability');
    }
    
    return risks;
  }

  identifyOptimizations(story, crewMember) {
    const optimizations = [];
    
    if (crewMember.role === 'Logic & Optimization') {
      optimizations.push('Streamline process flow');
      optimizations.push('Identify automation opportunities');
    }
    
    if (crewMember.role === 'Technical Analysis') {
      optimizations.push('Optimize performance and efficiency');
      optimizations.push('Reduce technical debt');
    }
    
    if (crewMember.role === 'Business Intelligence') {
      optimizations.push('Maximize business value');
      optimizations.push('Optimize resource allocation');
    }
    
    return optimizations;
  }

  calculatePriority(story, crewFeedback) {
    let priority = 0;
    
    // Base priority from complexity
    const complexityPriority = { low: 1, medium: 2, high: 3 };
    priority += complexityPriority[story.complexity] || 2;
    
    // Add crew relevance scores
    for (const feedback of Object.values(crewFeedback)) {
      const relevanceScore = { low: 0, medium: 1, high: 2 };
      priority += relevanceScore[feedback.relevance] || 0;
    }
    
    // Normalize to 1-5 scale
    return Math.min(5, Math.max(1, Math.ceil(priority / 3)));
  }

  generateTestScenarios(story, crewFeedback) {
    const scenarios = [];
    
    // Happy path scenario
    scenarios.push({
      name: 'Happy Path - Successful Execution',
      description: `User successfully completes: ${story.task}`,
      steps: this.generateTestSteps(story, 'success'),
      expectedOutcome: 'Task completed successfully with all acceptance criteria met',
      priority: 'high'
    });
    
    // Edge case scenarios
    if (story.complexity === 'high') {
      scenarios.push({
        name: 'Edge Case - Partial Completion',
        description: `User encounters issues while: ${story.task}`,
        steps: this.generateTestSteps(story, 'partial'),
        expectedOutcome: 'System handles partial completion gracefully',
        priority: 'medium'
      });
    }
    
    // Error scenarios
    scenarios.push({
      name: 'Error Handling - System Failure',
      description: `System encounters errors while: ${story.task}`,
      steps: this.generateTestSteps(story, 'error'),
      expectedOutcome: 'System provides clear error messages and recovery options',
      priority: 'medium'
    });
    
    return scenarios;
  }

  generateTestSteps(story, scenarioType) {
    const baseSteps = [
      `Given I am logged into the system as a ${story.userRole}`,
      `When I attempt to ${story.task}`,
      'Then the system should respond appropriately'
    ];
    
    switch (scenarioType) {
      case 'success':
        return [
          ...baseSteps,
          'And all acceptance criteria should be met',
          'And the business value should be achieved'
        ];
      case 'partial':
        return [
          ...baseSteps,
          'And the system should handle partial completion',
          'And provide clear next steps for completion'
        ];
      case 'error':
        return [
          ...baseSteps,
          'And the system should display appropriate error messages',
          'And provide recovery options or alternative paths'
        ];
      default:
        return baseSteps;
    }
  }

  async generateTestSuite(enhancedStories) {
    console.log('  🎯 Generating comprehensive test suite...');
    
    // Generate test suite files
    const testSuite = {
      metadata: {
        generated: new Date().toISOString(),
        totalStories: enhancedStories.length,
        crewMembers: Object.keys(this.crewMembers).length,
        categories: [...new Set(enhancedStories.map(s => s.category))]
      },
      stories: enhancedStories,
      testScenarios: enhancedStories.flatMap(s => s.testScenarios),
      crewValidation: this.generateCrewValidationSummary(enhancedStories)
    };
    
    // Save comprehensive test suite
    const testSuiteFile = path.join(this.storiesDir, 'comprehensive-test-suite.json');
    await fs.writeFile(testSuiteFile, JSON.stringify(testSuite, null, 2));
    
    // Generate markdown documentation
    const markdownFile = path.join(this.storiesDir, 'enhanced-user-stories.md');
    await fs.writeFile(markdownFile, this.generateMarkdownDocumentation(testSuite));
    
    console.log('    ✅ Test suite generated successfully');
  }

  generateCrewValidationSummary(enhancedStories) {
    const summary = {};
    
    for (const [crewId, crewMember] of Object.entries(this.crewMembers)) {
      summary[crewId] = {
        name: crewMember.name,
        role: crewMember.role,
        storiesReviewed: enhancedStories.length,
        highRelevanceStories: enhancedStories.filter(s => 
          s.crewFeedback[crewId].relevance === 'high'
        ).length,
        suggestionsProvided: enhancedStories.reduce((total, s) => 
          total + s.crewFeedback[crewId].suggestions.length, 0
        ),
        riskAssessments: enhancedStories.reduce((total, s) => 
          total + s.crewFeedback[crewId].riskAssessment.length, 0
        )
      };
    }
    
    return summary;
  }

  generateMarkdownDocumentation(testSuite) {
    let content = `# 👥 Enhanced User Stories - Crew Validated

## 📊 Test Suite Overview

- **Generated**: ${new Date(testSuite.metadata.generated).toLocaleString()}
- **Total Stories**: ${testSuite.metadata.totalStories}
- **Crew Members**: ${testSuite.metadata.crewMembers}
- **Categories**: ${testSuite.metadata.categories.join(', ')}

---

## 🧠 Crew Validation Summary

${Object.entries(testSuite.crewValidation).map(([crewId, summary]) => `
### ${summary.name} - ${summary.role}
- **Stories Reviewed**: ${summary.storiesReviewed}
- **High Relevance Stories**: ${summary.highRelevanceStories}
- **Suggestions Provided**: ${summary.suggestionsProvided}
- **Risk Assessments**: ${summary.riskAssessments}
`).join('\n')}

---

## 📖 Enhanced User Stories

${testSuite.stories.map((story, index) => `
### ${index + 1}. ${story.task}

**User Role**: ${story.userRole}  
**Business Value**: ${story.businessValue}  
**Category**: ${story.category}  
**Complexity**: ${story.complexity}  
**Priority**: ${story.priority}/5  
**Estimated Time**: ${story.estimatedTime}

#### Acceptance Criteria
${story.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

#### Test Scenarios
${story.testScenarios.map(scenario => `
**${scenario.name}** (Priority: ${scenario.priority})
- Description: ${scenario.description}
- Expected Outcome: ${scenario.expectedOutcome}
- Steps:
${scenario.steps.map(step => `  ${step}`).join('\n')}
`).join('\n')}

#### Crew Feedback
${Object.entries(story.crewFeedback).map(([crewId, feedback]) => `
**${feedback.crewMember}** (${feedback.role})
- Relevance: ${feedback.relevance}
- Suggestions: ${feedback.suggestions.join(', ')}
- Risks: ${feedback.riskAssessment.join(', ')}
- Optimizations: ${feedback.optimizationOpportunities.join(', ')}
`).join('\n')}

---
`).join('\n')}

---

*Enhanced User Stories - Crew Validated*  
*Generated: ${new Date().toISOString()}* 🚀
`;

    return content;
  }

  async createN8nIntegration(enhancedStories) {
    console.log('  🔄 Creating n8n integration files...');
    
    // Generate n8n workflow for user story testing
    const n8nWorkflow = this.generateN8nWorkflow(enhancedStories);
    
    const workflowFile = path.join(this.storiesDir, 'user-story-testing-workflow.json');
    await fs.writeFile(workflowFile, JSON.stringify(n8nWorkflow, null, 2));
    
    console.log('    ✅ n8n workflow generated');
  }

  generateN8nWorkflow(enhancedStories) {
    return {
      name: 'User Story Testing and Learning Workflow',
      nodes: [
        {
          id: '1',
          name: 'Start User Story Testing',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [240, 300]
        },
        {
          id: '2',
          name: 'Load User Stories',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            code: `// Load enhanced user stories
const stories = $input.all()[0].json.stories || [];
return stories.map(story => ({
  json: {
    storyId: story.id || Math.random().toString(36).substr(2, 9),
    userRole: story.userRole,
    task: story.task,
    businessValue: story.businessValue,
    category: story.category,
    complexity: story.complexity,
    priority: story.priority,
    testScenarios: story.testScenarios
  }
}));`
          }
        },
        {
          id: '3',
          name: 'Execute Test Scenarios',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [680, 300],
          parameters: {
            code: `// Execute test scenarios for each story
const story = $input.first().json;
const results = [];

for (const scenario of story.testScenarios) {
  try {
    // Simulate test execution
    const testResult = {
      storyId: story.storyId,
      scenarioName: scenario.name,
      status: Math.random() > 0.2 ? 'passed' : 'failed', // 80% pass rate
      executionTime: Math.floor(Math.random() * 5000) + 1000,
      timestamp: new Date().toISOString(),
      details: {
        steps: scenario.steps,
        expectedOutcome: scenario.expectedOutcome,
        actualOutcome: Math.random() > 0.2 ? scenario.expectedOutcome : 'Unexpected result'
      }
    };
    
    results.push(testResult);
  } catch (error) {
    results.push({
      storyId: story.storyId,
      scenarioName: scenario.name,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

return results.map(result => ({ json: result }));`
          }
        },
        {
          id: '4',
          name: 'Analyze Results',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [900, 300],
          parameters: {
            code: `// Analyze test results and generate insights
const results = $input.all().map(item => item.json);

const analysis = {
  totalTests: results.length,
  passed: results.filter(r => r.status === 'passed').length,
  failed: results.filter(r => r.status === 'failed').length,
  errors: results.filter(r => r.status === 'error').length,
  passRate: (results.filter(r => r.status === 'passed').length / results.length * 100).toFixed(2),
  averageExecutionTime: (results.reduce((sum, r) => sum + (r.executionTime || 0), 0) / results.length).toFixed(2),
  insights: [],
  recommendations: []
};

// Generate insights
if (analysis.passRate < 80) {
  analysis.insights.push('Test pass rate below target - investigate failures');
  analysis.recommendations.push('Review failed test scenarios and update acceptance criteria');
}

if (analysis.averageExecutionTime > 3000) {
  analysis.insights.push('Test execution time above target - optimize performance');
  analysis.recommendations.push('Identify performance bottlenecks in test execution');
}

return [{ json: analysis }];`
          }
        },
        {
          id: '5',
          name: 'Store in Supabase',
          type: 'n8n-nodes-base.code',
          typeVersion: 2,
          position: [1120, 300],
          parameters: {
            code: `// Store results in Supabase for learning
const analysis = $input.first().json;
const results = $('Execute Test Scenarios').all().map(item => item.json);

const learningData = {
  timestamp: new Date().toISOString(),
  testResults: results,
  analysis: analysis,
  metadata: {
    totalStories: results.length > 0 ? new Set(results.map(r => r.storyId)).size : 0,
    categories: [...new Set(results.map(r => r.category || 'unknown'))],
    complexity: [...new Set(results.map(r => r.complexity || 'unknown'))]
  }
};

// In a real implementation, this would insert into Supabase
console.log('Learning data to store:', JSON.stringify(learningData, null, 2));

return [{ json: learningData }];`
          }
        }
      ],
      connections: {
        'Start User Story Testing': {
          main: [[{ node: 'Load User Stories', type: 'main', index: 0 }]]
        },
        'Load User Stories': {
          main: [[{ node: 'Execute Test Scenarios', type: 'main', index: 0 }]]
        },
        'Execute Test Scenarios': {
          main: [[{ node: 'Analyze Results', type: 'main', index: 0 }]]
        },
        'Analyze Results': {
          main: [[{ node: 'Store in Supabase', type: 'main', index: 0 }]]
        }
      },
      active: false,
      settings: { executionOrder: 'v1' },
      versionId: '1',
      meta: { instanceId: Date.now().toString() },
      id: 'user-story-testing-workflow',
      tags: ['user-stories', 'testing', 'learning', 'crew-validation']
    };
  }

  async generateSupabaseSchema(enhancedStories) {
    console.log('  💾 Generating Supabase schema...');
    
    const schema = {
      tables: {
        user_stories: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
            user_role: { type: 'text', not_null: true },
            task: { type: 'text', not_null: true },
            business_value: { type: 'text', not_null: true },
            category: { type: 'text', not_null: true },
            complexity: { type: 'text', not_null: true },
            priority: { type: 'integer', not_null: true },
            estimated_time: { type: 'text' },
            dependencies: { type: 'jsonb' },
            acceptance_criteria: { type: 'jsonb' },
            crew_feedback: { type: 'jsonb' },
            validation_status: { type: 'text', default: 'validated' },
            validation_date: { type: 'timestamptz', default: 'now()' },
            created_at: { type: 'timestamptz', default: 'now()' },
            updated_at: { type: 'timestamptz', default: 'now()' }
          },
          indexes: [
            { name: 'idx_user_stories_category', columns: ['category'] },
            { name: 'idx_user_stories_priority', columns: ['priority'] },
            { name: 'idx_user_stories_complexity', columns: ['complexity'] }
          ]
        },
        test_executions: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
            story_id: { type: 'uuid', references: 'user_stories.id' },
            scenario_name: { type: 'text', not_null: true },
            status: { type: 'text', not_null: true },
            execution_time: { type: 'integer' },
            expected_outcome: { type: 'text' },
            actual_outcome: { type: 'text' },
            error_details: { type: 'jsonb' },
            executed_at: { type: 'timestamptz', default: 'now()' },
            crew_member: { type: 'text' },
            feedback: { type: 'jsonb' }
          },
          indexes: [
            { name: 'idx_test_executions_story_id', columns: ['story_id'] },
            { name: 'idx_test_executions_status', columns: ['status'] },
            { name: 'idx_test_executions_executed_at', columns: ['executed_at'] }
          ]
        },
        learning_insights: {
          columns: {
            id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
            insight_type: { type: 'text', not_null: true },
            insight_data: { type: 'jsonb', not_null: true },
            story_id: { type: 'uuid', references: 'user_stories.id' },
            crew_member: { type: 'text' },
            confidence_score: { type: 'numeric' },
            created_at: { type: 'timestamptz', default: 'now()' },
            applied: { type: 'boolean', default: false },
            applied_at: { type: 'timestamptz' }
          },
          indexes: [
            { name: 'idx_learning_insights_type', columns: ['insight_type'] },
            { name: 'idx_learning_insights_story_id', columns: ['story_id'] },
            { name: 'idx_learning_insights_applied', columns: ['applied'] }
          ]
        }
      },
      functions: {
        update_updated_at: {
          definition: `
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = now();
              RETURN NEW;
            END;
            $$ language 'plpgsql';
          `,
          triggers: [
            {
              table: 'user_stories',
              name: 'update_user_stories_updated_at',
              function: 'update_updated_at_column()',
              timing: 'BEFORE',
              events: ['UPDATE']
            }
          ]
        }
      }
    };
    
    const schemaFile = path.join(this.storiesDir, 'supabase-schema.sql');
    await fs.writeFile(schemaFile, this.generateSQLSchema(schema));
    
    console.log('    ✅ Supabase schema generated');
  }

  generateSQLSchema(schema) {
    let sql = `-- Supabase Schema for User Story Testing and Learning
-- Generated: ${new Date().toISOString()}

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
`;

    for (const [tableName, tableDef] of Object.entries(schema.tables)) {
      sql += `\n-- Table: ${tableName}\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columns = [];
      for (const [colName, colDef] of Object.entries(tableDef.columns)) {
        let colDefStr = `  ${colName} ${colDef.type}`;
        if (colDef.not_null) colDefStr += ' NOT NULL';
        if (colDef.default) colDefStr += ` DEFAULT ${colDef.default}`;
        if (colDef.primary_key) colDefStr += ' PRIMARY KEY';
        if (colDef.references) colDefStr += ` REFERENCES ${colDef.references}`;
        columns.push(colDefStr);
      }
      
      sql += columns.join(',\n') + '\n);\n';
      
      // Create indexes
      if (tableDef.indexes) {
        for (const index of tableDef.indexes) {
          sql += `CREATE INDEX IF NOT EXISTS ${index.name} ON ${tableName} (${index.columns.join(', ')});\n`;
        }
      }
    }
    
    // Create functions and triggers
    if (schema.functions) {
      for (const [funcName, funcDef] of Object.entries(schema.functions)) {
        sql += `\n-- Function: ${funcName}\n`;
        sql += funcDef.definition + '\n';
        
        if (funcDef.triggers) {
          for (const trigger of funcDef.triggers) {
            sql += `CREATE TRIGGER ${trigger.name}\n`;
            sql += `  ${trigger.timing} ${trigger.events.join(' OR ')}\n`;
            sql += `  ON ${trigger.table}\n`;
            sql += `  FOR EACH ROW\n`;
            sql += `  EXECUTE FUNCTION ${trigger.function};\n\n`;
          }
        }
      }
    }
    
    return sql;
  }
}

// Run the validator if this script is executed directly
if (require.main === module) {
  const validator = new CrewUserStoryValidator();
  validator.run();
}

module.exports = CrewUserStoryValidator;
