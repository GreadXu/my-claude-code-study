#!/bin/bash
# =============================================================================
# Claude Code 学习计划 - 初始化脚本
# =============================================================================
# 用途：新成员初始化个人学习数据
# 用法：bash scripts/init.sh [--force]
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

check_initialized() {
    if [ -f "PROGRESS.md" ] && [ -f ".claude/LEARNING_BOOKMARKS.md" ]; then
        return 0  # 已初始化
    fi
    return 1  # 未初始化
}

check_templates() {
    if [ ! -d ".templates" ]; then
        print_error "模板目录不存在：.templates/"
        print_info "请确保你从正确的主仓库 Fork"
        exit 1
    fi

    local templates=(
        ".templates/PROGRESS.template.md"
        ".templates/KNOWLEDGE_CACHE.template.md"
        ".templates/LEARNING_BOOKMARKS.template.md"
        ".templates/module/checklist.template.md"
        ".templates/module/notes.template.md"
    )

    for template in "${templates[@]}"; do
        if [ ! -f "$template" ]; then
            print_error "模板文件缺失：$template"
            exit 1
        fi
    done

    print_success "模板文件检查通过"
}

check_gitignore() {
    if ! grep -q "个人学习数据" .gitignore 2>/dev/null; then
        print_warning ".gitignore 可能未配置个人数据忽略规则"
        print_info "建议检查 .gitignore 文件"
        return 1
    fi
    print_success ".gitignore 配置检查通过"
    return 0
}

# =============================================================================
# 初始化函数
# =============================================================================

init_progress_file() {
    print_info "创建 PROGRESS.md..."

    # 替换模板中的日期占位符
    sed "s/{{DATE}}/$TODAY/g" .templates/PROGRESS.template.md > PROGRESS.md

    print_success "PROGRESS.md 已创建"
}

init_cache_file() {
    print_info "创建 KNOWLEDGE_CACHE.md..."

    # 确保 .claude 目录存在
    mkdir -p .claude

    # 替换模板中的日期占位符
    sed "s/{{DATE}}/$TODAY/g" .templates/KNOWLEDGE_CACHE.template.md > .claude/KNOWLEDGE_CACHE.md

    print_success "KNOWLEDGE_CACHE.md 已创建"
}

init_bookmarks_file() {
    print_info "创建 LEARNING_BOOKMARKS.md..."

    # 替换模板中的日期占位符
    sed "s/{{DATE}}/$TODAY/g" .templates/LEARNING_BOOKMARKS.template.md > .claude/LEARNING_BOOKMARKS.md

    print_success "LEARNING_BOOKMARKS.md 已创建"
}

init_module_files() {
    print_info "初始化模块文件..."

    # 查找所有模块目录
    local module_dirs=$(find . -type d -name "claude-code-core" -o -name "mcp-basics" -o -name "agent-sdk" -o -name "mcp-advanced" -o -name "everything-claude-code" -o -name "cc-switch" -o -name "spec-kit" -o -name "projects" 2>/dev/null)

    for module_dir in $module_dirs; do
        # 跳过模板目录
        if [[ "$module_dir" == *".templates"* ]]; then
            continue
        fi

        local module_name=$(basename "$module_dir")
        local checklist_path="$module_dir/checklist.md"
        local notes_path="$module_dir/notes.md"

        # 创建 checklist.md
        if [ ! -f "$checklist_path" ]; then
            print_info "  创建 $module_name/checklist.md..."

            # 获取模块优先级（从 README.md 中提取）
            local priority=""
            if [ -f "$module_dir/README.md" ]; then
                priority=$(grep -oP "P[0-3]" "$module_dir/README.md" | head -1)
            fi
            [ -z "$priority" ] && priority="P1"

            # 替换模板占位符
            sed -e "s/{{MODULE_NAME}}/$module_name/g" \
                -e "s/{{PRIORITY}}/$priority/g" \
                -e "s/{{DATE}}/$TODAY/g" \
                -e "s/{{QUICK_MODE_DAYS}}/3/g" \
                -e "s/{{FULL_MODE_DAYS}}/7/g" \
                .templates/module/checklist.template.md > "$checklist_path"
        fi

        # 创建 notes.md
        if [ ! -f "$notes_path" ]; then
            print_info "  创建 $module_name/notes.md..."

            # 替换模板占位符
            sed -e "s/{{MODULE_NAME}}/$module_name/g" \
                -e "s/{{LEARNING_MODE}}/未选择/g" \
                -e "s/{{START_DATE}}/待定/g" \
                .templates/module/notes.template.md > "$notes_path"
        fi
    done

    print_success "模块文件初始化完成"
}

configure_upstream() {
    print_info "检查 upstream 远程仓库..."

    # 检查是否已配置 upstream
    if git remote | grep -q "^upstream$"; then
        print_success "upstream 已配置"
        git remote -v | grep upstream
    else
        print_warning "upstream 未配置"
        print_info "请手动添加 upstream 远程仓库："
        echo ""
        echo "  git remote add upstream https://github.com/YOUR_ORG/YOUR_REPO.git"
        echo ""
        read -p "是否现在配置 upstream? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "请输入 upstream 仓库 URL: " upstream_url
            git remote add upstream "$upstream_url"
            print_success "upstream 已配置"
        fi
    fi
}

verify_gitignore() {
    print_info "验证 .gitignore 配置..."

    # 检查关键文件是否被忽略
    local test_files=("PROGRESS.md" ".claude/LEARNING_BOOKMARKS.md" ".claude/KNOWLEDGE_CACHE.md")
    local all_ignored=true

    for file in "${test_files[@]}"; do
        if git check-ignore -q "$file" 2>/dev/null; then
            print_success "  $file 被正确忽略"
        else
            print_warning "  $file 未被忽略（这可能不是问题）"
            all_ignored=false
        fi
    done

    if $all_ignored; then
        print_success "所有个人数据文件配置正确"
    fi
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    local force=false

    # 解析参数
    for arg in "$@"; do
        case $arg in
            --force)
                force=true
                shift
                ;;
            -h|--help)
                echo "用法: bash scripts/init.sh [--force]"
                echo ""
                echo "选项:"
                echo "  --force    强制重新初始化（覆盖现有文件）"
                echo "  -h, --help 显示帮助信息"
                exit 0
                ;;
        esac
    done

    print_header "      Claude Code 学习计划 - 初始化向导      "

    # 检查是否已初始化
    if check_initialized && [ "$force" = false ]; then
        print_warning "检测到已初始化的学习数据"
        echo ""
        read -p "是否重新初始化？这将覆盖现有文件。(y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "初始化已取消"
            exit 0
        fi
    fi

    echo ""

    # 步骤 1：检查模板文件
    print_header "步骤 1/5: 检查模板文件 "
    check_templates
    echo ""

    # 步骤 2：创建进度文件
    print_header "步骤 2/5: 创建进度文件 "
    init_progress_file
    echo ""

    # 步骤 3：创建书签和缓存文件
    print_header "步骤 3/5: 创建书签和缓存文件 "
    init_cache_file
    init_bookmarks_file
    echo ""

    # 步骤 4：初始化模块文件
    print_header "步骤 4/5: 初始化模块文件 "
    init_module_files
    echo ""

    # 步骤 5：配置 upstream 和验证
    print_header "步骤 5/5: 配置与验证 "
    configure_upstream
    verify_gitignore
    echo ""

    # 完成
    print_header "          初始化完成！          "
    echo ""
    print_success "所有文件已创建，可以开始学习了！"
    echo ""
    print_info "下一步："
    echo "  1. 对 Claude 说：'查看学习状态'"
    echo "  2. 对 Claude 说：'开始学习 claude-code-core'"
    echo "  3. 选择学习模式（快速/完整）"
    echo ""
    print_info "更多信息请查看："
    echo "  - README.md（快速开始指南）"
    echo "  - TEAM_GUIDE.md（团队协作指南）"
    echo ""
}

# 运行主流程
main "$@"
