# Study Workflow Skill

学习工作流程管理 Skill - 用于管理 Claude Code 学习计划的进度追踪。

## 功能

提供以下斜杠命令：

| 命令 | 功能 | 示例 |
|------|------|------|
| `/study start <模块名>` | 开始学习，初始化状态 | `/study start claude-code-core` |
| `/study update <模块名>` | 更新进度，显示预览确认 | `/study update claude-code-core` |
| `/study complete <模块名>` | 完成学习，更新所有状态 | `/study complete claude-code-core` |
| `/study status [模块名]` | 查看当前学习状态 | `/study status` 或 `/study status claude-code-core` |

## 目录结构

```
.claude/skills/study/
├── skill.json           # Skill 元数据和命令定义
├── index.ts             # 入口文件
├── lib/
│   ├── types.ts             # 类型定义
│   ├── module-locator.ts    # 模块路径解析
│   ├── progress-parser.ts   # checklist.md 解析
│   ├── progress-calculator.ts # 进度计算
│   ├── file-updater.ts      # 文件更新
│   └── ui-formatter.ts      # 输出格式化
└── commands/
    ├── start.ts         # /study start 处理器
    ├── update.ts        # /study update 处理器
    ├── complete.ts      # /study complete 处理器
    └── status.ts        # /study status 处理器
```

## 使用说明

### 开始学习

```
/study start claude-code-core
```

这将：
1. 询问选择学习模式（快速/完整）
2. 设置 checklist.md 的学习模式
3. 记录 notes.md 的开始日期
4. 更新 PROGRESS.md 状态为"进行中"
5. 添加学习日志

### 更新进度

```
/study update claude-code-core
```

这将：
1. 解析 checklist.md 计算完成百分比
2. 显示进度预览
3. 更新 PROGRESS.md 的进度
4. 添加进度日志

**注意**：你需要先手动编辑 checklist.md 勾选已完成的项目，然后运行此命令更新进度。

### 完成学习

```
/study complete claude-code-core
```

这将：
1. 验证是否所有项目已完成
2. 记录 notes.md 的完成日期
3. 更新 PROGRESS.md 状态为"已完成"
4. 添加完成日志

如果使用 `--force` 参数可以强制完成（即使有未完成项）：

```
/study complete claude-code-core --force
```

### 查看状态

```
/study status
```

显示所有模块的进度概览。

```
/study status claude-code-core
```

显示特定模块的详细状态。

## 模块名称

支持以下模块名称（可用短名称或完整路径）：

- `claude-code-core` / `01-基础入门/claude-code-core`
- `mcp-basics` / `01-基础入门/mcp-basics`
- `agent-sdk` / `02-进阶探索/agent-sdk`
- `mcp-advanced` / `02-进阶探索/mcp-advanced`
- `everything-claude-code` / `02-进阶探索/everything-claude-code`
- `cc-switch` / `03-实战应用/cc-switch`
- `spec-kit` / `03-实战应用/spec-kit`
- `projects` / `03-实战应用/projects`

## 进度输出示例

```
总体进度: ██████░░░░░░░░░░░░░░ 30%

优先级概览:
  P0 必学: ██████░░░░░░░░░░░░░░ 60%
  P1 推荐: ██░░░░░░░░░░░░░░░░░ 20%
  P2 可选: ░░░░░░░░░░░░░░░░░░░ 0%
  P3 了解: ████░░░░░░░░░░░░░░░░ 40%
```

## 开发说明

此 Skill 使用 TypeScript 编写，主要模块：

- **module-locator**: 解析模块路径，支持模糊匹配
- **progress-parser**: 解析 checklist.md，提取学习模式和完成项
- **progress-calculator**: 计算进度百分比，生成进度条
- **file-updater**: 生成文件更新内容
- **ui-formatter**: 格式化输出显示

## 许可

MIT
