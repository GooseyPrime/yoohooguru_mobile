"""
Configuration module for yoohoo.guru MCP Server.

This module provides configuration management for the MCP server,
designed for easy extension with environment-specific settings.
"""

import os
from typing import Optional


class Settings:
    """
    Configuration settings for the MCP server.
    
    This class centralizes configuration management and provides
    a foundation for environment-specific configurations.
    """
    
    def __init__(self) -> None:
        """Initialize settings from environment variables."""
        self.app_name: str = "yoohoo.guru MCP Server"
        self.version: str = "1.0.0"
        self.host: str = os.getenv("HOST", "0.0.0.0")
        self.port: int = int(os.getenv("PORT", "8000"))
        self.log_level: str = os.getenv("LOG_LEVEL", "info")
        self.environment: str = os.getenv("ENVIRONMENT", "development")
        
        # Database settings (for future use)
        self.database_url: Optional[str] = os.getenv("DATABASE_URL")
        
        # Redis settings (for future use)
        self.redis_url: Optional[str] = os.getenv("REDIS_URL")
        
        # Security settings (for future use)
        self.secret_key: Optional[str] = os.getenv("SECRET_KEY")
        self.jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes: int = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )


# Global settings instance
settings = Settings()