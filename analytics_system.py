"""
Custom Analytics and Reporting System for AlexAI Enterprise Platform
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MetricType(Enum):
    """Types of metrics that can be tracked"""
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"

class ReportType(Enum):
    """Types of reports that can be generated"""
    PROJECT_PROGRESS = "project_progress"
    TEAM_PERFORMANCE = "team_performance"
    SYSTEM_HEALTH = "system_health"
    USER_ACTIVITY = "user_activity"
    COST_ANALYSIS = "cost_analysis"
    SECURITY_AUDIT = "security_audit"

@dataclass
class Metric:
    """Metric data structure"""
    id: str
    name: str
    value: float
    type: MetricType
    tags: Dict[str, str]
    timestamp: datetime
    description: str = ""

@dataclass
class Report:
    """Report data structure"""
    id: str
    name: str
    type: ReportType
    data: Dict[str, Any]
    generated_at: datetime
    period_start: datetime
    period_end: datetime
    created_by: str
    format: str = "json"  # json, csv, pdf

class AnalyticsManager:
    """Analytics manager for collecting and analyzing data"""
    
    def __init__(self, db_path: str = "analytics.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the analytics database"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS metrics (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    value REAL NOT NULL,
                    type TEXT NOT NULL,
                    tags TEXT,
                    timestamp TEXT NOT NULL,
                    description TEXT
                )
            """)
            
            conn.execute("""
                CREATE TABLE IF NOT EXISTS reports (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    data TEXT NOT NULL,
                    generated_at TEXT NOT NULL,
                    period_start TEXT NOT NULL,
                    period_end TEXT NOT NULL,
                    created_by TEXT NOT NULL,
                    format TEXT DEFAULT 'json'
                )
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_metrics_timestamp 
                ON metrics(timestamp)
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_metrics_name 
                ON metrics(name)
            """)
            
            logger.info("Analytics database initialized")
    
    def record_metric(self, name: str, value: float, metric_type: MetricType, 
                     tags: Dict[str, str] = None, description: str = "") -> str:
        """Record a new metric"""
        metric_id = str(uuid.uuid4())
        metric = Metric(
            id=metric_id,
            name=name,
            value=value,
            type=metric_type,
            tags=tags or {},
            timestamp=datetime.utcnow(),
            description=description
        )
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT INTO metrics (id, name, value, type, tags, timestamp, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                metric.id,
                metric.name,
                metric.value,
                metric.type.value,
                json.dumps(metric.tags),
                metric.timestamp.isoformat(),
                metric.description
            ))
        
        logger.info(f"Recorded metric: {name} = {value}")
        return metric_id
    
    def get_metrics(self, name: str = None, start_time: datetime = None, 
                   end_time: datetime = None, tags: Dict[str, str] = None) -> List[Metric]:
        """Get metrics with optional filtering"""
        query = "SELECT * FROM metrics WHERE 1=1"
        params = []
        
        if name:
            query += " AND name = ?"
            params.append(name)
        
        if start_time:
            query += " AND timestamp >= ?"
            params.append(start_time.isoformat())
        
        if end_time:
            query += " AND timestamp <= ?"
            params.append(end_time.isoformat())
        
        if tags:
            for key, value in tags.items():
                query += f" AND tags LIKE ?"
                params.append(f'%"{key}":"{value}"%')
        
        query += " ORDER BY timestamp DESC"
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query, params)
            metrics = []
            for row in cursor.fetchall():
                metric = Metric(
                    id=row[0],
                    name=row[1],
                    value=row[2],
                    type=MetricType(row[3]),
                    tags=json.loads(row[4]) if row[4] else {},
                    timestamp=datetime.fromisoformat(row[5]),
                    description=row[6] or ""
                )
                metrics.append(metric)
        
        return metrics
    
    def aggregate_metrics(self, name: str, aggregation: str, 
                         start_time: datetime = None, end_time: datetime = None) -> float:
        """Aggregate metrics using various functions"""
        query = f"SELECT {aggregation}(value) FROM metrics WHERE name = ?"
        params = [name]
        
        if start_time:
            query += " AND timestamp >= ?"
            params.append(start_time.isoformat())
        
        if end_time:
            query += " AND timestamp <= ?"
            params.append(end_time.isoformat())
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query, params)
            result = cursor.fetchone()
            return result[0] if result[0] is not None else 0.0
    
    def generate_report(self, report_type: ReportType, period_start: datetime, 
                       period_end: datetime, created_by: str, **kwargs) -> Report:
        """Generate a report based on type and time period"""
        report_id = str(uuid.uuid4())
        
        if report_type == ReportType.PROJECT_PROGRESS:
            data = self._generate_project_progress_report(period_start, period_end)
        elif report_type == ReportType.TEAM_PERFORMANCE:
            data = self._generate_team_performance_report(period_start, period_end)
        elif report_type == ReportType.SYSTEM_HEALTH:
            data = self._generate_system_health_report(period_start, period_end)
        elif report_type == ReportType.USER_ACTIVITY:
            data = self._generate_user_activity_report(period_start, period_end)
        elif report_type == ReportType.COST_ANALYSIS:
            data = self._generate_cost_analysis_report(period_start, period_end)
        elif report_type == ReportType.SECURITY_AUDIT:
            data = self._generate_security_audit_report(period_start, period_end)
        else:
            data = {"error": "Unknown report type"}
        
        report = Report(
            id=report_id,
            name=f"{report_type.value.replace('_', ' ').title()} Report",
            type=report_type,
            data=data,
            generated_at=datetime.utcnow(),
            period_start=period_start,
            period_end=period_end,
            created_by=created_by
        )
        
        # Store report in database
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT INTO reports (id, name, type, data, generated_at, period_start, period_end, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                report.id,
                report.name,
                report.type.value,
                json.dumps(report.data),
                report.generated_at.isoformat(),
                report.period_start.isoformat(),
                report.period_end.isoformat(),
                report.created_by
            ))
        
        logger.info(f"Generated {report_type.value} report: {report_id}")
        return report
    
    def _generate_project_progress_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate project progress report"""
        # Mock data for demonstration
        return {
            "summary": {
                "total_projects": 12,
                "active_projects": 8,
                "completed_projects": 3,
                "overdue_projects": 1
            },
            "progress_by_domain": {
                "agile": {"total": 4, "completed": 2, "progress": 75.0},
                "software": {"total": 5, "completed": 1, "progress": 60.0},
                "business": {"total": 2, "completed": 0, "progress": 35.0},
                "startup": {"total": 1, "completed": 0, "progress": 45.0}
            },
            "top_performers": [
                {"name": "Enterprise Dashboard", "progress": 85, "team": "Picard, Data"},
                {"name": "Agile Workflow System", "progress": 92, "team": "Troi, Worf"},
                {"name": "AWS Infrastructure", "progress": 100, "team": "La Forge, Scott"}
            ],
            "needs_attention": [
                {"name": "Market Analysis Engine", "progress": 45, "issues": ["Resource constraints", "Scope creep"]},
                {"name": "Business Strategy Platform", "progress": 35, "issues": ["Requirement changes"]}
            ]
        }
    
    def _generate_team_performance_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate team performance report"""
        return {
            "team_metrics": {
                "total_members": 8,
                "active_members": 7,
                "average_productivity": 87.5,
                "total_tasks_completed": 156
            },
            "individual_performance": [
                {"name": "Captain Picard", "role": "Strategic Commander", "productivity": 95, "tasks_completed": 23},
                {"name": "Commander Data", "role": "Technical Operations", "productivity": 99, "tasks_completed": 45},
                {"name": "Counselor Troi", "role": "User Experience", "productivity": 88, "tasks_completed": 18},
                {"name": "Lieutenant La Forge", "role": "Infrastructure", "productivity": 92, "tasks_completed": 32},
                {"name": "Lieutenant Worf", "role": "Security", "productivity": 85, "tasks_completed": 28},
                {"name": "Ensign Crusher", "role": "Development", "productivity": 78, "tasks_completed": 15}
            ],
            "team_collaboration": {
                "cross_team_projects": 6,
                "average_response_time": "2.3 hours",
                "meeting_efficiency": 82.0
            }
        }
    
    def _generate_system_health_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate system health report"""
        return {
            "overall_health": "Excellent",
            "uptime": 99.9,
            "performance_metrics": {
                "average_response_time": 120,
                "throughput": 95.2,
                "error_rate": 0.1,
                "cpu_usage": 45.0,
                "memory_usage": 62.0,
                "disk_usage": 38.0
            },
            "service_status": {
                "dashboard": "Online",
                "agile": "Online", 
                "software": "Online",
                "business": "Online",
                "startup": "Online",
                "n8n": "Online"
            },
            "alerts": [
                {"level": "Warning", "message": "High memory usage on startup service", "timestamp": "2024-01-15T14:30:00Z"},
                {"level": "Info", "message": "Scheduled maintenance completed", "timestamp": "2024-01-15T12:00:00Z"}
            ]
        }
    
    def _generate_user_activity_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate user activity report"""
        return {
            "activity_summary": {
                "total_sessions": 245,
                "unique_users": 18,
                "average_session_duration": "45 minutes",
                "peak_usage_hours": ["09:00-11:00", "14:00-16:00"]
            },
            "user_engagement": [
                {"username": "admin", "sessions": 45, "total_time": "33.5 hours", "last_active": "2024-01-15T16:30:00Z"},
                {"username": "picard", "sessions": 32, "total_time": "24.0 hours", "last_active": "2024-01-15T15:45:00Z"},
                {"username": "data", "sessions": 28, "total_time": "21.0 hours", "last_active": "2024-01-15T16:15:00Z"},
                {"username": "troi", "sessions": 25, "total_time": "18.5 hours", "last_active": "2024-01-15T14:20:00Z"}
            ],
            "feature_usage": {
                "dashboard": 180,
                "project_management": 156,
                "analytics": 89,
                "reports": 67,
                "settings": 23
            }
        }
    
    def _generate_cost_analysis_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate cost analysis report"""
        return {
            "cost_summary": {
                "total_cost": 2840.50,
                "budget": 3000.00,
                "remaining_budget": 159.50,
                "cost_trend": "Stable"
            },
            "cost_breakdown": {
                "aws_infrastructure": 1250.00,
                "vercel_hosting": 45.00,
                "supabase_database": 25.00,
                "openai_api": 1520.50
            },
            "cost_optimization": {
                "potential_savings": 320.00,
                "recommendations": [
                    "Consolidate EC2 instances",
                    "Implement auto-scaling",
                    "Optimize API usage patterns"
                ]
            },
            "project_cost_allocation": {
                "Enterprise Dashboard": 450.00,
                "Agile Workflow System": 380.00,
                "AWS Infrastructure": 1250.00,
                "Security System": 760.50
            }
        }
    
    def _generate_security_audit_report(self, start_time: datetime, end_time: datetime) -> Dict:
        """Generate security audit report"""
        return {
            "security_summary": {
                "overall_security_score": 92,
                "total_incidents": 0,
                "failed_login_attempts": 12,
                "suspicious_activities": 2
            },
            "access_control": {
                "active_users": 18,
                "admin_users": 2,
                "locked_accounts": 0,
                "expired_sessions": 5
            },
            "security_events": [
                {"timestamp": "2024-01-15T16:30:00Z", "event": "Successful login", "user": "admin", "ip": "192.168.1.100"},
                {"timestamp": "2024-01-15T15:45:00Z", "event": "Failed login attempt", "user": "unknown", "ip": "203.0.113.45"},
                {"timestamp": "2024-01-15T14:20:00Z", "event": "Session timeout", "user": "troi", "ip": "192.168.1.105"}
            ],
            "compliance": {
                "data_encryption": "Enabled",
                "access_logging": "Enabled",
                "backup_schedule": "Daily",
                "vulnerability_scan": "Last scan: 2024-01-14"
            }
        }
    
    def get_reports(self, report_type: ReportType = None, 
                   start_time: datetime = None, end_time: datetime = None) -> List[Report]:
        """Get stored reports with optional filtering"""
        query = "SELECT * FROM reports WHERE 1=1"
        params = []
        
        if report_type:
            query += " AND type = ?"
            params.append(report_type.value)
        
        if start_time:
            query += " AND generated_at >= ?"
            params.append(start_time.isoformat())
        
        if end_time:
            query += " AND generated_at <= ?"
            params.append(end_time.isoformat())
        
        query += " ORDER BY generated_at DESC"
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query, params)
            reports = []
            for row in cursor.fetchall():
                report = Report(
                    id=row[0],
                    name=row[1],
                    type=ReportType(row[2]),
                    data=json.loads(row[3]),
                    generated_at=datetime.fromisoformat(row[4]),
                    period_start=datetime.fromisoformat(row[5]),
                    period_end=datetime.fromisoformat(row[6]),
                    created_by=row[7],
                    format=row[8] if len(row) > 8 else "json"
                )
                reports.append(report)
        
        return reports
    
    def export_report(self, report: Report, format: str = "json") -> str:
        """Export report in specified format"""
        if format == "json":
            return json.dumps(asdict(report), indent=2, default=str)
        elif format == "csv":
            # Convert report data to CSV format
            csv_lines = []
            csv_lines.append("Metric,Value")
            for key, value in report.data.items():
                if isinstance(value, dict):
                    for sub_key, sub_value in value.items():
                        csv_lines.append(f"{key}.{sub_key},{sub_value}")
                else:
                    csv_lines.append(f"{key},{value}")
            return "\n".join(csv_lines)
        else:
            return f"Unsupported format: {format}"

# Global analytics manager instance
analytics_manager = AnalyticsManager()

def record_project_metric(project_id: str, metric_name: str, value: float, 
                         tags: Dict[str, str] = None) -> str:
    """Record a project-related metric"""
    if tags is None:
        tags = {}
    tags["project_id"] = project_id
    return analytics_manager.record_metric(
        name=f"project.{metric_name}",
        value=value,
        metric_type=MetricType.GAUGE,
        tags=tags,
        description=f"Project metric: {metric_name}"
    )

def record_system_metric(metric_name: str, value: float, 
                        tags: Dict[str, str] = None) -> str:
    """Record a system-related metric"""
    if tags is None:
        tags = {}
    tags["component"] = "system"
    return analytics_manager.record_metric(
        name=f"system.{metric_name}",
        value=value,
        metric_type=MetricType.GAUGE,
        tags=tags,
        description=f"System metric: {metric_name}"
    )

def record_user_activity(user_id: str, action: str, 
                        tags: Dict[str, str] = None) -> str:
    """Record user activity"""
    if tags is None:
        tags = {}
    tags["user_id"] = user_id
    tags["action"] = action
    return analytics_manager.record_metric(
        name="user.activity",
        value=1.0,
        metric_type=MetricType.COUNTER,
        tags=tags,
        description=f"User activity: {action}"
    )

if __name__ == "__main__":
    # Example usage
    print("📊 AlexAI Analytics System Initialized")
    
    # Record some sample metrics
    record_project_metric("proj-001", "progress", 85.0, {"domain": "software"})
    record_project_metric("proj-002", "progress", 92.0, {"domain": "agile"})
    record_system_metric("response_time", 120.0, {"service": "dashboard"})
    record_system_metric("cpu_usage", 45.0, {"instance": "web-1"})
    record_user_activity("admin", "login", {"ip": "192.168.1.100"})
    
    # Generate a report
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=7)
    
    report = analytics_manager.generate_report(
        ReportType.PROJECT_PROGRESS,
        start_time,
        end_time,
        "admin"
    )
    
    print(f"✅ Generated report: {report.name}")
    print(f"Report ID: {report.id}")
    print(f"Data: {json.dumps(report.data, indent=2)}")
    
    # Export report
    json_export = analytics_manager.export_report(report, "json")
    print(f"JSON Export: {json_export[:200]}...") 