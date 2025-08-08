// N8N API Client for automated workflow synchronization
// AlexAI NCC-1701-B Automated Workflow Sync System

class N8NAPIClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.headers = {
      'X-N8N-API-KEY': apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getWorkflows() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching workflows:', error);
      throw error;
    }
  }

  async getWorkflow(workflowId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error fetching workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async createWorkflow(workflowData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(workflowData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error creating workflow:', error);
      throw error;
    }
  }

  async updateWorkflow(workflowId, workflowData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(workflowData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error updating workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async activateWorkflow(workflowId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/activate`, {
        method: 'POST',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error activating workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async deactivateWorkflow(workflowId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/${workflowId}/deactivate`, {
        method: 'POST',
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error deactivating workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async exportWorkflow(workflowId) {
    try {
      const workflow = await this.getWorkflow(workflowId);
      return {
        id: workflow.id,
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
        staticData: workflow.staticData,
        pinData: workflow.pinData,
        versionId: workflow.versionId,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      };
    } catch (error) {
      console.error(`❌ Error exporting workflow ${workflowId}:`, error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: this.headers
      });
      
      return {
        connected: response.ok,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  async getWorkflowExecutions(workflowId, limit = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error fetching executions for workflow ${workflowId}:`, error);
      throw error;
    }
  }
}

module.exports = N8NAPIClient;
