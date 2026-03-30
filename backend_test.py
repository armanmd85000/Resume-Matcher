#!/usr/bin/env python3
"""Backend API Testing for Resume Matcher"""

import requests
import sys
import json
from datetime import datetime

class ResumeMatcherAPITester:
    def __init__(self, base_url="https://453e9425-8e03-46ac-993f-adcbf5832cc7.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_match_endpoint(self):
        """Test keyword matching endpoint"""
        sample_jd = """
        We are looking for a Spanish Relationship Manager to handle client communications in Spanish and English.
        
        Key Requirements:
        - Fluent Spanish and English
        - Customer service experience
        - Data analysis skills
        - Project management
        - Microsoft Excel proficiency
        """
        
        sample_cv = """
        John Doe
        Senior Relationship Manager
        john.doe@email.com
        +1 234-567-8900
        New York, USA
        
        Professional Summary
        Experienced relationship manager with 5+ years in customer service and client communications. 
        Fluent in Spanish and English with strong analytical and project management skills.
        
        Core Competencies
        Spanish Language • English Language • Customer Service • Data Analysis • Microsoft Excel • Project Management
        
        Professional Experience
        Senior Relationship Manager
        ABC Company
        2020 - Present
        - Managed client relationships in Spanish and English
        - Performed data analysis using Microsoft Excel
        - Led project management initiatives
        """
        
        success, response = self.run_test(
            "Match Keywords",
            "POST",
            "api/match",
            200,
            data={
                "job_description": sample_jd,
                "cv_text": sample_cv
            }
        )
        
        if success and response:
            # Validate response structure
            required_fields = ['score', 'matched_keywords', 'missing_keywords', 'matched_phrases', 'jd_keyword_count', 'match_count']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            
            print(f"   Match Score: {response.get('score', 0)}%")
            print(f"   Matched Keywords: {len(response.get('matched_keywords', []))}")
            print(f"   Missing Keywords: {len(response.get('missing_keywords', []))}")
            print(f"   Matched Phrases: {response.get('matched_phrases', [])}")
        
        return success

    def test_invalid_match_request(self):
        """Test match endpoint with invalid data"""
        success, response = self.run_test(
            "Invalid Match Request",
            "POST",
            "api/match",
            422,  # Validation error expected
            data={"invalid": "data"}
        )
        return success

def main():
    print("🚀 Starting Resume Matcher Backend API Tests")
    print("=" * 50)
    
    tester = ResumeMatcherAPITester()
    
    # Run all tests
    tests = [
        tester.test_health_check,
        tester.test_match_endpoint,
        tester.test_invalid_match_request,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️  Some backend tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())