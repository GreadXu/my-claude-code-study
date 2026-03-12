#!/usr/bin/env bash
#
# migrate-v4.sh - AI 学习系统 v4.0 迁移脚本
#
# 功能：将 v3.0 的固定模块结构迁移到 v4.0 的学习目标导向系统
#
# 使用方法：
#   bash scripts/migrate-v4.sh          # 交互式迁移
#   bash scripts/migrate-v4.sh --dry-run # 预演模式
#   bash scripts/migrate-v4.sh --auto    # 自动迁移（使用默认配置）
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 模式
DRY_RUN=false
AUTO_MODE=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --auto)
            AUTO_MODE=true
            shift
            ;;
        --help)
            echo "用法: bash scripts/migrate-v4.sh [选项]"
            echo ""
            echo "选项:"
            echo "  --dry-run   预演模式，不执行实际操作"
            echo "  --auto      自动迁移，使用默认配置"
            echo "  --help      显示帮助信息"
            exit 0
            ;;
        *)
            echo -e "${RED}未知选项: $1${NC}"
            exit 1
            ;;
    esac
done

# 打印函数
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 执行命令（考虑 dry-run 模式）
run_cmd() {
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}[DRY-RUN] $1${NC}"
    else
        eval "$1"
    fi
}

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

# 创建备份
create_backup() {
    print_header "创建备份"

    local backup_dir=".backups/migrate-v4-$(date +%Y%m%d-%H%M%S)"

    if [ -d "$backup_dir" ]; then
        print_warning "备份目录已存在，将覆盖"
        run_cmd "rm -rf $backup_dir"
    fi

    run_cmd "mkdir -p $backup_dir"

    # 备份关键文件
    local files_to_backup=(
        "PROGRESS.md"
        "LEARNING_BOOKMARKS.md"
        "KNOWLEDGE_CACHE.md"
    )

    for file in "${files_to_backup[@]}"; do
        if check_file "$file"; then
            run_cmd "cp $file $backup_dir/"
            print_step "已备份: $file"
        fi
    done

    # 备份模块笔记
    run_cmd "mkdir -p $backup_dir/modules"
    for dir in 01-基础入门/* 02-进阶探索/* 03-实战应用/*; do
        if [ -d "$dir" ]; then
            module_name=$(basename "$dir")
            if check_file "$dir/notes.md"; then
                run_cmd "mkdir -p $backup_dir/modules/$module_name"
                run_cmd "cp $dir/notes.md $backup_dir/modules/$module_name/"
                print_step "已备份: $dir/notes.md"
            fi
        fi
    done

    print_step "备份完成: $backup_dir"
}

# 创建新的目录结构
create_new_structure() {
    print_header "创建新的目录结构"

    # 创建 .learning 目录
    run_cmd "mkdir -p .learning/goals/{active,paused,completed,archived}"
    run_cmd "mkdir -p .learning/courses"
    run_cmd "mkdir -p .learning/cache/{shared,courses}"
    run_cmd "mkdir -p .learning/progress"
    run_cmd "mkdir -p .learning/bookmarks"
    run_cmd "mkdir -p .learning/notes"

    print_step "目录结构创建完成"
}

# 迁移进度数据
migrate_progress() {
    print_header "迁移进度数据"

    if ! check_file "PROGRESS.md"; then
        print_warning "PROGRESS.md 不存在，跳过"
        return
    fi

    # 创建默认学习目标
    local goal_file=".learning/goals/active/ai-learning-v3-migration.md"
    local goal_name="ai-learning-v3-migration"

    run_cmd "cat > $goal_file << 'EOF'
# 学习目标：AI 技术学习（从 v3.0 迁移）

## 元数据
- **目标ID**: goal-$(date +%Y%m%d)-ai-learning-v3-migration
- **目标名称**: $goal_name
- **显示名称**: AI 技术学习（v3.0 迁移）
- **目标类型**: mixed (混合型)
- **创建时间**: $(date +%Y-%m-%d)
- **迁移来源**: v3.0 固定模块结构
- **当前状态**: active

## 课程结构
- **课程**: ai-learning-v3-course
- **说明**: 从 v3.0 的 9 个固定模块迁移而来

## 迁移说明
本目标是从 v3.0 的固定模块结构自动迁移生成的。
建议：创建新的学习目标以充分利用 v4.0 的 AI 引导功能。

EOF"

    # 复制进度文件
    run_cmd "cp PROGRESS.md .learning/progress/$goal_name-progress.md"

    # 更新 active-goal.md
    run_cmd "cat > .learning/goals/active-goal.md << 'EOF'
# 当前激活的学习目标

**目标ID**: goal-$(date +%Y%m%d)-ai-learning-v3-migration
**目标文件**: ../active/ai-learning-v3-migration.md
**激活时间**: $(date +%Y-%m-%d)

**说明**: 这是从 v3.0 迁移的临时目标。建议创建新的学习目标。
EOF"

    print_step "进度数据迁移完成"
}

# 迁移书签
migrate_bookmarks() {
    print_header "迁移书签数据"

    if ! check_file "LEARNING_BOOKMARKS.md"; then
        print_warning "LEARNING_BOOKMARKS.md 不存在，跳过"
        return
    fi

    local goal_name="ai-learning-v3-migration"
    run_cmd "cp LEARNING_BOOKMARKS.md .learning/bookmarks/$goal_name-bookmarks.md"

    print_step "书签数据迁移完成"
}

# 迁移笔记
migrate_notes() {
    print_header "迁移学习笔记"

    local goal_name="ai-learning-v3-migration"
    local notes_file=".learning/notes/$goal_name-notes.md"

    run_cmd "cat > $notes_file << 'EOF'
# 学习笔记：AI 技术学习（v3.0 迁移）

> 从 v3.0 的模块笔记迁移而来

## 📚 知识体系（按模块）

EOF"

    # 收集所有模块笔记
    for dir in 01-基础入门/* 02-进阶探索/* 03-实战应用/*; do
        if [ -d "$dir" ]; then
            module_name=$(basename "$dir")
            if check_file "$dir/notes.md"; then
                echo "" >> "$notes_file"
                echo "### $module_name" >> "$notes_file"
                echo "" >> "$notes_file"
                run_cmd "cat $dir/notes.md >> $notes_file"
                print_step "已迁移笔记: $module_name"
            fi
        fi
    done

    print_step "学习笔记迁移完成"
}

# 迁移知识缓存
migrate_cache() {
    print_header "迁移知识缓存"

    local cache_dir=".learning/cache/courses/ai-learning-v3-course"
    run_cmd "mkdir -p $cache_dir"

    # 移动现有缓存
    for dir in 01-基础入门/* 02-进阶探索/* 03-实战应用/*; do
        if [ -d "$dir" ]; then
            module_name=$(basename "$dir")
            if [ -d "$dir/knowledge" ]; then
                run_cmd "cp -r $dir/knowledge $cache_dir/$module_name"
                print_step "已迁移缓存: $module_name"
            fi
        fi
    done

    print_step "知识缓存迁移完成"
}

# 创建课程定义
create_course_definition() {
    print_header "创建课程定义"

    local course_dir=".learning/courses/ai-learning-v3-course"
    run_cmd "mkdir -p $course_dir"

    run_cmd "cat > $course_dir/course.md << 'EOF'
# 课程：AI 技术学习（v3.0 迁移）

## 课程信息
- **课程ID**: course-$(date +%Y%m%d)-ai-learning-v3
- **课程名称**: ai-learning-v3-course
- **目标类型**: mixed (混合型)
- **难度等级**: ⭐⭐⭐ 进阶
- **预计时长**: 8-12 周
- **迁移来源**: v3.0 固定模块结构

## 模块列表（从 v3.0 迁移）

### 01-基础入门
- [ai-tools-fundamentals](./modules/01-基础入门/ai-tools-fundamentals/) - P0 必学
- [mcp-protocol](./modules/01-基础入门/mcp-protocol/) - P1 推荐

### 02-进阶探索
- [agent-configuration](./modules/02-进阶探索/agent-configuration/) - P2 可选
- [mcp-advanced-config](./modules/02-进阶探索/mcp-advanced-config/) - P3 了解
- [ai-orchestration](./modules/02-进阶探索/ai-orchestration/) - P1 推荐
- [ai-resources-research](./modules/02-进阶探索/ai-resources-research/) - P1 推荐

### 03-实战应用
- [config-management](./modules/03-实战应用/config-management/) - P2 可选
- [spec-driven-dev](./modules/03-实战应用/spec-driven-dev/) - P2 可选
- [practical-projects](./modules/03-实战应用/practical-projects/) - P1 推荐

## 缓存配置
- **缓存目录**: ../cache/courses/ai-learning-v3-course
- **共享缓存**: []

## 迁移说明
本课程是从 v3.0 的固定模块结构自动迁移生成的。
建议：使用 v4.0 的 "创建学习目标" 功能创建个性化课程。
EOF"

    print_step "课程定义创建完成"
}

# 验证迁移结果
verify_migration() {
    print_header "验证迁移结果"

    local errors=0

    # 检查目录结构
    local dirs=(
        ".learning/goals/active"
        ".learning/courses"
        ".learning/cache/courses"
        ".learning/progress"
        ".learning/bookmarks"
        ".learning/notes"
    )

    for dir in "${dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_step "目录存在: $dir"
        else
            print_error "目录缺失: $dir"
            ((errors++))
        fi
    done

    # 检查关键文件
    local files=(
        ".learning/goals/active-goal.md"
        ".learning/goals/active/ai-learning-v3-migration.md"
        ".learning/progress/ai-learning-v3-migration-progress.md"
    )

    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_step "文件存在: $file"
        else
            print_error "文件缺失: $file"
            ((errors++))
        fi
    done

    if [ $errors -eq 0 ]; then
        print_step "迁移验证通过！"
        return 0
    else
        print_error "发现 $errors 个错误"
        return 1
    fi
}

# 显示迁移后指引
show_post_migration_guide() {
    print_header "迁移完成！"

    cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                     v4.0 迁移成功                            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                              ║
║  新功能概览：                                                ║
║  • 📚 多学习目标管理 - 同时管理多个学习目标                 ║
║  • 🤖 AI 引导创建 - 智能生成个性化课程                       ║
║  • 📢 缓存更新提示 - 自动检测课程变更                        ║
║  • 🎯 目标导向学习 - 以目标为核心的学习流程                 ║
║                                                              ║
╠═══════════════════════════════════════════════════════════════╣
║  下一步建议：                                                ║
║  1. 查看 "当前目标" 了解迁移后的学习状态                     ║
║  2. 说 "创建学习目标" 体验 AI 引导创建                       ║
║  3. 说 "刷新缓存" 测试缓存更新提示功能                       ║
║                                                              ║
╠═══════════════════════════════════════════════════════════════╣
║  新的目录结构：                                              ║
║  .learning/                                                  ║
║  ├── goals/       # 学习目标                                ║
║  ├── courses/     # 课程定义                                ║
║  ├── cache/       # 知识缓存                                ║
║  ├── progress/    # 学习进度                                ║
║  ├── bookmarks/   # 学习书签                                ║
║  └── notes/       # 学习笔记                                ║
║                                                              ║
╚═══════════════════════════════════════════════════════════════╝
EOF
}

# 主流程
main() {
    print_header "AI 学习系统 v4.0 迁移"

    if [ "$DRY_RUN" = true ]; then
        print_warning "预演模式：不会执行实际操作"
    fi

    if [ "$AUTO_MODE" = false ]; then
        echo "此脚本将把您的学习数据从 v3.0 迁移到 v4.0。"
        echo "建议先使用 --dry-run 模式预演。"
        echo ""
        read -p "是否继续？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "迁移已取消"
            exit 0
        fi
    fi

    # 执行迁移步骤
    create_backup
    create_new_structure
    migrate_progress
    migrate_bookmarks
    migrate_notes
    migrate_cache
    create_course_definition

    # 验证结果
    if verify_migration; then
        show_post_migration_guide
    else
        print_error "迁移验证失败，请检查错误信息"
        exit 1
    fi
}

# 运行主流程
main
