"""
Tests for the root API endpoints of yoohoo.guru MCP Server.
"""

from datetime import datetime
from typing import Dict, Any

import pytest
from fastapi.testclient import TestClient


class TestRootEndpoint:
    """Test cases for the root API endpoint."""
    
    def test_root_endpoint_success(self, client: TestClient) -> None:
        """
        Test that the root endpoint returns a successful response.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["message"] == "yoohoo.guru MCP Server is running"
        assert data["version"] == "1.0.0"
        assert "timestamp" in data
        
        # Validate timestamp format
        timestamp_str = data["timestamp"]
        datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
    
    def test_root_endpoint_response_structure(self, client: TestClient) -> None:
        """
        Test that the root endpoint response has the correct structure.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/")
        
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ["status", "message", "timestamp", "version"]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        assert isinstance(data["status"], str)
        assert isinstance(data["message"], str)
        assert isinstance(data["timestamp"], str)
        assert isinstance(data["version"], str)


class TestHealthEndpoint:
    """Test cases for the health check endpoint."""
    
    def test_health_endpoint_success(self, client: TestClient) -> None:
        """
        Test that the health endpoint returns a successful response.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/health")
        
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["message"] == "Service is operational"
        assert data["version"] == "1.0.0"
        assert "timestamp" in data
    
    def test_health_endpoint_response_structure(self, client: TestClient) -> None:
        """
        Test that the health endpoint response has the correct structure.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/health")
        
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ["status", "message", "timestamp", "version"]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"


class TestAPIDocumentation:
    """Test cases for API documentation endpoints."""
    
    def test_docs_endpoint_accessible(self, client: TestClient) -> None:
        """
        Test that the OpenAPI docs endpoint is accessible.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_redoc_endpoint_accessible(self, client: TestClient) -> None:
        """
        Test that the ReDoc docs endpoint is accessible.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_openapi_json_accessible(self, client: TestClient) -> None:
        """
        Test that the OpenAPI JSON schema is accessible.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/openapi.json")
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"
        
        schema = response.json()
        assert "openapi" in schema
        assert "info" in schema
        assert schema["info"]["title"] == "yoohoo.guru MCP Server"