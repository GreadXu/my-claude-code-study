# ai-orchestration AI 编排平台

> **优先级**：P1 🟡 推荐
> **预计时长**：快速模式 4-5 天 | 完整模式 1 周
> **难度等级**：⭐⭐⭐ 进阶
> **前置要求**：Docker 基础、ai-tools-fundamentals
> **更新日期**：2026-03-05

---

## 模块概述

OpenClaw 是开源的**本地优先 AI 编排平台**，提供 Gateway 架构、Skills 插件系统、EvoMap 进化平台和本地 LLM 部署能力。本模块将学习如何部署和配置 OpenClaw，实现与 Claude Code 的协作编排，构建强大的多 AI 工作流。

> **重点**：本模块聚焦于「AI 能力集成与编排」，通过配置 OpenClaw 作为编排层，协调多个 AI Agent（包括 Claude Code）协同工作。

n## 🎯 目标关联

本模块服务于你的三阶段目标：

- **第一阶段**：掌握 OpenClaw 平台的使用和配置
- **第二阶段**：构建 OpenClaw Agent Team，理解 Gateway 架构和 Skills 系统
- **第三阶段**：作为跨平台整合的关键组件，实现与 Claude Code 的协作

> 详情请查看：[.claude/GOALS.md](../../../.claude/GOALS.md)

## 前置知识

- [ ] 完成 claude-code-core 模块学习
- [ ] Docker 基础操作
- [ ] WebSocket 基础概念
- [ ] HTTP API 基础

---

## 学习模式说明

### 📚 快速模式（约 4-5 天）

**适合人群**：希望快速了解 OpenClaw 核心功能的学习者

**学习内容**：
- OpenClaw 部署与基础使用
- Skills 系统与插件生态
- EvoMap 与 GEP 协议概念
- 本地 LLM 部署与成本优化
- OpenClaw + Claude Code 协作基础

**时间分配**：
| 内容 | 时间 |
|------|------|
| Day 1: OpenClaw 部署与基础使用 | 6h |
| Day 2: Skills 系统与插件生态 | 6h |
| Day 3: EvoMap 与自主进化技术 | 5.5h |
| Day 4: 本地 LLM 与成本优化 | 5.5h |
| Day 5: OpenClaw + Claude Code 协作 | 5.5h |

### 🛠️ 完整模式（约 1 周）

**适合人群**：希望深入掌握 OpenClaw 并构建实际应用的学习者

**学习内容**：
- 包含快速模式的所有内容
- 深入学习 GEP 协议和 Gene Capsules
- 自定义 Skill 开发实践
- 复杂协作模式实现（并行依赖图、AI 辩论）
- 自我进化框架（Reflexion/MCE）

**额外时间**：
- Skill 开发深入实践：+1 天
- 协作模式深入实践：+1 天

---

## 学习资源

### 官方资源
- [OpenClaw GitHub](https://github.com/OpenClaw) - 源代码
- [OpenClaw 文档](https://docs.openclaw.org) - 官方文档
- [EvoMap 平台](https://evomap.org) - 进化平台
- [Ollama 文档](https://ollama.com/docs) - 本地 LLM 部署

### 推荐学习顺序
1. 部署 OpenClaw 并熟悉基础操作
2. 学习 Skills 系统并安装常用插件
3. 了解 EvoMap 和 GEP 协议概念
4. 部署本地 LLM 并配置使用
5. 实现 OpenClaw 编排 Claude Code 的协作场景

---

## 学习目标

### 快速模式目标
- [ ] 能够独立部署 OpenClaw
- [ ] 理解 Gateway 架构和 Skills 系统
- [ ] 了解 EvoMap 和 GEP 协议概念
- [ ] 能够部署本地 LLM（Ollama + Qwen）
- [ ] 能够实现基础的双层协作（OpenClaw 编排 Claude Code）

### 完整模式目标
- [ ] 深入掌握 OpenClaw 的所有核心功能
- [ ] 能够开发自定义 Skills
- [ ] 理解 GEP 协议和 Gene Capsules 机制
- [ ] 能够优化本地 LLM 部署和成本
- [ ] 能够实现复杂的多 Agent 协作模式

---

## 成果检验

### 快速模式检验
- [ ] 完成笔记文件 `notes.md`
- [ ] 成功部署 OpenClaw 并发送测试消息
- [ ] 安装并使用至少 3 个 Skills
- [ ] 部署本地 LLM 并集成到 OpenClaw
- [ ] 实现一个简单的协作示例

### 完整模式检验
- [ ] 开发一个自定义 Skill
- [ ] 接入 EvoMap 并导入 Gene Capsule
- [ ] 实现并行依赖图协作模式
- [ ] 完成 checklist.md 中的所有检查项

---

## 核心知识点概览

### 1. OpenClaw 核心架构
- Gateway 架构设计
- 多通道支持（飞书、Telegram、Slack 等）
- WebSocket 连接 (ws://127.0.0.1:18789)
- 本地优先的数据存储

### 2. Skills 插件系统
- Skill 架构与工作原理
- 社区 Skills 生态
- 自定义 Skill 开发
- Skill 链式调用

### 3. EvoMap 进化平台
- GEP（Genome Evolution Protocol）协议
- Gene Capsules 概念
- Agent 协作进化网络
- 信誉经济系统

### 4. 本地 LLM 部署
- Ollama 部署与配置
- 模型选择（Qwen2.5、DeepSeek-R1）
- 成本优化策略
- 性能调优

### 5. 协作模式
- 双层架构（编排层 vs 执行层）
- 线性管道协作
- 并行依赖图协作
- AI 辩论模式
- Hooks 回调机制（降低 90% token 消耗）

---

## 常见问题

### Q: OpenClaw 和 Claude Code 是什么关系？
**A**: OpenClaw 是编排层，负责协调多个 Agent；Claude Code 是执行层，负责具体代码任务。两者互补，可以协作构建强大的工作流。

### Q: 必须部署本地 LLM 吗？
**A**: 不是必须的。OpenClaw 支持多种 LLM 提供商，包括 OpenAI、Anthropic 等。本地 LLM 主要用于成本优化和数据隐私。

### Q: EvoMap 是必须的吗？
**A**: 不是必须的。EvoMap 是一个可选的进化平台，可以获取 Gene Capsules 和参与 Agent 协作网络。

### Q: Skills 和 MCP 有什么区别？
**A**: Skills 是 OpenClaw 的插件系统，MCP 是 Model Context Protocol。两者目标不同但可以互补。本模块假设你已经了解 MCP 基础（在 mcp-basics 模块中学习）。

---

## 与其他模块的关系

| 模块 | 关系 |
|------|------|
| claude-code-core | 前置要求，理解 Claude Code 的使用 |
| mcp-basics | 相关，OpenClaw 也支持 MCP 协议 |
| agent-sdk | 相关，理解 Agent 编排概念（可选） |
| projects | 实践应用，可将 OpenClaw 用于 AI 能力集成项目 |
| everything-claude-code | 相关，评估各类 AI 工具的编排集成方案 |

---

## 学习路径建议

1. **Day 1**：部署 OpenClaw，熟悉基本操作
2. **Day 2**：探索 Skills 生态，安装常用插件
3. **Day 3**：了解 EvoMap 概念（可选实践）
4. **Day 4**：部署本地 LLM，优化成本
5. **Day 5**：实现 OpenClaw + Claude Code 协作场景
