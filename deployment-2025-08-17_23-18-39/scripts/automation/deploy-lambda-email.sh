#!/bin/bash

# 🚀 AlexAI Star Trek System - Lambda Email Deployment
# This script deploys the daily email Lambda function with EventBridge scheduling

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LAMBDA_FUNCTION_NAME="alexai-daily-email"
LAMBDA_ROLE_NAME="alexai-daily-email-role"
EVENTBRIDGE_RULE_NAME="alexai-daily-email-rule"
LAMBDA_FILE="$SCRIPT_DIR/lambda-daily-email.js"
ZIP_FILE="/tmp/alexai-daily-email.zip"
REGION="${AWS_SES_REGION:-us-east-2}"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "🔧 Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        error "❌ AWS CLI not found. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "❌ AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # Check Lambda file
    if [[ ! -f "$LAMBDA_FILE" ]]; then
        error "❌ Lambda function file not found: $LAMBDA_FILE"
        exit 1
    fi
    
    log "✅ Prerequisites verified"
}

# Create IAM role for Lambda
create_iam_role() {
    log "🔐 Creating IAM role for Lambda function..."
    
    # Create trust policy
    cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
    
    # Create role
    if aws iam get-role --role-name "$LAMBDA_ROLE_NAME" &> /dev/null; then
        warn "⚠️  IAM role already exists: $LAMBDA_ROLE_NAME"
    else
        aws iam create-role \
            --role-name "$LAMBDA_ROLE_NAME" \
            --assume-role-policy-document file:///tmp/trust-policy.json \
            --description "Role for AlexAI daily email Lambda function"
        log "✅ IAM role created: $LAMBDA_ROLE_NAME"
    fi
    
    # Attach policies
    log "🔗 Attaching policies to IAM role..."
    
    # Basic Lambda execution policy
    aws iam attach-role-policy \
        --role-name "$LAMBDA_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    
    # SES policy
    cat > /tmp/ses-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendTemplatedEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
EOF
    
    aws iam put-role-policy \
        --role-name "$LAMBDA_ROLE_NAME" \
        --policy-name "SESPolicy" \
        --policy-document file:///tmp/ses-policy.json
    
    log "✅ Policies attached to IAM role"
    
    # Wait for role to be available
    log "⏳ Waiting for IAM role to be available..."
    aws iam wait role-exists --role-name "$LAMBDA_ROLE_NAME"
    
    # Clean up temporary files
    rm -f /tmp/trust-policy.json /tmp/ses-policy.json
}

# Create Lambda function
create_lambda_function() {
    log "🚀 Creating Lambda function..."
    
    # Create deployment package
    log "📦 Creating deployment package..."
    cd "$SCRIPT_DIR"
    zip -j "$ZIP_FILE" lambda-daily-email.js
    cd "$PROJECT_ROOT"
    
    # Get role ARN
    local role_arn=$(aws iam get-role --role-name "$LAMBDA_ROLE_NAME" --query 'Role.Arn' --output text)
    
    # Check if function exists
    if aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" &> /dev/null; then
        warn "⚠️  Lambda function already exists. Updating..."
        
        # Update function code
        aws lambda update-function-code \
            --function-name "$LAMBDA_FUNCTION_NAME" \
            --zip-file "fileb://$ZIP_FILE"
        
        # Update function configuration
        aws lambda update-function-configuration \
            --function-name "$LAMBDA_FUNCTION_NAME" \
            --environment "Variables={AWS_SES_FROM_EMAIL=$AWS_SES_FROM_EMAIL,AWS_SES_REGION=$REGION}" \
            --timeout 30 \
            --memory-size 128
    else
        # Create new function
        aws lambda create-function \
            --function-name "$LAMBDA_FUNCTION_NAME" \
            --runtime "nodejs18.x" \
            --role "$role_arn" \
            --handler "lambda-daily-email.handler" \
            --zip-file "fileb://$ZIP_FILE" \
            --description "AlexAI Star Trek System - Daily Execution Plan Email" \
            --timeout 30 \
            --memory-size 128 \
            --environment "Variables={AWS_SES_FROM_EMAIL=$AWS_SES_FROM_EMAIL,AWS_SES_REGION=$REGION}"
        
        log "✅ Lambda function created: $LAMBDA_FUNCTION_NAME"
    fi
    
    # Clean up
    rm -f "$ZIP_FILE"
}

# Create EventBridge rule
create_eventbridge_rule() {
    log "⏰ Creating EventBridge rule for daily scheduling..."
    
    # Check if rule exists
    if aws events describe-rule --name "$EVENTBRIDGE_RULE_NAME" &> /dev/null; then
        warn "⚠️  EventBridge rule already exists: $EVENTBRIDGE_RULE_NAME"
    else
        # Create rule
        aws events put-rule \
            --name "$EVENTBRIDGE_RULE_NAME" \
            --schedule-expression "cron(0 10 * * ? *)" \
            --description "Daily execution plan email at 10:00 AM"
        
        log "✅ EventBridge rule created: $EVENTBRIDGE_RULE_NAME"
    fi
    
    # Get Lambda function ARN
    local function_arn=$(aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" --query 'Configuration.FunctionArn' --output text)
    
    # Add Lambda permission
    log "🔐 Adding Lambda permission for EventBridge..."
    
    aws lambda add-permission \
        --function-name "$LAMBDA_FUNCTION_NAME" \
        --statement-id "EventBridgeInvoke" \
        --action "lambda:InvokeFunction" \
        --principal "events.amazonaws.com" \
        --source-arn "arn:aws:events:$REGION:$(aws sts get-caller-identity --query Account --output text):rule/$EVENTBRIDGE_RULE_NAME"
    
    # Create target
    log "🎯 Creating EventBridge target..."
    
    cat > /tmp/target.json << EOF
[
    {
        "Id": "1",
        "Arn": "$function_arn"
    }
]
EOF
    
    aws events put-targets \
        --rule "$EVENTBRIDGE_RULE_NAME" \
        --targets file:///tmp/target.json
    
    log "✅ EventBridge target created"
    
    # Clean up
    rm -f /tmp/target.json
}

# Test Lambda function
test_lambda_function() {
    log "🧪 Testing Lambda function..."
    
    # Test payload
    cat > /tmp/test-event.json << EOF
{
    "source": "aws.events",
    "detail-type": "Scheduled Event",
    "detail": {},
    "time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    
    # Invoke function
    local result=$(aws lambda invoke \
        --function-name "$LAMBDA_FUNCTION_NAME" \
        --payload file:///tmp/test-event.json \
        --cli-binary-format raw-in-base64-out \
        /tmp/lambda-response.json)
    
    if [[ $? -eq 0 ]]; then
        log "✅ Lambda function test successful"
        log "📋 Response:"
        cat /tmp/lambda-response.json | jq '.' 2>/dev/null || cat /tmp/lambda-response.json
    else
        error "❌ Lambda function test failed"
        cat /tmp/lambda-response.json
    fi
    
    # Clean up
    rm -f /tmp/test-event.json /tmp/lambda-response.json
}

# Show deployment status
show_deployment_status() {
    log "📊 Deployment Status Summary"
    echo "=================================="
    
    # Lambda function status
    if aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" &> /dev/null; then
        local function_arn=$(aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" --query 'Configuration.FunctionArn' --output text)
        local last_modified=$(aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" --query 'Configuration.LastModified' --output text)
        
        log "✅ Lambda Function: $LAMBDA_FUNCTION_NAME"
        log "🔗 ARN: $function_arn"
        log "🕒 Last Modified: $last_modified"
    else
        error "❌ Lambda Function: Not found"
    fi
    
    # EventBridge rule status
    if aws events describe-rule --name "$EVENTBRIDGE_RULE_NAME" &> /dev/null; then
        local rule_arn=$(aws events describe-rule --name "$EVENTBRIDGE_RULE_NAME" --query 'Arn' --output text)
        local schedule=$(aws events describe-rule --name "$EVENTBRIDGE_RULE_NAME" --query 'ScheduleExpression' --output text)
        
        log "✅ EventBridge Rule: $EVENTBRIDGE_RULE_NAME"
        log "🔗 ARN: $rule_arn"
        log "⏰ Schedule: $schedule"
    else
        error "❌ EventBridge Rule: Not found"
    fi
    
    # IAM role status
    if aws iam get-role --role-name "$LAMBDA_ROLE_NAME" &> /dev/null; then
        local role_arn=$(aws iam get-role --role-name "$LAMBDA_ROLE_NAME" --query 'Role.Arn' --output text)
        log "✅ IAM Role: $LAMBDA_ROLE_NAME"
        log "🔗 ARN: $role_arn"
    else
        error "❌ IAM Role: Not found"
    fi
    
    echo ""
    log "🎉 Your daily emails will now be sent automatically at 10:00 AM via AWS Lambda!"
    log "💡 You can remove the local cron job: ./scripts/automation/setup-daily-email-cron.sh -r"
}

# Main execution
main() {
    echo -e "${CYAN}🚀 AlexAI Star Trek System - Lambda Email Deployment${NC}"
    echo "========================================================"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Create IAM role
    create_iam_role
    
    # Create Lambda function
    create_lambda_function
    
    # Create EventBridge rule
    create_eventbridge_rule
    
    # Test the function
    test_lambda_function
    
    # Show status
    show_deployment_status
    
    echo ""
    log "🎯 Next steps:"
    log "  1. Monitor CloudWatch logs for execution"
    log "  2. Remove local cron job if desired"
    log "  3. Set up CloudWatch alarms for monitoring"
}

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --status   Show deployment status"
    echo "  -t, --test     Test Lambda function"
    echo ""
    echo "Default: Deploy Lambda function with EventBridge scheduling"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -s|--status)
        show_deployment_status
        exit 0
        ;;
    -t|--test)
        test_lambda_function
        exit 0
        ;;
    "")
        main "$@"
        ;;
    *)
        error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
