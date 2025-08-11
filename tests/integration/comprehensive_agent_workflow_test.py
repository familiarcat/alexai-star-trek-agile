#!/usr/bin/env python3
"""
Comprehensive Agent Workflow End-to-End Test Suite
Tests all AlexAI agents with proper mock data and executes n8n workflows for validation
"""

import requests
import json
import time
import subprocess
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import asyncio
import aiohttp

@dataclass
class TestResult:
    """Test result data structure"""
    test_name: str
    status: str
    details: str
    timestamp: str
    duration: float
    workflow_id: Optional[str] = None
    agent_name: Optional[str] = None
    mock_data: Optional[Dict] = None

class ComprehensiveAgentWorkflowTester:
    """Comprehensive end-to-end tester for all AlexAI agents and n8n workflows"""
    
    def __init__(self):
        self.local_url = "http://localhost:8000"
        self.n8n_url = "https://n8n.pbradygeorgen.com"
        self.test_results: List[TestResult] = []
        self.mock_data = self._generate_mock_data()
        self.workflow_results = {}
        
    def _generate_mock_data(self) -> Dict[str, Any]:
        """Generate comprehensive mock data for testing all agents"""
        return {
            "crew_requests": {
                "captain_picard": {
                    "context": "Strategic decision making for diplomatic mission",
                    "priority": "high",
                    "crew_members": ["lieutenant_data", "counselor_troi"],
                    "mission_type": "diplomatic"
                },
                "lieutenant_data": {
                    "context": "Technical analysis of alien technology",
                    "priority": "medium",
                    "crew_members": ["chief_engineer_scott"],
                    "analysis_type": "technology_assessment"
                },
                "counselor_troi": {
                    "context": "Psychological profile analysis of new species",
                    "priority": "medium",
                    "crew_members": ["captain_picard"],
                    "analysis_type": "psychological_assessment"
                },
                "chief_engineer_scott": {
                    "context": "Engineering solution for warp core instability",
                    "priority": "critical",
                    "crew_members": ["lieutenant_data"],
                    "problem_type": "warp_core_issue"
                },
                "commander_spock": {
                    "context": "Logical analysis of temporal paradox",
                    "priority": "high",
                    "crew_members": ["lieutenant_data", "captain_picard"],
                    "analysis_type": "temporal_analysis"
                },
                "lieutenant_worf": {
                    "context": "Security protocol assessment for hostile environment",
                    "priority": "high",
                    "crew_members": ["captain_picard"],
                    "security_level": "maximum"
                }
            },
            "specialized_requests": {
                "ships_computer": {
                    "context": "Database query for historical mission data",
                    "query_type": "mission_history",
                    "timeframe": "last_5_years"
                },
                "multimodal_agency": {
                    "context": "Analysis of visual sensor data from unknown object",
                    "data_type": "visual_sensors",
                    "analysis_depth": "comprehensive"
                },
                "bilateral_learning": {
                    "context": "Cross-agent knowledge synthesis",
                    "agents_involved": ["captain_picard", "lieutenant_data"],
                    "learning_type": "collaborative"
                },
                "enhanced_knowledge": {
                    "context": "Knowledge base expansion with new discoveries",
                    "discovery_type": "alien_civilization",
                    "integration_priority": "high"
                }
            },
            "orchestration_requests": {
                "crew_coordination": {
                    "context": "Multi-agent mission coordination",
                    "mission_type": "exploration",
                    "crew_size": 6,
                    "duration": "72_hours"
                },
                "ship_agency": {
                    "context": "Automated ship systems management",
                    "systems": ["life_support", "navigation", "communications"],
                    "autonomy_level": "full"
                },
                "llm_orchestration": {
                    "context": "Multi-LLM task distribution",
                    "llm_providers": ["openai", "anthropic", "local"],
                    "task_complexity": "high"
                }
            },
            "workflow_validation": {
                "validation_type": "comprehensive",
                "include_specialized": True,
                "test_depth": "full_integration",
                "mock_execution": True
            }
        }
    
    def log_test(self, test_name: str, status: str, details: str = "", 
                 duration: float = 0.0, workflow_id: str = None, 
                 agent_name: str = None, mock_data: Dict = None) -> TestResult:
        """Log test results with comprehensive details"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = TestResult(
            test_name=test_name,
            status=status,
            details=details,
            timestamp=timestamp,
            duration=duration,
            workflow_id=workflow_id,
            agent_name=agent_name,
            mock_data=mock_data
        )
        self.test_results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"[{timestamp}] {status_emoji} {test_name}: {status}")
        if details:
            print(f"  Details: {details}")
        if duration > 0:
            print(f"  Duration: {duration:.2f}s")
        if workflow_id:
            print(f"  Workflow: {workflow_id}")
        if agent_name:
            print(f"  Agent: {agent_name}")
        
        return result
    
    async def test_n8n_workflow_execution(self, workflow_name: str, mock_data: Dict) -> bool:
        """Test n8n workflow execution with mock data"""
        start_time = time.time()
        
        try:
            # Test workflow webhook endpoint
            webhook_url = f"{self.n8n_url}/webhook/{workflow_name}"
            
            async with aiohttp.ClientSession() as session:
                async with session.post(webhook_url, json=mock_data, timeout=30) as response:
                    if response.status == 200:
                        result_data = await response.json()
                        duration = time.time() - start_time
                        
                        # Validate response structure
                        if self._validate_workflow_response(workflow_name, result_data):
                            self.log_test(
                                f"N8N Workflow: {workflow_name}",
                                "PASS",
                                f"Workflow executed successfully in {duration:.2f}s",
                                duration,
                                workflow_name,
                                mock_data=mock_data
                            )
                            return True
                        else:
                            self.log_test(
                                f"N8N Workflow: {workflow_name}",
                                "FAIL",
                                "Invalid response structure",
                                duration,
                                workflow_name,
                                mock_data=mock_data
                            )
                            return False
                    else:
                        duration = time.time() - start_time
                        self.log_test(
                            f"N8N Workflow: {workflow_name}",
                            "FAIL",
                            f"HTTP {response.status}: {await response.text()}",
                            duration,
                            workflow_name,
                            mock_data=mock_data
                        )
                        return False
                        
        except Exception as e:
            duration = time.time() - start_time
            self.log_test(
                f"N8N Workflow: {workflow_name}",
                "FAIL",
                f"Execution error: {str(e)}",
                duration,
                workflow_name,
                mock_data=mock_data
            )
            return False
    
    def _validate_workflow_response(self, workflow_name: str, response_data: Dict) -> bool:
        """Validate workflow response structure based on workflow type"""
        if not isinstance(response_data, dict):
            return False
            
        # Common validation for all workflows
        if "success" not in response_data:
            return False
            
        # Workflow-specific validation
        if "comprehensive-agent-validation" in workflow_name:
            required_fields = ["validationType", "totalAgents", "systemHealth", "agentHealthChecks"]
            return all(field in response_data for field in required_fields)
            
        elif "crew-coordination" in workflow_name:
            required_fields = ["crewStatus", "coordinationLevel", "missionStatus"]
            return all(field in response_data for field in required_fields)
            
        elif "bilateral-learning" in workflow_name:
            required_fields = ["syncStatus", "learningProgress", "knowledgeGained"]
            return all(field in response_data for field in required_fields)
            
        elif "multimodal-agency" in workflow_name:
            required_fields = ["analysisResult", "dataProcessed", "insightsGenerated"]
            return all(field in response_data for field in required_fields)
            
        else:
            # Generic validation for unknown workflows
            return "success" in response_data and response_data["success"] is True
    
    async def test_agent_api_endpoints(self) -> bool:
        """Test all agent API endpoints with mock data"""
        print("\n🤖 Testing Agent API Endpoints...")
        
        all_passed = True
        
        # Test crew agent endpoints
        for agent_name, mock_data in self.mock_data["crew_requests"].items():
            start_time = time.time()
            
            try:
                endpoint = f"/api/crew/{agent_name.replace('_', '-')}"
                response = requests.post(
                    f"{self.local_url}{endpoint}",
                    json=mock_data,
                    timeout=15
                )
                
                duration = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test(
                            f"Agent API: {agent_name}",
                            "PASS",
                            "Agent responding correctly",
                            duration,
                            agent_name=agent_name,
                            mock_data=mock_data
                        )
                    else:
                        self.log_test(
                            f"Agent API: {agent_name}",
                            "FAIL",
                            "Agent returned error response",
                            duration,
                            agent_name=agent_name,
                            mock_data=mock_data
                        )
                        all_passed = False
                else:
                    duration = time.time() - start_time
                    self.log_test(
                        f"Agent API: {agent_name}",
                        "FAIL",
                        f"HTTP {response.status_code}",
                        duration,
                        agent_name=agent_name,
                        mock_data=mock_data
                    )
                    all_passed = False
                    
            except Exception as e:
                duration = time.time() - start_time
                self.log_test(
                    f"Agent API: {agent_name}",
                    "FAIL",
                    f"Connection error: {str(e)}",
                    duration,
                    agent_name=agent_name,
                    mock_data=mock_data
                )
                all_passed = False
        
        # Test specialized agent endpoints
        for agent_name, mock_data in self.mock_data["specialized_requests"].items():
            start_time = time.time()
            
            try:
                endpoint = f"/api/specialized/{agent_name.replace('_', '-')}"
                response = requests.post(
                    f"{self.local_url}{endpoint}",
                    json=mock_data,
                    timeout=15
                )
                
                duration = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test(
                            f"Specialized Agent: {agent_name}",
                            "PASS",
                            "Specialized agent responding correctly",
                            duration,
                            agent_name=agent_name,
                            mock_data=mock_data
                        )
                    else:
                        self.log_test(
                            f"Specialized Agent: {agent_name}",
                            "FAIL",
                            "Specialized agent returned error response",
                            duration,
                            agent_name=agent_name,
                            mock_data=mock_data
                        )
                        all_passed = False
                else:
                    duration = time.time() - start_time
                    self.log_test(
                        f"Specialized Agent: {agent_name}",
                        "FAIL",
                        f"HTTP {response.status_code}",
                        duration,
                        agent_name=agent_name,
                        mock_data=mock_data
                    )
                    all_passed = False
                    
            except Exception as e:
                duration = time.time() - start_time
                self.log_test(
                    f"Specialized Agent: {agent_name}",
                    "FAIL",
                    f"Connection error: {str(e)}",
                    duration,
                    agent_name=agent_name,
                    mock_data=mock_data
                )
                all_passed = False
        
        return all_passed
    
    async def test_n8n_workflows(self) -> bool:
        """Test all n8n workflows with mock data"""
        print("\n🔄 Testing N8N Workflows...")
        
        all_passed = True
        
        # Test comprehensive agent validation workflow
        if not await self.test_n8n_workflow_execution(
            "comprehensive-agent-validation",
            self.mock_data["workflow_validation"]
        ):
            all_passed = False
        
        # Test crew coordination workflows
        for workflow_type in ["crew-coordination", "simplified-crew-coordination", "optimized-crew-coordination"]:
            if not await self.test_n8n_workflow_execution(
                workflow_type,
                self.mock_data["orchestration_requests"]["crew_coordination"]
            ):
                all_passed = False
        
        # Test bilateral learning workflow
        if not await self.test_n8n_workflow_execution(
            "bilateral-learning",
            self.mock_data["specialized_requests"]["bilateral_learning"]
        ):
            all_passed = False
        
        # Test multimodal agency workflow
        if not await self.test_n8n_workflow_execution(
            "multimodal-agency-openrouter",
            self.mock_data["specialized_requests"]["multimodal_agency"]
        ):
            all_passed = False
        
        # Test enhanced AI insights workflow
        if not await self.test_n8n_workflow_execution(
            "enhanced-ai-insights",
            {"context": "Comprehensive system analysis", "depth": "full"}
        ):
            all_passed = False
        
        return all_passed
    
    async def test_bilateral_sync_system(self) -> bool:
        """Test bilateral sync system functionality"""
        print("\n🔄 Testing Bilateral Sync System...")
        
        start_time = time.time()
        
        try:
            # Test sync status
            sync_status_url = f"{self.local_url}/api/sync/status"
            response = requests.get(sync_status_url, timeout=10)
            
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("syncStatus") == "active":
                    self.log_test(
                        "Bilateral Sync Status",
                        "PASS",
                        "Sync system active and responding",
                        duration
                    )
                    return True
                else:
                    self.log_test(
                        "Bilateral Sync Status",
                        "FAIL",
                        "Sync system not properly configured",
                        duration
                    )
                    return False
            else:
                self.log_test(
                    "Bilateral Sync Status",
                    "FAIL",
                    f"HTTP {response.status_code}",
                    duration
                )
                return False
                
        except Exception as e:
            duration = time.time() - start_time
            self.log_test(
                "Bilateral Sync Status",
                "FAIL",
                f"Connection error: {str(e)}",
                duration
            )
            return False
    
    async def test_integration_scenarios(self) -> bool:
        """Test complex integration scenarios with multiple agents"""
        print("\n🔗 Testing Integration Scenarios...")
        
        all_passed = True
        
        # Test multi-agent coordination scenario
        start_time = time.time()
        try:
            coordination_data = {
                "scenario": "multi_agent_mission",
                "agents": ["captain_picard", "lieutenant_data", "chief_engineer_scott"],
                "mission_type": "critical_engineering",
                "priority": "critical",
                "timeframe": "immediate"
            }
            
            response = requests.post(
                f"{self.local_url}/api/coordination/mission",
                json=coordination_data,
                timeout=20
            )
            
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("coordinationStatus") == "active":
                    self.log_test(
                        "Multi-Agent Coordination",
                        "PASS",
                        "Complex coordination scenario successful",
                        duration,
                        mock_data=coordination_data
                    )
                else:
                    self.log_test(
                        "Multi-Agent Coordination",
                        "FAIL",
                        "Coordination scenario failed",
                        duration,
                        mock_data=coordination_data
                    )
                    all_passed = False
            else:
                self.log_test(
                    "Multi-Agent Coordination",
                    "FAIL",
                    f"HTTP {response.status_code}",
                    duration,
                    mock_data=coordination_data
                )
                all_passed = False
                
        except Exception as e:
            duration = time.time() - start_time
            self.log_test(
                "Multi-Agent Coordination",
                "FAIL",
                f"Connection error: {str(e)}",
                duration,
                mock_data=coordination_data
            )
            all_passed = False
        
        # Test knowledge synthesis scenario
        start_time = time.time()
        try:
            synthesis_data = {
                "scenario": "knowledge_synthesis",
                "agents": ["enhanced_knowledge", "bilateral_learning"],
                "synthesis_type": "cross_domain",
                "complexity": "high"
            }
            
            response = requests.post(
                f"{self.local_url}/api/knowledge/synthesize",
                json=synthesis_data,
                timeout=20
            )
            
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test(
                        "Knowledge Synthesis",
                        "PASS",
                        "Knowledge synthesis successful",
                        duration,
                        mock_data=synthesis_data
                    )
                else:
                    self.log_test(
                        "Knowledge Synthesis",
                        "FAIL",
                        "Knowledge synthesis failed",
                        duration,
                        mock_data=synthesis_data
                    )
                    all_passed = False
            else:
                self.log_test(
                    "Knowledge Synthesis",
                    "FAIL",
                    f"HTTP {response.status_code}",
                    duration,
                    mock_data=synthesis_data
                )
                all_passed = False
                
        except Exception as e:
            duration = time.time() - start_time
            self.log_test(
                "Knowledge Synthesis",
                "FAIL",
                f"Connection error: {str(e)}",
                duration,
                mock_data=synthesis_data
            )
            all_passed = False
        
        return all_passed
    
    def generate_comprehensive_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r.status == "PASS"])
        failed_tests = len([r for r in self.test_results if r.status == "FAIL"])
        warning_tests = len([r for r in self.test_results if r.status == "WARNING"])
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Group results by category
        agent_tests = [r for r in self.test_results if "Agent" in r.test_name]
        workflow_tests = [r for r in self.test_results if "Workflow" in r.test_name]
        sync_tests = [r for r in self.test_results if "Sync" in r.test_name]
        integration_tests = [r for r in self.test_results if "Integration" in r.test_name or "Coordination" in r.test_name]
        
        report = {
            "test_summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "warnings": warning_tests,
                "success_rate": round(success_rate, 2),
                "timestamp": datetime.now().isoformat(),
                "test_duration": sum(r.duration for r in self.test_results)
            },
            "category_breakdown": {
                "agent_tests": {
                    "total": len(agent_tests),
                    "passed": len([r for r in agent_tests if r.status == "PASS"]),
                    "failed": len([r for r in agent_tests if r.status == "FAIL"])
                },
                "workflow_tests": {
                    "total": len(workflow_tests),
                    "passed": len([r for r in workflow_tests if r.status == "PASS"]),
                    "failed": len([r for r in workflow_tests if r.status == "FAIL"])
                },
                "sync_tests": {
                    "total": len(sync_tests),
                    "passed": len([r for r in sync_tests if r.status == "PASS"]),
                    "failed": len([r for r in sync_tests if r.status == "FAIL"])
                },
                "integration_tests": {
                    "total": len(integration_tests),
                    "passed": len([r for r in integration_tests if r.status == "PASS"]),
                    "failed": len([r for r in integration_tests if r.status == "FAIL"])
                }
            },
            "detailed_results": [
                {
                    "test_name": r.test_name,
                    "status": r.status,
                    "details": r.details,
                    "timestamp": r.timestamp,
                    "duration": r.duration,
                    "workflow_id": r.workflow_id,
                    "agent_name": r.agent_name
                }
                for r in self.test_results
            ],
            "recommendations": self._generate_recommendations(),
            "mock_data_summary": {
                "crew_agents_tested": len(self.mock_data["crew_requests"]),
                "specialized_agents_tested": len(self.mock_data["specialized_requests"]),
                "orchestration_agents_tested": len(self.mock_data["orchestration_requests"]),
                "workflows_validated": len([r for r in self.test_results if r.workflow_id])
            }
        }
        
        return report
    
    def _generate_recommendations(self) -> List[str]:
        """Generate recommendations based on test results"""
        recommendations = []
        
        failed_tests = [r for r in self.test_results if r.status == "FAIL"]
        
        if any("Agent API" in r.test_name for r in failed_tests):
            recommendations.append("Review and fix agent API endpoint configurations")
        
        if any("Workflow" in r.test_name for r in failed_tests):
            recommendations.append("Validate n8n workflow configurations and webhook endpoints")
        
        if any("Sync" in r.test_name for r in failed_tests):
            recommendations.append("Check bilateral sync system configuration and connectivity")
        
        if any("Integration" in r.test_name for r in failed_tests):
            recommendations.append("Review multi-agent coordination and integration logic")
        
        # Performance recommendations
        slow_tests = [r for r in self.test_results if r.duration > 10.0]
        if slow_tests:
            recommendations.append(f"Optimize performance for {len(slow_tests)} slow-running tests")
        
        # Success rate recommendations
        success_rate = len([r for r in self.test_results if r.status == "PASS"]) / len(self.test_results) * 100
        if success_rate < 90:
            recommendations.append("Overall system reliability needs improvement")
        elif success_rate < 95:
            recommendations.append("Minor optimizations recommended for better reliability")
        
        return recommendations
    
    async def run_comprehensive_test_suite(self) -> bool:
        """Run the complete comprehensive test suite"""
        print("🚀 Starting Comprehensive Agent Workflow Test Suite...")
        print("=" * 60)
        
        start_time = time.time()
        
        # Test all components
        test_results = []
        
        # Test agent API endpoints
        test_results.append(await self.test_agent_api_endpoints())
        
        # Test n8n workflows
        test_results.append(await self.test_n8n_workflows())
        
        # Test bilateral sync system
        test_results.append(await self.test_bilateral_sync_system())
        
        # Test integration scenarios
        test_results.append(await self.test_integration_scenarios())
        
        total_duration = time.time() - start_time
        
        # Generate and save report
        report = self.generate_comprehensive_report()
        report["test_summary"]["total_duration"] = total_duration
        
        # Save report to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_filename = f"comprehensive_agent_workflow_test_report_{timestamp}.json"
        
        with open(f"tests/reports/{report_filename}", "w") as f:
            json.dump(report, f, indent=2)
        
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 COMPREHENSIVE TEST SUITE COMPLETE!")
        print("=" * 60)
        print(f"Total Tests: {report['test_summary']['total_tests']}")
        print(f"Passed: {report['test_summary']['passed']} ✅")
        print(f"Failed: {report['test_summary']['failed']} ❌")
        print(f"Warnings: {report['test_summary']['warnings']} ⚠️")
        print(f"Success Rate: {report['test_summary']['success_rate']}%")
        print(f"Total Duration: {total_duration:.2f}s")
        print(f"Report Saved: {report_filename}")
        
        if report['recommendations']:
            print("\n📋 Recommendations:")
            for rec in report['recommendations']:
                print(f"  • {rec}")
        
        print(f"\n🔄 Mock Data Summary:")
        print(f"  • Crew Agents Tested: {report['mock_data_summary']['crew_agents_tested']}")
        print(f"  • Specialized Agents Tested: {report['mock_data_summary']['specialized_agents_tested']}")
        print(f"  • Orchestration Agents Tested: {report['mock_data_summary']['orchestration_agents_tested']}")
        print(f"  • Workflows Validated: {report['mock_data_summary']['workflows_validated']}")
        
        return all(test_results)

async def main():
    """Main execution function"""
    tester = ComprehensiveAgentWorkflowTester()
    
    try:
        success = await tester.run_comprehensive_test_suite()
        
        if success:
            print("\n🎉 All tests passed! Your AlexAI system is fully operational.")
            sys.exit(0)
        else:
            print("\n⚠️ Some tests failed. Please review the recommendations above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⏹️ Test suite interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
