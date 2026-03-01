#!/bin/bash
# PreCommit Hook - 学习计划项目
# 在 Git 提交前检查是否有未完成的学习任务

echo "📚 Claude Code 学习计划 - PreCommit Hook"
echo "=========================================="
echo ""

# 检查是否有未提交的进度更新
if git diff --cached --name-only | grep -q "PROGRESS.md"; then
  echo "✅ 检测到进度更新，很好！"
else
  echo "💡 提示：记得更新 PROGRESS.md 记录你的学习进度哦！"
fi

echo ""
echo "🎯 继续保持学习的动力！"
echo "=========================================="

# Hook 成功，允许提交
exit 0
