# v3.0.0 Fork 用户升级指南

## 概述

v3.0.0 版本实施了**纯模板化架构**，将所有系统内容从用户目录移入 `.templates/modules/`。

## 变更说明

### 架构变化

**之前（v2.x）**：
```
01-基础入门/README.md          # 被追踪的系统文件
01-基础入门/ai-tools-fundamentals/
  ├── README.md                # 被追踪的系统文件
  ├── exercises/               # 被追踪的系统文件
  ├── checklist.md             # 用户数据（.gitignore）
  └── notes.md                 # 用户数据（.gitignore）
```

**现在（v3.0.0）**：
```
.templates/modules/01-基础入门/README.md          # 系统文件（Git 追踪）
.templates/modules/01-基础入门/ai-tools-fundamentals/
  ├── README.md                                      # 系统文件（Git 追踪）
  └── exercises/                                     # 系统文件（Git 追踪）

01-基础入门/README.md          # 由 init.sh 创建
01-基础入门/ai-tools-fundamentals/
  ├── README.md                # 由 init.sh 创建
  ├── exercises/               # 由 init.sh 创建
  ├── checklist.md             # 用户数据（.gitignore）
  └── notes.md                 # 用户数据（.gitignore）
```

### 核心优势

| 优势 | 说明 |
|------|------|
| **架构清晰** | 所有系统内容集中在 `.templates/modules/` |
| **数据隔离** | 用户目录完全由 init.sh 创建，不受 Git 追踪 |
| **更新简单** | 系统更新只影响 `.templates/`，用户数据完全独立 |
| **无冲突** | 同步更新时不会有任何冲突 |

## 升级步骤

### 步骤 1：备份（可选但推荐）

```bash
# 创建备份分支
git branch backup-before-v3-upgrade

# 或创建备份目录
mkdir -p .backups/v3-upgrade-$(date +%Y%m%d)
cp PROGRESS.md .backups/v3-upgrade-$(date +%Y%m%d)/
```

### 步骤 2：同步上游

**方法 A：GitHub UI（推荐）**

1. 打开你的 Fork 仓库页面
2. 点击 "Sync fork" → "Update branch"
3. 等待同步完成

**方法 B：命令行**

```bash
git fetch upstream
git merge upstream/main
```

### 步骤 3：运行 init.sh 恢复用户目录

同步后，你会发现 `01-*/02-*/03-*/` 目录可能消失或为空。运行 init.sh 恢复：

```bash
bash scripts/init.sh
```

init.sh 会：
- 从 `.templates/modules/` 复制所有课程内容到用户目录
- 恢复所有 README.md、exercises/ 目录
- 保留你的 checklist.md 和 notes.md（受 .gitignore 保护）

### 步骤 4：验证

```bash
# 检查目录是否恢复
ls -la 01-基础入门/
ls -la 02-进阶探索/
ls -la 03-实战应用/

# 检查 Git 状态（不应显示用户数据文件）
git status
```

## 常见问题

### Q1: 同步后我的学习进度丢失了吗？

**A: 没有丢失。**

你的个人数据（checklist.md、notes.md、PROGRESS.md）受 .gitignore 保护，不会被 Git 追踪或覆盖。

### Q2: 为什么同步后目录是空的？

**A: 这是正常的。**

v3.0.0 中，`01-*/02-*/03-*/` 目录不再被 Git 追踪，所以同步后会消失或为空。运行 `init.sh` 即可恢复。

### Q3: 我对 README.md 的修改会丢失吗？

**A: 会被覆盖。**

如果你修改了模块的 README.md，运行 init.sh 后会被模板版本覆盖。如需保留，请先备份。

### Q4: 后续同步还需要运行 init.sh 吗？

**A: 不需要。**

第一次恢复后，用户目录就在本地了，后续同步不会影响它。

### Q5: 如何回滚？

**A: 切换到备份分支。**

```bash
git checkout backup-before-v3-upgrade
```

## 注意事项

| 项目 | 说明 |
|------|------|
| **用户数据保护** | checklist.md、notes.md 受 .gitignore 保护 |
| **知识缓存** | knowledge/ 目录受保护，不会被删除 |
| **本地修改** | 用户在 README.md 中的修改会被 init.sh 覆盖 |
| **后续修改** | 恢复后所有修改都是本地的，同步不会被覆盖 |

## 支持

如有问题，请：
1. 查阅 [CHANGELOG.md](./CHANGELOG.md)
2. 查阅 [README.md](./README.md)
3. 提交 Issue 到 GitHub
