#!/bin/bash
# =============================================================================
# Claude Code 学习计划 - 迁移脚本
# =============================================================================
# 用途：版本迁移工具，检测并执行版本迁移
# 用法：bash scripts/migrate.sh [--check-only]
# =============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# 获取脚本所在目录的父目录（仓库根目录）
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# 当前日期
TODAY=$(date +%Y%m%d)

# =============================================================================
# 辅助函数
# =============================================================================

print_header() {
    echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║$1${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════╝${NC}"
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
# 版本检测
# =============================================================================

get_current_version() {
    if [ -f "CHANGELOG.md" ]; then
        local version=$(grep -m1 "^## \[" CHANGELOG.md | sed 's/^## \[\([^]]*\)\].*/\1/')
        echo "${version:-unknown}"
    else
        echo "unknown"
    fi
}

get_upstream_version() {
    if git show upstream/main:CHANGELOG.md &>/dev/null; then
        local version=$(git show upstream/main:CHANGELOG.md 2>/dev/null | grep -m1 "^## \[" | sed 's/^## \[\([^]]*\)\].*/\1/')
        echo "${version:-unknown}"
    else
        echo "unknown"
    fi
}

compare_versions() {
    local current=$1
    local target=$2

    if [ "$current" = "unknown" ] || [ "$target" = "unknown" ]; then
        return 2  # 无法比较
    elif [ "$current" = "$target" ]; then
        return 0  # 版本相同
    fi

    # 简单版本比较（假设格式为 X.Y.Z）
    local IFS=.
    local i current_parts=($current) target_parts=($target)

    for ((i=0; i<${#target_parts[@]}; i++)); do
        local cv=${current_parts[i]:-0}
        local tv=${target_parts[i]:-0}

        if [ "$tv" -gt "$cv" ]; then
            return 1  # 需要升级
        elif [ "$tv" -lt "$cv" ]; then
            return 3  # 当前版本更新
        fi
    done

    return 0  # 版本相同
}

# =============================================================================
# 数据完整性检查
# =============================================================================

check_personal_data() {
    print_info "检查个人数据完整性..."

    local missing_files=()

    # 检查关键文件
    [ -f "PROGRESS.md" ] || missing_files+=("PROGRESS.md")
    [ -f ".claude/LEARNING_BOOKMARKS.md" ] || missing_files+=(".claude/LEARNING_BOOKMARKS.md")
    [ -f ".claude/KNOWLEDGE_CACHE.md" ] || missing_files+=(".claude/KNOWLEDGE_CACHE.md")

    # 检查模块文件
    local checklist_count=$(find . -name "checklist.md" -not -path "*/.templates/*" -not -path "*/.backups/*" | wc -l)
    [ "$checklist_count" -ge 8 ] || missing_files+=("模块清单文件 (预期 8，实际 $checklist_count)")

    if [ ${#missing_files[@]} -eq 0 ]; then
        print_success "个人数据完整"
        return 0
    else
        print_warning "发现缺失文件:"
        for file in "${missing_files[@]}"; do
            echo "    - $file"
        done
        return 1
    fi
}

check_template_updates() {
    print_info "检查模板更新..."

    # 这里可以添加更复杂的模板比较逻辑
    # 简化版本：只检查模板目录是否存在
    if [ -d ".templates" ]; then
        print_success "模板目录存在"
        return 0
    else
        print_warning "模板目录缺失"
        return 1
    fi
}

check_compatibility() {
    print_info "检查数据兼容性..."

    # 检查 PROGRESS.md 格式
    if [ -f "PROGRESS.md" ]; then
        if grep -q "总体进度" PROGRESS.md && grep -q "优先级概览" PROGRESS.md; then
            print_success "PROGRESS.md 格式正确"
        else
            print_warning "PROGRESS.md 格式可能需要更新"
        fi
    fi

    # 检查书签格式
    if [ -f ".claude/LEARNING_BOOKMARKS.md" ]; then
        if grep -q "书签列表" .claude/LEARNING_BOOKMARKS.md; then
            print_success "书签格式正确"
        else
            print_warning "书签格式可能需要更新"
        fi
    fi
}

# =============================================================================
# 迁移报告生成
# =============================================================================

generate_migration_report() {
    local current_version=$1
    local target_version=$2
    local report_file=".backups/migration-report-$TODAY.md"

    mkdir -p .backups

    cat > "$report_file" << EOF
# 迁移报告

**日期**: $(date +%Y-%m-%d)
**版本**: $current_version → $target_version
**操作人**: $(git config user.name 2>/dev/null || echo "Unknown")

---

## 迁移前检查

### 版本信息
- 当前版本: $current_version
- 目标版本: $target_version

### 个人数据完整性
$(check_personal_data && echo "✓ 通过" || echo "✗ 发现问题")

### 模板检查
$(check_template_updates && echo "✓ 通过" || echo "✗ 发现问题")

### 兼容性检查
$(check_compatibility && echo "✓ 通过" || echo "✗ 可能需要更新")

---

## 迁移过程

### 执行的步骤
1. ✓ 备份个人数据
2. ✓ 获取上游更新
3. ✓ 检查版本变更
4. ✓ 验证数据完整性

---

## 迁移后验证

### 个人数据文件
- PROGRESS.md: $([ -f "PROGRESS.md" ] && echo "✓ 存在" || echo "✗ 缺失")
- LEARNING_BOOKMARKS.md: $([ -f ".claude/LEARNING_BOOKMARKS.md" ] && echo "✓ 存在" || echo "✗ 缺失")
- KNOWLEDGE_CACHE.md: $([ -f ".claude/KNOWLEDGE_CACHE.md" ] && echo "✓ 存在" || echo "✗ 缺失")

### 模块文件
- 清单文件: $(find . -name "checklist.md" -not -path "*/.templates/*" -not -path "*/.backups/*" | wc -l) 个
- 笔记文件: $(find . -name "notes.md" -not -path "*/.templates/*" -not -path "*/.backups/*" | wc -l) 个

---

## 注意事项

<!-- 在此记录迁移过程中的任何问题或需要手动处理的步骤 -->

EOF

    echo ""
    print_success "迁移报告已生成: $report_file"
    echo ""
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    local check_only=false

    # 解析参数
    for arg in "$@"; do
        case $arg in
            --check-only)
                check_only=true
                shift
                ;;
            -h|--help)
                echo "用法: bash scripts/migrate.sh [--check-only]"
                echo ""
                echo "选项:"
                echo "  --check-only 仅检查版本和兼容性，不执行迁移"
                echo "  -h, --help   显示帮助信息"
                exit 0
                ;;
        esac
    done

    print_header "      Claude Code 学习计划 - 版本迁移      "

    echo ""

    # 步骤 1：版本检测
    print_header "步骤 1/4: 版本检测 "
    local current_version=$(get_current_version)
    local target_version=$(get_upstream_version)

    echo ""
    echo "  当前版本: $current_version"
    echo "  上游版本: $target_version"
    echo ""

    compare_versions "$current_version" "$target_version"
    local cmp_result=$?

    case $cmp_result in
        0)
            print_success "已是最新版本"
            echo ""
            if [ "$check_only" = false ]; then
                print_info "如需重新运行迁移检查，请使用 --check-only"
            fi
            exit 0
            ;;
        1)
            print_info "发现新版本，需要迁移"
            ;;
        2)
            print_warning "无法检测版本信息"
            read -p "是否继续？(y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 0
            fi
            ;;
        3)
            print_warning "当前版本比上游更新"
            read -p "是否继续？(y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 0
            fi
            ;;
    esac
    echo ""

    # 步骤 2：数据完整性检查
    print_header "步骤 2/4: 数据完整性检查 "
    check_personal_data
    check_template_updates
    check_compatibility
    echo ""

    # 仅检查模式
    if $check_only; then
        print_header "          检查完成          "
        echo ""
        print_info "使用以下命令执行完整迁移："
        echo "  bash scripts/migrate.sh"
        echo ""
        exit 0
    fi

    # 步骤 3：确认迁移
    print_header "步骤 3/4: 迁移确认 "
    echo ""
    print_warning "迁移将："
    echo "  1. 获取上游更新"
    echo "  2. 可能更新系统文件"
    echo "  3. 保留所有个人数据"
    echo ""
    read -p "是否继续迁移？(Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_info "迁移已取消"
        exit 0
    fi
    echo ""

    # 步骤 4：执行迁移（调用 sync.sh）
    print_header "步骤 4/4: 执行迁移 "
    print_info "运行同步脚本..."
    echo ""

    if [ -x "scripts/sync.sh" ]; then
        bash scripts/sync.sh
    else
        print_error "找不到 sync.sh 脚本"
        exit 1
    fi
    echo ""

    # 生成迁移报告
    generate_migration_report "$current_version" "$target_version"

    # 完成
    print_header "          迁移完成！          "
    echo ""
    print_success "已从版本 $current_version 迁移到 $target_version"
    echo ""
    print_info "下一步："
    echo "  - 查看迁移报告了解详细信息"
    echo "  - 查看 CHANGELOG.md 了解详细变更"
    echo "  - 运行学习命令验证功能正常"
    echo ""
}

# 运行主流程
main "$@"
