#!/usr/bin/env python3
"""
End-to-End Deployment Test Script
Tests the complete CI/CD process for AlexAI Star Trek Agile System
"""

import requests
import json
import time
import subprocess
import sys
from datetime import datetime
from typing import Dict, List, Any

class EndToEndDeploymentTester:
    """Comprehensive end-to-end deployment tester"""
    
    def __init__(self):
        self.local_url = "http://localhost:8000"
        self.remote_main_url = "https://alexaikatratransferpackageremotev7-em8uv8wwo-pbradygeorgen.vercel.app"
        self.remote_dashboard_url = "https://alexaikatratransferpackageremotev7-5a0huy992-pbradygeorgen.vercel.app"
        self.test_results = []
        
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Log test results"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = {
            "timestamp": timestamp,
            "test": test_name,
            "status": status,
            "details": details
        }
        self.test_results.append(result)
        print(f"[{timestamp}] {test_name}: {status}")
        if details:
            print(f"  Details: {details}")
    
    def test_local_deployment(self) -> bool:
        """Test local deployment"""
        print("\n🔧 Testing Local Deployment...")
        
        try:
            # Test main page
            response = requests.get(f"{self.local_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Local Main Page", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Local Main Page", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test AlexAI status endpoint
            response = requests.get(f"{self.local_url}/api/alexai/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Local AlexAI Status", "PASS", "AlexAI core agent responding")
                else:
                    self.log_test("Local AlexAI Status", "FAIL", "AlexAI not responding properly")
                    return False
            else:
                self.log_test("Local AlexAI Status", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test observation lounge
            response = requests.get(f"{self.local_url}/observation-lounge", timeout=10)
            if response.status_code == 200:
                self.log_test("Local Observation Lounge", "PASS", "Enhanced AlexAI interface accessible")
            else:
                self.log_test("Local Observation Lounge", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test crew insights
            response = requests.post(
                f"{self.local_url}/api/agents/insights",
                json={"context": "End-to-end deployment testing"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Local Crew Insights", "PASS", "Multi-agent system responding")
                else:
                    self.log_test("Local Crew Insights", "FAIL", "Crew insights not working")
                    return False
            else:
                self.log_test("Local Crew Insights", "FAIL", f"Status: {response.status_code}")
                return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Local Deployment", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_remote_main_deployment(self) -> bool:
        """Test remote main deployment"""
        print("\n🌐 Testing Remote Main Deployment...")
        
        try:
            # Test main page (may have password protection)
            response = requests.get(f"{self.remote_main_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Remote Main Page", "PASS", f"Status: {response.status_code}")
            elif response.status_code == 401 or "Authentication Required" in response.text:
                self.log_test("Remote Main Page", "PASSWORD_PROTECTED", "Requires authentication")
            else:
                self.log_test("Remote Main Page", "FAIL", f"Status: {response.status_code}")
                return False
            
            # Test AlexAI status endpoint
            response = requests.get(f"{self.remote_main_url}/api/alexai/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Remote AlexAI Status", "PASS", "AlexAI core agent responding")
                else:
                    self.log_test("Remote AlexAI Status", "FAIL", "AlexAI not responding properly")
                    return False
            elif response.status_code == 401:
                self.log_test("Remote AlexAI Status", "PASSWORD_PROTECTED", "Requires authentication")
            else:
                self.log_test("Remote AlexAI Status", "FAIL", f"Status: {response.status_code}")
                return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Remote Main Deployment", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_remote_dashboard_deployment(self) -> bool:
        """Test remote dashboard deployment"""
        print("\n📊 Testing Remote Dashboard Deployment...")
        
        try:
            # Test dashboard page
            response = requests.get(f"{self.remote_dashboard_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Remote Dashboard", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Remote Dashboard", "FAIL", f"Status: {response.status_code}")
                return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Remote Dashboard Deployment", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_alexai_consultation(self) -> bool:
        """Test AlexAI consultation functionality"""
        print("\n🤖 Testing AlexAI Consultation...")
        
        try:
            # Test comprehensive consultation
            response = requests.post(
                f"{self.local_url}/api/alexai/consultation",
                json={"context": "End-to-end deployment testing and validation"},
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("analysis"):
                    analysis = data["analysis"]
                    self.log_test("AlexAI Consultation", "PASS", "Comprehensive analysis generated")
                    
                    # Check analysis components
                    if analysis.get("strategic_vision"):
                        self.log_test("Strategic Vision", "PASS", "Vision generated")
                    else:
                        self.log_test("Strategic Vision", "FAIL", "No vision generated")
                    
                    if analysis.get("recommendations"):
                        self.log_test("Recommendations", "PASS", f"{len(analysis['recommendations'])} recommendations")
                    else:
                        self.log_test("Recommendations", "FAIL", "No recommendations")
                    
                    if analysis.get("performance_metrics"):
                        self.log_test("Performance Metrics", "PASS", "Metrics calculated")
                    else:
                        self.log_test("Performance Metrics", "FAIL", "No metrics")
                    
                else:
                    self.log_test("AlexAI Consultation", "FAIL", "Analysis not generated properly")
                    return False
            else:
                self.log_test("AlexAI Consultation", "FAIL", f"Status: {response.status_code}")
                return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("AlexAI Consultation", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_multimodal_capabilities(self) -> bool:
        """Test multimodal capabilities"""
        print("\n🔍 Testing Multimodal Capabilities...")
        
        try:
            # Test mode switching
            modes = ["orchestrator", "analyzer", "strategist", "mediator", "innovator", "monitor"]
            
            for mode in modes:
                response = requests.post(
                    f"{self.local_url}/api/alexai/mode",
                    json={"mode": mode},
                    timeout=10
                )
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        self.log_test(f"Mode Switch: {mode}", "PASS", f"Switched to {mode}")
                    else:
                        self.log_test(f"Mode Switch: {mode}", "FAIL", "Mode switch failed")
                        return False
                else:
                    self.log_test(f"Mode Switch: {mode}", "FAIL", f"Status: {response.status_code}")
                    return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Multimodal Capabilities", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def test_crew_coordination(self) -> bool:
        """Test crew coordination and collaboration"""
        print("\n👥 Testing Crew Coordination...")
        
        try:
            # Test crew status
            response = requests.get(f"{self.local_url}/api/alexai/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("crew_status"):
                    crew_status = data["crew_status"]
                    
                    # Check crew members
                    crew_members = crew_status.get("crew_members", {})
                    expected_crew = ["picard", "troi", "spock", "data", "scott", "worf", "quark", "observationLounge"]
                    
                    for crew_id in expected_crew:
                        if crew_id in crew_members:
                            crew = crew_members[crew_id]
                            if crew.get("status") == "active":
                                self.log_test(f"Crew Member: {crew_id}", "PASS", f"Active - {crew.get('role', 'Unknown')}")
                            else:
                                self.log_test(f"Crew Member: {crew_id}", "FAIL", f"Status: {crew.get('status', 'Unknown')}")
                                return False
                        else:
                            self.log_test(f"Crew Member: {crew_id}", "FAIL", "Not found")
                            return False
                    
                    # Check system health
                    system_health = crew_status.get("system_health", {})
                    if system_health.get("overall_status") == "optimal":
                        self.log_test("System Health", "PASS", "Optimal status")
                    else:
                        self.log_test("System Health", "WARNING", f"Status: {system_health.get('overall_status', 'Unknown')}")
                    
                else:
                    self.log_test("Crew Coordination", "FAIL", "Crew status not available")
                    return False
            else:
                self.log_test("Crew Coordination", "FAIL", f"Status: {response.status_code}")
                return False
            
            return True
            
        except requests.exceptions.RequestException as e:
            self.log_test("Crew Coordination", "FAIL", f"Connection error: {str(e)}")
            return False
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n📋 Generating Test Report...")
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["status"] == "PASS"])
        failed_tests = len([r for r in self.test_results if r["status"] == "FAIL"])
        warning_tests = len([r for r in self.test_results if r["status"] in ["WARNING", "PASSWORD_PROTECTED"]])
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "warnings": warning_tests,
                "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0
            },
            "test_results": self.test_results,
            "deployment_urls": {
                "local": self.local_url,
                "remote_main": self.remote_main_url,
                "remote_dashboard": self.remote_dashboard_url
            }
        }
        
        # Save report
        with open("end_to_end_test_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        # Print summary
        print(f"\n🎯 Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Warnings: {warning_tests}")
        print(f"   Success Rate: {report['summary']['success_rate']:.1f}%")
        
        print(f"\n🌐 Deployment URLs:")
        print(f"   Local: {self.local_url}")
        print(f"   Remote Main: {self.remote_main_url}")
        print(f"   Remote Dashboard: {self.remote_dashboard_url}")
        
        if failed_tests == 0:
            print(f"\n✅ All critical tests passed! End-to-end deployment successful!")
        else:
            print(f"\n⚠️  {failed_tests} tests failed. Please review the results.")
        
        return report
    
    def run_complete_test_suite(self):
        """Run the complete end-to-end test suite"""
        print("🚀 Starting End-to-End Deployment Test Suite")
        print("=" * 60)
        
        # Test local deployment
        local_success = self.test_local_deployment()
        
        # Test remote deployments
        remote_main_success = self.test_remote_main_deployment()
        remote_dashboard_success = self.test_remote_dashboard_deployment()
        
        # Test AlexAI features
        if local_success:
            alexai_success = self.test_alexai_consultation()
            multimodal_success = self.test_multimodal_capabilities()
            crew_success = self.test_crew_coordination()
        else:
            alexai_success = False
            multimodal_success = False
            crew_success = False
        
        # Generate report
        report = self.generate_test_report()
        
        return {
            "local_deployment": local_success,
            "remote_main_deployment": remote_main_success,
            "remote_dashboard_deployment": remote_dashboard_success,
            "alexai_consultation": alexai_success,
            "multimodal_capabilities": multimodal_success,
            "crew_coordination": crew_success,
            "report": report
        }

def main():
    """Main test execution"""
    tester = EndToEndDeploymentTester()
    results = tester.run_complete_test_suite()
    
    # Exit with appropriate code
    if results["local_deployment"] and results["remote_main_deployment"] and results["remote_dashboard_deployment"]:
        print("\n🎉 End-to-end deployment test completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ End-to-end deployment test failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 