# 02-进阶探索

> **预计时长**：3-4 周（完整模式）
> **难度等级**：⭐⭐⭐ 进阶
> **更新日期**：2026-02-26

---

## 阶段概述

本阶段深入 Claude Code 生态的高级主题，包括 Agent SDK 开发、MCP 高级应用，以及生态资源全景探索。通过本阶段学习，你将具备开发自定义扩展和深入应用的能力。

## 学习模块

| 模块 | 优先级 | 学习模式 | 状态 |
|------|--------|----------|------|
| [agent-sdk](./agent-sdk/) | P1 🟡 推荐 | - | 未开始 |
| [mcp-advanced](./mcp-advanced/) | P2 🟢 可选 | - | 未开始 |
| [everything-claude-code](./everything-claude-code/) | P3 🔵 了解 | - | 未开始 |

---

## 前置知识

开始本阶段学习前，建议你具备：

- [ ] 完成 01-基础入门 阶段学习
- [ ] JavaScript/TypeScript 基础（agent-sdk 模块）
- [ ] Node.js 开发经验（mcp-advanced 模块）
- [ ] 异步编程概念理解
- [ ] REST API 基础知识

## 时间规划

### 快速模式（仅理论）
- agent-sdk：约 2 天
- mcp-advanced：约 1 天
- everything-claude-code：约 0.5 天
- **合计**：约 3.5 天

### 完整模式（理论+实践）
- agent-sdk：约 2 周
- mcp-advanced：约 1.5 周
- everything-claude-code：约 3 天
- **合计**：约 3-4 周

---

## 学习目标

完成本阶段后，你将能够：

### agent-sdk [P1]
- [ ] 理解 Agent SDK 的架构设计
- [ ] 掌握 Agent 开发的核心模式
- [ ] 能够开发自定义 Agent
- [ ] 完成 Agent 的集成和测试

### mcp-advanced [P2]
- [ ] 掌握 MCP 高级特性
- [ ] 能够开发自定义 MCP 服务器
- [ ] 理解 MCP 的调试技巧
- [ ] 完成服务器发布

### everything-claude-code [P3]
- [ ] 了解 Claude Code 生态全景
- [ ] 熟悉各类资源和工具
- [ ] 掌握资源发现方法
- [ ] 完成资源清单整理

---

## 学习资源

### 官方资源
- [Claude Agent SDK 文档](https://docs.anthropic.com/en/docs/build-with-claude/agent-sdk)
- [MCP 开发指南](https://modelcontextprotocol.io/docs/concepts/servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

### 推荐阅读顺序
1. 先学习 agent-sdk，掌握扩展开发能力
2. 再学习 mcp-advanced，深入 MCP 协议
3. 最后浏览 everything-claude-code，拓展视野

---

## 进度更新

本阶段的总体进度会自动反映在根目录的 `PROGRESS.md` 文件中。各模块的详细进度请查看对应模块的 `checklist.md`。

---

## 常见问题

### Q: 必须按顺序学习吗？
**A**: 建议按顺序学习。agent-sdk 和 mcp-advanced 有一定独立性，但 everything-claude-code 建议最后学习作为拓展。

### Q: 没有 TypeScript 基础可以学吗？
**A**: agent-sdk 和 mcp-advanced 需要 TypeScript 基础。如果时间有限，可以先选择快速模式了解概念，再补充 TypeScript 知识。

### Q: 完整模式的项目难度如何？
**A**: 完整模式的项目有一定挑战性，建议确保有充足时间，并可以随时在社区寻求帮助。
