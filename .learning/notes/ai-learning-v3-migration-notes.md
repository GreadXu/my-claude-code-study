# 学习笔记：AI 技术学习（v3.0 迁移）

> 从 v3.0 的模块笔记迁移而来

## 📚 知识体系（按模块）


### ai-tools-fundamentals

# ai-tools-fundamentals 学习笔记

> **学习模式**：快速模式
> **开始日期**：2026-03-06
> **完成日期**：2026-03-07

---

## 学习记录

### 2026-03-06
- ✅ 阅读 overview.md（Claude Code 概述）
- ✅ 阅读 concepts.md（核心概念与架构）
- ✅ 阅读 guides.md（使用指南与命令参考）
- ✅ 创建 3 个学习书签：协作式模式、可控性、软隔离 vs 物理隔离

### 2026-03-07
- ✅ 学习 Claude Code 使用场景（开发工作流、高级工作流）
- ✅ 整理关键知识点清单（快速复习版）

---

## 核心概念

### 1. Tool Use（工具使用）
**定义**：Claude 可以主动调用外部工具来完成特定任务，而非仅仅生成文本响应。

**工作原理**：
- Claude 分析用户请求
- 判断需要调用哪些工具
- 构造工具调用参数
- 执行工具调用
- 将结果整合到响应中

**示例工具**：
- 📝 Edit - 文件编辑
- 🔍 Glob/Grep - 文件搜索
- 💻 Bash - 命令执行
- 📚 Read - 代码读取
- 🌐 WebFetch - 网络获取

### 2. Hook（钩子）
在特定事件发生时自动执行的脚本机制。

**触发时机**：
- 工具调用前（pre-hook）
- 工具调用后（post-hook）
- 用户提交编辑前

**用途**：代码格式化、语法检查、自动化测试、自定义验证

### 3. 权限系统
**权限类型**：
- 工具权限 - 控制哪些工具可以被调用
- 文件权限 - 控制 AI 可以访问的文件范围
- 命令权限 - 控制可以执行的命令类型

**权限模式**：
- 自动允许 - 安全操作自动执行
- 用户确认 - 需要用户明确授权
- 拒绝 - 禁止危险操作

### 4. 配置系统
**配置层级**：
1. 全局配置 - `~/.claude/settings.json`
2. 项目配置 - `./CLAUDE.md`

**CLAUDE.md 内容**：项目说明、AI 工作流程指令、自定义命令、输出风格

---

## 架构理解

### 四层架构
1. **CLI 交互层** - 命令行界面、用户输入处理、输出格式化
2. **Tool Use 引擎** - 工具调度、参数验证、结果处理
3. **权限管理系统** - 权限检查、用户提示、操作审计
4. **配置管理器** - 配置文件解析、环境变量处理、默认值管理

### 工作流程
```
用户输入 → CLI 解析 → Claude AI 处理 → 判断需要工具
    ↓
权限检查 ← 用户确认（如需要）
    ↓
执行工具调用 → 处理结果 → 返回给用户
```

### 关键设计原则
1. **透明性** - 所有操作向用户展示，明确显示工具调用过程
2. **可控性** - 用户保留最终决策权，可以审查每个操作
3. **安全性** - 默认最小权限原则，危险操作需要明确授权
4. **可扩展性** - 支持自定义工具、钩子、slash 命令

---

## 使用场景

### 开发工作流场景

| 场景类别 | 典型任务 | 使用工具 |
|----------|----------|----------|
| **代码理解** | 阅读陌生代码库 | `Read`、`Grep`、`Glob` |
| | 快速定位功能实现 | `Grep` 搜索关键函数 |
| | 理解项目结构 | `Glob` 查看目录树 |
| **Bug 修复** | 分析错误日志 | `Read` 查看日志、`Grep` 搜索错误码 |
| | 定位问题代码 | `Grep` 搜索相关函数 |
| | 应用修复 | `Edit` 修改代码 |
| **新功能开发** | 查找类似实现 | `Grep` 搜索相关代码 |
| | 生成新代码 | AI 生成 + `Edit` 插入 |
| | 运行测试验证 | `Bash` 执行测试 |
| **重构** | 批量重命名 | `Grep` 查找 + `Edit` 替换 |
| | 提取公共逻辑 | `Grep` 查找重复 + AI 重构 |
| **文档工作** | 生成 API 文档 | `Read` 代码 + AI 分析 |
| | 更新 README | `Read` 现有文档 + `Edit` 更新 |

### 高级工作流场景

| 场景类别 | 典型任务 | 关键特性 |
|----------|----------|----------|
| **Agent 编排** | 多步骤自动化任务 | 结合多个工具的复杂工作流 |
| | 批量文件处理 | `Glob` + 循环处理 |
| | 跨模块重构 | `Grep` 全局搜索 + 批量 `Edit` |
| **计划模式** | 大规模重构 | `/plan` 进入计划模式，先规划后执行 |
| | 复杂功能设计 | 分步骤设计，逐步验证 |
| | 架构变更 | 影响分析 + 分批实施 |
| **CI/CD 集成** | 自动化代码审查 | Hook 触发审查脚本 |
| | 提交前验证 | pre-hook 运行测试、lint |
| | 自动化部署 | post-hook 触发部署 |
| **学习与研究** | 学习新代码库 | AI 解释 + 交互式提问 |
| | 技术调研 | `WebFetch` 获取资料 |
| | 最佳实践探索 | `Grep` 查找示例代码 |

### 场景与工具映射

```
理解代码    →  Read + Glob + Grep
修改代码    →  Edit + Read (验证)
调试问题    →  Bash + Read + Grep
重构        →  Grep (查找) + Edit (修改)
自动化      →  Hook + Bash + 计划模式
学习研究    →  WebFetch + Read + AI 分析
```

---

## 配置与设置

### CLAUDE.md 基础结构
```markdown
# 项目说明

## 常用命令
| 命令 | 功能 |
|------|------|
| npm run dev | 启动开发服务器 |
| npm run test | 运行测试 |

## 注意事项
- 使用 TypeScript 编写
- 遵循 ESLint 规则
```

### 自定义 Slash 命令
在 CLAUDE.md 中定义，如 `/review` 用于代码审查

### 权限模式
| 模式 | 文件读取 | 文件编辑 | 命令执行 | 危险操作 |
|------|---------|---------|---------|---------|
| 默认模式 | ✅ 自动 | ⚠️ 确认 | ⚠️ 确认 | ❌ 拒绝 |
| 自动模式 | ✅ 自动 | ✅ 自动 | ⚠️ 确认 | ❌ 拒绝 |

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| `/help` | 显示帮助信息 | - |
| `/edit <file>` | 编辑文件 | - |
| `/read <file>` | 读取文件 | - |
| `/plan` | 进入计划模式 | - |
| `/grep <pattern>` | 搜索文件内容 | - |
| `/glob <pattern>` | 搜索文件名 | - |
| `/git status` | 查看 Git 状态 | - |
| `/git diff` | 查看文件差异 | - |
| `/git commit` | 提交更改 | - |

---

## 学习心得与总结

### 核心收获
1. **Tool Use 机制**是 Claude Code 与传统 AI 助手的根本区别，使 AI 从被动响应转变为主动协作
2. **权限系统**体现了"软隔离"的安全理念，通过细粒度控制而非物理隔离实现安全
3. **CLAUDE.md 配置**既控制 AI 行为，又是项目文档，体现了"配置即文档"的设计思想
4. **协作式设计**让 AI 成为助手而非替代，强调人在决策中的核心地位

### 待深入探索的主题
- 协作式模式的价值（书签 1）
- 可控性的体验（书签 2）
- 软隔离 vs 物理隔离（书签 3）

---

## 关键知识点清单（快速复习）

### 一分钟核心概念

| 概念 | 一句话解释 |
|------|-----------|
| **Tool Use** | Claude 主动调用外部工具完成任务的机制，而非被动生成文本 |
| **Hook** | 在特定事件（工具调用、编辑提交）时自动执行脚本的机制 |
| **权限系统** | 分层控制 AI 行为，用户保留危险操作的最终决策权 |
| **CLAUDE.md** | 项目级配置文件，既是 AI 指令也是项目文档 |

### 必知工具（5个）

| 工具 | 用途 | 使用场景 |
|------|------|----------|
| **Read** | 读取文件内容 | 理解代码、查看配置 |
| **Edit** | 编辑文件 | 修改代码、更新文档 |
| **Grep** | 搜索文件内容 | 查找函数、定位错误 |
| **Glob** | 搜索文件名 | 浏览项目结构、查找文件 |
| **Bash** | 执行命令 | 运行测试、安装依赖 |

### 配置层级

```
全局配置: ~/.claude/settings.json  (跨项目设置)
项目配置: ./CLAUDE.md              (项目专属)
```

### 四大设计原则

| 原则 | 含义 |
|------|------|
| **透明性** | 所有操作向用户展示 |
| **可控性** | 用户保留最终决策权 |
| **安全性** | 默认最小权限 |
| **可扩展性** | 支持自定义扩展 |

### 工具选择速查

```
想读代码？        → Read
想改代码？        → Edit
想找函数？        → Grep
想找文件？        → Glob
想跑测试？        → Bash
想批量处理？      → 计划模式 (/plan)
```

### 权限模式对比

| 操作类型 | 默认模式 | 自动模式 |
|----------|----------|----------|
| 读取文件 | ✅ 自动 | ✅ 自动 |
| 编辑文件 | ⚠️ 确认 | ✅ 自动 |
| 执行命令 | ⚠️ 确认 | ⚠️ 确认 |
| 危险操作 | ❌ 拒绝 | ❌ 拒绝 |

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### mcp-protocol

# mcp-protocol 学习笔记

> **学习模式**：快速模式
> **开始日期**：2026-03-07
> **完成日期**：2026-03-07

---

## 学习记录

### 2026-03-07
- ✅ 初始化知识缓存（overview, concepts, guides）
- ✅ 开始快速模式学习
- ✅ 完成 overview.md 阅读，理解 MCP 基本概念和架构
- ✅ 创建书签：当前项目作为 MCP Server 的可行性
- ✅ 完成 concepts.md 阅读，深入理解 MCP 核心概念与架构
- ✅ 完成 guides.md 阅读，学习 MCP 最佳实践和部署
- ✅ 整理关键知识点清单
- 🎉 快速模式学习全部完成

---

## 核心概念

### 什么是 MCP？

**Model Context Protocol (MCP)** 是一种开放标准，允许应用程序以标准化的方式为 LLM 提供上下文。它将提供上下文的关注点与实际的 LLM 交互分离开来。

### MCP 的三大组成部分

| 组件 | 定义 | 功能 |
|------|------|------|
| **MCP Server** | 提供上下文的应用程序 | 暴露工具、提供资源、定义提示 |
| **MCP Client** | 使用 Server 上下文的应用 | 发现、连接、调用工具/资源 |
| **Transports** | 通信机制 | stdio、HTTP、SSE 等 |

### 三种上下文类型

| 类型 | URI 格式 | 用途 | 示例 |
|------|----------|------|------|
| **工具** | `tool://<name>` | LLM 可调用的函数 | 数据库查询、API 调用 |
| **资源** | `resource://<path>` | LLM 可读取的数据 | 文件、日志、配置、**动态 MD** |
| **提示** | `prompt://<name>` | 可复用的提示模板 | 代码审查、文档生成 |

### MCP 核心价值

- **标准化**：统一的协议，一次构建多处使用
- **解耦**：上下文提供与 LLM 交互分离
- **可扩展**：支持多种上下文类型和传输方式
- **跨平台**：支持 stdio、HTTP 等多种传输层

---

## 架构理解

### MCP 五层架构

```
┌─────────────────────────────────────────┐
│         应用层              │
│     Claude Desktop, AI IDEs            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        MCP Client Layer                 │
│    连接管理、协议处理、工具调用          │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Transport Layer                  │
│      stdio / HTTP / SSE                 │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        MCP Server Layer                 │
│   工具执行、资源提供、提示管理           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       数据源 / 服务                      │
│  文件系统、数据库、API、外部服务         │
└─────────────────────────────────────────┘
```

### 架构设计原则

| 原则 | 实现 |
|------|------|
| **分层解耦** | 应用-客户端-传输-服务器-数据，五层独立 |
| **协议统一** | 基于 JSON-RPC 2.0 的标准化通信 |
| **传输抽象** | Transports 层抽象，支持多种通信方式 |
| **类型分离** | 工具（执行）、资源（读取）、提示（模板）分离 |

### MCP Server 生命周期

1. **启动阶段**：Server 启动，初始化资源，等待连接
2. **初始化阶段**：交换能力信息，建立 Session
3. **运行阶段**：处理工具调用、提供资源访问、管理提示
4. **关闭阶段**：处理未完成请求，保存状态，释放资源

### 三种交互模式

| 模式 | 特点 | 适用场景 |
|------|------|----------|
| **同步模式** | 请求-响应 | 简单查询、状态获取 |
| **流式模式** | 持续数据流 | 大文件传输、实时生成 |
| **订阅模式** | 实时推送 | 日志监控、数据更新 |

### MCP 协议消息（JSON-RPC 2.0）

**核心方法**：
- `initialize` - 初始化连接
- `tools/list` - 列出可用工具
- `tools/call` - 调用工具
- `resources/list` - 列出可用资源
- `resources/read` - 读取资源
- `prompts/list` - 列出可用提示
- `prompts/get` - 获取提示内容

---

## 最佳实践

### 工具设计原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **单一职责** | 每个工具只做一件事 | `read_file` 而非 `file_operations` |
| **清晰命名** | 使用动词+名词 | `create_user` 而非 `user` |
| **详细描述** | 说明功能和用途 | "创建新用户，需要邮箱和用户名" |
| **明确 Schema** | 定义清晰的输入输出 | 使用 JSON Schema |

### 资源组织策略

| 策略 | 说明 | URI 示例 |
|------|------|----------|
| **按类型** | 资源类型在前 | `resource://file/config` |
| **按层级** | 反映数据层级 | `resource://db/users/123` |
| **按环境** | 区分环境 | `resource://prod/api/status` |

### 错误处理最佳实践

- 返回有意义的错误信息
- 提供解决建议
- 使用适当的错误码
- 记录详细的错误日志

### 安全考虑

| 风险 | 防护措施 |
|------|----------|
| **路径遍历** | 验证和规范化路径 |
| **命令注入** | 使用参数化查询 |
| **敏感数据** | 加密传输和存储 |
| **权限提升** | 实施最小权限原则 |

---

## 配置与设置

### Claude Desktop 配置

在 `~/Library/Application Support/Claude/claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/server.js"]
    }
  }
}
```

### stdio 传输配置
```json
{
  "command": "node",
  "args": ["server.js"],
  "env": {}
}
```

### HTTP 传输配置
```json
{
  "url": "https://api.example.com/mcp",
  "headers": {
    "Authorization": "Bearer xxx"
  }
}
```

---

## 常见模式

### 1. 分页处理
```typescript
server.setRequestHandler('tools/call', async (request) => {
  const { page = 1, limit = 10 } = request.params.arguments;
  const offset = (page - 1) * limit;
  const results = await fetchPaginated(offset, limit);
  return {
    content: [{ type: 'text', text: JSON.stringify(results) }],
    _meta: { page, limit, hasMore: results.length === limit }
  };
});
```

### 2. 流式响应
```typescript
server.setRequestHandler('tools/call', async (request) => {
  const stream = getDataStream();
  return {
    content: [{ type: 'text', text: stream }],
    _meta: { stream: true }
  };
});
```

### 3. 缓存资源
```typescript
const cache = new Map();
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params;
  if (cache.has(uri)) return { contents: [cache.get(uri)] };
  const data = await fetchResource(uri);
  cache.set(uri, data);
  return { contents: [data] };
});
```

---

## 调试技巧

### 1. 日志记录
```typescript
if (process.env.NODE_ENV === 'development') {
  server.on('request', (request) => {
    console.log('[MCP Request]', request.method, request.params);
  });
}
```

### 2. 验证工具
使用 Zod 进行输入验证

### 3. 测试工具
- MCP Inspector: `npx @modelcontextprotocol/inspect`
- 单元测试框架

---

## 部署建议

### 本地开发
- 使用 stdio 传输
- 热重载支持
- 详细日志

### 生产环境
- 使用 HTTP 传输
- 负载均衡
- 错误监控
- 限流保护

### Docker 部署
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "server.js"]
```

---

## 权限与安全

### 权限模型

| 级别 | 说明 | 示例 |
|------|------|------|
| **读取** | 只读访问 | 读取文件、查询数据 |
| **写入** | 修改数据 | 写入文件、更新记录 |
| **执行** | 运行命令 | 执行脚本、调用 API |
| **危险** | 高风险操作 | 删除文件、系统更改 |

### 安全特性

- **显式授权**：危险操作需要用户确认
- **作用域限制**：限制可访问的资源范围
- **审计日志**：记录所有操作
- **传输安全**：支持 TLS/SSL

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| `npm install @modelcontextprotocol/server` | 安装 MCP Server SDK | - |
| `npm install @modelcontextprotocol/client` | 安装 MCP Client SDK | - |
| `npx @modelcontextprotocol/inspect` | MCP Inspector 调试工具 | 测试 Server |
| `initialize` | 初始化 MCP 连接 | - |

---

## 关键知识点清单（快速复习）

### 一句话概念

| 概念 | 一句话解释 |
|------|-----------|
| **MCP** | Model Context Protocol - AI 上下文提供的开放标准 |
| **MCP Server** | 提供工具、资源、提示给 AI 的应用 |
| **MCP Client** | 连接并使用 MCP Server 的应用（如 Claude Desktop） |
| **Transports** | Server 与 Client 之间的通信机制（stdio/HTTP） |

### 三种上下文类型速查

| 类型 | 是什么 | URI 格式 | 典型用途 |
|------|--------|----------|----------|
| **工具** | AI 调用的函数 | `tool://<name>` | 执行操作（查询、写入、计算） |
| **资源** | AI 读取的数据 | `resource://<path>` | 获取信息（文件、日志、配置） |
| **提示** | 可复用的提示模板 | `prompt://<name>` | 标准化任务（代码审查、文档生成） |

### 核心协议方法

```
初始化阶段:
  initialize        → 建立连接，交换能力

工具操作:
  tools/list       → 列出可用工具
  tools/call       → 调用工具执行

资源操作:
  resources/list   → 列出可用资源
  resources/read   → 读取资源内容

提示操作:
  prompts/list     → 列出可用提示
  prompts/get      → 获取提示内容
```

### 架构层次（5层）

```
应用层 → Client层 → Transport层 → Server层 → 数据层
 ↓        ↓         ↓            ↓          ↓
用户    AI 应用    通信协议    MCP服务    实际数据
```

### 传输方式选择

| 方式 | 适用场景 | 优点 |
|------|----------|------|
| **stdio** | 本地开发、测试 | 简单、无需配置 |
| **HTTP** | 远程服务、生产环境 | 可扩展、支持负载均衡 |

### 交互模式速查

| 模式 | 特点 | 何时使用 |
|------|------|----------|
| **同步** | 请求-响应 | 简单查询 |
| **流式** | 持续数据流 | 大文件、实时生成 |
| **订阅** | 实时推送 | 日志监控、数据更新 |

### 工具设计四原则

1. **单一职责** - 每个工具只做一件事
2. **清晰命名** - 动词+名词（如 `read_file`）
3. **详细描述** - 说明功能和用途
4. **明确 Schema** - 定义输入输出

### 安全检查清单

- [ ] 路径遍历防护：验证和规范化路径
- [ ] 命令注入防护：使用参数化查询
- [ ] 敏感数据保护：加密传输和存储
- [ ] 权限最小化：只授予必要权限

### 常用命令速查

| 命令 | 功能 |
|------|------|
| `npm install @modelcontextprotocol/server` | 安装 Server SDK |
| `npm install @modelcontextprotocol/client` | 安装 Client SDK |
| `npx @modelcontextprotocol/inspect` | 启动调试工具 |

### Claude Desktop 配置路径

| 平台 | 配置文件路径 |
|------|-------------|
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **Linux** | `~/.config/Claude/claude_desktop_config.json` |

---

## 学习心得与总结

### 核心收获

1. **MCP 的分层架构设计非常清晰**，每层职责独立，易于理解和扩展
2. **JSON-RPC 2.0 作为通信协议**，简单且标准化，降低了实现复杂度
3. **三种上下文类型（工具、资源、提示）** 覆盖了 AI 与数据交互的所有场景
4. **多种交互模式（同步、流式、订阅）** 让 MCP 能适应不同的应用需求
5. **动态 Markdown 文件可以作为资源**，这为项目作为 MCP Server 提供了可能

### 实践要点

1. **工具设计要遵循单一职责**：每个工具只做一件事，便于复用和维护
2. **安全是首要考虑**：路径遍历、命令注入等风险需要主动防范
3. **调试工具很重要**：MCP Inspector 可以帮助快速测试 Server
4. **根据环境选择传输方式**：本地用 stdio，生产用 HTTP
5. **错误处理要友好**：提供清晰的错误信息和解决建议

### 重要理解

- **工具 vs 资源**：工具是 LLM 调用的函数（执行操作），资源是 LLM 读取的数据（获取信息）
- **stdio vs HTTP**：stdio 适合本地开发，HTTP 适合远程和微服务
- **动态资源**：内容实时生成的资源（如从数据库生成的 Markdown 报告）
- **Claude Desktop**：官方桌面客户端，通过 MCP 连接自定义 Server

### 待深入探索的主题

- 当前项目作为 MCP Server 的具体实现（书签 1）
- MCP 的实际应用场景和最佳实践
- 如何创建一个生产级的 MCP Server
- Python SDK 的使用和实现

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 动态 Markdown 文件可以作为 MCP 资源吗？ | 可以！资源是按内容类型（静态/动态/可订阅）区分，而非文件格式。Markdown 是文本格式，完全适合作为资源，且 AI 友好。 |
| 如何选择传输方式？ | 本地开发用 stdio，远程/生产环境用 HTTP |
| 工具和资源的区别是什么？ | 工具是 LLM 调用的函数（执行操作），资源是 LLM 读取的数据（获取信息） |
| Claude Desktop 是什么？ | Anthropic 官方桌面应用，支持 MCP 连接，可扩展 Claude 能力 |
| TypeScript 和 Python SDK 选哪个？ | 根据技术栈选择：Node.js/Web 用 TypeScript，数据科学/Python 后端用 Python |

### agent-configuration

# agent-configuration 学习笔记

> **学习模式**：完整模式
> **开始日期**：2026-03-09
> **完成日期**：待定

---

## 学习记录

- **2026-03-09**: 开始完整模式学习，初始化知识缓存
- **2026-03-09**: 完成 SDK 概述学习
  - TypeScript SDK 基本概念和安装
  - Messages API、工具使用、流式响应
  - MCP 集成
- **2026-03-09**: 完成核心概念学习
  - Agent vs Chatbot 的区别
  - 工具调用（Tool Use）机制
  - 循环控制（Loop Control）
  - 状态管理（内部状态 vs 上下文）
  - 多步骤推理
  - Agent 类型（信息检索、任务执行、编程辅助、领域专用）
  - 工具定义方式（Zod Schema、JSON Schema）
  - 参数设置和错误处理
  - Agent 设计原则

---

## 核心概念

### Agent vs Chatbot

| 特性 | Chatbot | Agent |
|------|---------|-------|
| 响应方式 | 被动响应 | 自主决策 |
| 交互模式 | 单轮交互 | 多步骤推理 |
| 能力边界 | 无工具能力 | 工具调用 + API |
| 运行机制 | 请求-响应 | 循环控制直到完成 |

**关键转变**：从"问答系统"到"任务执行系统"

### Agent 四大核心能力

1. **工具调用 (Tool Use)**
   - Claude 根据需要调用预定义工具
   - `toolRunner` 自动处理调用流程
   - 工具需要清晰的 schema 和 description

2. **循环控制 (Loop Control)**
   ```
   接收输入 → 分析任务 → 选择工具 → 执行工具 → 处理结果 → 判断完成
        ↑                                              ↓
        └──────────────── 未完成则继续 ──────────────────┘
   ```

3. **状态管理**
   - **API 可见状态**：messages、toolResults（进入上下文）
   - **内部状态**：currentStep、completed（控制逻辑，不发送给 API）

4. **多步骤推理**
   - 将复杂任务分解为多个步骤
   - 每步可能调用不同工具
   - 依赖前一步的结果继续推理

### Agent 类型

- **信息检索型**：搜索、查询、整合信息
- **任务执行型**：API 调用、文件操作、数据处理
- **编程辅助型**：代码生成、执行、测试
- **领域专用型**：数据分析、客服、写作等

---

## 架构理解

### SDK 分层设计

```
┌─────────────────────────────────────┐
│     Claude Code (完整 IDE)          │  ← 顶层：AI 开发环境
├─────────────────────────────────────┤
│     Agent SDK (高级抽象)            │  ← 中层：工具编排、状态管理
├─────────────────────────────────────┤
│   TypeScript SDK (基础 API)         │  ← 底层：直接 API 访问
├─────────────────────────────────────┤
│        Claude API                   │  ← 接口层
└─────────────────────────────────────┘
```

### TypeScript SDK 架构

- **Messages API**：与 Claude 交互的主要方式
- **工具使用**：`betaZodTool`、`toolRunner`
- **流式响应**：Server Sent Events (SSE)
- **MCP 集成**：`mcpTools`、`mcpMessages` 辅助函数

### 内部状态 vs 上下文

```typescript
interface AgentState {
  messages: Message[];      // ✅ 进入上下文（对话历史）
  toolResults: ToolResult[]; // ✅ 进入上下文（工具结果）
  currentStep: number;       // ❌ 内部使用（控制逻辑）
  completed: boolean;        // ❌ 内部使用（完成判断）
}
```

**设计原则**：
- 只有对话相关的信息进入 API 上下文
- 控制逻辑变量保留在 Agent 内部
- 节省 Token，保护实现细节

---

## 配置与设置

### TypeScript 基础

**什么是 TypeScript**：
- JavaScript 的超集，添加静态类型检查
- 编译后生成 JavaScript 代码
- 提供 IDE 智能补全和编译时错误检查

**核心概念**：
```typescript
// 基本类型
let name: string = "Alice";
let age: number = 25;

// Interface 定义对象结构
interface User {
  name: string;
  age: number;
  email?: string;  // 可选
}

// 函数类型
function greet(user: User): string {
  return `Hello ${user.name}`;
}
```

### Zod Schema

**什么是 Zod**：
- 运行时类型验证库
- 单一来源定义：既是类型又是验证器

**基本用法**：
```typescript
import { z } from 'zod';

// 定义 schema
const UserSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
  email: z.string().email().optional(),
});

// 运行时验证
const user = UserSchema.parse(data);

// 类型推导
type User = z.infer<typeof UserSchema>;
```

**在 Agent 中的应用**：
```typescript
const weatherTool = betaZodTool({
  name: 'get_weather',
  inputSchema: z.object({
    location: z.string().describe('城市名称'),
    unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
  run: (input) => {
    // input 类型自动推断
    return getWeather(input.location, input.unit);
  },
});
```

### 模型参数配置

| 参数 | 说明 | 建议值 |
|------|------|--------|
| `model` | 模型选择 | `claude-sonnet-4-5-20250929` |
| `max_tokens` | 输出 token 限制 | 1024-4096（根据任务复杂度） |
| `temperature` | 温度（0-1） | 0-0.3（稳定）/ 0.7-1（创造性） |

### 运行时环境

| 运行时 | 用途 | TypeScript 支持 |
|--------|------|----------------|
| **Node.js** | 服务器端 | 需要编译或 ts-node |
| **Deno** | 现代运行时 | 原生支持 TS |
| **Bun** | 高性能运行时 | 原生支持 TS |
| **浏览器** | 客户端 | 需要打包 |

---

## 常用命令/操作

### SDK 安装和初始化

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| `npm install @anthropic-ai/sdk` | 安装 TypeScript SDK | 需要Node.js 20+ |
| `npm install zod` | 安装 Zod 验证库 | 配合 SDK 使用 |
| `export ANTHROPIC_API_KEY=xxx` | 设置 API Key | 推荐使用环境变量 |

### 创建工具

```typescript
// 使用 Zod Schema（推荐）
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';

const tool = betaZodTool({
  name: 'tool_name',
  inputSchema: z.object({
    param: z.string(),
  }),
  description: '工具描述',
  run: async (input) => {
    // 工具逻辑
    return result;
  },
});
```

### 工具执行

```typescript
// 使用 toolRunner 自动处理循环
const result = await anthropic.beta.messages.toolRunner({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '用户消息' }],
  tools: [tool1, tool2, tool3],
});
```

### 错误处理

```typescript
// API 错误
try {
  await client.messages.create({...});
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.log(error.status);  // 400, 401, 429, 500
    console.log(error.name);    // 错误类型
  }
}

// 工具错误
import { ToolError } from '@anthropic-ai/sdk/lib/tools/BetaRunnableTool';

if (invalidInput) {
  throw new ToolError('详细的错误信息');
}
```

### 使用本地模型

```typescript
// 方案 1：LangChain
import { ChatOllama } from '@langchain/ollama';
const ollama = new ChatOllama({
  model: 'llama3.2',
  baseUrl: 'http://localhost:11434',
});

// 方案 2：OpenAI SDK + Ollama
import OpenAI from 'openai';
const client = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
});
```

---

## 学习心得与总结

### 关键收获

1. **Agent 的本质是循环**
   - 不是一次性的请求-响应，而是持续的自我驱动循环
   - 每轮评估"任务完成了吗？"，未完成则继续
   - 这让 Agent 能处理复杂的多步骤任务

2. **状态管理的艺术**
   - 内部状态 vs 上下文的分离很重要
   - 只有对话相关的内容进入 API 上下文
   - 控制逻辑保留在 Agent 内部，节省 Token

3. **工具描述的重要性**
   - Claude 依赖工具的 description 来理解何时使用
   - 就像给 AI 写"使用说明书"
   - 好的描述能让 Agent 更聪明地选择工具

4. **TypeScript 和 Zod 的价值**
   - TypeScript 提供编译时类型安全
   - Zod 提供运行时验证
   - 两者结合构成完整的类型安全系统

### Agent 设计原则

- **单一职责**：每个 Agent 专注一种任务
- **工具组合**：简单工具组合实现复杂功能
- **状态最小化**：只保存必要的状态
- **可观察性**：提供清晰的日志
- **优雅降级**：失败时提供备选方案

### 学习路径建议

1. 先用云端 API 理解概念（Claude 质量最高）
2. 再考虑本地模型（降低成本、保护隐私）
3. 使用 LangChain 等框架实现多模型切换

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| **内部状态和上下文的关系** | 内部状态 = Agent 的"大脑"（控制逻辑），上下文 = 和 AI 的"对话记录"。只有 messages 和 toolResults 会进入上下文，currentStep 和 completed 是内部变量 |
| **可以使用本地部署的大模型吗？** | Anthropic SDK 只支持 Claude API。要使用本地模型，可以用：1）LangChain/Vercel AI SDK（统一接口）2）OpenAI SDK + Ollama（兼容接口）3）直接 HTTP 请求 |
| **TypeScript 和 Zod 是什么？** | TypeScript 是 JavaScript 的类型安全超集（编译时检查），Zod 是运行时验证库。两者结合提供完整的类型安全。用于 Node.js、浏览器等运行时 |
| **工具调用的循环如何控制？** | 使用 `toolRunner` 自动处理。手动实现需要：1）发送请求 2）检查是否有 tool_use 3）执行工具 4）将结果加入 messages 5）重复直到完成 |
| **如何选择 Token 限制？** | 简单任务 512-1024，中等 1024-2048，复杂 2048-4096。Agent 应用建议 2048+，因为需要生成多步骤计划 |

### ai-orchestration

# ai-orchestration 学习笔记

> **学习模式**：完整模式
> **开始日期**：2026-03-09
> **完成日期**：待定

---

## 学习记录

- **2026-03-09**: 开始完整模式学习，初始化知识缓存
  - 完成 OpenClaw 项目概述学习
  - 了解核心架构和设计理念
  - 掌握 Gateway 架构和 Channel 系统
  - 完成核心概念学习（14 个关键概念）
  - 创建 3 个书签用于后续探索

- **2026-03-10**: 基础操作练习 + Agent 协作概念探索
  - ✅ 完成基础操作练习（3 个练习）
  - ✅ 掌握 15+ 个核心命令
  - ✅ 理解会话管理机制（/new, /reset, /compact）
  - ✅ 学习 Skills 系统原理
  - ✅ 深入理解子代理、多 Agent、Agent Team 概念
  - ✅ 掌握 sessions_spawn 和 subagents 的区别
  - 📖 创建书签：Agent 协作探索
  - 📚 创建学习文档：docs/OPENCLAW_COMMANDS.md

- **2026-03-11**: Skills 系统深入 + Coding-Agent 高级用法
  - ✅ Skills 系统深度分析（52 个 Skills，9 个就绪）
  - ✅ Skill 元数据结构（name, description, metadata, requirements）
  - ✅ 依赖检查机制（anyBins vs allBins）
  - ✅ 语义匹配原理（description 作为匹配依据）
  - ✅ Coding-Agent 高级用法
    - Claude Code 模式：--print、交互模式、Session 模式
    - Codex 模式：PTY 要求、--yolo、--full-auto
    - 后台会话管理：process 工具（list, poll, log, submit, write, kill）
  - ✅ 多轮对话机制
    - 后台交互模式：持续运行 + process 实时通信
    - Session 模式：持久化存储 + 分步执行
  - ✅ 模式选择决策树：--print vs 交互式 vs Session
  - 📚 进阶场景：批量 PR 审查、Git Worktree 并行开发

- **2026-03-12**: MCP 协议复习 + AI 上下文理解
  - ✅ MCP 核心概念回顾
    - 三大组成部分：MCP Server、MCP Client、Transports
    - 三种上下文类型：工具、资源、提示
    - 五层架构：应用层 → Client层 → Transport层 → Server层 → 数据层
  - ✅ 深入理解"MCP 是为 AI 上下文提供的开发标准"
    - 上下文 = AI 能看到和使用的工具、数据、提示
    - 开发标准 = 统一的通信协议、接口规范、数据格式
    - 类比：MCP = AI 世界的 USB 标准
  - ✅ MCP、Skill 和应用的协作关系
    - 应用开放 MCP Server
    - AI 应用通过 MCP Client 连接
    - Skill 可以作为 MCP Client 调用外部服务
    - 一次构建，到处使用
  - ✅ Slack 协作平台介绍
    - 企业级即时通讯和协作平台
    - 核心功能：频道、私信、文件共享、集成、搜索、工作流
    - MCP 应用场景：自动化通知、会议记录、消息发送

---

## 核心概念

### OpenClaw 定位
- **AI 编排系统**：提示词（prompts）、工具（tools）、协议（protocols）和集成（integrations）的协调平台
- **目标**：打造一个真正能做事情的个人助手
- **特点**：易于使用、支持广泛的平台、尊重隐私和安全

### Gateway 架构（核心）
```
消息渠道层 → Gateway（网关）→ Agent 运行时 → AI 模型提供商
```
- **Gateway**：消息路由、调度、会话管理、安全控制
- **Agent 运行时**：提示词执行、工具调用、内存管理
- **分层设计**：每层职责清晰，易于扩展

### Agent 工作空间
- **默认路径**：`~/.openclaw/workspace`
- **核心文件**：
  - `AGENTS.md` - Agent 行为指令
  - `SOUL.md` - Persona 和性格定义
  - `TOOLS.md` - 工具使用指南
  - `HEARTBEAT.md` - 心跳任务指令
  - `MEMORY.md` - 长期知识库
- **建议**：使用 git 进行版本化管理

### Channels（渠道系统）
- **内置渠道**：WhatsApp、Telegram、Discord、iMessage、Web
- **插件渠道**：Mattermost 等
- **安全配置**：使用 `allowFrom` 限制消息来源

### 会话管理
- **作用域**：per-sender（每个发送者独立会话）
- **重置触发器**：`/new`、`/reset`
- **重置策略**：daily（每日）、manual（手动）、idle（空闲）
- **压缩命令**：`/compact [instructions]` 压缩上下文

### 心跳系统
- **默认间隔**：30 分钟
- **默认状态**：开启（但建议初始禁用）
- **禁用方法**：设置 `heartbeat.every: "0m"`
- **行为**：读取 `HEARTBEAT.md` 并执行任务

### 安全模型
- **两手机设置**：个人手机 + 助手手机（推荐）
- **安全建议**：
  1. 始终设置 `allowFrom`
  2. 使用专用 WhatsApp 号码
  3. 初始禁用心跳，信任后再启用

### 插件系统
- **设计理念**：Core 保持精简，可选功能插件化
- **分发方式**：NPM 包分发 + 本地扩展加载
- **社区市场**：ClawHub (clawhub.ai)

### 内存系统
- **特殊插件槽**：同时只能激活一个内存插件
- **可选方案**：文件系统、LanceDB（向量搜索）、SQLite

### MCP 集成
- **实现方式**：通过 `mcporter` 桥接
- **优势**：无需重启 Gateway 即可更改 MCP 服务器

---

## MCP 协议复习

### MCP 核心概念回顾

#### 什么是 MCP？
**Model Context Protocol (MCP)** 是一种开放标准，允许应用程序以标准化方式为 LLM（如 Claude）提供上下文。

**核心价值**：
- 统一协议，一次构建多处使用
- 将"提供上下文"与"LLM 交互"分离
- 支持多种通信方式（stdio、HTTP）

#### 三大组成部分
| 组件 | 角色 | 功能 |
|------|------|------|
| **MCP Server** | 提供方 | 暴露工具、提供资源、定义提示 |
| **MCP Client** | 使用方 | 发现、连接、调用工具/资源 |
| **Transports** | 通信层 | stdio、HTTP、SSE 等 |

#### 三种上下文类型
| 类型 | URI 格式 | 用途 | 示例 |
|------|----------|------|------|
| **工具** | `tool://<name>` | LLM 调用的函数 | 数据库查询、API 调用、文件操作 |
| **资源** | `resource://<path>` | LLM 读取的数据 | 文件、日志、配置、动态 MD |
| **提示** | `prompt://<name>` | 可复用的提示模板 | 代码审查、文档生成 |

**关键区别**：
- **工具** = 执行操作（写入、计算）
- **资源** = 获取信息（读取）
- **提示** = 标准化任务流程

#### 五层架构
```
应用层 → Client层 → Transport层 → Server层 → 数据层
 ↓        ↓         ↓            ↓          ↓
用户    AI 应用    通信协议    MCP服务    实际数据
```

#### 核心协议方法
```
初始化:
  initialize        → 建立连接

工具操作:
  tools/list       → 列出工具
  tools/call       → 调用工具执行

资源操作:
  resources/list   → 列出资源
  resources/read   → 读取资源

提示操作:
  prompts/list     → 列出提示
  prompts/get      → 获取提示
```

---

### 深入理解"MCP 是为 AI 上下文提供的开发标准"

#### 上下文 (Context) 的含义
**在 AI 对话中，"上下文" = AI 能"看到"和"使用"的信息和工具**

**示例对比**：

没有上下文的情况：
```
用户："帮我查询数据库中的订单信息"
Claude："我不能直接访问数据库，请把数据给我。"
```

有了 MCP 上下文的情况：
```
用户："帮我查询数据库中的订单信息"
Claude："让我调用工具查询..."
      → tools/call "query_orders"
      → 返回数据
Claude："找到了 15 个订单，其中..."
```

#### 开发标准 (Development Standard) 的含义

**MCP 之前的混乱**：
```
每个 AI 应用需要单独对接不同的服务：
Claude ──→ Google Drive API
Claude ──→ Slack API
Claude ──→ GitHub API
Claude ──→ PostgreSQL
Claude ──→ ...每个都要写一套代码

问题：
1. 每个服务的接口都不一样
2. 维护成本高
3. 新服务接入麻烦
```

**有了 MCP 之后**：
```
统一标准接口：
Claude ──→ MCP Client ──→ MCP Server ──→ 任意服务
                      (标准协议)

好处：
1. 一次适配，多处使用
2. 新服务只需写 MCP Server
3. AI 应用无需关心底层实现
```

#### 类比理解

**类比 1：USB 标准**
```
没有 USB 标准：
每个设备都有自己独特的接口

有了 USB 标准：
一个接口连接所有设备

MCP = AI 世界的 USB
```

**类比 2：浏览器标准**
```
没有 Web 标准：
每个浏览器渲染网页都不一样

有了 Web 标准：
一个 HTML 文件到处运行

MCP = AI 应用的 Web 标准
```

#### MCP 标准化的内容

**1. 通信协议**：JSON-RPC 2.0
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {"table": "orders", "limit": 10}
  },
  "id": 1
}
```

**2. 上下文类型**：工具、资源、提示

**3. 接口规范**：RESTful 风格的方法
- initialize、tools/list、tools/call
- resources/list、resources/read
- prompts/list、prompts/get

---

### MCP、Skill 和应用的协作关系

#### 协作架构
```
┌─────────────────────────────────────────┐
│      OpenClaw Agent (星火)              │
│                                         │
│  ┌─────────────┐      ┌─────────────┐ │
│  │  Skill 1    │      │  Skill 2    │ │
│  │  (学习管理)  │      │  (GitHub)   │ │
│  └─────────────┘      └─────────────┘ │
│         │                    │         │
└─────────┼────────────────────┼─────────┘
          │                    │
          │         连接 MCP Server
          ▼                    ▼
     ┌─────────────────────────────┐
     │      MCP Client Layer       │
     └─────────────────────────────┘
          │         │         │
          ▼         ▼         ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │   Git   │ │  Slack  │ │Database │
    │  Server │ │  Server │ │ Server  │
    └─────────┘ └─────────┘ └─────────┘
```

#### 协作方式
| 方式 | 描述 | 示例 |
|------|------|------|
| **Skill 作为 MCP Client** | Skill 主动连接外部 MCP Server | 学习 Skill 连接 Git Server |
| **Skill 直接实现功能** | Skill 自己实现功能，不依赖 MCP | learning-tools 直接操作文件 |
| **混合模式** | 部分功能通过 MCP，部分自己实现 | 既有本地逻辑，又有外部调用 |

#### 完整生态系统
```
AI 应用层 (支持 MCP)
  ├─ Claude Desktop
  ├─ Cursor AI
  └─ OpenClaw Agent
         │
         ▼
    MCP Client Layer
         │
         ▼
    MCP Network
  ├─ Git Server
  ├─ Slack Server
  ├─ GitHub Actions
  ├─ Database Server
  └─ ... (任意应用)
```

#### 应用示例

**GitHub 作为 MCP Server**：
```
GitHub MCP Server
  ├─ 工具: create_issue, list_prs, review_code
  ├─ 资源: repo_content, issue_comments
  └─ 提示: code_review_template

Claude Desktop → "帮我审查这个 PR"
Cursor AI → "创建一个 issue"
OpenClaw Agent (GitHub Skill) → "检查我的 issue"
```

**Slack 作为 MCP Server**：
```
Slack MCP Server
  ├─ 工具: send_message, list_channels, create_channel
  └─ 资源: channel_history, user_messages

AI 应用 → "把这条消息发到 #general 频道"
AI 应用 → "帮我总结 #dev-team 的讨论"
```

---

### Slack 协作平台介绍

#### 基本介绍
| 方面 | 说明 |
|------|------|
| **类型** | 团队沟通和协作软件 |
| **用途** | 即时消息、文件共享、工作流集成 |
| **定位** | 企业级（类似微信/钉钉） |
| **官网** | slack.com |

#### 核心功能
```
1. 频道
   → 类似微信群，按话题/项目/团队划分

2. 私信
   → 一对一聊天

3. 文件共享
   → 直接分享图片、文档、代码

4. 集成
   → 连接 GitHub、Jira、Google Drive 等第三方服务

5. 搜索功能
   → 搜索历史消息和文件

6. 工作流
   → 自动化重复性操作
```

#### 与微信/钉钉对比
| 功能 | Slack | 微信 | 钉钉 |
|------|-------|------|------|
| **使用场景** | 企业团队 | 社交+工作 | 企业办公 |
| **频道/群组** | 频道 | 群聊 | 群聊 |
| **第三方集成** | 极丰富 | 较少 | 中等 |
| **开发者 API** | 完善开放 | 有限 | 开放 |
| **国际化** | 全球化 | 主力在中国 | 主力在中国 |

#### 在 MCP 上下文中的作用

**场景：自动化通知**
```
AI 检测到代码部署失败
  → 调用 Slack MCP Server
  → 发送消息到 #ops-alerts 频道
```

**场景：会议记录**
```
AI 分析团队讨论
  → 调用 Slack MCP Server
  → 读取频道历史消息
  → 生成会议纪要
```

---

### 核心要点总结

| 概念 | 理解 |
|------|------|
| **上下文** | AI 能看到和使用的工具、数据、提示 |
| **开发标准** | 统一的通信协议、接口规范、数据格式 |
| **MCP** | AI 世界的数据交换标准 |
| **类比** | USB、Web 标准、API 规范 |
| **核心价值** | 一次编写，多处使用 |
| **Skill 角色** | 可以作为 MCP Client 连接外部服务 |
| **Slack** | 企业级团队协作平台，类似微信/钉钉 |

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## Skills 系统深入

### Skill 元数据结构
```yaml
---
name: skill-name
description: '功能描述 + 使用场景 + 排除条件'
metadata:
  {
    "openclaw": {
      "emoji": "🎯",
      "requires": {
        "anyBins": ["cli-tool"],  # 任意一个工具存在即可
        "allBins": ["tool1", "tool2"],  # 所有工具都必须存在
        "config": ["api_key"]  # 需要的配置项
      }
    }
  }
---
```

### Skill 匹配机制
```
用户消息 → 语义分析 → 提取关键词和意图
    ↓
与所有 enabled Skills 的 description 向量匹配
    ↓
计算相似度分数
    ↓
选择最高分 Skill (超过阈值)
    ↓
检查依赖 (bins, config)
    ↓
就绪 → 执行 / 未就绪 → 返回错误
```

### Skills 目录结构
```
~/.openclaw/
├── .agents/skills/     # 个人 Skills（软链接）
│   ├── find-skills -> ...
│   └── skill-creator -> ...
├── skills/             # 项目 Skills（通过 clawhub 安装）
└── config.yml          # 全局配置
```

### 已就绪的 Skills (9个)
| Skill | 功能 | 使用场景 |
|-------|------|----------|
| clawhub | ClawHub CLI | 搜索、安装、更新 Skills |
| coding-agent | 编码任务代理 | 委托给 Claude Code/Codex/Pi |
| gh-issues | GitHub Issues | 获取 issues、实现修复、监控 PR |
| github | GitHub 操作 | PR、CI、代码审查 |
| healthcheck | 主机安全加固 | 安全审计、防火墙配置 |
| skill-creator | 创建新技能 | 从零创建、编辑优化 |
| tmux | tmux 会话控制 | 远程控制、发送按键 |
| weather | 天气查询 | 当前天气和预报 |
| find-skills | 发现技能 | 发现和安装技能 |

### ClawHub CLI 命令
```bash
npx clawhub search <query>     # 向量搜索 Skills
npx clawhub install <slug>     # 安装 Skill
npx clawhub update [slug]      # 更新 Skills
npx clawhub list               # 列出已安装
npx clawhub explore            # 浏览最新 Skills
```

---

## Coding-Agent 高级用法

### Claude Code vs Codex 对比
| 特性 | Claude Code | Codex |
|------|-------------|-------|
| PTY 要求 | ❌ 不需要 | ✅ 必须 |
| 执行模式 | `--print` | `exec` |
| 权限控制 | ✅ 细粒度 | ⚠️ 粗粒度 |
| 工具集 | 丰富 | 基础 |
| 模型 | Claude 系列 | GPT-5.2-Codex |
| 速度 | 中等 | 快（--yolo） |

### Claude Code 运行模式

#### 1. --print 模式（单次执行）
```bash
# 适用：一次性、明确的任务
claude --permission-mode bypassPermissions --print "创建一个登录表单"
```

#### 2. 交互模式（多轮对话）
```bash
# 启动后台会话（不使用 --print）
bash workdir:~/project background:true command:"claude --permission-mode bypassPermissions"
# sessionId: abc123

# 发送多轮指令
process action:submit sessionId:abc123 data="创建一个 API"
process action:submit sessionId:abc123 data="添加认证功能"
process action:submit sessionId:abc123 data="编写单元测试"

# 获取输出
process action:log sessionId:abc123

# 结束会话
process action:kill sessionId:abc123
```

#### 3. Session 模式（持久化）
```bash
# 第一次调用（创建 session）
claude --session my-app --permission-mode bypassPermissions --print "设计架构"

# 第二次调用（继续 session）
claude --session my-app --permission-mode bypassPermissions --print "实现核心功能"

# 第三次调用（继续 session）
claude --session my-app --permission-mode bypassPermissions --print "添加文档"
```

### Permission-Mode 对比
| 模式 | 安全性 | 适用场景 |
|------|--------|----------|
| 默认 | ✅ 最高 | 交互式开发 |
| auto | ⚠️ 中等 | 可信项目日常 |
| bypassPermissions | ❌ 最低 | 自动化脚本 |

### Process 工具完整命令
| Action | 说明 | 示例 |
|--------|------|------|
| list | 列出所有会话 | `process action:list` |
| poll | 检查会话状态 | `process action:poll sessionId:xxx` |
| log | 获取会话输出 | `process action:log sessionId:xxx offset:0 limit:100` |
| write | 写入原始数据（无换行） | `process action:write sessionId:xxx data:"text"` |
| submit | 写入+换行（模拟回车） | `process action:submit sessionId:xxx data:"继续"` |
| send-keys | 发送特殊按键 | `process action:send-keys sessionId:xxx keys:"C-c"` |
| kill | 终止会话 | `process action:kill sessionId:xxx` |

### Codex 模式（需要 PTY）
```bash
# 基础用法
bash pty:true workdir:~/project command:"codex exec '添加新功能'"

# 完全自动化（最快）
bash pty:true workdir:~/project command:"codex --yolo exec '重构整个模块'"

# 自动批准（平衡）
bash pty:true workdir:~/project command:"codex --full-auto exec '实现 API 端点'"
```

### 并行处理模式

#### 批量 PR 审查
```bash
# 获取所有 PR refs
git fetch origin '+refs/pull/*/head:refs/remotes/origin/pr/*'

# 并行部署 Codex 代理
bash pty:true workdir:~/project background:true command:"codex exec 'Review PR #86'"
bash pty:true workdir:~/project background:true command:"codex exec 'Review PR #87'"
bash pty:true workdir:~/project background:true command:"codex exec 'Review PR #88'"

# 监控所有会话
process action:list
```

#### Git Worktree 并行开发
```bash
# 创建 worktrees
git worktree add -b fix/issue-78 /tmp/issue-78 main
git worktree add -b fix/issue-99 /tmp/issue-99 main

# 并行启动代理
bash pty:true workdir:/tmp/issue-78 background:true command:"pnpm install && codex --yolo 'Fix #78'"
bash pty:true workdir:/tmp/issue-99 background:true command:"pnpm install && codex --yolo 'Fix #99'"

# 监控并创建 PR
process action:poll sessionId:<id>
cd /tmp/issue-78 && git push && gh pr create

# 清理
git worktree remove /tmp/issue-78
```

### 模式选择决策树
```
                     任务类型
                        │
        ┌───────────────┴───────────────┐
        │                               │
   明确的一次性任务                 需要多轮交互
        │                               │
        ▼                               ▼
   使用 --print                  使用交互模式
        │                               │
        │                         ┌─────┴─────┐
        │                         │           │
        │                    需要实时干预   可分步执行
        │                         │           │
        │                         ▼           ▼
        │                    后台交互模式   Session 模式
        │
    脚本自动化 / 可解析输出
```

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| `openclaw status` | 查看系统状态 | 第一诊断工具，显示 Gateway、Agents、Sessions 状态 |
| `openclaw status --deep` | 深度状态检查 | 包含 Channels、Probes、Events 详细信息 |
| `openclaw doctor` | 健康诊断 | 自动检查并修复问题 |
| `openclaw gateway start` | 启动 Gateway | 启动服务 |
| `openclaw gateway restart` | 重启 Gateway | 重启服务 |
| `openclaw logs --follow` | 实时查看日志 | 调试必备，按 Ctrl+C 退出 |
| `openclaw config get <key>` | 查看特定配置 | 获取配置项值，非交互式 |
| `openclaw tui` | 启动终端 UI | 交互式聊天界面 |
| `/new` | 创建新会话 | 生成新会话 ID，清除上下文 |
| `/reset` | 重置当前会话 | 清空对话历史，保持会话 ID |
| `/compact` | 压缩会话上下文 | 节省 token，上下文 >30% 时有用 |
| `openclaw agents list` | 列出所有 agents | 查看 agent 信息 |
| `openclaw agents bindings` | 查看路由绑定 | 检查消息路由规则 |
| `openclaw skills list` | 列出可用 skills | 查看技能列表（52 个，9 个就绪） |
| `openclaw agent --agent main --message "xxx"` | 单次消息调用 | 非交互模式，适合脚本 |
| `openclaw agent --agent main --message "xxx" --json` | JSON 输出 | 获取完整元数据 |
| `npx clawhub search <query>` | 搜索 Skills | 向量搜索可用技能 |
| `npx clawhub install <slug>` | 安装 Skill | 安装到项目 |
| `npx clawhub list` | 列出已安装 Skills | 查看安装状态 |
| `process action:list` | 列出后台会话 | 查看所有运行中的进程 |
| `process action:poll sessionId:xxx` | 检查会话状态 | 判断是否完成 |
| `process action:log sessionId:xxx` | 获取会话输出 | 读取进程输出 |
| `process action:submit sessionId:xxx data:"text"` | 发送指令（带换行） | 向后台会话发送指令 |
| `process action:kill sessionId:xxx` | 终止会话 | 结束后台进程 |
| `claude --print "task"` | Claude Code 单次执行 | 脚本模式 |
| `claude --session name --print "task"` | Claude Code 持久会话 | 多次调用共享上下文 |

---

## 学习心得与总结

### 2026-03-10 学习总结

#### 今日完成
- ✅ **练习 1**：OpenClaw 基础命令操作
  - 掌握系统状态检查、服务管理、日志查看、配置管理
  - 理解 systemd 服务机制和日志系统
  - 学习 gateway.bind 的安全配置（loopback vs 0.0.0.0）

- ✅ **练习 2**：Agent 交互与会话管理
  - 掌握 TUI 终端界面的使用
  - 理解会话生命周期：/new（新会话）vs /reset（重置当前）
  - 学习 /compact 命令的触发条件（上下文 >30%）
  - 发现系统中有 2 个 agents（main 和 firefly）

- ✅ **练习 3**：Skills 系统实践
  - 了解 Skills 架构：52 个 Skills，9 个就绪
  - 学习外部依赖的风险（weather Skill 不可用）
  - 掌握命令行参数：--agent、--message、--json
  - 从 JSON 输出中理解系统架构（15 个工具，8 个 Skills）

#### 核心收获
1. **命令行技能**：从不知道命令到熟练使用 15+ 个命令
2. **故障排查**：学会用 --help 查看命令，用 doctor 诊断问题
3. **系统架构**：理解 Gateway、Agent、Session、Skills 的关系
4. **Agent 协作**：深入理解子代理、多 Agent、Agent Team 的区别

#### 概念对比：子会话 vs 子代理 vs 多 Agent
| 特性 | 子会话 | 子代理 | 多 Agent |
|------|--------|--------|----------|
| 定义 | 同 Agent 的新实例 | 完全不同的 Agent | 多个独立 Agent |
| 配置 | 共享 | 独立 | 各自独立 |
| 用途 | 并行处理 | 专业化任务 | 任务分类 |
| 类比 | 一个人做多件事 | 请专家帮忙 | 公司不同部门 |

#### 遇到的问题与解决
| 问题 | 解决方案 |
|------|----------|
| 命令不存在 | 使用 --help 查看实际可用命令 |
| weather Skill 不可用 | 确认是外部服务问题，非配置错误 |
| --non-interactive 不存在 | `openclaw agent` 默认就是非交互模式 |
| 需要指定会话 | 使用 `--agent main` 参数 |
| `/compact` 失败 | 理解触发条件（上下文太小不压缩） |

#### 进度更新
- ai-orchestration：60% → 70%
- 总体进度：30% → 32%
- 创建书签：Agent 协作探索（待深入学习）

### 2026-03-11 学习总结（续）

#### 今日完成（续）
- ✅ **练习 2**：Skills 系统深入理解
  - 掌握 Skill 元数据结构（name, description, metadata）
  - 理解语义匹配机制和依赖检查
  - 学习 Coding-Agent 高级用法
  - 掌握 Claude Code 多轮对话机制

- ✅ **练习 3**：Hooks 系统实践
  - 理解事件驱动架构
  - 掌握 Webhook 配置
  - 学习双层协作模式
  - 了解 Token 优化策略（节省 90%+）

#### Hooks 系统核心概念
| 特性 | 说明 |
|------|------|
| **事件驱动** | 变化发生时主动通知，无需轮询 |
| **Token 优化** | 避免 98% 的轮询开销 |
| **实时响应** | 事件立即触发，延迟 <1 秒 |
| **工具解耦** | OpenClaw 和 Claude Code 独立运行 |

#### Hooks 事件类型
- `file_create`: 创建新文件
- `file_edit`: 编辑文件
- `file_delete`: 删除文件
- `command_complete`: 命令执行完成
- `test_result`: 测试完成

#### 协作模式
- **线性管道**：严格依赖关系，顺序执行
- **并行依赖图**：可并行开发的模块
- **事件驱动**：复杂的异步工作流

#### 进度更新
- ai-orchestration：70% → 75%
- 总体进度：32% → 35%

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### MCP 相关问题

| 问题 | 解决方案 |
|------|----------|
| 什么是"上下文"？ | AI 能看到和使用的工具、数据、提示 |
| 什么是"开发标准"？ | 统一的通信协议、接口规范、数据格式 |
| 为什么需要 MCP？ | 避免重复开发，降低集成成本 |
| 工具和资源的区别？ | 工具是 LLM 调用的函数（执行操作），资源是 LLM 读取的数据（获取信息） |
| stdio 和 HTTP 的选择？ | 本地开发用 stdio，远程/生产环境用 HTTP |
| Skill 和 MCP 的关系？ | Skill 可以作为 MCP Client 连接外部服务，也可以直接实现功能 |
| 什么是 Slack？ | 企业级团队协作平台，类似于微信/钉钉 |

### ai-resources-research

# ai-resources-research 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：待定

---

## 学习记录

<!-- 记录学习过程中的重要节点 -->

---

## 核心概念

<!-- 模块的核心概念说明 -->

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| | | |
| | | |

---

## 学习心得与总结

<!-- 空白区域，学习时填写 -->

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### mcp-advanced-config

# mcp-advanced-config 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：待定

---

## 学习记录

<!-- 记录学习过程中的重要节点 -->

---

## 核心概念

<!-- 模块的核心概念说明 -->

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| | | |
| | | |

---

## 学习心得与总结

<!-- 空白区域，学习时填写 -->

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### config-management

# config-management 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：待定

---

## 学习记录

<!-- 记录学习过程中的重要节点 -->

---

## 核心概念

<!-- 模块的核心概念说明 -->

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| | | |
| | | |

---

## 学习心得与总结

<!-- 空白区域，学习时填写 -->

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### practical-projects

# practical-projects 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：待定

---

## 学习记录

<!-- 记录学习过程中的重要节点 -->

---

## 核心概念

<!-- 模块的核心概念说明 -->

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| | | |
| | | |

---

## 学习心得与总结

<!-- 空白区域，学习时填写 -->

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |

### spec-driven-dev

# spec-driven-dev 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：待定

---

## 学习记录

<!-- 记录学习过程中的重要节点 -->

---

## 核心概念

<!-- 模块的核心概念说明 -->

---

## 架构理解

<!-- 模块的架构设计说明 -->

---

## 配置与设置

<!-- 相关配置说明 -->

---

## 常用命令/操作

| 命令/操作 | 用途 | 实践经验 |
|-----------|------|----------|
| | | |
| | | |

---

## 学习心得与总结

<!-- 空白区域，学习时填写 -->

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| | |
| | |
