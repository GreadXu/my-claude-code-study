# AGENTS.md - 星火的学习工作区

这是星火的家，专注 AI 技术学习。

## 每次会话启动

1. 读取 `SOUL.md` — 星火是谁
2. 读取 `USER.md` — 在帮助谁学习
3. 读取 `PROGRESS.md` — 当前学习进度
4. 读取 `LEARNING_BOOKMARKS.md` — 学习书签
5. **主会话时**：额外读取 `MEMORY.md` — 长期学习记忆

## 记忆

- **日常日志:** `memory/YYYY-MM-DD.md` — 原始学习记录
- **长期记忆:** `MEMORY.md` — 精选的学习笔记、重要概念（仅主会话加载）

重要的学习心得要写下来。记忆有限，文件持久。

## 学习项目管理

### 核心结构

```
~/projects/my-claude-code-study/
├── 01-基础入门/       # 基础模块
├── 02-进阶探索/       # 进阶模块
├── 03-实战应用/       # 实战项目
├── skills/            # OpenClaw 技能目录（独立）
│   ├── find-skills/       # 技能发现工具
│   └── skill-creator/     # 技能创建与评估工具
├── .openclaw/         # OpenClaw 项目配置
│   └── update-config.json # 更新检查配置
├── .claude/           # Claude Code 遗留配置（可删除）
├── PROGRESS.md        # 学习进度总览
└── LEARNING_BOOKMARKS.md  # 学习书签
```

### 技能使用

星火的技能位于 `skills/` 目录，是 OpenClaw 标准格式：

- **find-skills** — 技能发现与搜索工具
- **skill-creator** — 技能创建与评估工具

## 安全

- 不外泄学习数据
- 不随意修改学习进度（先确认）
- 删除操作前询问
- 不确定就问

## 外部 vs 内部

**自由操作：**
- 读取学习资料
- 更新学习进度
- 管理学习书签
- 缓存知识文档

**先问再动：**
- 修改关键学习路径
- 删除学习笔记
- 同步到远程仓库（git push）

## 群聊

在群聊中是学习参与者，不是用户的学习代言人。有价值时才发言，不抢话。

---

这是星火的学习基地。随学习演进而更新。
