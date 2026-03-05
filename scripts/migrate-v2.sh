#!/bin/bash
# =============================================================================
# AI 技术学习模板 - v1.x 到 v2.0 迁移脚本
# =============================================================================
# 用途：将旧模块名称迁移到新模块名称
# 用法：bash scripts/migrate-v2.sh [--dry-run] [--backup]
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取脚本所在目录的父目录（仓库根目录）
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# 当前日期
TODAY=$(date +%Y-%m-%d)

# 模块名称映射（旧名 -> 新名）
declare -A MODULE_MAPPINGS=(
    ["claude-code-core"]="ai-tools-fundamentals"
    ["mcp-basics"]="mcp-protocol"
    ["agent-sdk"]="agent-configuration"
    ["mcp-advanced"]="mcp-advanced-config"
    ["openclaw-ecosystem"]="ai-orchestration"
    ["everything-claude-code"]="ai-resources-research"
    ["cc-switch"]="config-management"
    ["spec-kit"]="spec-driven-dev"
    ["projects"]="practical-projects"
)

# =============================================================================
# 辅助函数
# =============================================================================

print_header() {
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║$1${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# =============================================================================
# 检测函数
# =============================================================================

detect_old_names() {
    local found_names=()
    local files_to_check=(
        "PROGRESS.md"
        ".claude/LEARNING_BOOKMARKS.md"
        ".claude/KNOWLEDGE_CACHE.md"
    )

    # 添加所有模块的 checklist.md 和 notes.md
    for old_name in "${!MODULE_MAPPINGS[@]}"; do
        # 检查各阶段目录下的模块文件
        for stage in "01-基础入门" "02-进阶探索" "03-实战应用"; do
            local checklist="$stage/$old_name/checklist.md"
            local notes="$stage/$old_name/notes.md"
            if [ -f "$checklist" ]; then
                files_to_check+=("$checklist")
            fi
            if [ -f "$notes" ]; then
                files_to_check+=("$notes")
            fi
        done
    done

    # 检查每个文件中的旧名称
    for file in "${files_to_check[@]}"; do
        if [ -f "$file" ]; then
            for old_name in "${!MODULE_MAPPINGS[@]}"; do
                if grep -q "$old_name" "$file" 2>/dev/null; then
                    found_names+=("$old_name")
                fi
            done
        fi
    done

    # 去重
    local unique_names=($(echo "${found_names[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '))
    echo "${unique_names[@]}"
}

# =============================================================================
# 迁移函数
# =============================================================================

backup_files() {
    local backup_dir=".backups/migrate-v2-$TODAY"
    print_info "创建备份目录: $backup_dir"
    mkdir -p "$backup_dir"

    # 备份关键文件
    local files_to_backup=(
        "PROGRESS.md"
        ".claude/LEARNING_BOOKMARKS.md"
        ".claude/KNOWLEDGE_CACHE.md"
    )

    for file in "${files_to_backup[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$backup_dir/"
            print_success "已备份: $file"
        fi
    done

    # 备份模块文件
    for stage in "01-基础入门" "02-进阶探索" "03-实战应用"; do
        for old_name in "${!MODULE_MAPPINGS[@]}"; do
            local checklist="$stage/$old_name/checklist.md"
            local notes="$stage/$old_name/notes.md"
            if [ -f "$checklist" ]; then
                mkdir -p "$backup_dir/$stage/$old_name"
                cp "$checklist" "$backup_dir/$stage/$old_name/"
                print_success "已备份: $checklist"
            fi
            if [ -f "$notes" ]; then
                mkdir -p "$backup_dir/$stage/$old_name"
                cp "$notes" "$backup_dir/$stage/$old_name/"
                print_success "已备份: $notes"
            fi
        done
    done

    print_success "备份完成，位置: $backup_dir"
    echo ""
}

migrate_file() {
    local file=$1
    local dry_run=$2

    if [ ! -f "$file" ]; then
        return
    fi

    local changed=false
    local changes=()

    for old_name in "${!MODULE_MAPPINGS[@]}"; do
        new_name="${MODULE_MAPPINGS[$old_name]}"
        if grep -q "$old_name" "$file" 2>/dev/null; then
            changes+=("$old_name -> $new_name")
            changed=true
            if [ "$dry_run" = false ]; then
                # 使用 sed 进行替换（兼容 macOS 和 Linux）
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/$old_name/$new_name/g" "$file"
                else
                    sed -i "s/$old_name/$new_name/g" "$file"
                fi
            fi
        fi
    done

    if [ "$changed" = true ]; then
        if [ "$dry_run" = true ]; then
            print_info "  [预览] $file 将替换:"
            for change in "${changes[@]}"; do
                echo "    - $change"
            done
        else
            print_success "已迁移: $file"
            for change in "${changes[@]}"; do
                echo "    - $change"
            done
        fi
    fi
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    local dry_run=false
    local do_backup=false

    # 解析参数
    for arg in "$@"; do
        case $arg in
            --dry-run)
                dry_run=true
                shift
                ;;
            --backup)
                do_backup=true
                shift
                ;;
            -h|--help)
                echo "用法: bash scripts/migrate-v2.sh [--dry-run] [--backup]"
                echo ""
                echo "选项:"
                echo "  --dry-run    仅预览更改，不实际修改文件"
                echo "  --backup     迁移前备份原始文件"
                echo "  -h, --help   显示帮助信息"
                echo ""
                echo "模块名称映射:"
                for old_name in "${!MODULE_MAPPINGS[@]}"; do
                    printf "  %-25s -> %s\n" "$old_name" "${MODULE_MAPPINGS[$old_name]}"
                done
                exit 0
                ;;
        esac
    done

    print_header "      v1.x → v2.0 模块名称迁移工具      "
    echo ""

    # 检测旧名称
    print_info "检测旧模块名称..."
    local old_names=$(detect_old_names)

    if [ -z "$old_names" ]; then
        print_success "未检测到旧模块名称，无需迁移"
        exit 0
    fi

    print_info "检测到以下旧模块名称:"
    for name in $old_names; do
        echo "  - $name → ${MODULE_MAPPINGS[$name]}"
    done
    echo ""

    # 如果是 dry-run 模式
    if [ "$dry_run" = true ]; then
        print_warning "预览模式 (--dry-run)：以下文件将被修改"
        echo ""
    fi

    # 备份
    if [ "$do_backup" = true ] && [ "$dry_run" = false ]; then
        backup_files
    fi

    # 迁移 PROGRESS.md
    if [ "$dry_run" = true ]; then
        print_info "[预览] PROGRESS.md"
    else
        print_info "迁移 PROGRESS.md..."
    fi
    migrate_file "PROGRESS.md" "$dry_run"
    echo ""

    # 迁移书签和缓存文件
    if [ "$dry_run" = true ]; then
        print_info "[预览] .claude/LEARNING_BOOKMARKS.md"
        print_info "[预览] .claude/KNOWLEDGE_CACHE.md"
    else
        print_info "迁移书签和缓存文件..."
    fi
    migrate_file ".claude/LEARNING_BOOKMARKS.md" "$dry_run"
    migrate_file ".claude/KNOWLEDGE_CACHE.md" "$dry_run"
    echo ""

    # 迁移模块文件
    if [ "$dry_run" = true ]; then
        print_info "[预览] 模块 checklist.md 和 notes.md 文件"
    else
        print_info "迁移模块文件..."
    fi

    for stage in "01-基础入门" "02-进阶探索" "03-实战应用"; do
        for old_name in "${!MODULE_MAPPINGS[@]}"; do
            migrate_file "$stage/$old_name/checklist.md" "$dry_run"
            migrate_file "$stage/$old_name/notes.md" "$dry_run"
        done
    done
    echo ""

    # 完成
    if [ "$dry_run" = true ]; then
        print_header "          预览完成          "
        echo ""
        print_info "这是将要进行的更改。"
        print_info "要执行迁移，请运行: bash scripts/migrate-v2.sh [--backup]"
    else
        print_header "          迁移完成！          "
        echo ""
        print_success "所有旧模块名称已迁移到新名称"
        echo ""
        print_info "后续操作:"
        echo "  1. 使用 '查看学习状态' 验证迁移结果"
        echo "  2. 旧模块名称仍可使用（通过别名映射）"
        echo "  3. 建议使用新模块名称进行后续操作"
    fi
    echo ""
}

# 运行主流程
main "$@"
