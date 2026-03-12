# 变更日志

本文件记录 AI 技术学习模板的所有重要变更。

格式遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

---

## 更新分类说明

| 标签 | 说明 | 同步建议 | 示例 |
|------|------|----------|------|
| **[Core]** | 框架、脚本、配置文件更新 | 建议同步 | 脚本优化、配置改进 |
| **[Curriculum]** | 模块学习内容更新 | 用户可选 | 新增模块、内容修订 |
| **[Fix]** | Bug 修复 | 建议同步 | 修复显示问题 |
| **[Docs]** | 文档更新 | 可选 | README 更新 |

**Fork 用户提示**：
- 使用 "同步核心更新" 只同步 `[Core]` 和 `[Fix]` 类型
- 使用 "同步课程更新" 只同步 `[Curriculum]` 类型
- 使用 "同步学习计划" 同步全部更新

---

## 版本说明

| 版本类型 | 说明 | 示例 |
|----------|------|------|
| **MAJOR** | 重大变更，可能破坏向后兼容性 | 1.0.0 → 2.0.0 |
| **MINOR** | 新增功能，向后兼容 | 1.0.0 → 1.1.0 |
| **PATCH** | Bug 修复，向后兼容 | 1.0.0 → 1.0.1 |

---

## [4.0.2] - 2026-03-12

### [Core] 学习系统技能触发关键词优化

- 🎯 **优化触发关键词，提高技能触发准确性**
  - **learn-goal-creator**：移除过于宽泛的 "学..." 触发词，"新目标" → "新学习目标"
  - **learn-goal-tracker**：统一使用 "学习目标" 替代 "目标"，消除歧义
  - **learn-module-manager**：移除 "我要学..." 避免与 goal-creator 冲突
  - **learn-status**：移除 "目标状态"、"当前目标" 归入 goal-tracker
  - **learn-tools**：新增 "继续书签"、"完成书签" 触发词

- 📝 **更新文档**
  - CLAUDE.md 快速参考表格更新为新的触发词
  - learn-goal-creator 添加 "我要学..." 路由判断说明
  - 所有技能 description 更新为精确的触发关键词

- ⚡ **优化效果**
  - 消除技能间关键词重叠
  - 每个触发词唯一指向一个技能
  - 减少误触发，提高 AI 判断准确性

---

## [4.0.1] - 2026-03-12

### [Core] 学习系统技能统一命名

- 🏷️ **技能命名统一为 `learn-*` 前缀**
  - `goal-creator` → `learn-goal-creator`
  - `goal-tracker` → `learn-goal-tracker`
  - `learning-manager` → `learn-module-manager`
  - `learning-status` → `learn-status`
  - `learning-tools` → `learn-tools`

- 📝 **统一技能描述格式**
  - 采用统一模板：`学习系统 - <功能简述>（<按需/常驻>）- <功能列表>。v4.0 <特性>。当用户说...时触发此技能。`
  - 所有技能描述以 "学习系统 - " 开头
  - 统一使用（按需加载）/（常驻技能）标识

- 📚 **更新 CLAUDE.md 引用**
  - 项目结构中的技能目录更新
  - Skill 协作表更新为新的技能名称

---

## [4.0.0] - 2026-03-12

### [Core] 学习目标导向架构 - 重大重构

- 🎯 **全新的学习目标导向系统**
  - **多学习目标管理**
    - 支持同时管理多个学习目标
    - 目标状态机：active/paused/completed/archived
    - 目标切换时自动保存/加载上下文
    - 聚焦视图显示当前激活目标

  - **AI 引导创建学习目标**
    - 交互式询问学习目的、知识水平、期望时长、侧重点
    - 自动分析知识源（官方文档、GitHub 仓库）
    - 根据目标类型生成课程（理论型/实践型/混合型）
    - 逐模块确认机制，支持个性化调整

  - **缓存更新提示系统**
    - 刷新缓存时自动检测内容变更
    - 生成课程修改建议（新增/更新/删除）
    - 变更记录到 `course-updates.md`
    - 用户可选择全部应用、选择性应用或跳过

- 🏗️ **新的数据结构**
  - `.learning/` - 学习系统数据根目录
    - `goals/` - 学习目标（active/paused/completed/archived）
    - `courses/` - 课程定义
    - `cache/` - 知识缓存（shared/courses）
    - `progress/` - 学习进度
    - `bookmarks/` - 学习书签
    - `notes/` - 学习笔记

- 🔧 **新增 Skills**
  - `goal-tracker` - 多目标管理（常驻技能）
  - `goal-creator` - AI 引导创建（按需技能）
  - 更新 `learning-status` - 添加目标状态查询
  - 更新 `learning-manager` - 整合目标系统
  - 更新 `learning-tools` - 添加缓存更新提示

- 📝 **新增工具脚本**
  - `scripts/migrate-v4.sh` - v4.0 迁移脚本
  - `scripts/skills.sh` - 版本管理工具

- 📖 **文档更新**
  - 完全重写 `CLAUDE.md` - 通用化配置，移除特定工具依赖
  - 新增迁移指南和功能说明

### ⚠️ 破坏性变更

- **数据结构变更**：v3.0 的固定模块结构迁移到 v4.0 目标导向系统
- **迁移要求**：运行 `bash scripts/migrate-v4.sh` 自动迁移
- **向后兼容性**：v3.0 用户需要迁移（可使用迁移脚本）

### 🔄 迁移说明

- 备份：自动备份到 `.backups/migrate-v4-*/`
- 数据迁移：进度、书签、笔记、缓存全部保留
- 新增功能：创建学习目标、多目标管理、缓存更新提示

---

## [3.0.0] - 2026-03-09

### [Core] 纯模板化架构 - 重大重构

- 🏗️ **完全重新设计模板架构**
  - **所有系统内容移入 `.templates/modules/`**
    - 分类导学 README.md 移入 `.templates/modules/01-*/README.md`
    - 模块 README.md 移入 `.templates/modules/模块名/README.md`
    - 练习文件移入 `.templates/modules/模块名/exercises/`
    - 实战项目移入 `.templates/modules/03-实战应用/practical-projects/feishu-learning-assistant/`
  - **用户目录完全由 `init.sh` 创建**
    - `01-*/02-*/03-*/` 目录现在完全由 init.sh 创建
    - 不再包含任何被 Git 追踪的系统文件
    - 用户的所有修改都是本地的，不会被同步覆盖

- 📝 **更新 `init.sh` 脚本**
  - 新增 `init_category_readmes()` - 复制分类导学
  - 新增 `init_exercises_directories()` - 复制练习文件
  - 新增 `init_practical_projects()` - 复制实战项目
  - 重构 `init_module_files()` - 仅处理模块 README.md 和用户数据文件

- 🔧 **简化 `.gitignore`**
  - 删除复杂的 `01-*/**/README.md` 规则（不再需要）
  - 删除 `**/exercises/` 规则（现在在 .templates/ 中）
  - 保留用户数据保护：`**/checklist.md`、`**/notes.md`、`**/knowledge/`

- 📚 **新增迁移脚本**
  - `scripts/migrate-v3.sh` - 帮助用户从 v2.x 迁移到 v3.0
  - 支持 `--dry-run` 预演模式
  - 提供详细的迁移步骤和 Git 命令

### [Docs] 文档更新

- 📖 **README.md**
  - 更新目录结构说明，反映新架构
  - 添加架构说明：系统内容 vs 用户数据
  - 新增 v3.0.0 学习日志条目

- 📖 **TEMPLATE_GUIDE.md**
  - 待更新：添加 v3.0.0 架构说明

### [Curriculum] 课程内容

- ✅ **课程模板全部移入 `.templates/modules/`**
  - 29 个文件已迁移到 .templates/modules/
  - 包含所有分类导学、模块 README、练习文件、实战项目

### 🔄 Fork 用户同步指南

**第一次同步此变更**：
1. 同步后会发现 `01-*/02-*/03-*/` 目录消失或为空
2. 运行 `bash scripts/init.sh` 恢复完整目录
3. init.sh 会从 `.templates/modules/` 复制所有课程内容

**后续修改保护**：
- 用户在 `01-*/02-*/03-*/` 中的所有修改都是本地的
- 这些目录完全不受 Git 追踪
- 同步更新时不会有任何冲突

### ⚠️ 破坏性变更

- **目录结构变更**：`01-*/02-*/03-*/` 不再包含被追踪的系统文件
- **迁移要求**：Fork 用户需要运行 `init.sh` 恢复目录
- **向后兼容性**：v2.x 用户需要迁移（可使用 `migrate-v3.sh` 脚本）

---

## [2.2.0] - 2026-03-09

### [Core] 架构简化

- 🎯 **简化模板架构**
  - 删除模块目录中的 README.md 物理文件
  - 只保留 `.templates/modules/` 作为课程内容的唯一源头
  - 模块目录的 README.md 现在由 `init.sh` 从模板复制
  - **优势**：架构清晰、避免混淆、更新简单

- 📝 **文档更新**
  - README.md 添加 init.sh 运行提示
  - TEMPLATE_GUIDE.md 更新架构说明
  - 新增 FAQ：模块 README.md 被删除后的恢复步骤

- 🔄 **Fork 用户同步指南**
  - 第一次同步此变更后，运行 `bash scripts/init.sh` 恢复 README.md
  - 后续修改受 .gitignore 保护，同步时不会被覆盖

---

## [2.1.1] - 2026-03-08

### [Docs] 文档更新

- 📚 **新增 Agent Skills 平台指南**
  - 创建 `docs/AGENT_SKILLS_PLATFORMS_GUIDE.md`
  - 包含 10+ 主流 Agent Skills 平台详细评估
  - 对比社区活跃度、使用方便性、AI 兼容性
  - 快速访问链接汇总
  - OpenClaw 生态系统介绍

- 📝 **README.md 更新**
  - "完整指南" 部分新增 Agent Skills 平台指南条目
  - "学习资源" 部分新增醒目的提示框链接

---

## [Unreleased]

### 变更 (Changed)
- 🔄 **架构重构**：将学习系统从 Command Skills 重构为 Prompt Skills
  - 删除 study Command Skill（TypeScript，环境不兼容）
  - 新增 5 个 Prompt Skills（learning-*），支持真正的自然语言触发
  - 所有功能保持不变，用户交互更加自然直观
  - 非阻塞更新提醒已迁移到 learning-manager 和 learning-progress

### 删除 (Removed)
- 🗑️ `.claude/skills/study/` - 移除 TypeScript Command Skill（环境不兼容）
- 🗑️ `SYNC_TEST.md` - 删除过时的测试文档（命令式语法）
- 🗑️ `IMPLEMENTATION_STATUS.md` - 删除已废弃的实施状态文档

### 新增 (Added)
- ✨ **Prompt Skills**：5 个自然语言触发的学习管理技能
  - `learning-progress` - 查看学习状态、更新进度
  - `learning-manager` - 开始学习、完成学习、重置模块
  - `learning-bookmark` - 创建书签、继续探索、完成书签
  - `learning-cache` - 初始化缓存、刷新缓存、查看缓存
  - `learning-sync` - 检查更新、同步学习计划、模块管理

### 文档 (Docs)
- 📝 learning-sync/SKILL.md：移除 `/study` 命令引用
- 📝 learning-manager/SKILL.md：添加非阻塞更新提醒
- 📝 learning-progress/SKILL.md：添加非阻塞更新提醒

### 计划中
- 添加更多学习模块模板
- 改进进度可视化
- 支持自定义学习路径

---

## [2.1.0] - 2026-03-07

（Fork 用户增强版本）

### [Core] 框架更新

**配置管理系统**：
- ✨ 新增 `.claude/update-config.json` 配置文件
- ✨ 新增 `.claude/scripts/lib/config-manager.sh` 配置管理工具
  - `get_config_value()` / `set_config_value()` - JSON 配置操作
  - `should_check_updates()` - 基于时间窗口的缓存判断
  - `update_check_cache()` - 更新检查时间戳和缓存版本
  - 跨平台日期处理（GNU/BSD date 兼容）
  - 降级支持（无 jq 工具时可用）

**更新分类解析器**：
- ✨ 新增 `.claude/scripts/lib/changelog-parser.sh` 分类解析器
  - `get_latest_version_changes()` - 提取最新版本内容
  - `parse_update_type()` - 按类型获取更新（Core/Curriculum/Fix/Docs）
  - `show_update_classification_preview()` - 显示分类预览
  - `get_sync_mode()` / `set_sync_mode()` - 同步模式管理

**脚本增强**：
- 🛠️ `scripts/init.sh` - 新增交互式 .gitignore 保护配置
  - 选项 1：启用全部保护（推荐）
  - 选项 2：仅保护进度文件
  - 选项 3：跳过（手动配置）
- 🛠️ `scripts/sync.sh` - 新增自定义模块检测
  - 扫描 .custom 标记文件
  - 同步前显示自定义模块列表
  - 更新为 6 步流程（新增步骤 4：检测自定义模块）

### [Curriculum] 内容更新

**自定义模块保护机制**：
- ✨ 新增 `.custom` 标记文件格式
  - 标记用户自定义的模块
  - 包含元数据（日期、文件列表）
  - 同步时自动跳过

### Prompt Skills 更新

**learning-progress**：
- 🔄 步骤 0 应用缓存机制
  - 24 小时时间窗口（可配置）
  - 在窗口内使用缓存版本，跳过 `git fetch upstream`

**learning-manager**：
- 🔄 步骤 0 应用缓存机制
  - 同 learning-progress 缓存机制
- ✨ 新增 .custom 标记说明
  - 自动创建 .custom 标记的触发条件
  - 自定义状态警告显示

**learning-sync**：
- ✨ 新增选择性同步功能
  - "同步核心更新" - 仅同步 [Core] + [Fix]
  - "同步课程更新" - 仅同步 [Curriculum]
  - "同步全部更新" - 完整同步
  - "查看/设置同步模式" - 管理 syncMode 配置

### 优化 (Improved)

**更新检查优化**：
- ⚡ 24 小时内重复操作使用缓存版本
- ⚡ 减少约 95% 的无效网络请求
- 🔧 无 jq 工具时自动降级为无缓存模式

**内容保护增强**：
- 🛡️ 用户自定义的课程内容完全受保护
- 🛡️ .gitignore 动态启用，避免配置错误
- 🛡️ .custom 标记独立于 Git 状态

**同步粒度提升**：
- 🎯 用户可精确控制要同步的内容类型
- 🎯 支持按分类同步（框架 vs 课程）

### 文档 (Docs)

- 📖 `CHANGELOG.md` - 添加更新分类说明
- 📖 `CLAUDE.md` - 添加配置管理命令参考
  - 新增"配置管理（Fork 用户）"章节
  - 更新同步管理表格

### 向后兼容性 (Backward Compatibility)

- ✅ 自动初始化配置文件（首次运行时）
- ✅ 旧模块名称继续支持（别名映射）
- ✅ 无 jq 工具时降级可用

### 解决问题 (Resolves)

- 🔴 **P0** 更新检查触发过于频繁 - 时间窗口缓存机制
- 🟡 **P1** 缺少课程内容保护机制 - .custom 标记 + .gitignore 增强
- 🟢 **P2** 更新粒度不足 - CHANGELOG 分类 + 选择性同步

---

## [2.0.1] - 2026-03-05

（兼容性更新）

### 向后兼容性 (Backward Compatibility)
- ✨ **模块名称别名映射**：支持旧模块名称继续使用
  - 在 CLAUDE.md 中添加了别名映射表
  - AI 行为时显示提示："注意：'{旧名称}' 已更名为 '{新名称}'，正在使用新名称继续..."
  - 旧名称完全兼容，无需强制迁移

### Clone 模式支持
- ✨ **两种使用模式**：
  - **Fork 模式**：公开仓库，通过 upstream 自动更新
  - **Clone 模式**：私有仓库，通过 `scripts/update-standalone.sh` 更新
- 📝 **TEMPLATE_GUIDE.md 更新**：添加模式选择指南

### 新增 (Added)
- 🛠️ **新增脚本**：
  - `scripts/migrate-v2.sh`：v1.x → v2.0 迁移脚本
  - `scripts/update-standalone.sh`：Clone 模式独立更新脚本
- 🔧 **update-checker.ts 改进**：
  - 新增 `isCloneMode()` 函数
  - 新增 `getRemoteVersionForCloneMode()` 函数
  - 支持 Clone 模式版本检测

### 文档 (Documentation)
- 📖 **CLAUDE.md 更新**：
  - 添加模块名称别名映射章节
- 📖 **TEMPLATE_GUIDE.md 更新**：
  - 添加两种使用模式说明
  - 添加 Clone 模式更新步骤
- 📖 **Windows 环境支持说明**：
  - README.md: 添加系统要求章节
  - TEMPLATE_GUIDE.md: 添加环境要求提示
  - MIGRATION.md: 添加环境要求提示

---

## [2.0.0] - 2026-03-05

### 重大变更 (Breaking Changes)
- 🔄 **项目重新定位**：从"Claude Code 学习计划"→"AI 技术学习模板"
  - 现在是一个可复用的学习框架，支持 Fork 后自定义学习内容
  - 内置 AI 工具基础课程作为示例

### 新增 (Added)
- ✨ **模块重命名**：所有模块使用通用名称，适合任何技术学习
  - `claude-code-core` → `ai-tools-fundamentals`
  - `mcp-basics` → `mcp-protocol`
  - `agent-sdk` → `agent-configuration`
  - `mcp-advanced` → `mcp-advanced-config`
  - `openclaw-ecosystem` → `ai-orchestration`
  - `everything-claude-code` → `ai-resources-research`
  - `cc-switch` → `config-management`
  - `spec-kit` → `spec-driven-dev`
  - `projects` → `practical-projects`
- 🛠️ **新增脚本**：`scripts/create-module.sh` 快速创建新模块
- 📝 **新增模板**：`.templates/module/README.template.md` 模块 README 模板

### 向后兼容性 (新增)
- ✨ **模块名称别名映射**：支持旧模块名称（如 `claude-code-core`）继续使用
  - 在 CLAUDE.md 中添加了别名映射表
  - AI 行为时显示提示："注意：'{旧名称}' 已更名为 '{新名称}'，正在使用新名称继续..."
- 📜 **迁移脚本**：新增 `scripts/migrate-v2.sh` 帮 v1.x 用户平滑迁移
  - 迁移 PROGRESS.md、 checklist.md、 notes.md 等文件
  - 显示迁移提示，建议运行迁移脚本
- 🔧 **Clone 模式支持**：
  - 新增 `scripts/update-standalone.sh` 脚本
  - 支持 Clone 模式（私有仓库）用户更新模板
  - 通过 HTTPS 获取最新版本，  智能合并更新（保留个人数据）
- 🔄 **update-checker.ts 改进**：支持 Clone 模式检测
  - 新增 `isCloneMode()` 函数
  - 新增 `getRemoteVersionForCloneMode()` 函数
  - 修改 `checkForUpdates()` 支持 Clone 模式
  - 修改 `formatUpdateReminder()` 和 `formatSyncCheckResult()` 支持 Clone 模式提示

- 📖 **TEMPLATE_GUIDE.md 更新**：添加两种使用模式说明和 Clone 模式更新步骤

### 文档 (Documentation)
- 📖 **README.md 重写**：更新为模板使用说明
- 📖 **CLAUDE.md 更新**：更新项目概述和模块映射
- 📖 **TEAM_GUIDE.md → TEMPLATE_GUIDE.md**：重命名并更新为模板使用指南

### 变更 (Changed)
- 🔄 阶段 README.md 更新:反映新的模块名称
- 🔄 模块 README.md 更新:更新标题和前置要求
- 🔄 `scripts/init.sh` 更新:更新模块列表

---

## [1.3.3] - 2026-03-04

### 测试 (Test)
- 🧪 版本更新检测功能验证版本
  - 用于验证 1.3.2 的自动 fetch upstream 修复
  - 团队成员运行 `/study update` 应能收到此版本的更新提醒

---

## [1.3.2] - 2026-03-04

### 修复 (Fixed)
- 🐛 修复版本检测机制
  - 修复 `getUpstreamVersion()` 未自动 fetch upstream 的问题
  - 添加 5 秒超时保护，避免网络问题导致阻塞
  - 现在团队成员会自动收到更新提醒

### 改进 (Improved)
- 📈 更新检测现在会在每次检查时自动获取上游最新版本信息

---

## [1.3.1] - 2026-03-04

### 测试 (Test)
- 🧪 测试同步功能验证
  - 版本号更新测试
  - 团队同步流程验证

---

## [1.3.0] - 2026-03-03

### 新增 (Added)
- 🔄 **学习计划同步功能** (版本 1.3.0)
  - 新增 `/study sync` 命令：检查上游更新
  - 新增 `/study sync auto` 命令：执行同步
  - 新增非阻塞更新提醒机制
  - 新增版本比较功能（基于 CHANGELOG.md）
  - 新增 upstream 配置检查

### 新增文件
- `.claude/skills/study/commands/sync.ts` - 同步命令处理器
- `.claude/skills/study/lib/update-checker.ts` - 更新检查器

### 文档 (Documentation)
- 更新 CLAUDE.md 添加同步管理命令说明

---

## [1.2.0] - 2026-03-01

### 新增 (Added)
- 📚 **理论知识展示行为规范**
  - 分块展示机制（超过 15 行自动分块）
  - 用户确认机制（每块后询问是否继续）
  - 来源标注规范（官方文档、GitHub README 等）
  - 独立于 `accept edits on` 设置

### 新增内容
- `03-实战应用/projects/feishu-learning-assistant/` - 飞书学习助手实战项目
  - 完整的项目架构文档
  - OpenClaw Skills 示例代码
  - 设置指南和场景示例
- `02-进阶探索/openclaw-ecosystem/exercises/day1-deployment/web-ui-guide.md` - Web UI 练习

### 改进 (Changed)
- 更新 .gitignore 添加 personal-notes

### 文档 (Documentation)
- 更新 CLAUDE.md 添加理论知识展示行为规范

---

## [1.1.2] - 2026-02-28

### 新增 (Added)
- 🔖 **书签系统改进**：添加"书签探索行为规范"章节
  - 每次查询后主动询问"还有其他疑问吗？"
  - 添加探索笔记记录功能（用户触发）
  - 添加状态切换视觉提示（🔵 探索模式、✅ 返回主线）
- 📝 **探索笔记机制**：用户可主动要求将探索结果记录到书签笔记

### 改进 (Changed)
- 🎯 **书签探索流程**：从自动返回改为用户确认返回，避免过早结束探索
- 📍 **状态提示增强**：明确标识探索模式和主线返回，避免上下文污染

### 文档 (Documentation)
- 更新 CLAUDE.md 添加书签探索行为规范
- 更新 README.md 书签系统使用说明

---

## [1.1.0] - 2026-02-28

### 新增 (Added)
- 📦 新增 `openclaw-ecosystem` 模块 [P1] - OpenClaw AI 编排平台

### 变更 (Changed)
- 🎯 **课程定位调整**：从「开发导向」转向「配置使用 AI 能力导向」
- 🔄 **优先级重组**：
  - `agent-sdk`：P1 🟡 → P2 🟢（开发侧→配置侧）
  - `mcp-advanced`：P2 🟢 → P3 🔵（开发侧→了解级）
  - `everything-claude-code`：P3 🔵 → P1 🟡（提升优先级）
- 📝 **模块内容重写**：
  - `agent-sdk`：从「Agent SDK 开发」→「Agent 配置与使用」
  - `mcp-advanced`：从「MCP 高级应用」→「MCP 高级配置与资源管理」
  - `projects`：调整为「AI 能力集成项目」导向
  - `mcp-basics`：强化配置至少 2 个 MCP 服务器
  - `openclaw-ecosystem`：强化 AI 编排与协作定位
  - `everything-claude-code`：强化工具评估与选择
  - `claude-code-core`：强调 CLAUDE.md 配置核心技能
- 📖 **阶段 README 更新**：强调「配置使用 AI 能力」目标
- 🗺️ **推荐学习路径更新**：反映新的优先级分布

---

## [1.0.0] - 2026-02-27

### 新增 (Added)
- 🎉 初始化团队协作系统
- 📚 完整的学习工作流程（快速/完整模式）
- 🔖 学习书签系统（疑问分支追踪）
- 💾 知识缓存系统（本地持久化）
- 📋 8 个学习模块结构
  - 01-基础入门：claude-code-core, mcp-basics
  - 02-进阶探索：agent-sdk, mcp-advanced, everything-claude-code
  - 03-实战应用：cc-switch, spec-kit, projects
- 🔧 自动化脚本系统（init.sh, sync.sh, migrate.sh, backup.sh）
- 📖 团队协作指南（TEAM_GUIDE.md）
- ✅ .gitignore 个人数据保护
- 📝 .gitattributes 统一行尾符配置

### 修复 (Fixed)
- 🐛 修复 backup.sh 在 Windows 环境下的兼容性问题
- 🛡️ 清理 settings.local.json 的 Git 追踪状态

### 变更 (Changed)
- 重构 PROGRESS.md 结构，支持优先级分类
- 改进 checklist.md 模板，支持双学习模式

### 文档 (Documentation)
- 添加 README.md 完整使用说明
- 添加 TEAM_GUIDE.md 团队协作指南
- 添加 CHANGELOG.md 变更日志
- 添加 MIGRATION.md 迁移指南

---

## 变更类型说明

### 🎉 新增 (Added)
- 新功能
- 新模块
- 新命令

### 🔄 变更 (Changed)
- 现有功能的变更
- 配置格式变更

### 🐛 修复 (Fixed)
- Bug 修复
- 错误处理改进

### 🗑️ 废弃 (Deprecated)
- 即将移除的功能

### ❌ 删除 (Removed)
- 已移除的功能

### 🔒 安全 (Security)
- 安全相关的修复或改进

---

## 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| 2.0.1 | 2026-03-05 | 兼容性更新：模块别名映射、Clone 模式支持、Windows 环境说明 |
| 2.0.0 | 2026-03-05 | 项目重新定位为"AI 技术学习模板" |
| 1.3.3 | 2026-03-04 | 测试版本：同步功能验证 |
| 1.3.0 | 2026-03-03 | 学习计划同步功能：版本检查和自动同步 |
| 1.2.0 | 2026-03-01 | 理论知识展示规范 + 飞书学习助手项目 |
| 1.1.2 | 2026-02-28 | 书签系统改进：添加探索行为规范和状态提示 |
| 1.1.0 | 2026-02-28 | 课程定位调整：聚焦「配置使用 AI 能力」 |
| 1.0.0 | 2026-02-27 | 团队协作系统初始化 |

---

**创建日期**：2026-02-27
**当前版本**：2.0.1
