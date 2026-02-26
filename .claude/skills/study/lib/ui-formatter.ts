/**
 * UI Formatter - 格式化输出显示
 * 进度条、状态徽章、表格等
 */

import { generateProgressBar, getStatusBadge } from './progress-calculator.js';
import { ModuleInfo, ChecklistData, ProgressFileData, StudyMode } from './types.js';

/**
 * 格式化模块信息显示
 */
export function formatModuleInfo(module: ModuleInfo): string {
  const priorityEmoji = getPriorityEmoji(module.priority);
  const priorityName = getPriorityName(module.priority);

  return `${module.name} [${module.priority}${priorityEmoji} ${priorityName}]`;
}

/**
 * 格式化进度显示（带颜色）
 */
export function formatProgressDisplay(percentage: number, width: number = 20): string {
  const bar = generateProgressBar(percentage, width);
  return `${bar} ${percentage}%`;
}

/**
 * 格式化状态徽章
 */
export function formatStatusBadge(status: string): string {
  return getStatusBadge(status);
}

/**
 * 格式化学习模式显示
 */
export function formatStudyMode(mode: StudyMode | null): string {
  if (mode === 'quick') return '📚 快速模式';
  if (mode === 'complete') return '🛠️ 完整模式';
  return '⚪ 未选择';
}

/**
 * 格式化模块状态卡片
 */
export function formatModuleCard(
  module: ModuleInfo,
  mode: StudyMode | null,
  status: string,
  percentage: number
): string {
  const lines: string[] = [];

  lines.push('┌' + '─'.repeat(50) + '┐');
  lines.push('│ ' + formatModuleInfo(module).padEnd(48) + '│');
  lines.push('├' + '─'.repeat(50) + '┤');
  lines.push('│ 模式: ' + formatStudyMode(mode).padEnd(42) + '│');
  lines.push('│ 状态: ' + formatStatusBadge(status) + ' ' + status.padEnd(38) + '│');
  lines.push('│ 进度: ' + formatProgressDisplay(percentage, 15).padEnd(42) + '│');
  lines.push('└' + '─'.repeat(50) + '┘');

  return lines.join('\n');
}

/**
 * 格式化进度更新预览
 */
export function formatUpdatePreview(
  moduleName: string,
  oldPercentage: number,
  newPercentage: number,
  oldStatus: string,
  newStatus: string,
  mode: StudyMode | null,
  fileChanges: { path: string; change: string }[]
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`Proposed changes for ${moduleName}:`);
  lines.push('━'.repeat(54));
  lines.push('');

  // 进度变化
  lines.push(`Progress: ${oldPercentage}% -> ${newPercentage}%`);
  lines.push(`  ${formatProgressDisplay(oldPercentage, 25)}`);
  lines.push(`  ${formatProgressDisplay(newPercentage, 25)}`);
  lines.push('');

  // 状态变化
  lines.push(`Status: ${formatStatusBadge(oldStatus)} ${oldStatus} -> ${formatStatusBadge(newStatus)} ${newStatus}`);
  lines.push('');

  // 模式
  if (mode) {
    lines.push(`Mode: ${mode === 'quick' ? '快速模式' : '完整模式'}`);
  }
  lines.push('');

  // 文件变化
  lines.push('File changes:');
  for (const change of fileChanges) {
    lines.push(`  📄 ${change.path}`);
    lines.push(`     ${change.change}`);
  }
  lines.push('');

  lines.push('━'.repeat(54));
  lines.push('');
  lines.push('Apply these changes? (y/n):');

  return lines.join('\n');
}

/**
 * 格式化开始学习确认
 */
export function formatStartConfirmation(
  module: ModuleInfo,
  mode: StudyMode
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('═'.repeat(54));
  lines.push(`  开始学习: ${formatModuleInfo(module)}`);
  lines.push('═'.repeat(54));
  lines.push('');
  lines.push(`  学习模式: ${mode === 'quick' ? '📚 快速模式' : '🛠️ 完整模式'}`);
  lines.push('');

  if (mode === 'quick') {
    lines.push('  快速模式包含:');
    lines.push('    • 理论学习（概念、架构、配置）');
    lines.push('    • 阅读核心文档');
    lines.push('    • 完成学习笔记');
    lines.push('    • 预计时间: 约 3 天');
  } else {
    lines.push('  完整模式包含:');
    lines.push('    • 所有理论学习');
    lines.push('    • 实践操作和练习');
    lines.push('    • 完成所有检验任务');
    lines.push('    • 输出练习代码和作品');
    lines.push('    • 预计时间: 约 1 周');
  }

  lines.push('');
  lines.push('  将执行以下操作:');
  lines.push('    1. 设置 checklist.md 学习模式');
  lines.push('    2. 记录 notes.md 开始日期');
  lines.push('    3. 更新 PROGRESS.md 状态为"进行中"');
  lines.push('    4. 添加学习日志');
  lines.push('');
  lines.push('═'.repeat(54));
  lines.push('');
  lines.push('确认开始学习? (y/n):');

  return lines.join('\n');
}

/**
 * 格式化完成学习确认
 */
export function formatCompleteConfirmation(
  module: ModuleInfo,
  percentage: number,
  incompleteItems: string[]
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('═'.repeat(54));
  lines.push(`  完成学习: ${formatModuleInfo(module)}`);
  lines.push('═'.repeat(54));
  lines.push('');

  if (percentage < 100) {
    lines.push(`  ⚠️  警告: 当前完成度 ${percentage}%`);
    lines.push('');
    lines.push(`  仍有 ${incompleteItems.length} 个未完成项目:`);
    const showItems = incompleteItems.slice(0, 5);
    for (const item of showItems) {
      lines.push(`    - ${item.substring(0, 45)}`);
    }
    if (incompleteItems.length > 5) {
      lines.push(`    ... 还有 ${incompleteItems.length - 5} 项`);
    }
    lines.push('');
    lines.push('  建议完成所有项目后再标记完成。');
    lines.push('  如需强制完成，请使用 --force 参数。');
  } else {
    lines.push('  ✅ 恭喜! 所有项目已完成!');
    lines.push('');
    lines.push('  将执行以下操作:');
    lines.push('    1. 记录 notes.md 完成日期');
    lines.push('    2. 更新 PROGRESS.md 状态为"已完成"');
    lines.push('    3. 添加完成日志');
    lines.push('    4. 重新计算总体进度');
  }

  lines.push('');
  lines.push('═'.repeat(54));
  lines.push('');

  return lines.join('\n');
}

/**
 * 格式化状态概览
 */
export function formatStatusOverview(
  parsed: ProgressFileData,
  moduleDetails: Map<string, { mode: StudyMode | null; status: string }>
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════╗');
  lines.push('║          Claude Code 学习进度总览                      ║');
  lines.push('╚════════════════════════════════════════════════════════╝');
  lines.push('');

  // 总体进度
  lines.push(`总体进度: ${formatProgressDisplay(parsed.overallProgress, 30)}`);
  lines.push('');

  // 优先级概览
  lines.push('优先级概览:');
  const priorities = ['P0', 'P1', 'P2', 'P3'] as const;
  for (const priority of priorities) {
    const emoji = getPriorityEmoji(priority);
    const name = getPriorityName(priority);
    const percentage = parsed.priorityProgress[priority];
    lines.push(`  ${priority} ${emoji} ${name}: ${formatProgressDisplay(percentage, 20)}`);
  }
  lines.push('');

  // 各模块详情
  lines.push('模块详情:');
  lines.push('');

  for (const [moduleName, rowData] of parsed.moduleRows) {
    const details = moduleDetails.get(moduleName);
    const modeDisplay = details?.mode ? (details.mode === 'quick' ? '📚 快速' : '🛠️ 完整') : '⚪ 未选择';
    const statusDisplay = `${formatStatusBadge(rowData.status)} ${rowData.status}`;

    lines.push(`  ${moduleName.padEnd(25)} ${modeDisplay.padEnd(10)} ${statusDisplay.padEnd(10)} ${rowData.percentage}`);
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * 格式化单个模块状态
 */
export function formatSingleModuleStatus(
  module: ModuleInfo,
  checklistData: ChecklistData,
  progressRow: { mode: string; status: string; percentage: string }
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════╗');
  lines.push(`║  ${formatModuleInfo(module).padEnd(50)}║`);
  lines.push('╚════════════════════════════════════════════════════════╝');
  lines.push('');

  // 基本信息
  lines.push('📋 基本信息:');
  lines.push(`   路径: ${module.path}`);
  lines.push(`   阶段: ${module.stageNumber} - ${module.stageName}`);
  lines.push(`   优先级: ${module.priority}${getPriorityEmoji(module.priority)} ${getPriorityName(module.priority)}`);
  lines.push('');

  // 学习状态
  lines.push('📊 学习状态:');
  lines.push(`   模式: ${formatStudyMode(checklistData.mode)}`);
  lines.push(`   状态: ${formatStatusBadge(progressRow.status)} ${progressRow.status}`);
  lines.push(`   进度: ${formatProgressDisplay(parseInt(progressRow.percentage) || 0, 30)}`);
  lines.push('');

  // 详细进度
  if (checklistData.mode) {
    const total = checklistData.mode === 'quick' ? checklistData.quickTotal : checklistData.completeTotal;
    const completed = checklistData.mode === 'quick' ? checklistData.quickCompleted : checklistData.completeCompleted;
    lines.push('📈 详细进度:');
    lines.push(`   已完成: ${completed}/${total} 项`);
    lines.push('');
  }

  // 各章节进度
  if (checklistData.sections.length > 0) {
    lines.push('📑 各章节进度:');
    for (const section of checklistData.sections) {
      if (section.total > 0) {
        const sectionPercentage = Math.round((section.completed / section.total) * 100);
        lines.push(`   ${section.title.substring(0, 35)}... ${section.completed}/${section.total} (${sectionPercentage}%)`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 格式化错误信息
 */
export function formatError(message: string, details?: string[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('❌ 错误: ' + message);
  lines.push('');

  if (details && details.length > 0) {
    lines.push('详细信息:');
    for (const detail of details) {
      lines.push('  - ' + detail);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 格式化成功信息
 */
export function formatSuccess(message: string, details?: string[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('✅ ' + message);
  lines.push('');

  if (details && details.length > 0) {
    for (const detail of details) {
      lines.push('  ' + detail);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 格式化警告信息
 */
export function formatWarning(message: string, details?: string[]): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('⚠️  ' + message);
  lines.push('');

  if (details && details.length > 0) {
    for (const detail of details) {
      lines.push('  - ' + detail);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 格式化模块建议
 */
export function formatModuleSuggestions(suggestions: string[], input: string): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`❌ 未找到模块: "${input}"`);
  lines.push('');
  lines.push('您是否想查找以下模块?');
  lines.push('');

  for (let i = 0; i < suggestions.length; i++) {
    lines.push(`  ${i + 1}. ${suggestions[i]}`);
  }

  lines.push('');
  lines.push('提示: 您可以使用模块名称或路径，例如:');
  lines.push('  - claude-code-core');
  lines.push('  - 01-基础入门/claude-code-core');
  lines.push('');

  return lines.join('\n');
}

// 辅助函数
function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'P0': return '';
    case 'P1': return '';
    case 'P2': return '';
    case 'P3': return '';
    default: return '';
  }
}

function getPriorityName(priority: string): string {
  switch (priority) {
    case 'P0': return '必学';
    case 'P1': return '推荐';
    case 'P2': return '可选';
    case 'P3': return '了解';
    default: return '';
  }
}
