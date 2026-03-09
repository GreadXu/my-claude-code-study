#!/bin/bash
# =============================================================================
# AI 技术学习模板 - v3.0.0 迁移脚本
# =============================================================================
# 用途：将系统内容从用户目录迁移到 .templates/modules/
# 用法：bash scripts/migrate-v3.sh [--dry-run]
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

# 是否为预演模式
DRY_RUN=false

# 解析参数
for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            echo "用法: bash scripts/migrate-v3.sh [--dry-run]"
            echo ""
            echo "选项:"
            echo "  --dry-run   预演模式，不执行实际操作"
            echo "  -h, --help  显示帮助信息"
            echo ""
            echo "说明:"
            echo "  此脚本将系统内容从用户目录迁移到 .templates/modules/"
            echo "  迁移后，用户目录仅包含个人数据（checklist.md、notes.md）"
            echo ""
            echo "  迁移完成后，需要运行 git rm 删除旧文件，然后提交更改"
            exit 0
            ;;
    esac
done

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
# 检查函数
# =============================================================================

check_git_status() {
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        print_warning "检测到未提交的更改"
        print_info "建议先提交或暂存更改，然后再运行迁移脚本"
        echo ""
        git status --short
        echo ""
        read -p "是否继续迁移？(y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "迁移已取消"
            exit 0
        fi
    fi
}

# =============================================================================
# 迁移函数
# =============================================================================

migrate_category_readmes() {
    print_info "迁移分类导学 README.md..."

    local categories=("01-基础入门" "02-进阶探索" "03-实战应用")

    for category in "${categories[@]}"; do
        local source="$category/README.md"
        local target=".templates/modules/$category/README.md"

        if [ -f "$source" ]; then
            if [ "$DRY_RUN" = true ]; then
                print_info "  [DRY RUN] 会复制: $source -> $target"
            else
                mkdir -p ".templates/modules/$category"
                cp "$source" "$target"
                print_success "  复制: $source -> $target"
            fi
        fi
    done

    print_success "分类导学 README.md 迁移完成"
}

migrate_module_readmes() {
    print_info "迁移模块 README.md..."

    local modules=(
        "01-基础入门/ai-tools-fundamentals"
        "01-基础入门/mcp-protocol"
        "02-进阶探索/agent-configuration"
        "02-进阶探索/mcp-advanced-config"
        "02-进阶探索/ai-orchestration"
        "02-进阶探索/ai-resources-research"
        "03-实战应用/config-management"
        "03-实战应用/spec-driven-dev"
        "03-实战应用/practical-projects"
    )

    for module in "${modules[@]}"; do
        local source="$module/README.md"
        local target=".templates/modules/$module/README.md"

        if [ -f "$source" ]; then
            if [ "$DRY_RUN" = true ]; then
                print_info "  [DRY RUN] 会复制: $source -> $target"
            else
                mkdir -p "$(dirname "$target")"
                cp "$source" "$target"
                print_success "  复制: $source -> $target"
            fi
        fi
    done

    print_success "模块 README.md 迁移完成"
}

migrate_exercises() {
    print_info "迁移练习文件..."

    # ai-tools-fundamentals/exercises
    local source="01-基础入门/ai-tools-fundamentals/exercises"
    local target=".templates/modules/01-基础入门/ai-tools-fundamentals/exercises"

    if [ -d "$source" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_info "  [DRY RUN] 会复制: $source -> $target"
        else
            mkdir -p "$(dirname "$target")"
            cp -r "$source" "$target"
            print_success "  复制: $source -> $target"
        fi
    fi

    # ai-orchestration/exercises
    local source="02-进阶探索/ai-orchestration/exercises"
    local target=".templates/modules/02-进阶探索/ai-orchestration/exercises"

    if [ -d "$source" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_info "  [DRY RUN] 会复制: $source -> $target"
        else
            mkdir -p "$(dirname "$target")"
            cp -r "$source" "$target"
            print_success "  复制: $source -> $target"
        fi
    fi

    print_success "练习文件迁移完成"
}

migrate_practical_projects() {
    print_info "迁移实战项目..."

    local source="03-实战应用/practical-projects/feishu-learning-assistant"
    local target=".templates/modules/03-实战应用/practical-projects/feishu-learning-assistant"

    if [ -d "$source" ]; then
        if [ "$DRY_RUN" = true ]; then
            print_info "  [DRY RUN] 会复制: $source -> $target"
        else
            mkdir -p "$(dirname "$target")"
            cp -r "$source" "$target"
            print_success "  复制: $source -> $target"
        fi
    fi

    print_success "实战项目迁移完成"
}

print_git_commands() {
    print_header "删除旧文件的 Git 命令"
    echo ""
    print_warning "以下命令将从 Git 追踪中删除旧的系统文件"
    print_warning "用户数据（checklist.md、notes.md）将被保留"
    echo ""

    echo "# 删除分类导学 README.md"
    echo "git rm '01-基础入门/README.md' || true"
    echo "git rm '02-进阶探索/README.md' || true"
    echo "git rm '03-实战应用/README.md' || true"
    echo ""

    echo "# 删除模块 README.md"
    echo "git rm '01-基础入门/ai-tools-fundamentals/README.md' || true"
    echo "git rm '01-基础入门/mcp-protocol/README.md' || true"
    echo "git rm '02-进阶探索/agent-configuration/README.md' || true"
    echo "git rm '02-进阶探索/mcp-advanced-config/README.md' || true"
    echo "git rm '02-进阶探索/ai-orchestration/README.md' || true"
    echo "git rm '02-进阶探索/ai-resources-research/README.md' || true"
    echo "git rm '03-实战应用/config-management/README.md' || true"
    echo ""

    echo "# 删除练习文件"
    echo "git rm -r '01-基础入门/ai-tools-fundamentals/exercises/' || true"
    echo "git rm -r '02-进阶探索/ai-orchestration/exercises/' || true"
    echo ""

    echo "# 删除实战项目"
    echo "git rm -r '03-实战应用/practical-projects/feishu-learning-assistant/' || true"
    echo ""

    print_info "上述命令不会删除用户数据（checklist.md、notes.md）"
    print_info "这些文件已被 .gitignore 保护，不会被 Git 追踪"
    echo ""
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    print_header "   v3.0.0 架构迁移 - 纯模板化方案   "
    echo ""

    if [ "$DRY_RUN" = true ]; then
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_warning "          预演模式 (DRY RUN)            "
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        print_info "预演模式不会执行任何实际操作"
        print_info "仅显示将要执行的操作"
        echo ""
    fi

    # 检查 Git 状态
    check_git_status
    echo ""

    # 步骤 1：迁移分类导学
    print_header "步骤 1/4: 迁移分类导学 "
    migrate_category_readmes
    echo ""

    # 步骤 2：迁移模块 README.md
    print_header "步骤 2/4: 迁移模块 README.md "
    migrate_module_readmes
    echo ""

    # 步骤 3：迁移练习文件
    print_header "步骤 3/4: 迁移练习文件 "
    migrate_exercises
    echo ""

    # 步骤 4：迁移实战项目
    print_header "步骤 4/4: 迁移实战项目 "
    migrate_practical_projects
    echo ""

    # 完成
    print_header "              迁移准备完成！              "
    echo ""

    if [ "$DRY_RUN" = true ]; then
        print_success "预演完成！以上是将要执行的操作"
        echo ""
    else
        print_success "所有系统内容已复制到 .templates/modules/"
        echo ""
    fi

    print_info "下一步操作："
    echo ""
    echo "  1. 检查 .templates/modules/ 中的文件是否正确"
    echo "  2. 运行以下命令删除旧的 Git 追踪文件："
    echo ""
    print_git_commands
    echo "  3. 提交更改："
    echo "     git add .templates/ scripts/init.sh .gitignore"
    echo "     git commit -m 'refactor: 纯模板化架构 - 所有系统内容移入 .templates/modules/'"
    echo ""
    echo "  4. 运行初始化脚本恢复用户目录："
    echo "     bash scripts/init.sh"
    echo ""

    if [ "$DRY_RUN" = false ]; then
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_warning "           重要提示                     "
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_warning ""
        print_warning "  用户数据（checklist.md、notes.md）已被保护"
        print_warning "  删除操作不会影响这些文件"
        print_warning ""
        print_warning "  删除前请确保 .templates/modules/ 中文件完整"
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    fi
}

# 运行主流程
main "$@"
