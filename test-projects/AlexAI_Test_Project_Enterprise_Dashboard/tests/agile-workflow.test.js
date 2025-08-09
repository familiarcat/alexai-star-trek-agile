// Agile Workflow Test Suite
// Tests the complete agile workflow integration with AlexAI crew coordination

const AgileWorkflowAPI = require('../src/api/agile-workflow');

describe('AlexAI Agile Workflow Integration', () => {
  let agileAPI;

  beforeEach(() => {
    agileAPI = new AgileWorkflowAPI();
  });

  describe('Task Management', () => {
    test('should create task with AI insights', async () => {
      const taskData = {
        title: 'Implement user authentication',
        description: 'Create secure login system with JWT tokens',
        priority: 'high',
        assignee: 'Lieutenant Data'
      };

      const task = await agileAPI.createTask(taskData);
      
      expect(task.id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.aiInsights).toBeDefined();
      expect(task.aiInsights.complexity).toBeDefined();
      expect(task.aiInsights.estimatedHours).toBeGreaterThan(0);
    });

    test('should recommend appropriate crew member based on task type', async () => {
      const technicalTask = {
        title: 'Optimize database queries',
        description: 'Improve performance of user data retrieval'
      };

      const task = await agileAPI.createTask(technicalTask);
      expect(['data', 'scott']).toContain(task.aiInsights.recommendedCrewMember);
    });

    test('should classify task complexity correctly', async () => {
      const complexTask = {
        title: 'Implement real-time collaborative editing',
        description: 'Build complex real-time synchronization system'
      };

      const task = await agileAPI.createTask(complexTask);
      expect(['high', 'very-high']).toContain(task.aiInsights.complexity);
    });
  });

  describe('Sprint Management', () => {
    test('should create sprint with crew input', async () => {
      const sprintData = {
        name: 'Sprint 1 - Foundation',
        goal: 'Set up basic project infrastructure',
        startDate: '2025-08-09',
        endDate: '2025-08-23'
      };

      const sprint = await agileAPI.createSprint(sprintData);
      
      expect(sprint.id).toBeDefined();
      expect(sprint.name).toBe(sprintData.name);
      expect(sprint.status).toBe('planning');
    });
  });

  describe('AI Crew Integration', () => {
    test('should extract complexity from AI response', async () => {
      const mockResponse = {
        message: 'This is a highly complex task requiring extensive technical knowledge'
      };

      const complexity = agileAPI.extractComplexity(mockResponse);
      expect(complexity).toBe('high');
    });

    test('should estimate hours from AI response', async () => {
      const mockResponse = {
        analysis: 'This task will take approximately 16 hours to complete'
      };

      const hours = agileAPI.extractEstimatedHours(mockResponse);
      expect(hours).toBe(16);
    });

    test('should identify risk factors', async () => {
      const mockResponse = {
        message: 'This has API integration dependencies and tight deadlines'
      };

      const risks = agileAPI.extractRiskFactors(mockResponse);
      expect(risks).toContain('Integration challenges');
      expect(risks).toContain('Time constraints');
    });
  });

  describe('Metrics and Analytics', () => {
    test('should calculate sprint metrics', async () => {
      const metrics = await agileAPI.getSprintMetrics('sprint-1');
      
      expect(metrics.completedStoryPoints).toBeDefined();
      expect(metrics.totalStoryPoints).toBeDefined();
      expect(metrics.velocity).toBeDefined();
      expect(metrics.teamEfficiency).toBeBetween(0, 1);
    });
  });
});

// Helper function for range testing
expect.extend({
  toBeBetween(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be between ${floor} and ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be between ${floor} and ${ceiling}`,
        pass: false,
      };
    }
  },
});
