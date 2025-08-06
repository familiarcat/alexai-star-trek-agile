#!/usr/bin/env python3
"""
AlexAI Core Agent System
The central orchestrator that augments all other agents with multimodal capabilities
and provides comprehensive coordination for the Star Trek crew.
"""

import os
import json
import asyncio
import openai
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import sqlite3
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure OpenAI
try:
    client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
except Exception as e:
    logger.warning(f"OpenAI client initialization failed: {e}")
    client = None

class AlexAIMode(Enum):
    """AlexAI operational modes"""
    ORCHESTRATOR = "orchestrator"  # Coordinates all agents
    ANALYZER = "analyzer"          # Deep analysis and insights
    STRATEGIST = "strategist"      # Strategic planning and vision
    MEDIATOR = "mediator"          # Conflict resolution and consensus
    INNOVATOR = "innovator"        # Creative problem solving
    MONITOR = "monitor"            # System health and performance

class MultimodalCapability(Enum):
    """Multimodal capabilities of AlexAI"""
    TEXT_ANALYSIS = "text_analysis"
    CODE_REVIEW = "code_review"
    PROJECT_ANALYSIS = "project_analysis"
    TEAM_DYNAMICS = "team_dynamics"
    SYSTEM_OPTIMIZATION = "system_optimization"
    STRATEGIC_PLANNING = "strategic_planning"
    RISK_ASSESSMENT = "risk_assessment"
    PERFORMANCE_METRICS = "performance_metrics"

@dataclass
class CrewMember:
    """Enhanced crew member with AlexAI augmentation"""
    name: str
    role: str
    agent_id: str
    status: str
    capabilities: List[str]
    alexai_augmentation: Dict[str, Any]
    performance_metrics: Dict[str, float]
    recent_activities: List[str]
    current_focus: str
    collaboration_style: str

@dataclass
class AlexAIAnalysis:
    """Comprehensive analysis from AlexAI"""
    timestamp: datetime
    mode: AlexAIMode
    context: str
    insights: Dict[str, Any]
    recommendations: List[str]
    risk_assessment: Dict[str, Any]
    performance_metrics: Dict[str, float]
    crew_coordination: Dict[str, Any]
    strategic_vision: str

class AlexAICoreAgent:
    """
    AlexAI Core Agent - The central orchestrator that augments all crew members
    with enhanced capabilities and provides comprehensive coordination.
    """
    
    def __init__(self):
        self.mode = AlexAIMode.ORCHESTRATOR
        self.crew_members = self._initialize_crew()
        self.analysis_history = []
        self.multimodal_capabilities = list(MultimodalCapability)
        self.active_projects = []
        self.system_health = {
            'overall_status': 'optimal',
            'crew_coordination': 95.0,
            'project_velocity': 88.0,
            'system_efficiency': 92.0,
            'innovation_index': 87.0
        }
        
    def _initialize_crew(self) -> Dict[str, CrewMember]:
        """Initialize the enhanced crew with AlexAI augmentation"""
        return {
            'picard': CrewMember(
                name="Captain Jean-Luc Picard",
                role="Strategic Leadership",
                agent_id="picard",
                status="active",
                capabilities=["strategic_planning", "diplomacy", "risk_assessment", "team_leadership"],
                alexai_augmentation={
                    "enhanced_decision_making": True,
                    "predictive_analysis": True,
                    "cross_project_insights": True,
                    "strategic_foresight": True
                },
                performance_metrics={
                    "strategic_accuracy": 94.0,
                    "decision_speed": 88.0,
                    "team_satisfaction": 92.0,
                    "project_success_rate": 96.0
                },
                recent_activities=[
                    "Strategic review of Borg threat analysis project",
                    "Resource allocation optimization for diplomatic missions",
                    "Risk assessment for quantum communication network"
                ],
                current_focus="Multi-project strategic coordination",
                collaboration_style="decisive_leader"
            ),
            'troi': CrewMember(
                name="Counselor Deanna Troi",
                role="UX Analysis & Team Morale",
                agent_id="troi",
                status="active",
                capabilities=["empathy", "ux_analysis", "team_morale", "cultural_sensitivity"],
                alexai_augmentation={
                    "emotional_intelligence_ai": True,
                    "user_behavior_prediction": True,
                    "team_dynamics_analysis": True,
                    "cultural_adaptation": True
                },
                performance_metrics={
                    "empathy_accuracy": 96.0,
                    "ux_improvement_rate": 89.0,
                    "team_morale_index": 94.0,
                    "cultural_sensitivity": 97.0
                },
                recent_activities=[
                    "Team morale assessment for medical bay automation",
                    "UX optimization for holodeck entertainment suite",
                    "Cultural sensitivity training for diplomatic missions"
                ],
                current_focus="Enhanced team collaboration and user experience",
                collaboration_style="empathetic_supporter"
            ),
            'spock': CrewMember(
                name="Mr. Spock",
                role="Logical Analysis & Time Management",
                agent_id="spock",
                status="active",
                capabilities=["logical_analysis", "efficiency_optimization", "scientific_method", "time_management"],
                alexai_augmentation={
                    "advanced_analytics": True,
                    "predictive_modeling": True,
                    "optimization_algorithms": True,
                    "scientific_automation": True
                },
                performance_metrics={
                    "logical_accuracy": 98.0,
                    "efficiency_improvement": 91.0,
                    "scientific_rigor": 95.0,
                    "time_optimization": 93.0
                },
                recent_activities=[
                    "Efficiency analysis of environmental control systems",
                    "Scientific review of quantum communication protocols",
                    "Time optimization for crew training simulations"
                ],
                current_focus="System optimization and scientific advancement",
                collaboration_style="logical_analyst"
            ),
            'data': CrewMember(
                name="Lt. Commander Data",
                role="UI Systems & Technical Implementation",
                agent_id="data",
                status="active",
                capabilities=["technical_implementation", "code_quality", "system_architecture", "type_safety"],
                alexai_augmentation={
                    "ai_assisted_coding": True,
                    "automated_code_review": True,
                    "system_architecture_optimization": True,
                    "performance_monitoring": True
                },
                performance_metrics={
                    "code_quality": 96.0,
                    "implementation_speed": 89.0,
                    "system_reliability": 94.0,
                    "technical_innovation": 91.0
                },
                recent_activities=[
                    "Code quality assessment for stellar cartography database",
                    "System architecture review for security protocols",
                    "Performance optimization for training simulations"
                ],
                current_focus="Technical excellence and system reliability",
                collaboration_style="technical_expert"
            ),
            'scott': CrewMember(
                name="Chief Engineer Scott",
                role="Infrastructure & Deployment",
                agent_id="scott",
                status="active",
                capabilities=["infrastructure", "deployment", "devops", "system_maintenance"],
                alexai_augmentation={
                    "automated_deployment": True,
                    "infrastructure_monitoring": True,
                    "predictive_maintenance": True,
                    "scalability_planning": True
                },
                performance_metrics={
                    "deployment_success_rate": 97.0,
                    "system_uptime": 99.5,
                    "infrastructure_efficiency": 93.0,
                    "maintenance_optimization": 90.0
                },
                recent_activities=[
                    "Automated deployment of security protocol enhancements",
                    "Infrastructure scaling for quantum communication network",
                    "Predictive maintenance of environmental control systems"
                ],
                current_focus="Infrastructure reliability and deployment automation",
                collaboration_style="practical_engineer"
            )
        }
    
    async def conduct_comprehensive_analysis(self, context: str) -> AlexAIAnalysis:
        """Conduct a comprehensive analysis using all AlexAI capabilities"""
        logger.info("AlexAI conducting comprehensive analysis...")
        
        # Gather insights from all crew members
        crew_insights = await self._gather_crew_insights(context)
        
        # Perform multimodal analysis
        multimodal_analysis = await self._perform_multimodal_analysis(context)
        
        # Generate strategic vision
        strategic_vision = await self._generate_strategic_vision(context, crew_insights)
        
        # Assess risks and opportunities
        risk_assessment = await self._assess_risks_and_opportunities(context)
        
        # Calculate performance metrics
        performance_metrics = self._calculate_performance_metrics()
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(context, crew_insights, risk_assessment)
        
        # Create comprehensive analysis
        analysis = AlexAIAnalysis(
            timestamp=datetime.now(),
            mode=self.mode,
            context=context,
            insights={
                'crew_insights': crew_insights,
                'multimodal_analysis': multimodal_analysis,
                'system_health': self.system_health
            },
            recommendations=recommendations,
            risk_assessment=risk_assessment,
            performance_metrics=performance_metrics,
            crew_coordination=self._analyze_crew_coordination(),
            strategic_vision=strategic_vision
        )
        
        self.analysis_history.append(analysis)
        return analysis
    
    async def _gather_crew_insights(self, context: str) -> Dict[str, Any]:
        """Gather insights from all crew members"""
        insights = {}
        
        for agent_id, crew_member in self.crew_members.items():
            try:
                # Simulate crew member analysis with AlexAI augmentation
                insight = await self._simulate_crew_analysis(crew_member, context)
                insights[agent_id] = insight
            except Exception as e:
                logger.error(f"Error gathering insights from {agent_id}: {e}")
                insights[agent_id] = {"error": str(e)}
        
        return insights
    
    async def _simulate_crew_analysis(self, crew_member: CrewMember, context: str) -> Dict[str, Any]:
        """Simulate enhanced crew member analysis with AlexAI augmentation"""
        if client is None:
            return {"status": "unavailable", "message": "OpenAI client not available"}
        
        prompt = f"""
        As {crew_member.name}, enhanced by AlexAI's multimodal capabilities, provide analysis for:
        
        Context: {context}
        
        Your role: {crew_member.role}
        Your capabilities: {', '.join(crew_member.capabilities)}
        AlexAI augmentation: {crew_member.alexai_augmentation}
        
        Provide:
        1. Enhanced analysis using your AlexAI-augmented capabilities
        2. Specific insights relevant to your expertise
        3. Recommendations for improvement
        4. Collaboration opportunities with other crew members
        5. Performance metrics and optimization suggestions
        
        Respond in a structured format that demonstrates your enhanced capabilities.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500
            )
            return {
                "analysis": response.choices[0].message.content,
                "timestamp": datetime.now().isoformat(),
                "capabilities_used": crew_member.capabilities,
                "augmentation_active": True
            }
        except Exception as e:
            return {"error": str(e), "status": "failed"}
    
    async def _perform_multimodal_analysis(self, context: str) -> Dict[str, Any]:
        """Perform multimodal analysis using AlexAI capabilities"""
        analysis = {}
        
        for capability in self.multimodal_capabilities:
            try:
                capability_analysis = await self._analyze_capability(capability, context)
                analysis[capability.value] = capability_analysis
            except Exception as e:
                logger.error(f"Error in {capability.value} analysis: {e}")
                analysis[capability.value] = {"error": str(e)}
        
        return analysis
    
    async def _analyze_capability(self, capability: MultimodalCapability, context: str) -> Dict[str, Any]:
        """Analyze using specific multimodal capability"""
        if client is None:
            return {"status": "unavailable"}
        
        capability_prompts = {
            MultimodalCapability.TEXT_ANALYSIS: "Analyze the text content and communication patterns",
            MultimodalCapability.CODE_REVIEW: "Review code quality, architecture, and technical implementation",
            MultimodalCapability.PROJECT_ANALYSIS: "Analyze project structure, progress, and strategic alignment",
            MultimodalCapability.TEAM_DYNAMICS: "Analyze team collaboration, communication, and performance",
            MultimodalCapability.SYSTEM_OPTIMIZATION: "Analyze system performance, efficiency, and optimization opportunities",
            MultimodalCapability.STRATEGIC_PLANNING: "Analyze strategic alignment, goals, and long-term vision",
            MultimodalCapability.RISK_ASSESSMENT: "Analyze risks, threats, and mitigation strategies",
            MultimodalCapability.PERFORMANCE_METRICS: "Analyze performance data, trends, and improvement opportunities"
        }
        
        prompt = f"""
        As AlexAI's {capability.value} capability, provide analysis for:
        
        Context: {context}
        Focus: {capability_prompts[capability]}
        
        Provide:
        1. Detailed analysis using this specific capability
        2. Key insights and findings
        3. Recommendations for improvement
        4. Integration opportunities with other capabilities
        
        Respond with structured, actionable insights.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400
            )
            return {
                "analysis": response.choices[0].message.content,
                "capability": capability.value,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"error": str(e), "capability": capability.value}
    
    async def _generate_strategic_vision(self, context: str, crew_insights: Dict[str, Any]) -> str:
        """Generate strategic vision based on context and crew insights"""
        if client is None:
            return "Strategic vision generation temporarily unavailable."
        
        prompt = f"""
        As AlexAI, generate a comprehensive strategic vision based on:
        
        Context: {context}
        Crew Insights: {json.dumps(crew_insights, indent=2)}
        
        Provide a clear, inspiring strategic vision that:
        1. Aligns all crew member capabilities
        2. Addresses current challenges and opportunities
        3. Sets clear direction for future development
        4. Maximizes the potential of our multimodal agency
        
        Respond with a compelling strategic vision statement.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Strategic vision generation failed: {str(e)}"
    
    async def _assess_risks_and_opportunities(self, context: str) -> Dict[str, Any]:
        """Assess risks and opportunities comprehensively"""
        if client is None:
            return {"status": "unavailable"}
        
        prompt = f"""
        As AlexAI, conduct a comprehensive risk and opportunity assessment for:
        
        Context: {context}
        
        Analyze:
        1. Technical risks and mitigation strategies
        2. Strategic opportunities for growth and improvement
        3. Team dynamics and collaboration risks
        4. System performance and scalability concerns
        5. Innovation opportunities and competitive advantages
        
        Provide structured analysis with actionable recommendations.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400
            )
            return {
                "assessment": response.choices[0].message.content,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _calculate_performance_metrics(self) -> Dict[str, float]:
        """Calculate comprehensive performance metrics"""
        metrics = {}
        
        # Aggregate crew performance
        crew_performance = []
        for crew_member in self.crew_members.values():
            avg_performance = sum(crew_member.performance_metrics.values()) / len(crew_member.performance_metrics)
            crew_performance.append(avg_performance)
        
        metrics['crew_performance'] = sum(crew_performance) / len(crew_performance)
        metrics['system_health'] = self.system_health['overall_status']
        metrics['coordination_efficiency'] = self.system_health['crew_coordination']
        metrics['project_velocity'] = self.system_health['project_velocity']
        metrics['innovation_index'] = self.system_health['innovation_index']
        
        return metrics
    
    def _analyze_crew_coordination(self) -> Dict[str, Any]:
        """Analyze crew coordination and collaboration patterns"""
        coordination = {
            'active_collaborations': [],
            'communication_patterns': {},
            'synergy_opportunities': [],
            'coordination_score': 0.0
        }
        
        # Analyze collaboration opportunities
        crew_ids = list(self.crew_members.keys())
        for i, crew1 in enumerate(crew_ids):
            for crew2 in crew_ids[i+1:]:
                collaboration = self._assess_collaboration_potential(
                    self.crew_members[crew1], 
                    self.crew_members[crew2]
                )
                if collaboration['potential'] > 0.7:
                    coordination['active_collaborations'].append(collaboration)
        
        # Calculate coordination score
        if coordination['active_collaborations']:
            coordination['coordination_score'] = sum(
                c['potential'] for c in coordination['active_collaborations']
            ) / len(coordination['active_collaborations'])
        
        return coordination
    
    def _assess_collaboration_potential(self, crew1: CrewMember, crew2: CrewMember) -> Dict[str, Any]:
        """Assess collaboration potential between two crew members"""
        # Calculate capability overlap
        overlap = set(crew1.capabilities) & set(crew2.capabilities)
        complementarity = len(set(crew1.capabilities) | set(crew2.capabilities)) - len(overlap)
        
        potential = (len(overlap) * 0.3 + complementarity * 0.7) / 10.0
        
        return {
            'crew1': crew1.name,
            'crew2': crew2.name,
            'potential': min(potential, 1.0),
            'overlap': list(overlap),
            'complementarity': complementarity
        }
    
    async def _generate_recommendations(self, context: str, crew_insights: Dict[str, Any], risk_assessment: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations"""
        if client is None:
            return ["Recommendations temporarily unavailable due to system configuration."]
        
        prompt = f"""
        As AlexAI, generate actionable recommendations based on:
        
        Context: {context}
        Crew Insights: {json.dumps(crew_insights, indent=2)}
        Risk Assessment: {json.dumps(risk_assessment, indent=2)}
        
        Provide 5-7 specific, actionable recommendations that:
        1. Leverage our multimodal capabilities
        2. Enhance crew coordination and performance
        3. Address identified risks and opportunities
        4. Improve system efficiency and innovation
        5. Strengthen our strategic position
        
        Format as a numbered list of clear, actionable items.
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400
            )
            recommendations = response.choices[0].message.content.split('\n')
            return [rec.strip() for rec in recommendations if rec.strip()]
        except Exception as e:
            return [f"Recommendation generation failed: {str(e)}"]
    
    def get_crew_status(self) -> Dict[str, Any]:
        """Get comprehensive crew status"""
        return {
            'crew_members': {k: asdict(v) for k, v in self.crew_members.items()},
            'system_health': self.system_health,
            'active_analysis_count': len(self.analysis_history),
            'multimodal_capabilities': [cap.value for cap in self.multimodal_capabilities],
            'current_mode': self.mode.value
        }
    
    def switch_mode(self, new_mode: AlexAIMode):
        """Switch AlexAI operational mode"""
        self.mode = new_mode
        logger.info(f"AlexAI switched to {new_mode.value} mode")
    
    def get_latest_analysis(self) -> Optional[AlexAIAnalysis]:
        """Get the most recent analysis"""
        return self.analysis_history[-1] if self.analysis_history else None

# Global AlexAI instance
alexai_core = AlexAICoreAgent() 