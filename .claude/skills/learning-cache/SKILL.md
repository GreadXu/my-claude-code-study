---
name: learning-cache
description: AI 技术学习知识缓存 - 初始化模块知识缓存、刷新缓存、查看缓存状态。当用户说"初始化缓存"、"创建缓存"、"拉取资料"、"刷新缓存"、"更新缓存"、"同步资料"、"查看缓存"、"缓存状态"时触发此技能。
---

# Learning Cache Skill

## 功能范围
- 初始化知识缓存（拉取官方文档）
- 刷新知识缓存（更新最新资料）
- 查看缓存状态

---

## 模块资料来源配置

| 模块 | GitHub 仓库 | 官方文档 | 检测方式 |
|------|------------|---------|----------|
| ai-tools-fundamentals | anthropics/claude-code | code.claude.com/docs | 每次询问 |
| mcp-protocol | anthropic-ai/sdk-python | docs.anthropic.com | 每次询问 |
| agent-configuration | anthropic-ai/sdk-python | docs.anthropic.com | 每次询问 |
| mcp-advanced-config | anthropic-ai/sdk-python | docs.anthropic.com | 每次询问 |
| ai-orchestration | OpenClaw/openclaw | docs.openclaw.org | 每次询问 |
| ai-resources-research | - | - | 每次询问 |
| config-management | - | - | 每次询问 |
| spec-driven-dev | anthropics/spec-kit | github.com/anthropics | 每次询问 |
| practical-projects | - | - | 每次询问 |

> 💡 **自定义模块**：添加新模块时，在模块的 `README.md` 中配置学习资源链接。

---

## 初始化知识缓存

**触发方式**（任意一种）：
- "初始化知识缓存 `<模块名>`" / "创建知识缓存 `<模块名>`" / "新建缓存 `<模块名>`"
- "拉取资料 `<模块名>`" / "获取资料 `<模块名>`" / "下载文档 `<模块名>`"
- "初始化缓存" / "创建缓存"（询问模块名）

**执行步骤**：

1. 从配置获取模块资料来源

2. 拉取官方资料（使用 MCP 工具，优化参数：`retain_images=false`，`timeout=20`）

3. 创建模块知识缓存目录：
   ```
   XX-阶段名称/模块名/knowledge/
   ├── README.md           # 缓存说明
   ├── overview.md         # 概述内容
   ├── concepts.md         # 核心概念
   ├── guides.md           # 使用指南
   └── .metadata.json      # 缓存元数据
   ```

4. 结构化存储到缓存文件

5. 更新 `KNOWLEDGE_CACHE.md` 状态表

**优化参数说明**：
- `retain_images=false`：跳过图片下载，提升加载速度 50-70%
- `timeout=20`：20秒超时，适合大型文档

---

## 刷新知识缓存

**触发方式**（任意一种）：
- "刷新知识缓存" / "更新知识缓存" / "刷新缓存"
- "更新缓存" / "同步资料" / "刷新资料" / "更新文档"
- "刷新知识缓存 `<模块名>`" / "更新 `<模块名>` 缓存" / "`<模块名>` 刷新缓存"

**执行步骤**：

1. 显示当前缓存状态（从 `KNOWLEDGE_CACHE.md`）

2. 询问更新范围：
   - 1. 全部模块
   - 2. 指定模块

3. 拉取最新资料（使用优化参数：`retain_images=false`，`timeout=20`）

4. 更新缓存文件和 `.metadata.json`

5. 更新 `KNOWLEDGE_CACHE.md` 更新历史

**优化参数说明**：
- `retain_images=false`：跳过图片下载，提升加载速度 50-70%
- `timeout=20`：20秒超时，适合大型文档

---

## 查看知识缓存

**触发方式**（任意一种）：
- "查看知识缓存" / "知识缓存状态" / "缓存列表"
- "缓存状态" / "看看缓存" / "显示缓存" / "缓存情况"
- "知识缓存" / "文档缓存" / "资料缓存"

**执行步骤**：

1. 读取 `KNOWLEDGE_CACHE.md`

2. 显示缓存状态表

---

## 缓存目录结构

```
XX-阶段名称/模块名/knowledge/
├── README.md           # 缓存说明
├── overview.md         # 概述内容
├── concepts.md         # 核心概念
├── guides.md           # 使用指南
└── .metadata.json      # 缓存元数据
```

---

## .metadata.json 格式

```json
{
  "module": "ai-tools-fundamentals",
  "cache_date": "2026-03-07",
  "source_urls": [
    "https://code.claude.com/docs",
    "https://github.com/anthropics/claude-code"
  ],
  "files": ["overview.md", "concepts.md", "guides.md"],
  "version": "1.0"
}
```

---

## 理论知识展示行为规范

> 在学习过程中展示官方文档、概念解释、使用指南等理论知识时，AI 应遵循分块展示和用户确认机制，确保用户有充分时间理解内容。

### 适用范围

| 场景 | 示例 |
|------|------|
| 官方文档 | GitHub README、API 文档、技术规范 |
| 概念解释 | 术语定义、原理说明、架构描述 |
| 使用指南 | 安装步骤、配置说明、操作流程 |
| 理论知识 | 学习资料、教程内容、最佳实践 |

### 分块展示策略

**触发条件**：
- 展示内容超过 15 行
- 内容包含多个独立的逻辑单元（如多个概念、多个步骤）

**分块原则**：
- 按逻辑单元分块（如按概念、按步骤、按小节）
- 每块不超过 15 行（不含确认提示）
- 优先在自然段落边界分块

**示例**：
```
第 1/3 块：核心概念
[展示前 15 行内容]

═══════════════════════════════════
❓ 是否继续下一部分？
   - 回复任意内容继续
   - "跳过"进入下一步
   - "暂停"稍后继续
═══════════════════════════════════

[用户确认后...]

第 2/3 块：实现原理
[展示接下来的内容]
```

### 确认提示格式

```
═══════════════════════════════════
❓ 是否继续下一部分？
   - 回复任意内容继续
   - "跳过"进入下一步
   - "暂停"稍后继续
═══════════════════════════════════
```

### 用户响应处理

| 用户输入 | AI 行为 |
|---------|---------|
| 任意非指令内容（如"继续"、"好的"、"y"） | 继续展示下一块 |
| "跳过" | 跳过剩余理论内容，直接进入下一步操作 |
| "暂停" | 停止展示，告知用户可回复"继续"恢复 |
| "完成" | 结束理论展示，进入下一步操作 |

### 来源标注规范

| 内容类型 | 标注方式 | 示例 |
|----------|----------|------|
| 官方文档 | 文档名称 + 链接 | `来源：Claude Code 官方文档 https://code.claude.com/docs` |
| GitHub README | 仓库名 + 文件路径 | `来源：anthropics/claude-code/blob/main/README.md` |
| API 文档 | 文档标题 + URL | `来源：MCP SDK API Reference` |
| 缓存知识 | 缓存日期 | `来源：知识缓存 (2026-03-07)` |
| AI 生成内容 | 无需标注 | （直接展示） |

**标注格式**：
```
📚 来源：Claude Code 官方文档
https://code.claude.com/docs/getting-started

───────

[内容开始]
```

### 禁止行为

- ❌ 不要在展示完理论内容后自动继续下一步
- ❌ 不要推测用户已经读完内容
- ❌ 不要在用户未确认的情况下进入下一步
- ❌ 不要一次性展示超过 15 行的理论内容
- ❌ 不要因为 `accept edits on` 模式开启而省略理论确认

### 独立于 `accept edits on` 设置

> 重要说明：理论知识确认机制独立于文件编辑设置

- `accept edits on`：仅影响文件编辑操作，不影响理论展示
- 即使 `accept edits on` 开启，展示理论内容时仍需等待用户确认

---

## 注意事项

1. **缓存策略**：每次询问用户，而非自动判断过期，给予用户完全控制
2. **内容获取优化**：拉取网页内容时使用 `retain_images=false` 跳过媒体文件，提升加载速度
3. **日期格式**：统一使用 YYYY-MM-DD 格式
4. **文件路径**：所有路径相对于仓库根目录
