---
name: notify
description: Send notifications to Telegram or Desktop when tasks complete, need approval, or errors occur. Use when completing a significant task, waiting for user input, encountering errors, or when the session becomes idle.
allowed-tools: Bash
---

# Notify Skill

Send notifications to keep the user informed about task progress.

## When to Use

- **Task Completed**: After completing a significant task or feature
- **Approval Needed**: When waiting for user confirmation before proceeding
- **Error Occurred**: When encountering an error that needs attention
- **Session Idle**: When waiting for user input

## Usage

### Send Telegram Notification

```bash
# Basic notification
./scripts/send-telegram.sh "Your message here"

# With event type (for formatting)
./scripts/send-telegram.sh "Task completed: implemented search API" "task_completed"
./scripts/send-telegram.sh "Need approval to delete files" "approval_needed"
./scripts/send-telegram.sh "Build failed: missing dependency" "error_occurred"
```

### Send Desktop Notification

```bash
# macOS, Linux, and Windows supported
./scripts/send-desktop.sh "Title" "Message body"
```

### Check Configuration

```bash
# Verify notification setup is working
./scripts/test-notify.sh
```

## Event Types

| Event | Emoji | Use Case |
|-------|-------|----------|
| `task_completed` | ✅ | Task finished successfully |
| `approval_needed` | 🔔 | Waiting for user confirmation |
| `input_required` | 💬 | Need user input to continue |
| `error_occurred` | ❌ | Error that needs attention |
| `session_idle` | 💤 | Session is idle |

## Configuration

Scripts read configuration from these locations (in priority order):

1. **Environment variables** (highest priority)
   - `AI_DEV_TG_BOT_TOKEN` - Telegram bot token
   - `AI_DEV_TG_CHAT_ID` - Telegram chat ID

2. **Project config**: `.ai/config/notifications.yaml`

3. **User config**: `~/.ai-dev/notifications.yaml`

4. **Project .env**: `.env` file in project root

5. **User .env**: `~/.ai-dev/.env`

### Quick Setup

1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Get your chat ID by messaging the bot and visiting:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Set environment variables or create config file

See [setup-guide.md](references/setup-guide.md) for detailed instructions.

## Examples

### After completing a feature

```bash
./scripts/send-telegram.sh "✅ Implemented user authentication

Changes:
- Added login/register endpoints
- Created JWT middleware
- Added unit tests

Ready for review!" "task_completed"
```

### When needing approval

```bash
./scripts/send-telegram.sh "🔔 Ready to deploy to production

Changes will affect:
- 3 API endpoints
- Database migration required

Reply to approve or reject." "approval_needed"
```

### On error

```bash
./scripts/send-telegram.sh "❌ Build failed

Error: Missing dependency 'lodash'
File: src/utils/helpers.ts:15

Please check and advise." "error_occurred"
```

## Troubleshooting

If notifications aren't working:

1. Run `./scripts/test-notify.sh` to verify setup
2. Check that bot token and chat ID are correct
3. Ensure the bot has permission to message you (send /start to the bot first)
4. Check script permissions: `chmod +x ./scripts/*.sh`
