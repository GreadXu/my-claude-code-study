# OpenClaw 核心概念

> **来源**：OpenClaw/openclaw GitHub 仓库
> **文档**：VISION.md, AGENTS.md, docs/concepts/
> **更新日期**：2026-03-09

---

## 核心架构

### Gateway 架构

OpenClaw 采用 Gateway 架构模式：

```
┌─────────────────────────────────────────────────┐
│                 消息渠道层                        │
│  WhatsApp │ Telegram │ Discord │ iMessage       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│              Gateway (网关)                       │
│  - 消息路由和调度                                 │
│  - 会话管理                                       │
│  - 安全控制                                       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│            Agent 运行时                           │
│  - 提示词执行                                     │
│  - 工具调用                                       │
│  - 内存管理                                       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│          AI 模型提供商                            │
│  Anthropic │ OpenAI │ Gemini │ 其他             │
└─────────────────────────────────────────────────┘
```

---

## 核心概念

### 1. Agent 工作空间 (Agent Workspace)

**默认路径**：`~/.openclaw/workspace`

Agent 工作空间是 OpenClaw 读取操作指令和"内存"的地方。

#### 自动创建的文件

| 文件 | 说明 |
|------|------|
| `AGENTS.md` | Agent 行为指令 |
| `SOUL.md` | Persona 和性格定义 |
| `TOOLS.md` | 工具使用指南 |
| `IDENTITY.md` | 身份标识 |
| `USER.md` | 用户信息 |
| `HEARTBEAT.md` | 心跳任务指令 |
| `BOOTSTRAP.md` | 仅在全新工作空间创建 |
| `MEMORY.md` | 可选，存在时被加载 |

**建议**：将此文件夹设为 git 仓库（最好是私有的），以便备份你的 `AGENTS.md` 和内存文件。

#### 配置工作空间

```json5
{
  agent: {
    // 自定义工作空间路径
    workspace: "~/.openclaw/workspace",
    // 跳过自动创建引导文件
    skipBootstrap: false,
  },
}
```

---

### 2. Channels (渠道系统)

OpenClaw 支持多种消息渠道，每个渠道都有特定的配置和安全考虑。

#### 核心渠道

| 渠道 | 状态 | 说明 |
|------|------|------|
| **WhatsApp** | ✅ 内置 | 通过 WhatsApp Web 协议 |
| **Telegram** | ✅ 内置 | 通过 Bot API |
| **Discord** | ✅ 内置 | 通过 Bot Token |
| **iMessage** | ✅ 内置 | macOS 专用（通过 AppleScript） |
| **Web** | ✅ 内置 | WebChat 界面 |
| **Mattermost** | 🔌 插件 | 通过扩展支持 |

#### 渠道配置示例

```json5
{
  channels: {
    whatsapp: {
      // 安全：限制消息来源
      allowFrom: ["+15555550123"],
      // 群组设置
      groups: {
        "*": { requireMention: true },
      },
    },
  },
}
```

---

### 3. 会话管理 (Sessions)

#### 会话文件位置

- **会话文件**：`~/.openclaw/agents/<agentId>/sessions/{{SessionId}}.jsonl`
- **会话元数据**：`~/.openclaw/agents/<agentId>/sessions/sessions.json`

#### 会话作用域

```json5
{
  session: {
    // 会话作用域
    scope: "per-sender",
    // 重置触发器
    resetTriggers: ["/new", "/reset"],
    // 重置策略
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 10080,  // 7 天
    },
  },
}
```

**说明**：
- `/new` 或 `/reset` 为该聊天启动新会话
- 如果单独发送，Agent 会回复简短的问候以确认重置
- `/compact [instructions]` 压缩会话上下文并报告剩余上下文预算

---

### 4. 心跳系统 (Heartbeats)

OpenClaw 支持主动模式，通过心跳系统定期触发 Agent 行为。

#### 默认行为

- **默认间隔**：每 30 分钟
- **提示词**：`Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.`

#### 心跳配置

```json5
{
  agent: {
    heartbeat: {
      every: "30m",        // 间隔
      directPolicy: "allow", // 直接消息策略
      ackMaxChars: 1000,    // HEARTBEAT_OK 最大字符数
    },
  },
}
```

#### 心跳行为

| 条件 | 行为 |
|------|------|
| `HEARTBEAT.md` 存在且为空 | 跳过心跳运行以节省 API 调用 |
| `HEARTBEAT.md` 缺失 | 心跳仍运行，由模型决定做什么 |
| 回复 `HEARTBEAT_OK` | 抑制该心跳的出站投递 |
| 间隔设置为 `"0m"` | 禁用心跳 |

---

### 5. 媒体处理

#### 入站媒体（Inbound Media）

入站附件（图片/音频/文档）可以通过模板变量传递给命令：

| 模板变量 | 说明 | 示例值 |
|----------|------|--------|
| `{{MediaPath}}` | 本地临时文件路径 | `/tmp/openclaw/media/image-123.png` |
| `{{MediaUrl}}` | 伪 URL（用于引用） | `media://image-123.png` |
| `{{Transcript}}` | 音频转录文本（如果启用） | "你好，请帮我..." |

**支持的媒体类型**：
- 📷 图片：PNG, JPG, JPEG, GIF, WebP
- 🎵 音频：MP3, M4A, WAV, OGG
- 📄 文档：PDF, TXT, MD（文本提取）

**入站处理流程**：
```
1. 渠道接收附件
2. 下载到临时目录 /tmp/openclaw/media/
3. 生成唯一文件名
4. 设置模板变量
5. 传递给 Agent 上下文
```

#### 出站媒体（Outbound Media）

Agent 可以通过特殊语法发送附件：

```
这是您要求的截图。

MEDIA:/tmp/openclaw/screenshot.png

请查看上面的图片。
```

**MEDIA 标签规则**：
- ✅ 必须在单独一行
- ✅ 格式：`MEDIA:<path-or-url>`
- ❌ 行内不能有空格（`MEDIA: /path` 无效）
- ✅ 支持本地路径和 HTTP/HTTPS URL
- ✅ 多个媒体文件可连续使用

**出站处理流程**：
```
1. Agent 输出包含 MEDIA: 标签
2. OpenClaw 解析并提取路径
3. 验证文件存在性
4. 根据渠道上传/发送
5. 从最终消息中移除 MEDIA: 标签
```

#### 媒体处理配置

**音频转录配置**：
```json5
{
  channels: {
    whatsapp: {
      audio: {
        transcribe: true,        // 启用转录
        language: "zh-CN",       // 转录语言
        provider: "openai",      // 转录服务提供商
      },
    },
  },
}
```

**媒体大小限制**：
- WhatsApp: 100MB
- Telegram: 50MB (文档), 10MB (音频)
- Discord: 25MB (免费), 500MB (Nitro)

---

### 6. 路由系统

#### 群聊路由

```json5
{
  routing: {
    groupChat: {
      // 触发模式
      mentionPatterns: ["@openclaw", "openclaw"],
    },
  },
}
```

#### 提及模式

在群聊中，可以通过以下方式触发 Agent：
- `@openclaw`
- `openclaw`
- 自定义提及模式

---

### 7. 安全模型

#### 安全优先事项

OpenClaw 的 Agent 可以：
- 在你的机器上运行命令（取决于 Pi 工具设置）
- 读取/写入工作区中的文件
- 通过 WhatsApp/Telegram/Discord/Mattermost 发送消息

#### 安全配置建议

**开始保守**：
1. ✅ 始终设置 `channels.whatsapp.allowFrom`
2. ✅ 使用专用 WhatsApp 号码作为助手
3. ✅ 最初通过设置 `agents.defaults.heartbeat.every: "0m"` 禁用心跳

#### 两手机设置（推荐）

```
你的手机（个人）          第二手机（助手）
    WhatsApp                   WhatsApp
  +1-555-YOU      →       +1-555-ASSIST
                                  ↓
                          你的 Mac (openclaw)
                            Pi agent
```

**为什么？**
- 如果将你的个人 WhatsApp 链接到 OpenClaw，发给你的每条消息都变成"Agent 输入"
- 这通常不是你想要的

---

### 8. 插件系统（深度）

#### 插件 API 特点

- ✅ **广泛而强大**：提供完整的扩展能力
- ✅ **NPM 包分发**：首选分发方式，便于版本管理
- ✅ **本地扩展加载**：用于开发和测试
- ✅ **Core 保持精简**：核心功能最小化，可选功能插件化

#### 插件开发路径

**首选路径**：NPM 包分发

**开发流程**：
1. 创建独立的 NPM 包
2. 实现插件 API 接口
3. 发布到 NPM 仓库
4. 用户通过 `npm install` 安装
5. 在配置中激活插件

**社区生态**：
- 插件市场：ClawHub (clawhub.ai)
- PR 标准：有意加入核心的插件门槛很高
- 推荐先在社区验证

#### Skills vs Plugins

| 特性 | Skills | Plugins |
|------|--------|---------|
| **分发方式** | 随核心一起发布 | 通过 NPM 分发 |
| **用途** | 基线 UX | 可选功能 |
| **新功能策略** | 先发布到 ClawHub | 首选 NPM 包路径 |
| **更新频率** | 跟随核心版本 | 独立版本管理 |

#### 插件开发门槛

**有意加入核心的插件门槛很高**：
- 必须是广泛使用的基础设施
- 必须有稳定的 API 设计
- 必须通过社区长期验证
- 维护成本可控

---

### 8.5 运行时架构

#### Node.js 版本要求

| 环境 | 版本要求 | 说明 |
|------|----------|------|
| **运行时基线** | Node **22+** | 最低支持版本 |
| **开发模式** | Bun 或 Node | Bun 用于 TypeScript 执行 |
| **生产环境** | Node | 运行构建的输出（`dist/*`） |

#### 依赖安装

```bash
# 使用 pnpm（首选）
pnpm install

# 或使用 Bun
bun install

# 不推荐 npm（可能出现锁文件问题）
```

#### CLI 命令体系

| 命令 | 功能 | 示例 |
|------|------|------|
| `openclaw gateway` | 启动 Gateway 服务 | `openclaw gateway --port 18789` |
| `openclaw dashboard` | 打开 Web 仪表板 | `openclaw dashboard` |
| `openclaw status` | 查看本地状态 | `openclaw status --all` |
| `openclaw health` | Gateway 健康检查 | `openclaw health --json` |
| `openclaw channels login` | 登录渠道 | `openclaw channels login` |
| `openclaw setup` | 初始化工作空间 | `openclaw setup` |

#### Gateway 服务配置

**默认端口**：18789

**启动模式**：
- **前台运行**：`openclaw gateway --port 18789`
- **后台运行**：`nohup openclaw gateway --port 18789 > /tmp/openclaw-gateway.log 2>&1 &`

**配置示例**：
```json5
{
  gateway: {
    mode: "local",    // 或 "remote"
    port: 18789,
  },
}
```

#### 日志系统

**日志位置**：`/tmp/openclaw/`

**日志文件格式**：`openclaw-YYYY-MM-DD.log`

**日志级别配置**：
```json5
{
  logging: {
    level: "info" | "debug" | "warn" | "error",
  },
}
```

---

---

### 9. 内存系统

#### 内存插件槽

- **特殊槽**：内存是一个特殊的插件槽
- **单一激活**：同时只能激活一个内存插件
- **多种选项**：目前提供多种内存选项
- **未来方向**：计划收敛到一个推荐的默认路径

#### 内存工作流

详细内存工作流：[Memory](/concepts/memory)

---

### 10. MCP 集成

OpenClaw 通过 `mcporter` 支持 MCP（Model Context Protocol）：

**优势**：
- ✅ 添加或更改 MCP 服务器无需重启 Gateway
- ✅ 保持核心工具/上下文表面精简
- ✅ 减少 MCP 变更对核心稳定性和安全性的影响

**项目**：https://github.com/steipete/mcporter

---

## 架构设计原则

### 1. 安全第一

- 强大的默认值
- 有风险的路径需要明确说明
- 由操作员控制

### 2. 可黑客化

- TypeScript 作为主要语言
- 广泛的认知和快速迭代
- 易于阅读、修改和扩展

### 3. 精简核心

- Core 保持精简
- 可选功能作为插件提供
- 强大的插件 API

### 4. 显式配置

- 终端优先设计
- 设置保持显式
- 用户看到文档、身份验证、权限和安全姿态

---

## 运行时环境

### Node.js 版本

- **运行时基线**：Node **22+**
- **支持**：Node + Bun 路径
- **生产**：Node 运行构建的输出（`dist/*`）
- **开发**：首选 Bun 用于 TypeScript 执行

### 安装依赖

```bash
# 使用 pnpm（首选）
pnpm install

# 或使用 Bun
bun install
```

### 开发命令

```bash
# 运行 CLI
pnpm openclaw ...

# 或开发模式
pnpm dev
```

---

## 相关资源

- **Agent 工作空间**：[Agent workspace](/concepts/agent-workspace)
- **内存工作流**：[Memory](/concepts/memory)
- **安全指南**：[Security](/gateway/security)
- **Gateway 运维**：[Gateway runbook](/gateway)
