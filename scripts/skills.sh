#!/usr/bin/env bash
#
# skills.sh - 学习系统版本管理工具
#
# 功能：管理 Skill 和课程的独立版本更新
#
# 使用方法：
#   bash scripts/skills.sh check      # 检查更新
#   bash scripts/skills.sh update     # 更新 Skill
#   bash scripts/skills.sh list       # 列出已安装的 Skill
#   bash scripts/skills.sh info       # 显示版本信息
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 配置文件
CONFIG_FILE=".learning/skills-config.json"
VERSION_FILE=".learning/skills-version.json"

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

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# 初始化配置
init_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        cat > "$CONFIG_FILE" << 'EOF'
{
  "skills": {
    "learning-status": {
      "version": "4.0.0",
      "source": "local",
      "last_check": null,
      "auto_update": false
    },
    "learning-manager": {
      "version": "4.0.0",
      "source": "local",
      "last_check": null,
      "auto_update": false
    },
    "learning-tools": {
      "version": "4.0.0",
      "source": "local",
      "last_check": null,
      "auto_update": false
    },
    "goal-tracker": {
      "version": "4.0.0",
      "source": "local",
      "last_check": null,
      "auto_update": false
    },
    "goal-creator": {
      "version": "4.0.0",
      "source": "local",
      "last_check": null,
      "auto_update": false
    }
  },
  "courses": {
    "auto_update_check": true,
    "update_interval_hours": 24
  }
}
EOF
        print_step "配置文件已初始化: $CONFIG_FILE"
    fi
}

# 获取当前版本
get_current_version() {
    if [ -f "CHANGELOG.md" ]; then
        grep -m 1 "## \[" CHANGELOG.md | sed 's/## \[\([0-9.]*\).*/\1/'
    else
        echo "unknown"
    fi
}

# 检查 Skill 更新
check_skill_updates() {
    print_header "检查 Skill 更新"

    local current_version=$(get_current_version)
    local has_update=false

    echo "当前版本: $current_version"
    echo ""

    # 检查是否有上游仓库
    if git remote | grep -q "upstream"; then
        # 获取上游最新版本（从缓存）
        local cache_file=".claude/update-config.json"
        if [ -f "$cache_file" ] && command -v jq >/dev/null 2>&1; then
            local upstream_version=$(jq -r '.upstream_version // "unknown"' "$cache_file" 2>/dev/null)
            local last_check=$(jq -r '.last_check // "never"' "$cache_file" 2>/dev/null)

            echo "上游版本: $upstream_version"
            echo "上次检查: $last_check"

            if [ "$upstream_version" != "unknown" ] && [ "$upstream_version" != "$current_version" ]; then
                echo ""
                print_warning "发现新版本！"
                echo ""
                echo "更新内容："
                git fetch upstream >/dev/null 2>&1
                git log HEAD..upstream/main --oneline --no-merges | head -5 | sed 's/^/  • /'
                echo ""
                has_update=true
            else
                print_step "已是最新版本"
            fi
        else
            print_info "未找到缓存信息，运行学习状态检查时将自动更新"
        fi
    else
        print_warning "未配置 upstream 仓库"
        echo "如需检查更新，请添加 upstream："
        echo "  git remote add upstream <原始仓库URL>"
    fi

    return $([ "$has_update" = true ] && echo 1 || echo 0)
}

# 检查课程更新
check_course_updates() {
    print_header "检查课程缓存更新"

    local cache_count=0
    local outdated_count=0

    # 遍历所有缓存目录
    for metadata_file in .learning/cache/courses/*/.metadata.json .learning/cache/shared/*/.metadata.json 2>/dev/null; do
        if [ -f "$metadata_file" ]; then
            ((cache_count++))
            local cache_date=$(jq -r '.cache_date // "unknown"' "$metadata_file" 2>/dev/null)

            # 检查缓存是否超过7天
            if [ "$cache_date" != "unknown" ]; then
                local cache_timestamp=$(date -d "$cache_date" +%s 2>/dev/null || echo 0)
                local current_timestamp=$(date +%s)
                local days_diff=$(( (current_timestamp - cache_timestamp) / 86400 ))

                if [ $days_diff -gt 7 ]; then
                    ((outdated_count++))
                    local module_name=$(jq -r '.module // "unknown"' "$metadata_file" 2>/dev/null)
                    print_warning "$module_name 缓存已过期 ($cache_date, ${days_diff}天前)"
                fi
            fi
        fi
    done

    echo ""
    if [ $cache_count -eq 0 ]; then
        print_info "未找到知识缓存"
    else
        echo "缓存统计："
        echo "  • 总缓存数: $cache_count"
        echo "  • 过期缓存: $outdated_count"
        echo ""

        if [ $outdated_count -gt 0 ]; then
            echo "建议：说 \"刷新缓存\" 更新过期的知识缓存"
        fi
    fi
}

# 列出已安装的 Skill
list_skills() {
    print_header "已安装的 Skill"

    echo "核心 Skills（常驻/按需）："
    echo ""

    local skills=(
        "learning-status:常驻"
        "learning-manager:按需"
        "learning-tools:按需"
        "goal-tracker:常驻"
        "goal-creator:按需"
    )

    for skill_info in "${skills[@]}"; do
        local skill_name="${skill_info%:*}"
        local skill_type="${skill_info#*:}"

        if [ -f ".claude/skills/$skill_name/SKILL.md" ]; then
            local version=$(grep "version:" ".claude/skills/$skill_name/SKILL.md" 2>/dev/null | head -1 | cut -d: -f2 | xargs || echo "4.0.0")
            echo "  • $skill_name ($skill_type) - v${version}"
        else
            echo "  • $skill_name ($skill_type) - ${RED}未安装${NC}"
        fi
    done

    echo ""
    echo "使用 'npx skills' 管理额外的 Skill"
}

# 显示版本信息
show_version_info() {
    print_header "版本信息"

    local system_version=$(get_current_version)
    echo "学习系统版本: v$system_version"
    echo ""

    # 显示各 Skill 版本
    echo "Skill 版本："
    for skill_dir in .claude/skills/*/; do
        if [ -d "$skill_dir" ]; then
            local skill_name=$(basename "$skill_dir")
            if [ -f "$skill_dir/SKILL.md" ]; then
                local version=$(grep "## 版本" "$skill_dir/SKILL.md" 2>/dev/null | head -1 | cut -d: -f2 | xargs || echo "4.0.0")
                echo "  • $skill_name: v$version"
            fi
        fi
    done

    echo ""
    # 显示缓存统计
    echo "知识缓存统计："
    local cache_count=$(find .learning/cache -name ".metadata.json" 2>/dev/null | wc -l)
    echo "  • 缓存数量: $cache_count"

    local total_size=$(du -sh .learning/cache 2>/dev/null | cut -f1 || echo "未知")
    echo "  • 占用空间: $total_size"
}

# 更新 Skill
update_skills() {
    print_header "更新 Skill"

    print_warning "此功能需要配置 upstream 仓库"
    echo ""

    # 检查 upstream
    if ! git remote | grep -q "upstream"; then
        print_error "未配置 upstream 仓库"
        echo ""
        echo "请先添加 upstream："
        echo "  git remote add upstream <原始仓库URL>"
        echo "  git fetch upstream"
        return 1
    fi

    echo "更新方式："
    echo "  1. GitHub UI - 点击 'Sync fork' → 'Update branch'（推荐）"
    echo "  2. 命令行 - git fetch upstream && git merge upstream/main"
    echo ""

    read -p "是否使用命令行更新？(y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "正在拉取上游更新..."
        git fetch upstream

        print_step "正在合并更新..."
        git merge upstream/main

        print_step "更新完成！"
        echo ""
        echo "请检查 CHANGELOG.md 查看更新内容"
    else
        print_info "已取消，请手动更新"
    fi
}

# 主函数
main() {
    init_config

    case "${1:-list}" in
        check)
            check_skill_updates
            echo ""
            check_course_updates
            ;;
        update)
            update_skills
            ;;
        list)
            list_skills
            ;;
        info)
            show_version_info
            ;;
        --help|-h)
            echo "用法: bash scripts/skills.sh [命令]"
            echo ""
            echo "命令:"
            echo "  check   - 检查 Skill 和课程更新"
            echo "  update  - 更新 Skill"
            echo "  list    - 列出已安装的 Skill"
            echo "  info    - 显示版本信息"
            echo ""
            echo "示例:"
            echo "  bash scripts/skills.sh check"
            echo "  bash scripts/skills.sh update"
            ;;
        *)
            print_error "未知命令: $1"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
