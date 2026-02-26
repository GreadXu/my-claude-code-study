#!/bin/bash
# Study Start Script - 开始学习脚本
# 用法: ./study-start.sh <模块名> <模式: quick|complete>

MODULE_NAME=$1
MODE=${2:-quick}
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# 模块路径映射
declare -A MODULE_PATHS=(
  ["claude-code-core"]="01-基础入门/claude-code-core"
  ["mcp-basics"]="01-基础入门/mcp-basics"
  ["agent-sdk"]="02-进阶探索/agent-sdk"
  ["mcp-advanced"]="02-进阶探索/mcp-advanced"
  ["everything-claude-code"]="02-进阶探索/everything-claude-code"
  ["cc-switch"]="03-实战应用/cc-switch"
  ["spec-kit"]="03-实战应用/spec-kit"
  ["projects"]="03-实战应用/projects"
)

MODULE_PATH="${MODULE_PATHS[$MODULE_NAME]}"

if [ -z "$MODULE_PATH" ]; then
  echo "错误: 未找到模块 '$MODULE_NAME'"
  echo "可用模块: ${!MODULE_PATHS[@]}"
  exit 1
fi

CHECKLIST_FILE="$ROOT_DIR/$MODULE_PATH/checklist.md"
NOTES_FILE="$ROOT_DIR/$MODULE_PATH/notes.md"
PROGRESS_FILE="$ROOT_DIR/PROGRESS.md"

# 检查文件是否存在
if [ ! -f "$CHECKLIST_FILE" ]; then
  echo "错误: checklist.md 不存在于 $MODULE_PATH"
  exit 1
fi

# 获取当前日期
DATE=$(date +%Y-%m-%d)
MODE_TEXT="快速模式"
if [ "$MODE" = "complete" ]; then
  MODE_TEXT="完整模式"
fi

echo "开始学习: $MODULE_NAME"
echo "学习模式: $MODE_TEXT"
echo "开始日期: $DATE"
echo ""

# 更新 checklist.md - 设置学习模式
if [ "$MODE" = "quick" ]; then
  sed -i 's/- \[ \] \*\*快速模式\*\*/- [x] **快速模式**/' "$CHECKLIST_FILE"
  sed -i 's/- \[x\] \*\*完整模式\*\*/- [ ] **完整模式**/' "$CHECKLIST_FILE"
else
  sed -i 's/- \[ \] \*\*完整模式\*\*/- [x] **完整模式**/' "$CHECKLIST_FILE"
  sed -i 's/- \[x\] \*\*快速模式\*\*/- [ ] **快速模式**/' "$CHECKLIST_FILE"
fi

# 更新 notes.md - 设置学习模式和开始日期
sed -i "s/> \*\*学习模式\*\*：.*/> **学习模式**：$MODE_TEXT/" "$NOTES_FILE"
sed -i "s/> \*\*开始日期\*\*：.*/> **开始日期**：$DATE/" "$NOTES_FILE"

# 更新 PROGRESS.md - 更新状态为进行中
# 先查找模块所在阶段
STAGE=""
if [[ $MODULE_PATH == "01-"* ]]; then
  STAGE="01-基础入门"
elif [[ $MODULE_PATH == "02-"* ]]; then
  STAGE="02-进阶探索"
elif [[ $MODULE_PATH == "03-"* ]]; then
  STAGE="03-实战应用"
fi

# 更新模块状态行
sed -i "/| $MODULE_NAME |/ {
  s/| 未选择 |/$MODE_TEXT |/
  s/| 未开始 |/ 进行中 |/
}" "$PROGRESS_FILE"

# 添加学习日志
LOG_ENTRY="| $DATE | $MODULE_NAME | 开始学习 | 选择${MODE_TEXT} |"
# 在日志表格后插入新行
sed -i "/^| 2026-02-26 |/a $LOG_ENTRY" "$PROGRESS_FILE"

echo "已更新:"
echo "  - $CHECKLIST_FILE"
echo "  - $NOTES_FILE"
echo "  - $PROGRESS_FILE"
echo ""
echo "下一步:"
echo "  1. 阅读 $MODULE_PATH/README.md"
echo "  2. 按照 checklist.md 逐步完成学习"
echo "  3. 使用 study-update.sh 更新进度"
