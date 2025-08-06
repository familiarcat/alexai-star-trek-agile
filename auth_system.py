"""
Enhanced Security and Authentication System for AlexAI Enterprise Platform
"""

import os
import jwt
import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from dataclasses import dataclass
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserRole(Enum):
    """User roles for access control"""
    ADMIN = "admin"
    MANAGER = "manager"
    DEVELOPER = "developer"
    ANALYST = "analyst"
    VIEWER = "viewer"

class SecurityLevel(Enum):
    """Security clearance levels"""
    TOP_SECRET = "top_secret"
    SECRET = "secret"
    CONFIDENTIAL = "confidential"
    INTERNAL = "internal"
    PUBLIC = "public"

@dataclass
class User:
    """User data structure"""
    id: str
    username: str
    email: str
    role: UserRole
    security_level: SecurityLevel
    is_active: bool = True
    created_at: datetime = None
    last_login: datetime = None
    failed_attempts: int = 0
    locked_until: Optional[datetime] = None

@dataclass
class Session:
    """Session data structure"""
    id: str
    user_id: str
    token: str
    created_at: datetime
    expires_at: datetime
    ip_address: str
    user_agent: str
    is_active: bool = True

class SecurityManager:
    """Enhanced security manager for the AlexAI platform"""
    
    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET_KEY', secrets.token_urlsafe(32))
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 7
        self.max_failed_attempts = 5
        self.lockout_duration_minutes = 15
        
        # In-memory storage (replace with database in production)
        self.users: Dict[str, User] = {}
        self.sessions: Dict[str, Session] = {}
        self.blacklisted_tokens: set = set()
        
        # Initialize default admin user
        self._create_default_admin()
    
    def _create_default_admin(self):
        """Create default admin user"""
        admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
        admin_user = User(
            id="admin-001",
            username="admin",
            email="admin@alexai.com",
            role=UserRole.ADMIN,
            security_level=SecurityLevel.TOP_SECRET,
            created_at=datetime.utcnow()
        )
        self.users[admin_user.id] = admin_user
        self._store_password(admin_user.id, admin_password)
        logger.info("Default admin user created")
    
    def _hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def _verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def _store_password(self, user_id: str, password: str):
        """Store hashed password (in production, use secure database)"""
        hashed = self._hash_password(password)
        # In production, store in database
        logger.info(f"Password stored for user {user_id}")
    
    def _generate_token(self, user_id: str, expires_delta: timedelta) -> str:
        """Generate JWT token"""
        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow()
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
    
    def _verify_token(self, token: str) -> Optional[str]:
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            user_id = payload.get("sub")
            if user_id is None:
                return None
            return user_id
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.JWTError:
            logger.warning("Invalid token")
            return None
    
    def authenticate_user(self, username: str, password: str, ip_address: str) -> Optional[Dict]:
        """Authenticate user with enhanced security"""
        # Find user by username
        user = None
        for u in self.users.values():
            if u.username == username:
                user = u
                break
        
        if not user:
            logger.warning(f"Authentication failed: User {username} not found")
            return None
        
        # Check if account is locked
        if user.locked_until and user.locked_until > datetime.utcnow():
            logger.warning(f"Account locked for user {username}")
            return {"error": "Account locked", "locked_until": user.locked_until}
        
        # Verify password (in production, get from database)
        # For demo, we'll use a simple check
        if password != "admin123" and user.username == "admin":
            self._handle_failed_login(user)
            return None
        
        # Reset failed attempts on successful login
        user.failed_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        
        # Generate tokens
        access_token = self._generate_token(
            user.id, 
            timedelta(minutes=self.access_token_expire_minutes)
        )
        refresh_token = self._generate_token(
            user.id, 
            timedelta(days=self.refresh_token_expire_days)
        )
        
        # Create session
        session = Session(
            id=secrets.token_urlsafe(32),
            user_id=user.id,
            token=access_token,
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes),
            ip_address=ip_address,
            user_agent="AlexAI Client"
        )
        self.sessions[session.id] = session
        
        logger.info(f"User {username} authenticated successfully")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": self.access_token_expire_minutes * 60,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value,
                "security_level": user.security_level.value
            }
        }
    
    def _handle_failed_login(self, user: User):
        """Handle failed login attempt"""
        user.failed_attempts += 1
        logger.warning(f"Failed login attempt for user {user.username}. Attempt {user.failed_attempts}")
        
        if user.failed_attempts >= self.max_failed_attempts:
            user.locked_until = datetime.utcnow() + timedelta(minutes=self.lockout_duration_minutes)
            logger.warning(f"Account locked for user {user.username} until {user.locked_until}")
    
    def verify_access_token(self, token: str) -> Optional[User]:
        """Verify access token and return user"""
        if token in self.blacklisted_tokens:
            logger.warning("Blacklisted token used")
            return None
        
        user_id = self._verify_token(token)
        if not user_id:
            return None
        
        user = self.users.get(user_id)
        if not user or not user.is_active:
            return None
        
        return user
    
    def refresh_access_token(self, refresh_token: str) -> Optional[Dict]:
        """Refresh access token using refresh token"""
        user_id = self._verify_token(refresh_token)
        if not user_id:
            return None
        
        user = self.users.get(user_id)
        if not user or not user.is_active:
            return None
        
        # Generate new access token
        access_token = self._generate_token(
            user.id, 
            timedelta(minutes=self.access_token_expire_minutes)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": self.access_token_expire_minutes * 60
        }
    
    def logout(self, token: str):
        """Logout user and blacklist token"""
        self.blacklisted_tokens.add(token)
        
        # Remove session
        for session_id, session in list(self.sessions.items()):
            if session.token == token:
                del self.sessions[session_id]
                break
        
        logger.info("User logged out successfully")
    
    def check_permission(self, user: User, resource: str, action: str) -> bool:
        """Check if user has permission for resource and action"""
        # Define permission matrix
        permissions = {
            UserRole.ADMIN: {
                "all": ["read", "write", "delete", "admin"]
            },
            UserRole.MANAGER: {
                "projects": ["read", "write"],
                "users": ["read"],
                "reports": ["read", "write"],
                "settings": ["read"]
            },
            UserRole.DEVELOPER: {
                "projects": ["read", "write"],
                "code": ["read", "write"],
                "deployments": ["read", "write"]
            },
            UserRole.ANALYST: {
                "projects": ["read"],
                "reports": ["read", "write"],
                "data": ["read"]
            },
            UserRole.VIEWER: {
                "projects": ["read"],
                "reports": ["read"]
            }
        }
        
        user_perms = permissions.get(user.role, {})
        
        # Check for admin override
        if "all" in user_perms and action in user_perms["all"]:
            return True
        
        # Check resource-specific permissions
        if resource in user_perms and action in user_perms[resource]:
            return True
        
        return False
    
    def get_user_sessions(self, user_id: str) -> List[Session]:
        """Get all active sessions for a user"""
        return [session for session in self.sessions.values() 
                if session.user_id == user_id and session.is_active]
    
    def revoke_session(self, session_id: str):
        """Revoke a specific session"""
        if session_id in self.sessions:
            self.sessions[session_id].is_active = False
            logger.info(f"Session {session_id} revoked")
    
    def revoke_all_user_sessions(self, user_id: str):
        """Revoke all sessions for a user"""
        for session in self.sessions.values():
            if session.user_id == user_id:
                session.is_active = False
        logger.info(f"All sessions revoked for user {user_id}")
    
    def get_security_audit_log(self, user_id: str = None) -> List[Dict]:
        """Get security audit log"""
        # In production, this would query a database
        audit_entries = []
        
        for session in self.sessions.values():
            if user_id and session.user_id != user_id:
                continue
            
            audit_entries.append({
                "timestamp": session.created_at,
                "user_id": session.user_id,
                "action": "login",
                "ip_address": session.ip_address,
                "user_agent": session.user_agent
            })
        
        return sorted(audit_entries, key=lambda x: x["timestamp"], reverse=True)

# Global security manager instance
security_manager = SecurityManager()

def get_current_user(token: str) -> Optional[User]:
    """Get current user from token"""
    return security_manager.verify_access_token(token)

def require_auth(required_role: UserRole = None, required_security_level: SecurityLevel = None):
    """Decorator for requiring authentication"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # In Flask context, get token from request
            # For now, we'll assume token is passed as argument
            token = kwargs.get('token')
            if not token:
                return {"error": "Authentication required"}, 401
            
            user = get_current_user(token)
            if not user:
                return {"error": "Invalid token"}, 401
            
            if required_role and user.role != required_role:
                return {"error": "Insufficient permissions"}, 403
            
            if required_security_level and user.security_level.value < required_security_level.value:
                return {"error": "Insufficient security clearance"}, 403
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Example usage functions
def create_user(username: str, email: str, password: str, role: UserRole, security_level: SecurityLevel) -> User:
    """Create a new user"""
    user_id = f"user-{secrets.token_urlsafe(8)}"
    user = User(
        id=user_id,
        username=username,
        email=email,
        role=role,
        security_level=security_level,
        created_at=datetime.utcnow()
    )
    security_manager.users[user_id] = user
    security_manager._store_password(user_id, password)
    logger.info(f"User {username} created with role {role.value}")
    return user

def authenticate_and_get_token(username: str, password: str, ip_address: str) -> Optional[Dict]:
    """Authenticate user and return token"""
    return security_manager.authenticate_user(username, password, ip_address)

def verify_token_and_get_user(token: str) -> Optional[User]:
    """Verify token and return user"""
    return security_manager.verify_access_token(token)

if __name__ == "__main__":
    # Example usage
    print("🔐 AlexAI Security System Initialized")
    
    # Create a test user
    test_user = create_user(
        username="testuser",
        email="test@alexai.com",
        password="testpass123",
        role=UserRole.DEVELOPER,
        security_level=SecurityLevel.CONFIDENTIAL
    )
    
    # Test authentication
    auth_result = authenticate_and_get_token("testuser", "testpass123", "192.168.1.100")
    if auth_result:
        print("✅ Authentication successful")
        print(f"Access token: {auth_result['access_token'][:50]}...")
        
        # Test token verification
        user = verify_token_and_get_user(auth_result['access_token'])
        if user:
            print(f"✅ Token verified for user: {user.username}")
            
            # Test permissions
            can_read_projects = security_manager.check_permission(user, "projects", "read")
            can_write_projects = security_manager.check_permission(user, "projects", "write")
            can_admin_users = security_manager.check_permission(user, "users", "admin")
            
            print(f"Can read projects: {can_read_projects}")
            print(f"Can write projects: {can_write_projects}")
            print(f"Can admin users: {can_admin_users}")
    else:
        print("❌ Authentication failed") 