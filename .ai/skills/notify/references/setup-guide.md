# Notify Skill Setup Guide

This guide helps you configure notifications for AI Dev System.

## Quick Setup (5 minutes)

### Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

1. Send any message to your new bot
2. Open this URL in your browser (replace `YOUR_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
3. Find `"chat":{"id":123456789}` - that number is your chat ID

### Step 3: Configure

Choose one of these methods:

#### Option A: Environment Variables (Recommended)

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export AI_DEV_TG_BOT_TOKEN="your-bot-token"
export AI_DEV_TG_CHAT_ID="your-chat-id"
```

#### Option B: Project Config File

Create `.ai/config/notifications.yaml`:

```yaml
notifications:
  enabled: true
  
  channels:
    telegram:
      enabled: true
      bot_token: "your-bot-token"
      chat_id: "your-chat-id"
    
    desktop:
      enabled: true
```

#### Option C: User Config File (Global)

Create `~/.ai-dev/notifications.yaml` with the same content as Option B.

This applies to all projects where you don't have a project-specific config.

#### Option D: .env File

Create `.env` in project root or `~/.ai-dev/.env`:

```bash
AI_DEV_TG_BOT_TOKEN=your-bot-token
AI_DEV_TG_CHAT_ID=your-chat-id
```

### Step 4: Test

Run the test script:

```bash
./.ai/skills/notify/scripts/test-notify.sh
```

## Configuration Priority

Settings are loaded in this order (first found wins):

1. **Environment variables** - `AI_DEV_TG_BOT_TOKEN`, `AI_DEV_TG_CHAT_ID`
2. **Project YAML** - `.ai/config/notifications.yaml`
3. **User YAML** - `~/.ai-dev/notifications.yaml`
4. **Project .env** - `.env`
5. **User .env** - `~/.ai-dev/.env`

## Security Notes

⚠️ **Never commit tokens to git!**

Add to `.gitignore`:

```gitignore
# Notification secrets
.ai/config/notifications.yaml
.env
```

Use environment variables or user-level config (`~/.ai-dev/`) for sensitive data.

## Alternative: Legacy Variable Names

The scripts also support these variable names for compatibility:

- `TELEGRAM_BOT_TOKEN` → `AI_DEV_TG_BOT_TOKEN`
- `TELEGRAM_CHAT_ID` → `AI_DEV_TG_CHAT_ID`

## Desktop Notifications

Desktop notifications work automatically on:

| OS | Method | Requirements |
|----|--------|--------------|
| **macOS** | osascript | None (built-in) |
| **Linux** | notify-send | `sudo apt install libnotify-bin` |
| **Windows** | PowerShell | None (built-in) |

## Troubleshooting

### "Bot token not configured"

- Check that the token is set correctly
- Run `echo $AI_DEV_TG_BOT_TOKEN` to verify

### "Failed to send notification"

- Ensure you've sent `/start` to your bot first
- Check that the chat ID is correct
- Try getting updates again to verify the chat ID

### Desktop notifications not showing

**macOS:**
- Check System Preferences > Notifications > Script Editor

**Linux:**
- Install: `sudo apt install libnotify-bin`
- Check: `notify-send "Test" "Message"`

**Windows:**
- Ensure PowerShell is available
- Check notification settings in Windows Settings

## Advanced: Multiple Recipients

To send to multiple people or groups:

1. Create a Telegram group
2. Add your bot to the group
3. Get the group chat ID (will be negative, like `-123456789`)
4. Use the group chat ID in your config

## Integration with OpenCode/Claude Code

When using with AI tools:

1. Install ai-dev-system: `npx ai-dev init`
2. Sync to your AI tool: `npx ai-dev sync opencode`
3. The notify skill will be available automatically

AI agents will use the skill when:
- Completing significant tasks
- Needing approval
- Encountering errors
- Session becomes idle
