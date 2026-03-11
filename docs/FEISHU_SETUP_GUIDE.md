# Feishu DM Integration Setup Guide

## Overview
Configure Feishu private message bot to enable bidirectional communication with the Learning Assistant Agent.

## Prerequisites
- Feishu account with admin permissions
- OpenClaw Gateway installed and running
- Learning Assistant Agent configured (Phase 2 complete)

---

## Step 1: Create Feishu Application

### 1.1 Access Feishu Open Platform
1. Visit: https://open.feishu.cn/
2. Login with your Feishu account
3. Navigate to "Create App" (创建应用)

### 1.2 Create Enterprise Self-Built App
1. Click "Create App" → "Enterprise Self-Built App" (企业自建应用)
2. Fill in application details:
   - **App Name**: 学习助手 (Learning Assistant)
   - **App Description**: AI-powered learning coach for progress tracking
   - **App Icon**: Upload learning/education related icon

### 1.3 Get App Credentials
After creating the app, navigate to:
- **App Credentials** (凭证与基础信息)
- Copy the following:
  - `App ID` (应用ID)
  - `App Secret` (应用凭证)

---

## Step 2: Configure Permissions

### 2.1 Required Permissions
Navigate to "Permissions" (权限管理) and enable:

| Permission | Permission Code | Description |
|------------|-----------------|-------------|
| Receive Messages | `im:message` | Receive user messages |
| Send Messages as Bot | `im:message:send_as_bot` | Send messages to users |
| Access Conversations | `im:conversation` | Access conversation info |

### 2.2 Enable Permissions
1. Find each permission in the permission list
2. Toggle to enable
3. Save changes

---

## Step 3: Configure Event Subscriptions

### 3.1 Add Event Subscription
1. Navigate to "Event Subscriptions" (事件订阅)
2. Add subscription for: `im.message.receive_v1`

### 3.2 Configure Encryption (Optional but Recommended)
1. Generate an **Encrypt Key** (加密密钥) - 43 characters
2. Generate a **Verification Token** (验证令牌) - random string
3. Save these for OpenClaw configuration

---

## Step 4: Configure OpenClaw Feishu Channel

### 4.1 Edit OpenClaw Configuration
Edit `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "learning": {
          "appId": "cli_xxxxxxxxxxxxx",
          "appSecret": "xxxxxxxxxxxxxxxxxxxx",
          "encryptKey": "xxxxxxxxxxxxxxxxxxxx",
          "verificationToken": "xxxxxxxxxxxxxxxxxxxx",
          "botName": "学习助手"
        }
      },
      "bindings": [
        {
          "agentId": "learning-assistant",
          "match": {
            "channel": "feishu",
            "peer": {"kind": "dm"}
          }
        }
      ]
    }
  }
}
```

### 4.2 Replace with Your Credentials
- `appId`: Your Feishu App ID
- `appSecret`: Your Feishu App Secret
- `encryptKey`: Your encryption key (from Step 3.2)
- `verificationToken`: Your verification token (from Step 3.2)

---

## Step 5: Configure Pairing

### 5.1 Start OpenClaw Gateway
```bash
openclaw gateway start
```

### 5.2 Check Pairing Status
```bash
openclaw pairing list feishu
```

### 5.3 Add Bot in Feishu
1. In Feishu, search for your bot by name
2. Add the bot as a contact
3. Send a message to initiate pairing
4. Note the pairing code displayed

### 5.4 Approve Pairing
```bash
openclaw pairing approve feishu <配对码>
```

---

## Step 6: Command Mapping

### Feishu → Learning Commands

| Feishu Message | Learning Command |
|----------------|------------------|
| `查看学习状态` | learning-status - show overall progress |
| `进度怎么样` | learning-status - quick status check |
| `<模块名>进度如何` | learning-status - module-specific progress |
| `更新进度` | learning-status - sync progress from checklist |
| `开始学习 <模块>` | learning-manager - start new module |
| `完成学习 <模块>` | learning-manager - mark module complete |
| `重置模块 <模块>` | learning-manager - reset module progress |
| `创建书签 <名称>` | learning-tools - create bookmark |
| `继续书签` | learning-tools - resume bookmark exploration |
| `完成书签 <名称>` | learning-tools - mark bookmark resolved |
| `初始化缓存 <模块>` | learning-tools - create knowledge cache |
| `刷新缓存` | learning-tools - update cache |
| `查看缓存` | learning-tools - show cache status |
| `检查更新` | learning-tools - check template updates |

---

## Step 7: Test Communication

### Test 1: Basic Status Request
1. In Feishu, send: `查看学习状态`
2. Expected: Progress table with all modules

### Test 2: Module-Specific Query
1. In Feishu, send: `ai-orchestration 进度如何`
2. Expected: Detailed module card

### Test 3: Bookmark Creation
1. In Feishu, send: `创建书签 测试书签`
2. Expected: Bookmark creation flow

---

## Troubleshooting

### Gateway Not Running
```bash
openclaw gateway status
openclaw gateway start
```

### Pairing Failed
- Check bot permissions in Feishu
- Verify credentials in openclaw.json
- Check Gateway logs: `openclaw gateway logs`

### No Response from Bot
- Verify event subscription is configured
- Check encryption settings match
- Ensure agent is configured correctly

---

## Security Notes

1. **Never commit** `openclaw.json` with real credentials to version control
2. **Use environment variables** for production deployments
3. **Limit permissions** to only what's necessary
4. **Monitor usage** through Feishu admin console

---

## Next Steps

After Feishu integration is working:
- [ ] Test all command mappings
- [ ] Create mobile shortcuts for common commands
- [ ] Set up notification preferences
- [ ] Document user feedback

---

*Last Updated: 2026-03-11*
