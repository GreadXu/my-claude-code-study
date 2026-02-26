/**
 * File Updater - 处理文件更新操作
 * 生成并应用文件更新
 */

import { ModuleInfo, StudyMode, StudyStatus, FileUpdate, ChecklistData } from './types.js';
import { setStudyMode, parseChecklist, calculateProgress } from './progress-parser.js';
import { updateModuleProgressRow, updateOverallProgress, updateStageProgress, addLogEntry, recalculateAllProgress, parseProgressFile } from './progress-calculator.js';

/**
 * 获取当前日期字符串
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 生成 notes.md 更新内容
 */
export function generateNotesUpdate(
  originalContent: string,
  mode: StudyMode,
  status: 'start' | 'complete'
): string {
  const lines = originalContent.split('\n');
  const date = getCurrentDate();
  const modeText = mode === 'quick' ? '快速模式' : '完整模式';

  // 更新学习模式
  let result = originalContent.replace(
    /> \*\*学习模式\*\*：.+/,
    `> **学习模式**：${modeText}`
  );

  // 根据状态更新日期
  if (status === 'start') {
    result = result.replace(
      /> \*\*开始日期\*\*：.+/,
      `> **开始日期**：${date}`
    );
  } else if (status === 'complete') {
    result = result.replace(
      /> \*\*完成日期\*\*：.+/,
      `> **完成日期**：${date}`
    );
  }

  return result;
}

/**
 * 生成 checklist.md 更新内容（设置学习模式）
 */
export function generateChecklistModeUpdate(
  originalContent: string,
  mode: StudyMode
): string {
  return setStudyMode(originalContent, mode);
}

/**
 * 生成 PROGRESS.md 更新内容
 */
export function generateProgressUpdate(
  originalContent: string,
  moduleName: string,
  mode: StudyMode,
  status: StudyStatus,
  percentage: number,
  priorityLabel: string,
  stageName: string
): string {
  let result = originalContent;

  // 更新模块行
  result = updateModuleProgressRow(result, moduleName, {
    mode: mode === 'quick' ? '快速模式' : '完整模式',
    status: getStatusText(status),
    percentage: `${percentage}%`,
    priorityLabel
  });

  // 更新阶段进度
  const parsed = parseProgressFile(result);
  const stagePercentage = parsed.stageProgress.get(stageName) || 0;
  result = updateStageProgress(result, stageName, stagePercentage);

  // 更新总体进度
  result = updateOverallProgress(result, parsed.overallProgress);

  return result;
}

/**
 * 获取状态文本
 */
function getStatusText(status: StudyStatus): string {
  switch (status) {
    case 'not-started':
      return '未开始';
    case 'in-progress':
      return '进行中';
    case 'completed':
      return '已完成';
  }
}

/**
 * 生成开始学习的完整更新预览
 */
export function generateStartUpdates(
  module: ModuleInfo,
  mode: StudyMode,
  checklistContent: string,
  notesContent: string,
  progressContent: string
): FileUpdate[] {
  const updates: FileUpdate[] = [];
  const date = getCurrentDate();
  const priorityLabel = `${module.priority}${getPriorityEmoji(module.priority)}`;

  // 1. 更新 checklist.md
  const newChecklistContent = generateChecklistModeUpdate(checklistContent, mode);
  updates.push({
    path: module.checklistPath,
    type: 'modify',
    original: checklistContent,
    updated: newChecklistContent,
    description: `设置学习模式为 ${mode === 'quick' ? '快速模式' : '完整模式'}`
  });

  // 2. 更新 notes.md
  const newNotesContent = generateNotesUpdate(notesContent, mode, 'start');
  updates.push({
    path: module.notesPath,
    type: 'modify',
    original: notesContent,
    updated: newNotesContent,
    description: `记录开始日期 ${date}`
  });

  // 3. 更新 PROGRESS.md
  const newProgressContent = generateProgressUpdate(
    progressContent,
    module.name,
    mode,
    'in-progress',
    0,
    priorityLabel,
    module.stageName
  );

  // 添加日志
  const withLog = addLogEntry(
    newProgressContent,
    date,
    module.name,
    '开始学习',
    `选择${mode === 'quick' ? '快速模式' : '完整模式'}`
  );

  updates.push({
    path: 'PROGRESS.md',
    type: 'modify',
    original: progressContent,
    updated: withLog,
    description: `更新状态为"进行中"，添加学习日志`
  });

  return updates;
}

/**
 * 生成更新进度的完整更新预览
 */
export function generateUpdateUpdates(
  module: ModuleInfo,
  checklistContent: string,
  progressContent: string
): FileUpdate[] {
  const updates: FileUpdate[] = [];
  const date = getCurrentDate();
  const priorityLabel = `${module.priority}${getPriorityEmoji(module.priority)}`;

  // 解析 checklist
  const parsed = parseChecklist(checklistContent);
  const percentage = calculateProgress(parsed);
  const mode = parsed.mode || 'complete'; // 默认完整模式

  // 生成 PROGRESS.md 更新
  const newProgressContent = generateProgressUpdate(
    progressContent,
    module.name,
    mode,
    'in-progress',
    percentage,
    priorityLabel,
    module.stageName
  );

  // 添加日志
  const withLog = addLogEntry(
    newProgressContent,
    date,
    module.name,
    '更新进度',
    `${percentage}% 完成`
  );

  updates.push({
    path: 'PROGRESS.md',
    type: 'modify',
    original: progressContent,
    updated: withLog,
    description: `更新进度为 ${percentage}%`
  });

  return updates;
}

/**
 * 生成完成学习的完整更新预览
 */
export function generateCompleteUpdates(
  module: ModuleInfo,
  checklistContent: string,
  notesContent: string,
  progressContent: string,
  force: boolean = false
): { updates: FileUpdate[]; warnings: string[] } {
  const updates: FileUpdate[] = [];
  const warnings: string[] = [];
  const date = getCurrentDate();
  const priorityLabel = `${module.priority}${getPriorityEmoji(module.priority)}`;

  // 解析 checklist
  const parsed = parseChecklist(checklistContent);
  const percentage = calculateProgress(parsed);
  const mode = parsed.mode || 'complete';

  // 检查是否所有必选项都已完成
  if (percentage < 100 && !force) {
    warnings.push(`当前完成度为 ${percentage}%，仍有未完成的项目`);
    warnings.push('建议完成所有项目后再标记为完成，或使用 --force 强制完成');
  }

  // 1. 更新 notes.md
  const newNotesContent = generateNotesUpdate(notesContent, mode, 'complete');
  updates.push({
    path: module.notesPath,
    type: 'modify',
    original: notesContent,
    updated: newNotesContent,
    description: `记录完成日期 ${date}`
  });

  // 2. 更新 PROGRESS.md
  const newProgressContent = generateProgressUpdate(
    progressContent,
    module.name,
    mode,
    'completed',
    100,
    priorityLabel,
    module.stageName
  );

  // 添加日志
  const logNotes = percentage < 100 ? `（${percentage}% 完成）` : '全部完成';
  const withLog = addLogEntry(
    newProgressContent,
    date,
    module.name,
    '完成学习',
    logNotes
  );

  updates.push({
    path: 'PROGRESS.md',
    type: 'modify',
    original: progressContent,
    updated: withLog,
    description: `更新状态为"已完成"，添加完成日志`
  });

  return { updates, warnings };
}

/**
 * 获取优先级表情符号
 */
function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case 'P0':
      return '';
    case 'P1':
      return '';
    case 'P2':
      return '';
    case 'P3':
      return '';
    default:
      return '';
  }
}

/**
 * 应用文件更新
 */
export async function applyUpdates(updates: FileUpdate[]): Promise<void> {
  // 这个函数将被命令处理器调用
  // 实际的文件操作将在命令处理器中完成
  // 这里只返回更新信息
}

/**
 * 生成更新预览文本
 */
export function generateUpdatePreviewText(updates: FileUpdate[], moduleName: string): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(`Proposed changes for ${moduleName}:`);
  lines.push('━'.repeat(54));
  lines.push('');

  for (const update of updates) {
    lines.push(`📄 ${update.path}`);
    lines.push(`   ${update.description}`);
    lines.push('');
  }

  lines.push('━'.repeat(54));
  lines.push('');

  return lines.join('\n');
}

/**
 * 验证更新前的文件状态
 */
export function validateFilesBeforeUpdate(
  checklistContent: string | null,
  notesContent: string | null,
  progressContent: string | null
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (checklistContent === null) {
    errors.push('checklist.md 文件不存在');
  }
  if (notesContent === null) {
    errors.push('notes.md 文件不存在');
  }
  if (progressContent === null) {
    errors.push('PROGRESS.md 文件不存在');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
