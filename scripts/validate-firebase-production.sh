#!/bin/bash

# Firebase Production Validation Script
# Ensures that production/staging deployments use real Firebase projects, not emulators or mocks
# Enhanced to support copilot environment secrets access

set -e

echo "🔥 Firebase Production Validation"
echo "=================================="

# Function to check for copilot environment variables
check_copilot_env() {
    local env_name="$1"
    echo "🤖 Checking for copilot environment variables..."
    
    # Check if we're in a copilot environment
    if [ -n "$COPILOT_ENV" ] || [ -n "$GITHUB_COPILOT" ]; then
        echo "   ✅ Copilot environment detected"
        
        # Try to access copilot secrets if available
        if command -v copilot-env 2>/dev/null; then
            echo "   🔑 Accessing copilot environment secrets..."
            copilot-env load || echo "   ⚠️  Could not load copilot environment secrets"
        fi
    else
        echo "   📋 Standard environment mode"
    fi
}

# Function to check if a value indicates a demo/test/mock project
is_demo_value() {
    local value="$1"
    case "$value" in
        *demo* | *test* | *mock* | *localhost* | *emulator* | *example* | *your_* | *changeme* | *placeholder*)
            return 0
            ;;
        "")
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Function to validate Firebase configuration
validate_firebase_config() {
    local env_name="$1"
    echo ""
    echo "🔍 Validating Firebase configuration for $env_name environment..."

    # Required Firebase environment variables
    local firebase_vars=(
        "FIREBASE_PROJECT_ID"
        "FIREBASE_API_KEY"
        "FIREBASE_AUTH_DOMAIN"
        "FIREBASE_DATABASE_URL"
        "FIREBASE_STORAGE_BUCKET"
        "FIREBASE_APP_ID"
    )

    local react_firebase_vars=(
        "REACT_APP_FIREBASE_PROJECT_ID"
        "REACT_APP_FIREBASE_API_KEY"
        "REACT_APP_FIREBASE_AUTH_DOMAIN"
        "REACT_APP_FIREBASE_DATABASE_URL"
        "REACT_APP_FIREBASE_STORAGE_BUCKET"
        "REACT_APP_FIREBASE_APP_ID"
    )

    local validation_failed=0

    # Check backend Firebase variables
    echo "  Backend Firebase Configuration:"
    for var in "${firebase_vars[@]}"; do
        local value="${!var}"
        if [ -z "$value" ]; then
            echo "    ❌ $var is not set"
            validation_failed=1
        elif is_demo_value "$value"; then
            echo "    ❌ $var contains demo/test/mock value: $value"
            validation_failed=1
        else
            echo "    ✅ $var is properly configured"
        fi
    done

    # Check frontend Firebase variables
    echo "  Frontend Firebase Configuration:"
    for var in "${react_firebase_vars[@]}"; do
        local value="${!var}"
        
        # Special handling for DATABASE_URL which may be truncated due to secret name limits
        if [ "$var" = "REACT_APP_FIREBASE_DATABASE_URL" ] && [ -z "$value" ]; then
            # Check for truncated version
            local truncated_var="REACT_APP_FIREBASE_DATABASE_"
            local truncated_value="${!truncated_var}"
            if [ -n "$truncated_value" ]; then
                value="$truncated_value"
                echo "    ✅ $var is properly configured (using truncated variable name)"
                continue
            fi
        fi
        
        if [ -z "$value" ]; then
            echo "    ❌ $var is not set"
            validation_failed=1
        elif is_demo_value "$value"; then
            echo "    ❌ $var contains demo/test/mock value: $value"
            validation_failed=1
        else
            echo "    ✅ $var is properly configured"
        fi
    done

    # Check for prohibited emulator settings
    echo "  Emulator/Mock Configuration Check:"
    if [ -n "$FIREBASE_EMULATOR_HOST" ]; then
        echo "    ❌ FIREBASE_EMULATOR_HOST is set: $FIREBASE_EMULATOR_HOST (prohibited in $env_name)"
        validation_failed=1
    else
        echo "    ✅ FIREBASE_EMULATOR_HOST is not set"
    fi

    if [ -n "$USE_MOCKS" ] && [ "$USE_MOCKS" != "false" ]; then
        echo "    ❌ USE_MOCKS is enabled: $USE_MOCKS (prohibited in $env_name)"
        validation_failed=1
    else
        echo "    ✅ USE_MOCKS is not enabled"
    fi

    # Validate Firebase project ID format
    if [ -n "$FIREBASE_PROJECT_ID" ]; then
        if [[ "$FIREBASE_PROJECT_ID" =~ ^[a-z0-9-]+$ ]]; then
            echo "    ✅ FIREBASE_PROJECT_ID format is valid"
        else
            echo "    ❌ FIREBASE_PROJECT_ID format is invalid: $FIREBASE_PROJECT_ID"
            validation_failed=1
        fi
    fi

    return $validation_failed
}

# Main validation logic
main() {
    local environment="${NODE_ENV:-development}"
    
    echo "Environment: $environment"
    
    # Check for copilot environment integration
    check_copilot_env "$environment"
    
    case "$environment" in
        "production")
            echo "🚀 Production environment detected - strict validation required"
            validate_firebase_config "production"
            if [ $? -ne 0 ]; then
                echo ""
                echo "❌ VALIDATION FAILED: Production deployment blocked!"
                echo "   All Firebase configurations must use live projects."
                echo "   Mocks and emulators are prohibited in production."
                echo "   💡 Tip: Check your copilot environment secrets configuration"
                exit 1
            fi
            ;;
        "staging")
            echo "🔄 Staging environment detected - strict validation required"
            validate_firebase_config "staging"
            if [ $? -ne 0 ]; then
                echo ""
                echo "❌ VALIDATION FAILED: Staging deployment blocked!"
                echo "   All Firebase configurations must use live projects."
                echo "   Mocks and emulators are prohibited in staging."
                echo "   💡 Tip: Check your copilot environment secrets configuration"
                exit 1
            fi
            ;;
        "test")
            echo "🧪 Test environment detected - allowing mock configurations"
            echo "   Mocks and emulators are permitted for testing."
            ;;
        "development")
            echo "🛠️  Development environment detected - allowing mock configurations"
            echo "   Mocks and emulators are permitted for local development."
            ;;
        *)
            echo "⚠️  Unknown environment: $environment"
            echo "   Treating as production for safety - strict validation required"
            validate_firebase_config "unknown"
            if [ $? -ne 0 ]; then
                echo ""
                echo "❌ VALIDATION FAILED: Deployment blocked for unknown environment!"
                echo "   💡 Tip: Set NODE_ENV properly and check copilot secrets"
                exit 1
            fi
            ;;
    esac

    echo ""
    echo "✅ Firebase validation passed for $environment environment"
    echo ""
    echo "📋 Policy Reminder:"
    echo "   • Production/Staging: Live Firebase projects only"
    echo "   • Preview/PR environments: Live Firebase projects only"
    echo "   • Development/Test: Mocks and emulators allowed"
    echo "   • All cloud dependencies must be exercised live in deployed environments"
    echo "   • Use copilot environment secrets for secure configuration management"
}

# Run main function
main "$@"