# 02-进阶探索

> **预计时长**：1.5-2 周（完整模式）
> **难度等级**：⭐⭐⭐ 进阶
> **更新日期**：2026-02-28

---

## 阶段概述

本阶段深入 Claude Code 生态的高级主题，聚焦于**配置和使用** AI 能力而非深入开发。通过本阶段学习，你将掌握 Agent 配置、MCP 高级特性配置、OpenClaw AI 编排平台使用，以及生态资源评估能力。

## 学习模块

| 模块 | 优先级 | 学习模式 | 状态 |
|------|--------|----------|------|
| [agent-sdk](./agent-sdk/) | P2 🟢 可选 | - | 未开始 |
| [mcp-advanced](./mcp-advanced/) | P3 🔵 了解 | - | 未开始 |
| [openclaw-ecosystem](./openclaw-ecosystem/) | P1 🟡 推荐 | - | 未开始 |
| [everything-claude-code](./everything-claude-code/) | P1 🟡 推荐 | - | 未开始 |

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
- agent-sdk：约 1 天
- mcp-advanced：约 0.5 天
- openclaw-ecosystem：约 0.5-1 天
- everything-claude-code：约 0.5 天
- **合计**：约 2.5-3 天

### 完整模式（理论+实践）
- agent-sdk：约 2-3 天
- mcp-advanced：约 2 天
- openclaw-ecosystem：约 2-3 天
- everything-claude-code：约 1 天
- **合计**：约 1.5-2 周

---

## 学习目标

完成本阶段后，你将能够：

### agent-sdk [P2]
- [ ] 理解 Agent 的核心概念和工作原理
- [ ] 了解常用 Agent 类型和适用场景
- [ ] 学习配置和使用现有 Agent
- [ ] 了解 Agent 工具集成方式

### mcp-advanced [P3]
- [ ] 了解 MCP 高级特性 (Resources, Prompts)
- [ ] 理解服务器架构
- [ ] 学习配置高级服务器选项
- [ ] 了解服务器开发流程（理论）

### openclaw-ecosystem [P1]
- [ ] 理解 OpenClaw AI 编排平台架构
- [ ] 掌握 Skills 插件系统的配置与使用
- [ ] 部署本地 LLM 并优化成本
- [ ] 实现 OpenClaw + Claude Code 协作

### everything-claude-code [P1]
- [ ] 评估各类 AI 工具的适用场景
- [ ] 测试工具配置难度
- [ ] 整理常用工具清单
- [ ] 完成资源推荐清单

---

## 学习资源

### 官方资源
- [Claude Agent SDK 文档](https://docs.anthropic.com/en/docs/build-with-claude/agent-sdk)
- [MCP 开发指南](https://modelcontextprotocol.io/docs/concepts/servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

### 推荐阅读顺序
1. 先学习 openclaw-ecosystem，掌握 AI 编排和协作
2. 再学习 everything-claude-code，评估各类工具
3. 然后根据兴趣学习 agent-sdk（了解 Agent 配置）
4. 最后浏览 mcp-advanced（了解 MCP 高级配置）

---

## 进度更新

本阶段的总体进度会自动反映在根目录的 `PROGRESS.md` 文件中。各模块的详细进度请查看对应模块的 `checklist.md`。

---

## 常见问题

### Q: 必须按顺序学习吗？
**A**: 建议按推荐的 P1 → P2 → P3 顺序学习。openclaw-ecosystem 和 everything-claude-code 是重点模块。

### Q: 不想开发，只想配置和使用，可以吗？
**A**: 完全可以。本阶段重点已调整为「配置使用」而非「开发」。P1 模块都是配置导向的。

### Q: agent-sdk 和 mcp-advanced 现在是什么定位？
**A**: 这两个模块已降为 P2/P3，主要用于了解概念。如果你想深入开发，可以选学；否则以快速模式了解即可。
