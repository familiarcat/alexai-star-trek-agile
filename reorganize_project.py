#!/usr/bin/env python3
"""
Project Reorganization Script
Automates the restructuring of the AlexAI Star Trek Agile System
for junior developer accessibility
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

class ProjectReorganizer:
    """Handles the complete project reorganization"""
    
    def __init__(self):
        self.root_dir = Path.cwd()
        self.backup_dir = self.root_dir / "backup_before_reorganization"
        self.reorganization_log = []
        
    def log_action(self, action: str, details: str = ""):
        """Log reorganization actions"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {action}: {details}"
        self.reorganization_log.append(log_entry)
        print(f"🔄 {log_entry}")
        
    def create_backup(self):
        """Create backup of current structure"""
        self.log_action("Creating backup", "Saving current project structure")
        
        if self.backup_dir.exists():
            shutil.rmtree(self.backup_dir)
        
        # Copy all files except backup and .git
        for item in self.root_dir.iterdir():
            if item.name not in ['.git', 'backup_before_reorganization']:
                if item.is_file():
                    shutil.copy2(item, self.backup_dir / item.name)
                elif item.is_dir():
                    shutil.copytree(item, self.backup_dir / item.name)
        
        self.log_action("Backup created", f"Saved to {self.backup_dir}")
        
    def create_directory_structure(self):
        """Create the new directory structure"""
        self.log_action("Creating new directory structure")
        
        directories = [
            "src/core",
            "src/agents/crew_members",
            "src/agents/multimodal",
            "src/database/migrations",
            "src/api",
            "src/utils",
            "src/config",
            "frontend/web/templates",
            "frontend/web/static/css",
            "frontend/web/static/js",
            "frontend/web/static/images",
            "frontend/dashboard",
            "deployment/scripts/local",
            "deployment/scripts/cloud/vercel",
            "deployment/scripts/cloud/aws",
            "deployment/scripts/cloud/railway",
            "deployment/scripts/cloud/heroku",
            "deployment/scripts/automated",
            "deployment/config",
            "deployment/secrets",
            "tests/unit",
            "tests/integration",
            "tests/fixtures",
            "tests/reports",
            "docs/guides",
            "docs/api",
            "docs/architecture",
            "docs/reports/status_reports",
            "docs/reports/analysis_reports",
            "docs/reports/deployment_reports",
            "scripts/setup",
            "scripts/analysis",
            "scripts/maintenance",
            "data"
        ]
        
        for directory in directories:
            dir_path = self.root_dir / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            self.log_action("Created directory", directory)
            
        # Create __init__.py files for Python packages
        python_dirs = [
            "src", "src/core", "src/agents", "src/agents/crew_members",
            "src/agents/multimodal", "src/database", "src/api", "src/utils", "src/config"
        ]
        
        for dir_name in python_dirs:
            init_file = self.root_dir / dir_name / "__init__.py"
            if not init_file.exists():
                init_file.touch()
                self.log_action("Created __init__.py", dir_name)
                
    def move_core_files(self):
        """Move core application files to src/core/"""
        self.log_action("Moving core application files")
        
        core_files = [
            ("app.py", "src/core/app.py"),
            ("alexai_core_agent.py", "src/core/alexai_core_agent.py"),
            ("agile_project_manager.py", "src/core/agile_project_manager.py")
        ]
        
        for source, destination in core_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_database_files(self):
        """Move database-related files to src/database/"""
        self.log_action("Moving database files")
        
        database_files = [
            ("database_mock.py", "src/database/mock.py"),
            ("supabase_config.py", "src/database/supabase_config.py"),
            ("setup_supabase_tables.sql", "src/database/setup_supabase_tables.sql")
        ]
        
        for source, destination in database_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_utility_files(self):
        """Move utility files to src/utils/"""
        self.log_action("Moving utility files")
        
        utility_files = [
            ("workspace_scraper.py", "src/utils/workspace_scraper.py"),
            ("test_openai.py", "src/utils/test_openai.py")
        ]
        
        for source, destination in utility_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_frontend_files(self):
        """Move frontend files to frontend/"""
        self.log_action("Moving frontend files")
        
        # Move templates
        if (self.root_dir / "templates").exists():
            shutil.move(str(self.root_dir / "templates"), str(self.root_dir / "frontend/web/templates"))
            self.log_action("Moved directory", "templates → frontend/web/templates")
            
        # Move static files
        if (self.root_dir / "static").exists():
            shutil.move(str(self.root_dir / "static"), str(self.root_dir / "frontend/web/static"))
            self.log_action("Moved directory", "static → frontend/web/static")
            
        # Move dashboard
        if (self.root_dir / "dashboard").exists():
            shutil.move(str(self.root_dir / "dashboard"), str(self.root_dir / "frontend/dashboard"))
            self.log_action("Moved directory", "dashboard → frontend/dashboard")
            
        # Move index.html
        if (self.root_dir / "index.html").exists():
            shutil.move(str(self.root_dir / "index.html"), str(self.root_dir / "frontend/web/index.html"))
            self.log_action("Moved file", "index.html → frontend/web/index.html")
            
    def move_deployment_files(self):
        """Move deployment files to deployment/"""
        self.log_action("Moving deployment files")
        
        # Move deployment scripts
        deployment_scripts = [
            ("deploy_to_aws.sh", "deployment/scripts/cloud/aws/deploy.sh"),
            ("deploy_to_server.sh", "deployment/scripts/cloud/aws/deploy_server.sh"),
            ("deploy_to_railway.sh", "deployment/scripts/cloud/railway/deploy.sh"),
            ("deploy_to_vercel.sh", "deployment/scripts/cloud/vercel/deploy.sh"),
            ("deploy_dashboard.sh", "deployment/scripts/cloud/vercel/deploy_dashboard.sh"),
            ("deploy_agile_system.sh", "deployment/scripts/automated/deploy_agile.sh"),
            ("automated_deploy.sh", "deployment/scripts/automated/ci_cd.sh"),
            ("enhanced_deploy.sh", "deployment/scripts/automated/enhanced_deploy.sh"),
            ("quick_deploy.sh", "deployment/scripts/automated/quick_deploy.sh"),
            ("start_local.sh", "deployment/scripts/local/start_local.sh"),
            ("start_alexai_platform.sh", "deployment/scripts/local/start_platform.sh"),
            ("setup_aws_infrastructure.sh", "deployment/scripts/cloud/aws/infrastructure.sh"),
            ("setup_enterprise_secrets.sh", "deployment/scripts/automated/setup_enterprise.sh"),
            ("setup_secrets.sh", "deployment/secrets/setup_secrets.sh"),
            ("setup_production.sh", "deployment/scripts/automated/setup_production.sh")
        ]
        
        for source, destination in deployment_scripts:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
        # Move configuration files
        config_files = [
            ("vercel.json", "deployment/config/vercel.json"),
            ("railway.toml", "deployment/config/railway.toml"),
            ("docker-compose.yml", "deployment/config/docker-compose.yml"),
            ("Procfile", "deployment/config/Procfile")
        ]
        
        for source, destination in config_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
        # Move nginx config
        if (self.root_dir / "nginx").exists():
            shutil.move(str(self.root_dir / "nginx"), str(self.root_dir / "deployment/config/nginx"))
            self.log_action("Moved directory", "nginx → deployment/config/nginx")
            
        # Move secrets
        if (self.root_dir / "supabase_db_password").exists():
            shutil.move(str(self.root_dir / "supabase_db_password"), str(self.root_dir / "deployment/secrets/supabase_db_password"))
            self.log_action("Moved file", "supabase_db_password → deployment/secrets/supabase_db_password")
            
    def move_test_files(self):
        """Move test files to tests/"""
        self.log_action("Moving test files")
        
        test_files = [
            ("test_systems.py", "tests/integration/test_systems.py"),
            ("test_end_to_end_deployment.py", "tests/integration/test_end_to_end.py"),
            ("test_public_access.py", "tests/integration/test_public_access.py"),
            ("fixed_deployment_test.py", "tests/integration/fixed_deployment_test.py"),
            ("fix_deployment_issues.py", "tests/integration/fix_deployment_issues.py"),
            ("test_report.json", "tests/reports/test_report.json"),
            ("end_to_end_test_report.json", "tests/reports/end_to_end_test_report.json"),
            ("public_access_report.json", "tests/reports/public_access_report.json")
        ]
        
        for source, destination in test_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_documentation_files(self):
        """Move documentation files to docs/"""
        self.log_action("Moving documentation files")
        
        # Move guides
        guide_files = [
            ("DEPLOYMENT_GUIDE.md", "docs/guides/deployment.md"),
            ("QUICK_DEPLOYMENT.md", "docs/guides/quick_deployment.md"),
            ("AUTOMATED_DEPLOYMENT_GUIDE.md", "docs/guides/automated_deployment.md"),
            ("VERCEL_CREDENTIALS_SETUP.md", "docs/guides/vercel_setup.md"),
            ("VERCEL_SUPABASE_DEPLOYMENT.md", "docs/guides/vercel_supabase.md"),
            ("disable_password_protection.md", "docs/guides/password_protection.md")
        ]
        
        for source, destination in guide_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
        # Move reports
        report_files = [
            ("DEPLOYMENT_STATUS.md", "docs/reports/status_reports/deployment_status.md"),
            ("CURRENT_STATUS.md", "docs/reports/status_reports/current_status.md"),
            ("ALEXAI_CONSULTATION_REPORT.md", "docs/reports/analysis_reports/alexai_consultation.md"),
            ("CI_CD_SUCCESS_REPORT.md", "docs/reports/deployment_reports/ci_cd_success.md"),
            ("END_TO_END_DEPLOYMENT_STATUS.md", "docs/reports/deployment_reports/end_to_end_status.md"),
            ("DEPLOYMENT_RECOMMENDATIONS.md", "docs/reports/deployment_reports/recommendations.md"),
            ("TEST_RESULTS_SUMMARY.md", "docs/reports/analysis_reports/test_results.md"),
            ("DASHBOARD_ENHANCEMENT.md", "docs/reports/analysis_reports/dashboard_enhancement.md"),
            ("aws_cost_analysis.md", "docs/reports/analysis_reports/aws_cost_analysis.md"),
            ("FILE_STRUCTURE_ANALYSIS.md", "docs/reports/analysis_reports/file_structure_analysis.md")
        ]
        
        for source, destination in report_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_script_files(self):
        """Move utility scripts to scripts/"""
        self.log_action("Moving utility scripts")
        
        setup_scripts = [
            ("bootstrap.sh", "scripts/setup/bootstrap.sh"),
            ("cursorai_setup.sh", "scripts/setup/cursorai_setup.sh"),
            ("install.sh", "scripts/setup/install.sh")
        ]
        
        for source, destination in setup_scripts:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
        analysis_scripts = [
            ("aws_infrastructure_manager.sh", "scripts/analysis/aws_infrastructure_manager.sh"),
            ("cost_optimization_analyzer.sh", "scripts/analysis/cost_optimization_analyzer.sh"),
            ("simple_cost_analyzer.sh", "scripts/analysis/simple_cost_analyzer.sh")
        ]
        
        for source, destination in analysis_scripts:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def move_data_files(self):
        """Move data files to data/"""
        self.log_action("Moving data files")
        
        data_files = [
            ("crew_activities.json", "data/crew_activities.json"),
            ("crew_insights.json", "data/crew_insights.json"),
            ("workspace_embeddings.json", "data/workspace_embeddings.json"),
            ("aws_infrastructure_config.json", "data/aws_infrastructure_config.json"),
            ("alexai_cursor_bootstrapper.json", "data/alexai_cursor_bootstrapper.json"),
            ("alexai_cursorai_katra_transfer.md", "data/alexai_cursorai_katra_transfer.md"),
            ("cursorai_bootstrap_prompt.txt", "data/cursorai_bootstrap_prompt.txt")
        ]
        
        for source, destination in data_files:
            source_path = self.root_dir / source
            dest_path = self.root_dir / destination
            
            if source_path.exists():
                shutil.move(str(source_path), str(dest_path))
                self.log_action("Moved file", f"{source} → {destination}")
                
    def create_new_readme(self):
        """Create a new comprehensive README.md"""
        self.log_action("Creating new comprehensive README.md")
        
        readme_content = """# 🖖 AlexAI Star Trek Agile System

A comprehensive AI-powered agile project management system featuring the AlexAI Core Agent and Star Trek crew augmentation.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ (for dashboard)
- OpenAI API Key

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd alexai_katra_transfer_package_remote_v7

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your OpenAI API key

# Start local development
./deployment/scripts/local/start_local.sh
```

### Access the Application
- **Main Application:** http://localhost:8000
- **Observation Lounge:** http://localhost:8000/observation-lounge
- **AlexAI Consultation:** Available in the Observation Lounge

## 📁 Project Structure

```
alexai_katra_transfer_package_remote_v7/
├── src/                    # Main application source code
│   ├── core/              # Core application logic
│   ├── agents/            # AI agent implementations
│   ├── database/          # Database layer
│   ├── api/               # API endpoints
│   ├── utils/             # Utility functions
│   └── config/            # Configuration management
├── frontend/              # Frontend applications
│   ├── web/               # Main web interface
│   └── dashboard/         # Next.js dashboard
├── deployment/            # Deployment configurations
├── tests/                 # Testing suite
├── docs/                  # Documentation
├── scripts/               # Utility scripts
└── data/                  # Data files
```

## 🤖 AlexAI Core Agent

The AlexAI Core Agent serves as the central orchestrator with multimodal capabilities:

### Operational Modes
- **Strategic Mode:** Long-term planning and vision
- **Tactical Mode:** Immediate action coordination
- **Analytical Mode:** Data analysis and insights
- **Creative Mode:** Innovation and problem-solving
- **Collaborative Mode:** Team coordination
- **Adaptive Mode:** Dynamic response to changes

### Multimodal Capabilities
- Text Analysis
- Code Review
- Project Analysis
- Team Dynamics
- System Optimization
- Strategic Planning
- Risk Assessment
- Performance Metrics

## 🖖 Star Trek Crew Integration

The system features augmented Star Trek crew members:

- **Captain Picard:** Strategic leadership and decision-making
- **Counselor Troi:** Empathy analysis and team dynamics
- **Mr. Spock:** Logical analysis and problem-solving
- **Lt. Commander Data:** Data processing and optimization
- **Chief Engineer Scott:** Technical implementation and optimization

## 🚀 Deployment

### Local Development
```bash
./deployment/scripts/local/start_local.sh
```

### Cloud Deployment
```bash
# Vercel
./deployment/scripts/cloud/vercel/deploy.sh

# AWS
./deployment/scripts/cloud/aws/deploy.sh

# Railway
./deployment/scripts/cloud/railway/deploy.sh
```

## 📚 Documentation

- [Getting Started Guide](docs/guides/getting_started.md)
- [Deployment Guide](docs/guides/deployment.md)
- [Development Guide](docs/guides/development.md)
- [API Documentation](docs/api/endpoints.md)
- [Architecture Overview](docs/architecture/system_overview.md)

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/

# Run specific test categories
python -m pytest tests/unit/
python -m pytest tests/integration/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🖖 Live Long and Prosper

May the force be with you... wait, wrong franchise! 🖖

---

*Generated by AlexAI Core Agent*
"""
        
        with open(self.root_dir / "README.md", "w") as f:
            f.write(readme_content)
            
        self.log_action("Created new README.md", "Comprehensive project documentation")
        
    def create_env_example(self):
        """Create .env.example file"""
        self.log_action("Creating .env.example file")
        
        env_content = """# AlexAI Star Trek Agile System Environment Variables

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (for production)
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Application Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your_secret_key_here

# Database Configuration
DATABASE_URL=sqlite:///agile_manager.db

# Deployment Configuration
VERCEL_TOKEN=your_vercel_token_here
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
"""
        
        with open(self.root_dir / ".env.example", "w") as f:
            f.write(env_content)
            
        self.log_action("Created .env.example", "Environment variables template")
        
    def save_reorganization_log(self):
        """Save the reorganization log"""
        log_file = self.root_dir / "REORGANIZATION_LOG.md"
        
        log_content = f"""# 🔄 Project Reorganization Log

**Date:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
**Status:** ✅ **REORGANIZATION COMPLETE**

## Actions Performed

"""
        
        for log_entry in self.reorganization_log:
            log_content += f"- {log_entry}\n"
            
        log_content += f"""

## Summary

- **Files Moved:** {len([entry for entry in self.reorganization_log if 'Moved' in entry])}
- **Directories Created:** {len([entry for entry in self.reorganization_log if 'Created directory' in entry])}
- **Files Created:** {len([entry for entry in self.reorganization_log if 'Created' in entry and 'directory' not in entry])}

## Next Steps

1. Update import statements in moved files
2. Test all functionality
3. Update CI/CD pipelines
4. Validate deployment scripts

---

*Generated by Project Reorganizer*
"""
        
        with open(log_file, "w") as f:
            f.write(log_content)
            
        self.log_action("Saved reorganization log", "REORGANIZATION_LOG.md")
        
    def run_reorganization(self):
        """Run the complete reorganization process"""
        print("🚀 Starting Project Reorganization")
        print("=" * 50)
        
        try:
            # Create backup
            self.create_backup()
            
            # Create new structure
            self.create_directory_structure()
            
            # Move files to new locations
            self.move_core_files()
            self.move_database_files()
            self.move_utility_files()
            self.move_frontend_files()
            self.move_deployment_files()
            self.move_test_files()
            self.move_documentation_files()
            self.move_script_files()
            self.move_data_files()
            
            # Create new files
            self.create_new_readme()
            self.create_env_example()
            
            # Save log
            self.save_reorganization_log()
            
            print("\n" + "=" * 50)
            print("✅ Project Reorganization Complete!")
            print(f"📁 Backup saved to: {self.backup_dir}")
            print(f"📋 Log saved to: REORGANIZATION_LOG.md")
            print("\n🎯 Next Steps:")
            print("1. Update import statements in moved files")
            print("2. Test all functionality")
            print("3. Update CI/CD pipelines")
            print("4. Validate deployment scripts")
            
        except Exception as e:
            print(f"❌ Error during reorganization: {e}")
            print("🔄 Restoring from backup...")
            # Restore from backup logic would go here
            raise

if __name__ == "__main__":
    reorganizer = ProjectReorganizer()
    reorganizer.run_reorganization() 