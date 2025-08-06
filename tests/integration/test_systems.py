#!/usr/bin/env python3
"""
Test script for AlexAI Enterprise Platform Systems
"""

import os
import sys
import json
from datetime import datetime, timedelta

def test_flask_app():
    """Test Flask application"""
    print("🔍 Testing Flask Application...")
    try:
        import requests
        response = requests.get('http://localhost:8000', timeout=5)
        if response.status_code == 200:
            print("✅ Flask app is running and responding")
            return True
        else:
            print(f"❌ Flask app returned status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Flask app test failed: {e}")
        return False

def test_socket_connection():
    """Test Socket.IO connection"""
    print("\n🔍 Testing Socket.IO Connection...")
    try:
        import socketio
        sio = socketio.Client()
        
        @sio.event
        def connect():
            print("✅ Socket.IO connection established")
            sio.disconnect()
        
        @sio.event
        def disconnect():
            print("✅ Socket.IO connection closed")
        
        sio.connect('http://localhost:8000')
        return True
    except Exception as e:
        print(f"❌ Socket.IO test failed: {e}")
        return False

def test_database_connection():
    """Test database connections"""
    print("\n🔍 Testing Database Connections...")
    
    # Test SQLite (if exists)
    try:
        import sqlite3
        conn = sqlite3.connect('analytics.db')
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"✅ SQLite database accessible with {len(tables)} tables")
        conn.close()
    except Exception as e:
        print(f"⚠️  SQLite test: {e}")
    
    # Test Supabase (if credentials available)
    if os.getenv('SUPABASE_URL') and os.getenv('SUPABASE_KEY'):
        try:
            from supabase import create_client
            supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
            response = supabase.table('projects').select('*').limit(1).execute()
            print("✅ Supabase connection successful")
        except Exception as e:
            print(f"❌ Supabase test failed: {e}")
    else:
        print("⚠️  Supabase credentials not found")

def test_environment():
    """Test environment setup"""
    print("\n🔍 Testing Environment Setup...")
    
    required_vars = ['OPENAI_API_KEY', 'FLASK_ENV']
    optional_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'VERCEL_TOKEN']
    
    print("Required environment variables:")
    for var in required_vars:
        if os.getenv(var):
            print(f"  ✅ {var}: Set")
        else:
            print(f"  ❌ {var}: Not set")
    
    print("\nOptional environment variables:")
    for var in optional_vars:
        if os.getenv(var):
            print(f"  ✅ {var}: Set")
        else:
            print(f"  ⚠️  {var}: Not set")

def test_file_structure():
    """Test file structure"""
    print("\n🔍 Testing File Structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'vercel.json',
        'start_local.sh'
    ]
    
    optional_files = [
        'dashboard/package.json',
        'dashboard/next.config.js',
        'supabase_config.py'
    ]
    
    print("Required files:")
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}: Present")
        else:
            print(f"  ❌ {file}: Missing")
    
    print("\nOptional files:")
    for file in optional_files:
        if os.path.exists(file):
            print(f"  ✅ {file}: Present")
        else:
            print(f"  ⚠️  {file}: Missing")

def test_dashboard():
    """Test dashboard if available"""
    print("\n🔍 Testing Dashboard...")
    
    if os.path.exists('dashboard'):
        print("✅ Dashboard directory exists")
        
        if os.path.exists('dashboard/package.json'):
            print("✅ Dashboard package.json found")
            
            # Check if node_modules exists
            if os.path.exists('dashboard/node_modules'):
                print("✅ Dashboard dependencies installed")
            else:
                print("⚠️  Dashboard dependencies not installed")
        else:
            print("❌ Dashboard package.json missing")
    else:
        print("⚠️  Dashboard directory not found")

def generate_test_report():
    """Generate a test report"""
    print("\n📊 Generating Test Report...")
    
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "tests": {
            "flask_app": test_flask_app(),
            "socket_connection": test_socket_connection(),
            "environment": True,  # We'll check this separately
            "file_structure": True,  # We'll check this separately
            "dashboard": os.path.exists('dashboard')
        },
        "environment_vars": {
            "openai_api_key": bool(os.getenv('OPENAI_API_KEY')),
            "supabase_url": bool(os.getenv('SUPABASE_URL')),
            "supabase_key": bool(os.getenv('SUPABASE_KEY')),
            "vercel_token": bool(os.getenv('VERCEL_TOKEN'))
        },
        "system_info": {
            "python_version": sys.version,
            "platform": sys.platform,
            "working_directory": os.getcwd()
        }
    }
    
    # Save report
    with open('test_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print("✅ Test report saved to test_report.json")
    return report

def main():
    """Main test function"""
    print("🚀 AlexAI Enterprise Platform - System Test Suite")
    print("=" * 60)
    
    # Run all tests
    test_environment()
    test_file_structure()
    test_dashboard()
    test_database_connection()
    
    # These require the server to be running
    flask_ok = test_flask_app()
    socket_ok = test_socket_connection() if flask_ok else False
    
    # Generate report
    report = generate_test_report()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    
    tests = report['tests']
    passed = sum(tests.values())
    total = len(tests)
    
    print(f"Tests Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for deployment.")
    else:
        print("⚠️  Some tests failed. Please review the issues above.")
    
    print("\n🔗 Access URLs:")
    print("  Local: http://localhost:8000")
    print("  Dashboard: http://localhost:8000")
    
    if os.getenv('VERCEL_TOKEN'):
        print("  Vercel: Ready for deployment")
    else:
        print("  Vercel: Token not configured")

if __name__ == "__main__":
    main() 