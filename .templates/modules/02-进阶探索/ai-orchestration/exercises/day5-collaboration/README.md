# Day 5: OpenClaw + Claude Code 协作 - 实践材料

> **时间**: 5.5 小时
> **目标**: 实现双层协作架构

---

## 双层架构设计

```
┌─────────────────────────────────────┐
│          OpenClaw (编排层)            │
│     任务: "实现用户认证系统"           │
│     ↓ 分解                            │
│   1. 设计数据库模型                   │
│   2. 实现 API 端点                    │
│   3. 编写单元测试                     │
└─────────────────────────────────────┘
         ↓                    ↓                    ↓
   Claude Code #1      Claude Code #2      Claude Code #3
   (数据库模型)          (API 端点)          (单元测试)
```

---

## Hooks 配置

在 Claude Code 项目中创建 `.hooks/openclaw.json`:

```json
{
  "webhook_url": "http://localhost:18789/hooks/claude-code",
  "events": [
    "file_create",
    "file_edit",
    "command_complete",
    "test_result"
  ],
  "project_name": "my-app",
  "agent_id": "claude-code-1"
}
```

---

## 多环境设置（tmux + git worktree）

```bash
# 创建 worktrees
git worktree add ../my-app-db model-branch
git worktree add ../my-app-api api-branch
git worktree add ../my-app-test test-branch

# 启动 tmux 会话
tmux new-session -d -s openclaw-collab

# 创建窗格
tmux selectp -t 0
tmux splitw -h -p 50
tmux splitw -v -p 50

# 在每个窗格启动 Claude Code
# Pane 0: cd ../my-app-db && claude-code
# Pane 1: cd ../my-app-api && claude-code
# Pane 2: cd ../my-app-test && claude-code
```

---

## 协作模式 1: 线性管道

```
OpenClaw → [设计] → Claude Code #1
                    ↓
              [确认设计]
                    ↓
OpenClaw → [实现] → Claude Code #2
                    ↓
              [代码审查]
                    ↓
OpenClaw → [测试] → Claude Code #3
```

---

## 协作模式 2: 并行依赖图

```
           OpenClaw
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  [DB]      [API]    [Frontend]
    ↓         ↓         ↓
  CC#1       CC#2      CC#3
    └─────────┼─────────┘
              ↓
         [集成测试]
              ↓
           CC#4
```

---

## 预期结果

- [ ] 理解双层架构概念
- [ ] 配置 Hooks 成功
- [ ] 实现线性管道协作
- [ ]（可选）实现并行依赖图协作
- [ ] 理解 token 优化策略（Hooks 降低 90% 消耗）

---

## Hooks 事件说明

| 事件 | 触发时机 | 用途 |
|------|----------|------|
| file_create | 文件创建 | 通知 OpenClaw 新文件 |
| file_edit | 文件编辑 | 同步代码变更 |
| command_complete | 命令完成 | 报告任务状态 |
| test_result | 测试完成 | 汇总测试结果 |

---

## 最佳实践

1. **明确职责分工**：OpenClaw 负责编排，Claude Code 负责执行
2. **使用 Hooks 通信**：避免轮询，降低 token 消耗
3. **隔离工作环境**：使用 git worktree 避免冲突
4. **监控协作状态**：定期检查各 Agent 状态
