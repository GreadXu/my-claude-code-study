/**
 * Progress Parser - 解析 checklist.md 文件
 * 提取学习模式、完成项、进度等信息
 */

import { ChecklistData, ChecklistSection, StudyMode } from './types.js';

/**
 * 解析 checklist.md 内容
 */
export function parseChecklist(content: string): ChecklistData {
  const lines = content.split('\n');

  const result: ChecklistData = {
    mode: null,
    quickTotal: 0,
    quickCompleted: 0,
    completeTotal: 0,
    completeCompleted: 0,
    rawContent: content,
    sections: []
  };

  let currentSection: ChecklistSection | null = null;
  let inQuickMode = false;
  let inCompleteMode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 检测学习模式选择
    if (trimmedLine.includes('快速模式') && trimmedLine.includes('[x]')) {
      result.mode = 'quick';
    } else if (trimmedLine.includes('完整模式') && trimmedLine.includes('[x]')) {
      result.mode = 'complete';
    }

    // 检测快速模式章节
    if (trimmedLine.startsWith('## ') && trimmedLine.includes('快速模式')) {
      inQuickMode = true;
      inCompleteMode = false;
      if (currentSection) {
        result.sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine,
        type: 'quick',
        total: 0,
        completed: 0,
        content: '',
        startLine: i,
        endLine: i
      };
      continue;
    }

    // 检测完整模式章节
    if (trimmedLine.startsWith('## ') && trimmedLine.includes('完整模式')) {
      inQuickMode = false;
      inCompleteMode = true;
      if (currentSection) {
        result.sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine,
        type: 'complete',
        total: 0,
        completed: 0,
        content: '',
        startLine: i,
        endLine: i
      };
      continue;
    }

    // 检测其他二级标题（结束当前章节）
    if (trimmedLine.startsWith('## ') && currentSection) {
      result.sections.push(currentSection);
      currentSection = null;
      inQuickMode = false;
      inCompleteMode = false;
      continue;
    }

    // 统计 checkbox
    const checkboxMatch = trimmedLine.match(/^[\s]*-\s*\[([ x])\]/);
    if (checkboxMatch) {
      const isChecked = checkboxMatch[1] === 'x';

      if (inQuickMode || (currentSection?.type === 'quick')) {
        result.quickTotal++;
        if (isChecked) result.quickCompleted++;
        if (currentSection) {
          currentSection.total++;
          if (isChecked) currentSection.completed++;
        }
      } else if (inCompleteMode || (currentSection?.type === 'complete')) {
        result.completeTotal++;
        if (isChecked) result.completeCompleted++;
        if (currentSection) {
          currentSection.total++;
          if (isChecked) currentSection.completed++;
        }
      } else {
        // 不在任何模式章节中的 checkbox，计入完整模式
        result.completeTotal++;
        if (isChecked) result.completeCompleted++;
      }
    }

    if (currentSection) {
      currentSection.content += line + '\n';
      currentSection.endLine = i;
    }
  }

  // 处理最后一个章节
  if (currentSection) {
    result.sections.push(currentSection);
  }

  // 如果没有选择模式，默认为未选择
  if (result.mode === null) {
    result.mode = null;
  }

  return result;
}

/**
 * 从文件内容中提取学习模式
 */
export function extractStudyMode(content: string): StudyMode | null {
  const parsed = parseChecklist(content);
  return parsed.mode;
}

/**
 * 设置学习模式（返回更新后的内容）
 */
export function setStudyMode(content: string, mode: StudyMode): string {
  const lines = content.split('\n');
  const result: string[] = [];

  let inModeSelection = false;
  let quickModeLine = -1;
  let completeModeLine = -1;

  // 查找模式选择的行号
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('学习模式选择')) {
      inModeSelection = true;
    }
    if (inModeSelection) {
      if (line.includes('快速模式') && line.includes('- [')) {
        quickModeLine = i;
      }
      if (line.includes('完整模式') && line.includes('- [')) {
        completeModeLine = i;
      }
    }
    // 超过模式选择区域后停止
    if (inModeSelection && line.startsWith('## ')) {
      break;
    }
  }

  // 更新 checkbox 状态
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === quickModeLine) {
      if (mode === 'quick') {
        result.push(line.replace('- [ ]', '- [x]'));
      } else {
        result.push(line.replace('- [x]', '- [ ]'));
      }
    } else if (i === completeModeLine) {
      if (mode === 'complete') {
        result.push(line.replace('- [ ]', '- [x]'));
      } else {
        result.push(line.replace('- [x]', '- [ ]'));
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * 计算当前进度百分比
 */
export function calculateProgress(parsed: ChecklistData): number {
  const mode = parsed.mode;

  if (mode === 'quick') {
    if (parsed.quickTotal === 0) return 0;
    return Math.round((parsed.quickCompleted / parsed.quickTotal) * 100);
  } else if (mode === 'complete') {
    if (parsed.completeTotal === 0) return 0;
    return Math.round((parsed.completeCompleted / parsed.completeTotal) * 100);
  } else {
    // 未选择模式时，基于完整模式计算
    if (parsed.completeTotal === 0) return 0;
    return Math.round((parsed.completeCompleted / parsed.completeTotal) * 100);
  }
}

/**
 * 检查是否所有必选项都已完成
 */
export function areRequiredItemsCompleted(parsed: ChecklistData): boolean {
  const mode = parsed.mode;
  const progress = calculateProgress(parsed);

  return progress === 100;
}

/**
 * 获取未完成的项目列表
 */
export function getIncompleteItems(parsed: ChecklistData): string[] {
  const incomplete: string[] = [];

  for (const section of parsed.sections) {
    const lines = section.content.split('\n');
    for (const line of lines) {
      const match = line.match(/^[\s]*-\s*\[ \]\s*(.+)$/);
      if (match) {
        incomplete.push(`[${section.title}] ${match[1].trim()}`);
      }
    }
  }

  return incomplete;
}

/**
 * 生成章节进度摘要
 */
export function getSectionSummary(parsed: ChecklistData): string {
  const summary: string[] = [];

  for (const section of parsed.sections) {
    if (section.total > 0) {
      const percentage = Math.round((section.completed / section.total) * 100);
      summary.push(`${section.title}: ${section.completed}/${section.total} (${percentage}%)`);
    }
  }

  return summary.join('\n');
}

/**
 * 验证 checklist.md 格式
 */
export function validateChecklist(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 检查是否有学习模式选择部分
  if (!content.includes('学习模式选择')) {
    errors.push('缺少"学习模式选择"部分');
  }

  // 检查是否有快速模式章节
  if (!content.includes('快速模式')) {
    errors.push('缺少"快速模式"章节');
  }

  // 检查是否有完整模式章节
  if (!content.includes('完整模式')) {
    errors.push('缺少"完整模式"章节');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
