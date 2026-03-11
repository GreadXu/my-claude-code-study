# Feishu Learning Assistant - Command Reference

> Quick reference for interacting with the Learning Assistant via Feishu

## Status Commands 📊

| Command | Description | Example |
|---------|-------------|---------|
| `查看学习状态` | Show overall progress | 查看学习状态 |
| `进度怎么样` | Quick status check | 进度怎么样 |
| `<模块>进度如何` | Module-specific progress | ai-orchestration 进度如何 |
| `更新进度` | Sync progress from checklist | 更新进度 |

## Learning Commands 📚

| Command | Description | Example |
|---------|-------------|---------|
| `开始学习 <模块>` | Start new module | 开始学习 mcp-protocol |
| `完成学习 <模块>` | Mark module complete | 完成学习 ai-tools-fundamentals |
| `重置模块 <模块>` | Reset module progress | 重置模块 mcp-protocol |

## Bookmark Commands 🔖

| Command | Description | Example |
|---------|-------------|---------|
| `创建书签 <名称>` | Create learning bookmark | 创建书签 深入理解 Tool Use |
| `继续书签` | Resume bookmark exploration | 继续书签 |
| `完成书签 <名称>` | Mark bookmark resolved | 完成书签 深入理解 Tool Use |

## Cache Commands 💾

| Command | Description | Example |
|---------|-------------|---------|
| `初始化缓存 <模块>` | Create knowledge cache | 初始化缓存 ai-orchestration |
| `刷新缓存` | Update existing cache | 刷新缓存 |
| `查看缓存` | Show cache status | 查看缓存 |

## Sync Commands 🔄

| Command | Description | Example |
|---------|-------------|---------|
| `检查更新` | Check template updates | 检查更新 |

## Module Names 📋

### Available Modules
```
ai-tools-fundamentals    - AI 工具基础 [P0]
mcp-protocol            - MCP 协议入门 [P1]
ai-orchestration       - AI 编排平台 [P1]
ai-resources-research   - AI 资源研究 [P1]
agent-configuration    - Agent 配置与使用 [P2]
mcp-advanced-config    - MCP 高级配置 [P3]
config-management      - 配置管理工具 [P2]
spec-driven-dev        - 规范驱动开发 [P2]
practical-projects     - 综合实战项目 [P1]
```

## Quick Workflows ⚡

### Start Learning New Module
```
你: 开始学习 mcp-protocol
助手: 发现未找到知识缓存...
你: 初始化缓存
助手: 缓存初始化完成...
你: 快速模式
助手: 开始学习 mcp-protocol (快速模式)
```

### Check Progress During Learning
```
你: mcp-protocol 进度如何
助手: ╔══════════════════════════════╗
    ║ mcp-protocol - 模块详情        ║
    ║ 进度: 25% █████░░░░░░░░░░░░░░  ║
    ╚══════════════════════════════╝
```

### Create Bookmark for Question
```
你: 创建书签 Agent 通信机制
助手: ╔══════════════════════════════╗
    ║ 书签预览                      ║
    ║ 名称：Agent 通信机制           ║
    ║ 确认创建？                    ║
    ╚══════════════════════════════╝
```

## Tips 💡

1. **Use module names directly**: No need for exact formatting, the assistant understands variations
2. **Quick status checks**: Just say "进度" for a quick overview
3. **Natural language**: The assistant understands conversational queries like "我学哪了?"
4. **Mobile shortcuts**: Create Feishu shortcuts for frequently used commands

## Status Badges Meaning

- 🟢 未开始 - Not started
- 🟡 进行中 - In progress
- ✅ 已完成 - Completed

## Priority Levels

- 🔴 P0 必学 - Essential
- 🟡 P1 推荐 - Recommended
- 🟢 P2 可选 - Optional
- 🔵 P3 了解 - Knowledge only

---

*Last Updated: 2026-03-11*
