#!/usr/bin/env python3
"""
Reorganized Deployment Test Script
Tests the complete CI/CD process for the reorganized AlexAI Star Trek Agile System
"""

import requests
import json
import time
import subprocess
import sys
from datetime import datetime
from typing import Dict, List, Any

class ReorganizedDeploymentTester:
    """Comprehensive deployment tester for reorganized project structure"""
    
    def __init__(self):
        self.local_url = "http://localhost:8000"
        self.remote_url = "https://alexaikatratransferpackageremotev7-3rggtmu7f-pbradygeorgen.vercel.app"
        self.test_results = []
        
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Log test results"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = {
            "timestamp": timestamp,
            "test_name": test_name,
            "status": status,
            "details": details
        }
        self.test_results.append(result)
        print(f"[{timestamp}] {test_name}: {status}")
        if details:
            print(f"  Details: {details}")
            
    def test_local_deployment(self):
        """Test local deployment with new structure"""
        print("🔧 Testing Local Deployment (Reorganized Structure)...")
        
        # Test main page
        try:
            response = requests.get(f"{self.local_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Local Main Page", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Local Main Page", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Local Main Page", "FAIL", f"Connection error: {e}")
            
        # Test AlexAI status
        try:
            response = requests.get(f"{self.local_url}/api/alexai/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "crew_status" in data:
                    self.log_test("Local AlexAI Status", "PASS", "AlexAI core agent responding")
                else:
                    self.log_test("Local AlexAI Status", "FAIL", "Invalid response format")
            else:
                self.log_test("Local AlexAI Status", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Local AlexAI Status", "FAIL", f"Connection error: {e}")
            
        # Test observation lounge
        try:
            response = requests.get(f"{self.local_url}/observation-lounge", timeout=10)
            if response.status_code == 200:
                self.log_test("Local Observation Lounge", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Local Observation Lounge", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Local Observation Lounge", "FAIL", f"Connection error: {e}")
            
    def test_remote_deployment(self):
        """Test remote deployment with new structure"""
        print("🌐 Testing Remote Deployment (Reorganized Structure)...")
        
        # Test main page
        try:
            response = requests.get(f"{self.remote_url}/", timeout=10)
            if response.status_code == 200:
                self.log_test("Remote Main Page", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Remote Main Page", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Remote Main Page", "FAIL", f"Connection error: {e}")
            
        # Test AlexAI status
        try:
            response = requests.get(f"{self.remote_url}/api/alexai/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "crew_status" in data:
                    self.log_test("Remote AlexAI Status", "PASS", "AlexAI core agent responding")
                else:
                    self.log_test("Remote AlexAI Status", "FAIL", "Invalid response format")
            else:
                self.log_test("Remote AlexAI Status", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Remote AlexAI Status", "FAIL", f"Connection error: {e}")
            
        # Test observation lounge
        try:
            response = requests.get(f"{self.remote_url}/observation-lounge", timeout=10)
            if response.status_code == 200:
                self.log_test("Remote Observation Lounge", "PASS", f"Status: {response.status_code}")
            else:
                self.log_test("Remote Observation Lounge", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Remote Observation Lounge", "FAIL", f"Connection error: {e}")
            
    def test_file_structure(self):
        """Test that the new file structure is properly organized"""
        print("📁 Testing File Structure Organization...")
        
        import os
        from pathlib import Path
        
        # Check key directories exist
        key_dirs = [
            "src/core",
            "src/agents",
            "src/database", 
            "src/api",
            "src/utils",
            "src/config",
            "frontend/web/templates",
            "frontend/web/static",
            "frontend/dashboard",
            "deployment/scripts/local",
            "deployment/scripts/cloud",
            "deployment/config",
            "tests/unit",
            "tests/integration",
            "docs/guides",
            "docs/api",
            "docs/architecture",
            "scripts/setup",
            "scripts/analysis",
            "data"
        ]
        
        for dir_path in key_dirs:
            if os.path.exists(dir_path):
                self.log_test(f"Directory: {dir_path}", "PASS", "Directory exists")
            else:
                self.log_test(f"Directory: {dir_path}", "FAIL", "Directory missing")
                
        # Check key files exist
        key_files = [
            "main.py",
            "src/core/app.py",
            "src/core/alexai_core_agent.py",
            "src/core/agile_project_manager.py",
            "frontend/web/templates/dashboard.html",
            "frontend/web/templates/observation_lounge.html",
            "deployment/scripts/local/start_local.sh",
            "deployment/config/vercel.json",
            "README.md",
            ".env.example"
        ]
        
        for file_path in key_files:
            if os.path.exists(file_path):
                self.log_test(f"File: {file_path}", "PASS", "File exists")
            else:
                self.log_test(f"File: {file_path}", "FAIL", "File missing")
                
    def test_import_structure(self):
        """Test that import statements work correctly"""
        print("🔗 Testing Import Structure...")
        
        try:
            # Test main imports
            import sys
            from pathlib import Path
            
            # Add src to path
            src_path = Path.cwd() / "src"
            sys.path.insert(0, str(src_path))
            
            # Test core imports
            from src.core.app import app
            self.log_test("Import: src.core.app", "PASS", "App imported successfully")
            
            from src.core.alexai_core_agent import alexai_core, AlexAIMode
            self.log_test("Import: src.core.alexai_core_agent", "PASS", "AlexAI core imported successfully")
            
            from src.core.agile_project_manager import AgileProjectManager
            self.log_test("Import: src.core.agile_project_manager", "PASS", "Agile manager imported successfully")
            
        except Exception as e:
            self.log_test("Import Structure", "FAIL", f"Import error: {e}")
            
    def test_deployment_scripts(self):
        """Test that deployment scripts are accessible and executable"""
        print("🚀 Testing Deployment Scripts...")
        
        import os
        import stat
        
        # Check local deployment script
        local_script = "deployment/scripts/local/start_local.sh"
        if os.path.exists(local_script):
            # Check if executable
            if os.access(local_script, os.X_OK):
                self.log_test("Local Deployment Script", "PASS", "Script exists and executable")
            else:
                self.log_test("Local Deployment Script", "WARNING", "Script exists but not executable")
        else:
            self.log_test("Local Deployment Script", "FAIL", "Script missing")
            
        # Check Vercel deployment script
        vercel_script = "deployment/scripts/cloud/vercel/deploy.sh"
        if os.path.exists(vercel_script):
            if os.access(vercel_script, os.X_OK):
                self.log_test("Vercel Deployment Script", "PASS", "Script exists and executable")
            else:
                self.log_test("Vercel Deployment Script", "WARNING", "Script exists but not executable")
        else:
            self.log_test("Vercel Deployment Script", "FAIL", "Script missing")
            
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n📋 Generating Test Report...")
        
        # Calculate statistics
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["status"] == "PASS"])
        failed_tests = len([r for r in self.test_results if r["status"] == "FAIL"])
        warning_tests = len([r for r in self.test_results if r["status"] == "WARNING"])
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Create report
        report = {
            "timestamp": datetime.now().isoformat(),
            "test_summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "warnings": warning_tests,
                "success_rate": success_rate
            },
            "deployment_urls": {
                "local": self.local_url,
                "remote": self.remote_url
            },
            "test_results": self.test_results
        }
        
        # Save report
        with open("REORGANIZED_DEPLOYMENT_TEST_REPORT.json", "w") as f:
            json.dump(report, f, indent=2, default=str)
            
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 Reorganized Deployment Test Summary")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Warnings: {warning_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print("\n🌐 Deployment URLs:")
        print(f"  Local: {self.local_url}")
        print(f"  Remote: {self.remote_url}")
        
        if success_rate >= 90:
            print("\n✅ Reorganized deployment test successful!")
            print("🎉 Project structure reorganization complete!")
        else:
            print("\n⚠️ Some tests failed. Please review the results.")
            
        return success_rate >= 90

def main():
    """Main test execution"""
    print("🚀 Starting Reorganized Deployment Test Suite")
    print("=" * 60)
    
    tester = ReorganizedDeploymentTester()
    
    # Run all tests
    tester.test_file_structure()
    tester.test_import_structure()
    tester.test_deployment_scripts()
    tester.test_local_deployment()
    tester.test_remote_deployment()
    
    # Generate report
    success = tester.generate_test_report()
    
    if success:
        print("\n🎉 All tests passed! The reorganized project structure is working correctly.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please review the test report.")
        sys.exit(1)

if __name__ == "__main__":
    main() 