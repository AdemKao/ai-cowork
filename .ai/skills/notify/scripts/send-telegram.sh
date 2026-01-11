#!/bin/bash
#
# Send Telegram notification
# Usage: ./send-telegram.sh "message" [event_type]
#
# Event types: task_completed, approval_needed, input_required, error_occurred, session_idle
#

set -e

MESSAGE="$1"
EVENT_TYPE="${2:-info}"

# Exit if no message
if [ -z "$MESSAGE" ]; then
    echo "Usage: $0 \"message\" [event_type]"
    exit 1
fi

# Configuration loading priority:
# 1. Environment variables (already set)
# 2. Project .ai/config/notifications.yaml
# 3. User ~/.ai-dev/notifications.yaml
# 4. Project .env
# 5. User ~/.ai-dev/.env

load_env_file() {
    local env_file="$1"
    if [ -f "$env_file" ]; then
        while IFS='=' read -r key value || [ -n "$key" ]; do
            # Skip comments and empty lines
            [[ "$key" =~ ^#.*$ ]] && continue
            [[ -z "$key" ]] && continue
            # Remove quotes from value
            value="${value%\"}"
            value="${value#\"}"
            value="${value%\'}"
            value="${value#\'}"
            # Export if not already set
            if [ -z "${!key}" ]; then
                export "$key=$value"
            fi
        done < "$env_file"
    fi
}

load_yaml_config() {
    local yaml_file="$1"
    if [ -f "$yaml_file" ]; then
        # Simple YAML parser for our specific format
        if [ -z "$AI_DEV_TG_BOT_TOKEN" ]; then
            AI_DEV_TG_BOT_TOKEN=$(grep -E '^\s*bot_token:' "$yaml_file" 2>/dev/null | sed 's/.*bot_token:\s*//' | sed 's/["\x27]//g' | sed 's/\${.*}//' | tr -d ' ')
        fi
        if [ -z "$AI_DEV_TG_CHAT_ID" ]; then
            AI_DEV_TG_CHAT_ID=$(grep -E '^\s*chat_id:' "$yaml_file" 2>/dev/null | sed 's/.*chat_id:\s*//' | sed 's/["\x27]//g' | sed 's/\${.*}//' | tr -d ' ')
        fi
    fi
}

# Load configuration (order matters - later doesn't override earlier)
load_yaml_config ".ai/config/notifications.yaml"
load_yaml_config "$HOME/.ai-dev/notifications.yaml"
load_env_file ".env"
load_env_file "$HOME/.ai-dev/.env"

# Also check for TELEGRAM_* variants (common naming)
if [ -z "$AI_DEV_TG_BOT_TOKEN" ] && [ -n "$TELEGRAM_BOT_TOKEN" ]; then
    AI_DEV_TG_BOT_TOKEN="$TELEGRAM_BOT_TOKEN"
fi
if [ -z "$AI_DEV_TG_CHAT_ID" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    AI_DEV_TG_CHAT_ID="$TELEGRAM_CHAT_ID"
fi

# Validate configuration
if [ -z "$AI_DEV_TG_BOT_TOKEN" ]; then
    echo "Error: Telegram bot token not configured"
    echo "Set AI_DEV_TG_BOT_TOKEN environment variable or add to .ai/config/notifications.yaml"
    exit 1
fi

if [ -z "$AI_DEV_TG_CHAT_ID" ]; then
    echo "Error: Telegram chat ID not configured"
    echo "Set AI_DEV_TG_CHAT_ID environment variable or add to .ai/config/notifications.yaml"
    exit 1
fi

# Get project name from git or directory
get_project_name() {
    if [ -d ".git" ]; then
        basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || basename "$(pwd)"
    else
        basename "$(pwd)"
    fi
}

PROJECT_NAME=$(get_project_name)

# Add emoji based on event type
case "$EVENT_TYPE" in
    task_completed)
        EMOJI="✅"
        ;;
    approval_needed)
        EMOJI="🔔"
        ;;
    input_required)
        EMOJI="💬"
        ;;
    error_occurred)
        EMOJI="❌"
        ;;
    session_idle)
        EMOJI="💤"
        ;;
    *)
        EMOJI="📢"
        ;;
esac

# Format message with project name
FORMATTED_MESSAGE="$EMOJI [$PROJECT_NAME] $MESSAGE"

# Send to Telegram
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${AI_DEV_TG_BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{
        \"chat_id\": \"${AI_DEV_TG_CHAT_ID}\",
        \"text\": $(echo "$FORMATTED_MESSAGE" | jq -Rs .),
        \"parse_mode\": \"Markdown\"
    }" 2>/dev/null)

# Check result
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo "Notification sent successfully"
else
    ERROR=$(echo "$RESPONSE" | grep -o '"description":"[^"]*"' | sed 's/"description":"//;s/"$//')
    echo "Failed to send notification: $ERROR"
    exit 1
fi
