#!/usr/bin/env python3
"""
MCP Server Status Verification Script

This script verifies that the yoohoo.guru MCP server is active and responding correctly.
Run this script to confirm the server status and validate all endpoints.
"""

import json
import sys
from datetime import datetime
from typing import Dict, Any

import httpx


def colored_output(text: str, color: str) -> str:
    """Add color to console output."""
    colors = {
        'green': '\033[92m',
        'red': '\033[91m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'end': '\033[0m'
    }
    return f"{colors.get(color, '')}{text}{colors['end']}"


def test_endpoint(client: httpx.Client, url: str, endpoint: str) -> Dict[str, Any]:
    """Test a specific endpoint and return results."""
    try:
        response = client.get(f"{url}{endpoint}")
        return {
            'endpoint': endpoint,
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'response_time': response.elapsed.total_seconds(),
            'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else None,
            'content_type': response.headers.get('content-type', 'unknown')
        }
    except Exception as e:
        return {
            'endpoint': endpoint,
            'status_code': None,
            'success': False,
            'error': str(e),
            'response_time': None
        }


def verify_mcp_status(base_url: str = "http://localhost:8000") -> bool:
    """
    Verify MCP server status by testing all endpoints.
    
    Args:
        base_url: Base URL of the MCP server
        
    Returns:
        bool: True if all checks pass, False otherwise
    """
    print(colored_output("🎯 yoohoo.guru MCP Server Status Check", 'blue'))
    print(f"Testing server at: {base_url}")
    print("-" * 60)
    
    endpoints_to_test = [
        ('/', 'Root endpoint'),
        ('/health', 'Health check'),
        ('/docs', 'API Documentation'),
        ('/openapi.json', 'OpenAPI Schema')
    ]
    
    all_passed = True
    
    with httpx.Client(timeout=10.0) as client:
        for endpoint, description in endpoints_to_test:
            result = test_endpoint(client, base_url, endpoint)
            
            if result['success']:
                status_icon = colored_output("✅", 'green')
                print(f"{status_icon} {description} ({endpoint})")
                
                # Show additional details for JSON endpoints
                if result.get('data') and isinstance(result['data'], dict):
                    if 'status' in result['data']:
                        status = result['data']['status']
                        message = result['data'].get('message', 'No message')
                        print(f"   Status: {colored_output(status, 'green')}")
                        print(f"   Message: {message}")
                        
                        # Verify expected response format
                        if endpoint == '/' and status == 'healthy':
                            expected_message = "yoohoo.guru MCP Server is running"
                            if message == expected_message:
                                print(f"   {colored_output('✓ Response matches expected format', 'green')}")
                            else:
                                print(f"   {colored_output('⚠ Unexpected message format', 'yellow')}")
                                
                print(f"   Response time: {result['response_time']:.3f}s")
                
            else:
                status_icon = colored_output("❌", 'red')
                print(f"{status_icon} {description} ({endpoint})")
                if 'error' in result:
                    print(f"   Error: {result['error']}")
                elif result['status_code']:
                    print(f"   HTTP {result['status_code']}")
                all_passed = False
            
            print()
    
    print("-" * 60)
    if all_passed:
        print(colored_output("🎉 MCP Server Status: ACTIVE - All checks passed!", 'green'))
        print(f"Server verified at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        return True
    else:
        print(colored_output("💥 MCP Server Status: ISSUES DETECTED", 'red'))
        print("Some endpoints failed verification. Check the output above for details.")
        return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Verify yoohoo.guru MCP Server status")
    parser.add_argument("--url", default="http://localhost:8000", 
                       help="Base URL of the MCP server (default: http://localhost:8000)")
    parser.add_argument("--json", action="store_true",
                       help="Output results in JSON format")
    
    args = parser.parse_args()
    
    try:
        if args.json:
            # JSON output for automated monitoring
            with httpx.Client(timeout=10.0) as client:
                root_result = test_endpoint(client, args.url, "/")
                health_result = test_endpoint(client, args.url, "/health")
                
                output = {
                    "timestamp": datetime.now().isoformat(),
                    "server_url": args.url,
                    "status": "active" if root_result['success'] and health_result['success'] else "inactive",
                    "endpoints": {
                        "root": root_result,
                        "health": health_result
                    }
                }
                print(json.dumps(output, indent=2))
        else:
            # Human-readable output
            success = verify_mcp_status(args.url)
            sys.exit(0 if success else 1)
            
    except KeyboardInterrupt:
        print(colored_output("\n⚡ Status check interrupted", 'yellow'))
        sys.exit(1)
    except Exception as e:
        print(colored_output(f"💥 Unexpected error: {e}", 'red'))
        sys.exit(1)