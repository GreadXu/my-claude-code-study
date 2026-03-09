# v3.0.0 架构迁移指南

## 概述

v3.0.0 版本实施了**纯模板化架构**，将所有系统内容从用户目录移入 `.templates/modules/`。

## 变更内容

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

### 迁移的文件（32个）

| 类型 | 数量 | 文件 |
|------|------|------|
| 分类导学 | 3 | `01-基础入门/README.md`, `02-进阶探索/README.md`, `03-实战应用/README.md` |
| 模块 README | 9 | 所有模块的 README.md |
| 练习文件 | 9 | ai-tools-fundamentals/exercises/*, ai-orchestration/exercises/* |
| 实战项目 | 11 | practical-projects/feishu-learning-assistant/* |
| **总计** | **32** | |

### 更新的文件

| 文件 | 变更 |
|------|------|
| `scripts/init.sh` | 新增函数：复制完整目录结构 |
| `.gitignore` | 简化规则，删除不再需要的配置 |
| `README.md` | 更新目录结构说明 |
| `CLAUDE.md` | 更新项目结构说明 |
| `CHANGELOG.md` | 新增 v3.0.0 变更日志 |

### 新增的文件

| 文件 | 说明 |
|------|------|
| `scripts/migrate-v3.sh` | 迁移脚本（支持 --dry-run） |

## 迁移步骤

### 步骤 1：备份（可选但推荐）

```bash
# 创建备份
git add -A
git commit -m "backup: 迁移前的备份"
```

### 步骤 2：验证 .templates/modules/

```bash
# 检查文件是否完整
find .templates/modules -type f | wc -l  # 应该显示 32
```

### 步骤 3：运行迁移脚本（预演）

```bash
# 预演模式，不执行实际操作
bash scripts/migrate-v3.sh --dry-run
```

### 步骤 4：运行迁移脚本（正式）

```bash
# 正式迁移（如果已手动复制文件，可跳过此步）
bash scripts/migrate-v3.sh
```

### 步骤 5：删除旧的 Git 追踪文件

```bash
# 删除分类导学 README.md
git rm '01-基础入门/README.md' || true
git rm '02-进阶探索/README.md' || true
git rm '03-实战应用/README.md' || true

# 删除模块 README.md
git rm '01-基础入门/ai-tools-fundamentals/README.md' || true
git rm '01-基础入门/mcp-protocol/README.md' || true
git rm '02-进阶探索/agent-configuration/README.md' || true
git rm '02-进阶探索/mcp-advanced-config/README.md' || true
git rm '02-进阶探索/ai-orchestration/README.md' || true
git rm '02-进阶探索/ai-resources-research/README.md' || true
git rm '03-实战应用/config-management/README.md' || true
git rm '03-实战应用/practical-projects/README.md' || true

# 删除练习文件
git rm -r '01-基础入门/ai-tools-fundamentals/exercises/' || true
git rm -r '02-进阶探索/ai-orchestration/exercises/' || true

# 删除实战项目
git rm -r '03-实战应用/practical-projects/feishu-learning-assistant/' || true
```

### 步骤 6：提交更改

```bash
# 添加所有更改
git add .templates/ scripts/ .gitignore README.md CLAUDE.md CHANGELOG.md MIGRATION_V3.md

# 提交
git commit -m "refactor: 纯模板化架构 v3.0.0 - 所有系统内容移入 .templates/modules/"
```

### 步骤 7：运行 init.sh 恢复用户目录

```bash
# 恢复所有用户目录
bash scripts/init.sh
```

### 步骤 8：验证

```bash
# 检查用户目录是否恢复
ls -la 01-基础入门/
ls -la 02-进阶探索/
ls -la 03-实战应用/

# 检查 Git 状态
git status
```

## Fork 用户同步指南

### 第一次同步此变更

1. **同步上游**：
   ```bash
   # GitHub UI
   点击 "Sync fork" → "Update branch"

   # 或命令行
   git fetch upstream && git merge upstream/main
   ```

2. **运行 init.sh**：
   ```bash
   bash scripts/init.sh
   ```

3. **验证**：
   ```bash
   # 检查目录是否恢复
   ls -la 01-基础入门/
   ls -la 02-进阶探索/
   ls -la 03-实战应用/
   ```

### 后续修改保护

- ✅ 用户在 `01-*/02-*/03-*/` 中的所有修改都是本地的
- ✅ 这些目录完全不受 Git 追踪
- ✅ 同步更新时不会有任何冲突

## 优势

### 架构清晰
- ✅ 所有系统内容集中在 `.templates/modules/`
- ✅ 用户目录完全隔离
- ✅ 一目了然

### 更新简单
- ✅ 系统更新只影响 `.templates/`
- ✅ 用户数据完全独立
- ✅ 无冲突

### 初次克隆干净
- ✅ 没有冗余的系统文件混在用户目录中
- ✅ 用户完全掌控自己的学习数据

## 注意事项

1. **用户数据保护**：`checklist.md`、`notes.md` 已被 .gitignore 保护，不会被删除
2. **知识缓存**：`knowledge/` 目录也被保护，不会被删除
3. **本地修改**：用户在 README.md 中的修改会被 init.sh 覆盖（如需保留，请备份）

## 回滚

如需回滚到 v2.x：

```bash
# 恢复删除的文件
git checkout HEAD~1 -- 01-基础入门/ 02-进阶探索/ 03-实战应用/

# 删除 .templates/modules/
rm -rf .templates/modules/

# 恢复旧版本文件
git checkout HEAD~1 -- scripts/init.sh .gitignore

# 提交回滚
git add -A
git commit -m "revert: 回滚到 v2.x 架构"
```

## 支持

如有问题，请：
1. 查阅 [CHANGELOG.md](./CHANGELOG.md)
2. 查阅 [README.md](./README.md)
3. 提交 Issue 到 GitHub
