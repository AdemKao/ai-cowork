#!/bin/bash
#
# Send desktop notification
# Usage: ./send-desktop.sh "title" "message"
#
# Supports: macOS, Linux (notify-send), Windows (PowerShell)
#

TITLE="${1:-AI Dev System}"
MESSAGE="${2:-Notification}"

# Detect OS and send notification
case "$(uname -s)" in
    Darwin)
        # macOS
        osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\"" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "Desktop notification sent (macOS)"
        else
            echo "Failed to send notification. Check System Preferences > Notifications"
            exit 1
        fi
        ;;
    Linux)
        # Linux with notify-send
        if command -v notify-send &> /dev/null; then
            notify-send "$TITLE" "$MESSAGE"
            echo "Desktop notification sent (Linux)"
        else
            echo "notify-send not found. Install with: sudo apt install libnotify-bin"
            exit 1
        fi
        ;;
    MINGW*|MSYS*|CYGWIN*)
        # Windows (Git Bash, MSYS, Cygwin)
        if command -v powershell.exe &> /dev/null; then
            powershell.exe -Command "
                [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
                [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
                \$template = '<toast><visual><binding template=\"ToastText02\"><text id=\"1\">$TITLE</text><text id=\"2\">$MESSAGE</text></binding></visual></toast>'
                \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
                \$xml.LoadXml(\$template)
                \$toast = [Windows.UI.Notifications.ToastNotification]::new(\$xml)
                [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('AI Dev System').Show(\$toast)
            " 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "Desktop notification sent (Windows)"
            else
                # Fallback to msg command
                msg "%username%" "$TITLE: $MESSAGE" 2>/dev/null || echo "Failed to send Windows notification"
            fi
        else
            echo "PowerShell not found for Windows notifications"
            exit 1
        fi
        ;;
    *)
        echo "Unsupported OS: $(uname -s)"
        exit 1
        ;;
esac
