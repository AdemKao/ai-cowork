#!/bin/bash
#
# Test notification configuration
# Usage: ./test-notify.sh
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== AI Dev System Notification Test ==="
echo ""

# Check configuration sources
echo "📋 Checking configuration sources..."
echo ""

check_config() {
    local name="$1"
    local path="$2"
    if [ -f "$path" ]; then
        echo "  ✅ $name: $path"
        return 0
    else
        echo "  ⚪ $name: $path (not found)"
        return 1
    fi
}

CONFIG_FOUND=0
check_config "Project YAML config" ".ai/config/notifications.yaml" && CONFIG_FOUND=1
check_config "User YAML config" "$HOME/.ai-dev/notifications.yaml" && CONFIG_FOUND=1
check_config "Project .env" ".env" && CONFIG_FOUND=1
check_config "User .env" "$HOME/.ai-dev/.env" && CONFIG_FOUND=1

echo ""

# Check environment variables
echo "🔑 Checking environment variables..."
echo ""

if [ -n "$AI_DEV_TG_BOT_TOKEN" ]; then
    echo "  ✅ AI_DEV_TG_BOT_TOKEN: ***${AI_DEV_TG_BOT_TOKEN: -4}"
elif [ -n "$TELEGRAM_BOT_TOKEN" ]; then
    echo "  ✅ TELEGRAM_BOT_TOKEN: ***${TELEGRAM_BOT_TOKEN: -4}"
else
    echo "  ❌ Telegram bot token not set"
fi

if [ -n "$AI_DEV_TG_CHAT_ID" ]; then
    echo "  ✅ AI_DEV_TG_CHAT_ID: $AI_DEV_TG_CHAT_ID"
elif [ -n "$TELEGRAM_CHAT_ID" ]; then
    echo "  ✅ TELEGRAM_CHAT_ID: $TELEGRAM_CHAT_ID"
else
    echo "  ❌ Telegram chat ID not set"
fi

echo ""

# Check dependencies
echo "🔧 Checking dependencies..."
echo ""

if command -v curl &> /dev/null; then
    echo "  ✅ curl: $(command -v curl)"
else
    echo "  ❌ curl: not found (required for Telegram)"
fi

if command -v jq &> /dev/null; then
    echo "  ✅ jq: $(command -v jq)"
else
    echo "  ⚠️  jq: not found (optional, for JSON formatting)"
fi

# Check OS-specific desktop notification support
case "$(uname -s)" in
    Darwin)
        echo "  ✅ Desktop notifications: macOS (osascript)"
        ;;
    Linux)
        if command -v notify-send &> /dev/null; then
            echo "  ✅ Desktop notifications: Linux (notify-send)"
        else
            echo "  ⚠️  Desktop notifications: notify-send not found"
            echo "      Install with: sudo apt install libnotify-bin"
        fi
        ;;
    MINGW*|MSYS*|CYGWIN*)
        if command -v powershell.exe &> /dev/null; then
            echo "  ✅ Desktop notifications: Windows (PowerShell)"
        else
            echo "  ⚠️  Desktop notifications: PowerShell not found"
        fi
        ;;
esac

echo ""

# Test sending
echo "📤 Testing notifications..."
echo ""

read -p "Send test Telegram notification? [y/N] " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  Sending Telegram notification..."
    if "$SCRIPT_DIR/send-telegram.sh" "🧪 Test notification from AI Dev System" "task_completed"; then
        echo "  ✅ Telegram notification sent!"
    else
        echo "  ❌ Telegram notification failed"
    fi
fi

echo ""

read -p "Send test desktop notification? [y/N] " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  Sending desktop notification..."
    if "$SCRIPT_DIR/send-desktop.sh" "AI Dev System" "Test notification"; then
        echo "  ✅ Desktop notification sent!"
    else
        echo "  ❌ Desktop notification failed"
    fi
fi

echo ""
echo "=== Test Complete ==="
