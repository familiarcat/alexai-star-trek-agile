#!/usr/bin/env python3
"""
Test Public Access Script
Tests the deployment after disabling password protection
"""

import requests
import json
import time
from datetime import datetime

class PublicAccessTester:
    """Tests public access to the deployment"""
    
    def __init__(self):
        self.main_url = "https://alexaikatratransferpackageremotev7-em8uv8wwo-pbradygeorgen.vercel.app"
        self.local_url = "http://localhost:8000"
        
    def test_main_page_access(self):
        """Test if main page is publicly accessible"""
        print("🔓 Testing Main Page Public Access...")
        
        try:
            response = requests.get(f"{self.main_url}/", timeout=10)
            if response.status_code == 200:
                print(f"✅ Main Page: PUBLICLY ACCESSIBLE (Status: {response.status_code})")
                return True
            elif response.status_code == 401:
                print(f"❌ Main Page: STILL PASSWORD PROTECTED (Status: {response.status_code})")
                print("   → Please disable password protection in Vercel dashboard")
                return False
            else:
                print(f"⚠️ Main Page: UNEXPECTED STATUS (Status: {response.status_code})")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Main Page: CONNECTION ERROR ({str(e)})")
            return False
    
    def test_alexai_endpoints(self):
        """Test AlexAI endpoints"""
        print("\n🤖 Testing AlexAI Endpoints...")
        
        endpoints = [
            "/api/alexai/status",
            "/api/alexai/consultation"
        ]
        
        results = []
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.main_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    print(f"✅ {endpoint}: WORKING (Status: {response.status_code})")
                    results.append(True)
                elif response.status_code == 401:
                    print(f"❌ {endpoint}: PASSWORD PROTECTED (Status: {response.status_code})")
                    results.append(False)
                else:
                    print(f"⚠️ {endpoint}: UNEXPECTED STATUS (Status: {response.status_code})")
                    results.append(False)
            except requests.exceptions.RequestException as e:
                print(f"❌ {endpoint}: CONNECTION ERROR ({str(e)})")
                results.append(False)
        
        return all(results)
    
    def test_observation_lounge(self):
        """Test observation lounge access"""
        print("\n👁️ Testing Observation Lounge...")
        
        try:
            response = requests.get(f"{self.main_url}/observation-lounge", timeout=10)
            if response.status_code == 200:
                print(f"✅ Observation Lounge: ACCESSIBLE (Status: {response.status_code})")
                return True
            elif response.status_code == 401:
                print(f"❌ Observation Lounge: PASSWORD PROTECTED (Status: {response.status_code})")
                return False
            else:
                print(f"⚠️ Observation Lounge: UNEXPECTED STATUS (Status: {response.status_code})")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Observation Lounge: CONNECTION ERROR ({str(e)})")
            return False
    
    def test_alexai_consultation(self):
        """Test AlexAI consultation functionality"""
        print("\n🧠 Testing AlexAI Consultation...")
        
        try:
            response = requests.post(
                f"{self.main_url}/api/alexai/consultation",
                json={"context": "Testing public access to AlexAI consultation"},
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    print(f"✅ AlexAI Consultation: WORKING")
                    if data.get("analysis"):
                        analysis = data["analysis"]
                        print(f"   → Strategic Vision: {'✅' if analysis.get('strategic_vision') else '❌'}")
                        print(f"   → Recommendations: {'✅' if analysis.get('recommendations') else '❌'}")
                        print(f"   → Performance Metrics: {'✅' if analysis.get('performance_metrics') else '❌'}")
                    return True
                else:
                    print(f"❌ AlexAI Consultation: FAILED (No success response)")
                    return False
            elif response.status_code == 401:
                print(f"❌ AlexAI Consultation: PASSWORD PROTECTED (Status: {response.status_code})")
                return False
            else:
                print(f"⚠️ AlexAI Consultation: UNEXPECTED STATUS (Status: {response.status_code})")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ AlexAI Consultation: CONNECTION ERROR ({str(e)})")
            return False
    
    def generate_public_access_report(self):
        """Generate comprehensive public access report"""
        print("\n📋 Generating Public Access Report...")
        
        timestamp = datetime.now().isoformat()
        
        # Test all components
        main_page_works = self.test_main_page_access()
        alexai_endpoints_work = self.test_alexai_endpoints()
        observation_lounge_works = self.test_observation_lounge()
        consultation_works = self.test_alexai_consultation()
        
        # Calculate success rate
        tests = [main_page_works, alexai_endpoints_work, observation_lounge_works, consultation_works]
        passed_tests = sum(tests)
        total_tests = len(tests)
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Generate report
        report = {
            "timestamp": timestamp,
            "deployment_url": self.main_url,
            "test_results": {
                "main_page": main_page_works,
                "alexai_endpoints": alexai_endpoints_work,
                "observation_lounge": observation_lounge_works,
                "alexai_consultation": consultation_works
            },
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": total_tests - passed_tests,
                "success_rate": success_rate
            },
            "status": "PUBLIC" if main_page_works else "PROTECTED"
        }
        
        # Print summary
        print(f"\n🎯 Public Access Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {total_tests - passed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        print(f"   Status: {report['status']}")
        
        if main_page_works:
            print(f"\n🎉 SUCCESS! Deployment is publicly accessible!")
            print(f"   → Main App: {self.main_url}")
            print(f"   → AlexAI Core Agent: Fully functional")
            print(f"   → Star Trek Interface: Ready for use")
        else:
            print(f"\n⚠️ Password protection still active!")
            print(f"   → Please disable password protection in Vercel dashboard")
            print(f"   → Follow the guide in: disable_password_protection.md")
        
        # Save report
        with open("public_access_report.json", "w") as f:
            json.dump(report, f, indent=2)
        
        return report

def main():
    """Main test execution"""
    tester = PublicAccessTester()
    report = tester.generate_public_access_report()
    
    # Exit with appropriate code
    if report["status"] == "PUBLIC":
        print(f"\n✅ Public access test completed successfully!")
        return 0
    else:
        print(f"\n❌ Public access test failed - password protection active!")
        return 1

if __name__ == "__main__":
    exit(main()) 