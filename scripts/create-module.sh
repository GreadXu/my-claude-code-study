#!/bin/bash
# =============================================================================
# AI 技术学习模板 - 创建新模块脚本
# =============================================================================
# 用途：快速创建新的学习模块
# 用法：bash scripts/create-module.sh <模块名> <阶段> <优先级>
# 示例：bash scripts/create-module.sh react-basics 01-基础入门 P1
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
# 参数验证
# =============================================================================

validate_params() {
    if [ -z "$MODULE_NAME" ]; then
        print_error "缺少模块名称"
        echo ""
        echo "用法: bash scripts/create-module.sh <模块名> <阶段> <优先级>"
        echo ""
        echo "示例:"
        echo "  bash scripts/create-module.sh react-basics 01-基础入门 P1"
        echo "  bash scripts/create-module.sh vue-ecosystem 02-进阶探索 P2"
        exit 1
    fi

    # 验证阶段
    case "$STAGE" in
        "01-基础入门"|"02-进阶探索"|"03-实战应用")
            ;;
        *)
            print_error "无效的阶段: $STAGE"
            echo "有效阶段: 01-基础入门, 02-进阶探索, 03-实战应用"
            exit 1
            ;;
    esac

    # 验证优先级
    case "$PRIORITY" in
        "P0"|"P1"|"P2"|"P3")
            ;;
        *)
            print_error "无效的优先级: $PRIORITY"
            echo "有效优先级: P0, P1, P2, P3"
            exit 1
            ;;
    esac

    # 检查模块是否已存在
    if [ -d "$STAGE/$MODULE_NAME" ]; then
        print_error "模块已存在: $STAGE/$MODULE_NAME"
        exit 1
    fi
}

# =============================================================================
# 创建模块
# =============================================================================

create_module_directory() {
    print_info "创建模块目录: $STAGE/$MODULE_NAME"
    mkdir -p "$STAGE/$MODULE_NAME"
    print_success "目录创建成功"
}

create_readme() {
    print_info "创建 README.md..."

    local priority_label=""
    local priority_color=""
    case "$PRIORITY" in
        "P0") priority_label="必学"; priority_color="🔴" ;;
        "P1") priority_label="推荐"; priority_color="🟡" ;;
        "P2") priority_label="可选"; priority_color="🟢" ;;
        "P3") priority_label="了解"; priority_color="🔵" ;;
    esac

    cat > "$STAGE/$MODULE_NAME/README.md" << EOF
# $MODULE_NAME 模块标题

> **优先级**：$PRIORITY $priority_color $priority_label
> **预计时长**：快速模式 X 天 | 完整模式 X 周
> **难度等级**：⭐ 入门
> **前置要求**：根据需要填写
> **更新日期**：$TODAY

---

## 模块概述

[在此描述模块的主要内容和学习目标]

## 前置知识

- [ ] 前置要求 1
- [ ] 前置要求 2

---

## 学习模式说明

### 📚 快速模式（约 X 天）

**适合人群**：想快速了解概念的学习者

**学习内容**：
- 理论学习：核心概念、架构
- 资源阅读：官方文档
- **输出**：学习笔记

### 🛠️ 完整模式（约 X 周）

**适合人群**：希望深入掌握并实际应用的学习者

**学习内容**：
- 理论学习：核心概念、架构
- 实践内容：配置、使用、实践任务
- **输出**：学习笔记 + 练习代码 + 配置文件

---

## 学习资源

### 官方资源
- [官方文档链接]()
- [GitHub 仓库链接]()

### 推荐阅读顺序
1. 第一步
2. 第二步
3. 第三步

---

## 学习目标

### 快速模式目标
- [ ] 目标 1
- [ ] 目标 2

### 完整模式目标
- [ ] 目标 1
- [ ] 目标 2
- [ ] 实践任务

---

## 成果检验

### 快速模式检验
- [ ] 完成 \`notes.md\` 笔记文件
- [ ] 能够解释核心概念

### 完整模式检验
- [ ] 完成实践任务
- [ ] 输出完整的 \`notes.md\` 学习笔记
- [ ] 完成 checklist.md 中的所有检查项

---

## 常见问题

### Q: 问题 1？
**A**: 回答 1

### Q: 问题 2？
**A**: 回答 2
EOF

    print_success "README.md 已创建"
}

create_checklist() {
    print_info "创建 checklist.md..."

    # 从模板复制
    if [ -f ".templates/module/checklist.template.md" ]; then
        sed -e "s/{{MODULE_NAME}}/$MODULE_NAME/g" \
            -e "s/{{PRIORITY}}/$PRIORITY/g" \
            -e "s/{{DATE}}/$TODAY/g" \
            -e "s/{{QUICK_MODE_DAYS}}/3/g" \
            -e "s/{{FULL_MODE_DAYS}}/7/g" \
            .templates/module/checklist.template.md > "$STAGE/$MODULE_NAME/checklist.md"
        print_success "checklist.md 已创建"
    else
        print_warning "模板文件不存在，创建基础 checklist.md"
        cat > "$STAGE/$MODULE_NAME/checklist.md" << EOF
# $MODULE_NAME 学习清单

> **创建日期**：$TODAY
> **优先级**：$PRIORITY

---

## 学习模式选择

- [ ] **快速模式**（约 3 天）- 理论为主
- [ ] **完整模式**（约 1 周）- 理论+实践

---

## 📚 快速模式清单

### 第一部分：理论理解
- [ ] 理解核心概念
- [ ] 阅读官方文档
- [ ] 整理学习笔记

---

## 🛠️ 完整模式清单

### 第一部分：理论学习
- [ ] 理解核心概念
- [ ] 阅读官方文档

### 第二部分：实践操作
- [ ] 完成配置实践
- [ ] 完成练习任务

### 第三部分：成果输出
- [ ] 整理完整笔记
- [ ] 输出学习成果
EOF
        print_success "基础 checklist.md 已创建"
    fi
}

create_notes() {
    print_info "创建 notes.md..."

    # 从模板复制
    if [ -f ".templates/module/notes.template.md" ]; then
        sed -e "s/{{MODULE_NAME}}/$MODULE_NAME/g" \
            -e "s/{{LEARNING_MODE}}/未选择/g" \
            -e "s/{{START_DATE}}/待定/g" \
            .templates/module/notes.template.md > "$STAGE/$MODULE_NAME/notes.md"
        print_success "notes.md 已创建"
    else
        print_warning "模板文件不存在，创建基础 notes.md"
        cat > "$STAGE/$MODULE_NAME/notes.md" << EOF
# $MODULE_NAME 学习笔记

> **学习模式**：未选择
> **开始日期**：待定
> **完成日期**：-

---

## 学习日志

| 日期 | 内容 | 备注 |
|------|------|------|
| - | - | - |

---

## 核心概念

### 概念 1


### 概念 2


---

## 实践记录

### 实践 1


---

## 疑问与解答

### 疑问 1


---

## 学习资源

- [资源 1]()
- [资源 2]()
EOF
        print_success "基础 notes.md 已创建"
    fi
}

create_exercises_dir() {
    print_info "创建 exercises/ 目录..."
    mkdir -p "$STAGE/$MODULE_NAME/exercises"
    echo "# 练习文件" > "$STAGE/$MODULE_NAME/exercises/.gitkeep"
    print_success "exercises/ 目录已创建"
}

update_claude_md() {
    print_info "请手动更新 CLAUDE.md 添加模块路径映射："
    echo ""
    echo "  在 CLAUDE.md 的模块路径映射部分添加："
    echo "  - \`$MODULE_NAME\` → \`$STAGE/$MODULE_NAME\`"
    echo ""
}

update_progress_md() {
    print_info "请手动更新 PROGRESS.md 添加模块行："
    echo ""
    echo "  在 PROGRESS.md 的 $STAGE 部分添加："
    echo "  | $MODULE_NAME | $PRIORITY $(case $PRIORITY in P0) echo '🔴';; P1) echo '🟡';; P2) echo '🟢';; P3) echo '🔵';; esac) | 未选择 | 未开始 | 0% |"
    echo ""
}

# =============================================================================
# 主流程
# =============================================================================

main() {
    # 解析参数
    MODULE_NAME=${1:-}
    STAGE=${2:-"01-基础入门"}
    PRIORITY=${3:-"P1"}

    print_header "      AI 技术学习模板 - 创建新模块      "

    # 验证参数
    validate_params

    echo ""
    print_info "模块信息："
    echo "  - 模块名称: $MODULE_NAME"
    echo "  - 所属阶段: $STAGE"
    echo "  - 优先级: $PRIORITY"
    echo ""

    # 确认创建
    read -p "确认创建模块? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "创建已取消"
        exit 0
    fi

    echo ""

    # 创建模块
    print_header "步骤 1/6: 创建模块目录 "
    create_module_directory
    echo ""

    print_header "步骤 2/6: 创建 README.md "
    create_readme
    echo ""

    print_header "步骤 3/6: 创建 checklist.md "
    create_checklist
    echo ""

    print_header "步骤 4/6: 创建 notes.md "
    create_notes
    echo ""

    print_header "步骤 5/6: 创建 exercises/ 目录 "
    create_exercises_dir
    echo ""

    print_header "步骤 6/6: 后续步骤提示 "
    update_claude_md
    update_progress_md
    echo ""

    # 完成
    print_header "          模块创建完成！          "
    echo ""
    print_success "模块 $MODULE_NAME 已创建在 $STAGE/$MODULE_NAME/"
    echo ""
    print_info "下一步："
    echo "  1. 编辑 README.md 添加模块具体内容"
    echo "  2. 更新 CLAUDE.md 添加模块路径映射"
    echo "  3. 更新 PROGRESS.md 添加模块行"
    echo "  4. 对 Claude 说：'开始学习 $MODULE_NAME'"
    echo ""
}

# 显示帮助
show_help() {
    echo "用法: bash scripts/create-module.sh <模块名> <阶段> <优先级>"
    echo ""
    echo "参数:"
    echo "  模块名    英文短名称（如 react-basics, vue-ecosystem）"
    echo "  阶段      01-基础入门 | 02-进阶探索 | 03-实战应用"
    echo "  优先级    P0(必学) | P1(推荐) | P2(可选) | P3(了解)"
    echo ""
    echo "示例:"
    echo "  bash scripts/create-module.sh react-basics 01-基础入门 P1"
    echo "  bash scripts/create-module.sh docker-deployment 02-进阶探索 P2"
    echo "  bash scripts/create-module.sh my-project 03-实战应用 P1"
    exit 0
}

# 检查是否请求帮助
for arg in "$@"; do
    case $arg in
        -h|--help)
            show_help
            ;;
    esac
done

# 运行主流程
main "$@"
