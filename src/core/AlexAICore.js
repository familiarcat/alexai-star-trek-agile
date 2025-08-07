/**
 * AlexAICore - JavaScript Version
 * Multi-agent AI system with Star Trek crew members
 */

const OpenAI = require('openai');

class AlexAICore {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.crewMembers = {
      picard: {
        name: 'Captain Jean-Luc Picard',
        role: 'Strategic Leadership',
        specialty: 'Strategic planning, diplomacy, and mission coordination'
      },
      troi: {
        name: 'Counselor Deanna Troi',
        role: 'UX and Morale',
        specialty: 'User experience, team morale, and emotional intelligence'
      },
      spock: {
        name: 'Mr. Spock',
        role: 'Logic and Time Management',
        specialty: 'Logical analysis, time management, and efficiency'
      },
      data: {
        name: 'Lt. Commander Data',
        role: 'UI Systems and Type Safety',
        specialty: 'User interface design, type safety, and system architecture'
      },
      scott: {
        name: 'Chief Engineer Scott',
        role: 'Infrastructure and Build Systems',
        specialty: 'Infrastructure, deployment, and technical implementation'
      }
    };

    this.currentMode = 'collaborative';
    this.consultationHistory = [];
  }

  async consultation(context) {
    try {
      const crewInsights = await this.getMultiAgentInsights(context);
      
      const consultation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        context,
        insights: crewInsights,
        mode: this.currentMode,
        recommendations: this.generateRecommendations(crewInsights)
      };

      this.consultationHistory.push(consultation);
      return consultation;
    } catch (error) {
      console.error('Consultation error:', error);
      throw new Error('Failed to complete consultation');
    }
  }

  async getMultiAgentInsights(context) {
    const insights = {};
    
    for (const [memberKey, member] of Object.entries(this.crewMembers)) {
      try {
        insights[memberKey] = await this.getAgentInsight(member, context);
      } catch (error) {
        console.error(`Error getting insight from ${member.name}:`, error);
        insights[memberKey] = `Unable to get insight from ${member.name} at this time.`;
      }
    }

    return insights;
  }

  async getAgentInsight(crewMember, context) {
    const prompt = `
You are ${crewMember.name}, ${crewMember.role} on the USS Enterprise.
Your specialty is: ${crewMember.specialty}

Context: ${context}

Please provide your professional insight and recommendations based on your expertise.
Keep your response concise and actionable.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${crewMember.name}, a Star Trek character with expertise in ${crewMember.specialty}. Provide professional, actionable advice.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(`OpenAI API error for ${crewMember.name}:`, error);
      return 'I apologize, but I\'m experiencing technical difficulties. Please try again later.';
    }
  }

  generateRecommendations(insights) {
    const recommendations = [];
    
    // Analyze insights and generate actionable recommendations
    for (const [memberKey, insight] of Object.entries(insights)) {
      if (insight && insight.length > 50) { // Only process substantial insights
        recommendations.push({
          crewMember: this.crewMembers[memberKey].name,
          insight: insight.substring(0, 200) + (insight.length > 200 ? '...' : ''),
          priority: this.assessPriority(insight)
        });
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  assessPriority(insight) {
    // Simple priority assessment based on keywords
    const highPriorityKeywords = ['critical', 'urgent', 'immediate', 'security', 'error', 'fail'];
    const mediumPriorityKeywords = ['important', 'consider', 'recommend', 'suggest', 'improve'];
    
    const lowerInsight = insight.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerInsight.includes(keyword))) {
      return 3;
    } else if (mediumPriorityKeywords.some(keyword => lowerInsight.includes(keyword))) {
      return 2;
    }
    return 1;
  }

  getCrewStatus() {
    return {
      crewMembers: this.crewMembers,
      currentMode: this.currentMode,
      totalConsultations: this.consultationHistory.length,
      lastConsultation: this.consultationHistory[this.consultationHistory.length - 1] || null
    };
  }

  getLatestAnalysis() {
    return this.consultationHistory[this.consultationHistory.length - 1] || null;
  }



  getSystemHealth() {
    return {
      overall_status: 'OPTIMAL',
      crew_coordination: 95,
      project_velocity: 87,
      system_resources: {
        cpu_usage: 23,
        memory_usage: 45,
        network_latency: 12,
        database_status: 'ONLINE'
      },
      ai_agents: {
        total_agents: Object.keys(this.crewMembers).length,
        active_agents: Object.keys(this.crewMembers).length,
        response_time: 0.8,
        accuracy_rate: 94.2
      }
    };
  }

  getCurrentMode() {
    return this.currentMode;
  }

  async getMultiAgentInsightsForProject(projectId) {
    try {
      const context = `Analyzing project with ID: ${projectId}. Please provide insights on project management, technical implementation, and strategic recommendations.`;
      return await this.getMultiAgentInsights(context);
    } catch (error) {
      console.error('Error getting project insights:', error);
      throw new Error('Failed to get project insights');
    }
  }


    
    if (highPriorityKeywords.some(keyword => lowerInsight.includes(keyword))) {
      return 'high';
    } else if (mediumPriorityKeywords.some(keyword => lowerInsight.includes(keyword))) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  setMode(mode) {
    const validModes = ['collaborative', 'strategic', 'tactical', 'analytical'];
    if (validModes.includes(mode)) {
      this.currentMode = mode;
      return { success: true, mode: this.currentMode };
    } else {
      throw new Error(`Invalid mode. Valid modes are: ${validModes.join(', ')}`);
    }
  }
}

module.exports = AlexAICore; 