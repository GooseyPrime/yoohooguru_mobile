"""
Test configuration and fixtures for yoohoo.guru MCP Server tests.
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client() -> TestClient:
    """
    Create a test client for the FastAPI application.
    
    Returns:
        TestClient: FastAPI test client instance
    """
    return TestClient(app)