# OpenClaw 命令参考手册

> OpenClaw 常用命令速查与参考指南
>
> **更新日期**：2026-03-10
> **OpenClaw 版本**：2026.3.8

---

## 📑 目录

- [🔥 最常用命令](#-最常用命令-top-10)
- [📋 按功能分类](#-按功能分类)
- [🎯 日常工作流程](#-日常工作流程)
- [🔧 故障排查](#-故障排查)
- [📁 重要路径](#-重要路径)
- [💡 使用技巧](#-使用技巧)

---

## 🔥 最常用命令 (Top 10)

| 命令 | 功能 | 使用频率 | 说明 |
|------|------|----------|------|
| `openclaw status` | 查看系统状态 | ⭐⭐⭐⭐⭐ | 第一诊断工具 |
| `openclaw --help` | 显示帮助信息 | ⭐⭐⭐⭐⭐ | 查看命令帮助 |
| `openclaw doctor` | 健康检查 | ⭐⭐⭐⭐ | 自动诊断问题 |
| `openclaw gateway start` | 启动 Gateway | ⭐⭐⭐⭐ | 启动服务 |
| `openclaw gateway stop` | 停止 Gateway | ⭐⭐⭐⭐ | 停止服务 |
| `openclaw logs --follow` | 实时查看日志 | ⭐⭐⭐⭐ | 调试必备 |
| `openclaw chat` | 启动聊天界面 | ⭐⭐⭐ | 与 Agent 对话 |
| `openclaw config` | 配置管理 | ⭐⭐⭐ | 查看配置 |
| `openclaw agents` | 管理 Agents | ⭐⭐⭐ | Agent 操作 |
| `openclaw security audit` | 安全审计 | ⭐⭐⭐ | 安全检查 |

---

## 📋 按功能分类

### 1️⃣ 系统状态与诊断

#### 查看系统状态

```bash
# 基本状态
openclaw status

# 深度检查（包含 channels 和 probes）
openclaw status --deep

# 显示所有状态（包括隐藏信息）
openclaw status --all
```

**输出内容**：
- Dashboard URL
- OS 版本和 Node.js 版本
- Gateway 服务状态
- Agent 数量和状态
- Session 信息
- 安全审计摘要

#### 健康检查

```bash
# 基本诊断
openclaw doctor

# 自动修复问题
openclaw doctor --fix

# 深度检查
openclaw doctor --deep
```

**检查项目**：
- OAuth 目录状态
- 通道安全警告
- Skills 状态
- 插件加载情况
- Gateway 连接状态
- Memory 搜索配置

#### 安全审计

```bash
# 基本安全检查
openclaw security audit

# 深度审计
openclaw security audit --deep

# 自动修复安全问题
openclaw security audit --fix
```

---

### 2️⃣ Gateway 服务管理

#### 服务控制

```bash
# 启动 Gateway
openclaw gateway start

# 停止 Gateway
openclaw gateway stop

# 重启 Gateway
openclaw gateway restart
```

#### systemd 服务

```bash
# 安装 systemd 服务（开机自启）
openclaw gateway install

# 卸载 systemd 服务
openclaw gateway uninstall

# 查看服务状态
systemctl --user status openclaw-gateway.service
```

#### 日志与调试

```bash
# 查看 Gateway 日志
openclaw gateway logs

# 实时跟踪日志
openclaw logs --follow

# 按级别过滤
openclaw logs --level error
openclaw logs --level warn
openclaw logs --level info
```

#### Dashboard 访问

```bash
# 显示 Dashboard URL
openclaw dashboard

# 在浏览器中打开（需要配置）
openclaw dashboard --open
```

---

### 3️⃣ 配置管理

#### 查看配置

```bash
# 查看所有配置
openclaw config

# 查看特定配置项
openclaw config get gateway.port
openclaw config get agents.defaults.model.primary
```

#### 修改配置

```bash
# 设置配置项
openclaw config set gateway.port 18789
openclaw config set agents.defaults.maxConcurrent 4

# 删除配置项
openclaw config delete gateway.trustedProxies
```

#### 配置向导

```bash
# 重新运行配置向导
openclaw onboard

# 配置特定部分
openclaw configure --section model
openclaw configure --section gateway
```

#### 编辑配置文件

```bash
# 打开配置文件编辑
openclaw config edit

# 配置文件位置
~/.openclaw/openclaw.json
```

---

### 4️⃣ Agent 管理

#### Agent 列表与状态

```bash
# 列出所有 agents
openclaw agents list

# 查看 agent 状态
openclaw agents status

# 查看默认 agent
openclaw agents get main
```

#### 创建与管理

```bash
# 创建新 agent
openclaw agents create my-agent

# 删除 agent
openclaw agents delete my-agent

# 切换默认 agent
openclaw agents switch my-agent
```

#### Agent 会话

```bash
# 查看会话历史
openclaw sessions list

# 查看特定 agent 的会话
openclaw sessions list --agent main

# 清除会话
openclaw sessions clear
```

---

### 5️⃣ 会话与聊天

#### 交互式聊天

```bash
# 启动交互式聊天
openclaw chat

# 向 agent 发送单条消息
openclaw chat --message "你好"

# 指定 agent 聊天
openclaw chat --agent my-agent

# 使用非交互模式
openclaw chat --non-interactive --message "测试消息"
```

---

### 6️⃣ Memory 管理

#### Memory 状态

```bash
# 查看 memory 状态
openclaw memory status

# 深度检查 memory
openclaw memory status --deep

```

#### Memory 操作

```bash
# 清理 memory 缓存
openclaw memory clear

# 搜索 memory
openclaw memory search "关键词"

# 导入 memory
openclaw memory import <file>

# 导出 memory
openclaw memory export > file.json
```

---

### 7️⃣ Skills 管理

#### Skills 列表

```bash
# 列出所有可用 skills
openclaw skills list

# 查看已安装的 skills
openclaw skills list --installed
```

#### Skills 安装与删除

```bash
# 添加 skill
openclaw skills add <skill-name>

# 删除 skill
openclaw skills remove <skill-name>

# 更新所有 skills
openclaw skills update
```

---

### 8️⃣ 杂项命令

#### 版本信息

```bash
# 查看版本
openclaw --version

# 查看完整版本信息
openclaw version
```

#### 帮助信息

```bash
# 总帮助
openclaw --help

# 特定命令帮助
openclaw gateway --help
openclaw agents --help
```

#### 其他

```bash
# 生成补全脚本
openclaw completions

# 查看环境变量
openclaw env
```

---

## 🎯 日常工作流程

### 启动 OpenClaw

```bash
# 1. 检查状态
openclaw status

# 2. 启动 Gateway（如果未运行）
openclaw gateway start

# 3. 验证服务
openclaw doctor

# 4. 开始对话
openclaw chat
```

### 日常检查

```bash
# 查看系统状态
openclaw status

# 查看日志（如有问题）
openclaw logs --follow

# 安全检查
openclaw security audit
```

### 配置新 Agent

```bash
# 1. 创建 agent
openclaw agents create my-new-agent

# 2. 配置 agent
openclaw config set agents.my-new-agent.model.primary zai/glm-4.7

# 3. 测试 agent
openclaw chat --agent my-new-agent
```

---

## 🔧 故障排查

### Gateway 无法启动

```bash
# 1. 检查服务状态
systemctl --user status openclaw-gateway.service

# 2. 查看 Gateway 日志
openclaw gateway logs

# 3. 运行诊断
openclaw doctor

# 4. 检查端口占用
netstat -tuln | grep 18789
```

### 无法连接 Dashboard

```bash
# 1. 检查 Gateway 是否运行
openclaw status

# 2. 获取 token
grep -oP '(?<="token": ")[^"]+' ~/.openclaw/openclaw.json

# 3. 检查防火墙
sudo ufw status
```

### Agent 响应异常

```bash
# 1. 查看 Agent 日志
openclaw logs --follow

# 2. 检查 API 密钥配置
openclaw config get auth.profiles

# 3. 测试 API 连接
openclaw doctor
```

---

## 📁 重要路径

### Linux / WSL2

| 路径 | 说明 |
|------|------|
| `~/.openclaw/` | OpenClaw 主目录 |
| `~/.openclaw/openclaw.json` | 主配置文件 |
| `~/.openclaw/workspace/` | Workspace 目录 |
| `~/.openclaw/agents/` | Agents 配置目录 |
| `~/.openclaw/logs/` | 日志目录 |
| `~/.npm-global/bin/openclaw` | CLI 可执行文件 |
| `~/.config/systemd/user/` | systemd 服务文件 |

### Windows 访问

WSL2 路径可以 Windows 中访问：
```powershell
# 访问用户主目录
\\wsl$\Ubuntu\home\用户名\.openclaw

# 访问配置文件
\\wsl$\Ubuntu\home\用户名\.openclaw\openclaw.json
```

---

## 💡 使用技巧

### Tab 补全

```bash
# 启用 Bash 补全
source <(openclaw completions)

# 或添加到 .bashrc
echo 'source <(openclaw completions)' >> ~/.bashrc
```

### 常用组合命令

```bash
# 启动并查看日志
openclaw gateway start && openclaw logs --follow

# 完整诊断
openclaw status && openclaw doctor && openclaw security audit

# 快速测试
openclaw chat --message "测试" --non-interactive
```

### 配置别名

在 `~/.bashrc` 中添加：
```bash
# OpenClaw 别名
alias oc='openclaw'
alias ocs='openclaw status'
alias ocg='openclaw gateway'
alias ocl='openclaw logs --follow'
alias occ='openclaw chat'
```

---

## 📚 参考资源

- **官方文档**：https://docs.openclaw.ai/
- **故障排查**：https://docs.openclaw.ai/troubleshooting
- **FAQ**：https://docs.openclaw.ai/faq
- **安全指南**：https://docs.openclaw.ai/gateway/security

---

## 📝 快速查询

### 查看配置

```bash
# Gateway token
grep -oP '(?<="token": ")[^"]+' ~/.openclaw/openclaw.json

# 端口号
grep -oP '(?<="port": )\d+' ~/.openclaw/openclaw.json

# 主模型
grep -oP '(?<="primary": ")[^"]+' ~/.openclaw/openclaw.json
```

### 服务管理

```bash
# WSL2 启用 systemd
sudo bash -c "echo -e '[boot]\nsystemd=true' > /etc/wsl.conf"

# 重启 WSL2（在 PowerShell 中）
wsl --shutdown

# 查看 systemd 服务
systemctl --user list-units | grep openclaw
```

---

> **提示**：此文档会随着 OpenClaw 版本更新而持续更新。
> 如有问题或建议，请提交 Issue 或 PR。
