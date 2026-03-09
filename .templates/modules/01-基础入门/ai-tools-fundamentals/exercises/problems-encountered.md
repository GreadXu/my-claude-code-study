# claude-code-core 学习 - 问题记录

> 记录学习过程中遇到的问题和解决方案

---

## 问题 1：/commit 命令不存在

### 问题描述
按照早期文档使用 `/commit` 命令时，提示命令不存在。

### 发现时间
2026-02-27

### 根本原因
Claude Code 新版本中已移除 `/commit` 命令

### 解决方案
- 使用 `/diff` 命令查看文件差异
- 手动执行 Git 提交操作

### 学习成果
- 软件会持续更新，需要关注官方 CHANGELOG
- 文档可能滞后，以实际功能为准

---

## 问题 2：editor 配置无法识别

### 问题描述
在 `settings.json` 中添加 `editor: "code"` 配置后，配置验证失败。

### 发现时间
2026-03-01

### 探索过程
1. 查阅官方示例文件（settings-lax.json, settings-strict.json）
2. 搜索网络文档和教程
3. 创建书签深入探索

### 根本原因
`editor` 配置项可能不是官方支持的配置项。

### 解决方案
- 编辑器配置应使用 `CLAUDE_EDITOR` 环境变量
- settings.json 中的配置项需符合官方 Schema

### 学习成果
- 配置验证是了解官方支持功能的好方法
- 环境变量是配置编辑器的正确方式

---

## 问题 3：Hook 配置格式错误

### 问题描述
配置 `PreCommit` Hook 时，提示 `hooks.PreCommit: Invalid key in record`。

### 发现时间
2026-03-01

### 探索过程
1. 尝试添加 `hooks.PreCommit` 配置
2. 收到完整 JSON Schema 错误信息
3. 研究 Schema 发现正确的 Hook 格式

### 根本原因
1. **没有 `PreCommit` Hook 类型**
2. Hooks 配置格式比预期复杂：需要 `hooks` 数组和 `type` 字段

### 正确格式
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Hello'"
          }
        ]
      }
    ]
  }
}
```

### 可用 Hook 类型
- `SessionStart` / `SessionEnd`
- `PreToolUse` / `PostToolUse`
- `PermissionRequest`
- `ConfigChange`

### 学习成果
- 错误信息是学习的宝贵资源
- JSON Schema 包含完整的配置规范
- 官方示例文件是配置参考的好来源

---

## 问题 4：Plan Mode 自动触发

### 问题描述
编辑配置文件时自动进入 Plan Mode，无法直接修改。

### 发现时间
2026-03-01

### 根本原因
系统的保护机制，防止意外修改重要配置

### 解决方案
1. 创建 Plan 文件
2. 调用 ExitPlanMode 退出计划模式
3. 确认后执行修改

### 学习成果
- Plan Mode 是安全机制，确保修改经过规划
- 理解了 Plan Mode 的工作流程

---

## 总结

| 问题类型 | 数量 | 解决方式 |
|----------|------|----------|
| 命令变更 | 1 | 查阅官方更新日志 |
| 配置不支持 | 1 | 书签探索 + 验证反馈 |
| 格式理解错误 | 1 | 阅读 Schema 文档 |
| 系统机制 | 1 | 理解设计意图 |

### 关键收获
1. **验证失败是学习机会**：错误信息往往包含完整的规范
2. **书签系统很有用**：帮助深入探索疑问，探索后可返回主线
3. **官方文档最可靠**：第三方教程可能过时
4. **实践出真知**：通过实际配置操作，理解更深刻
