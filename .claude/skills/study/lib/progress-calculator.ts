/**
 * Progress Calculator - 计算总体进度和各优先级进度
 * 从 PROGRESS.md 中提取和计算进度信息
 */

import { ProgressFileData, ProgressRowData, Priority } from './types.js';

/**
 * 解析 PROGRESS.md 文件内容
 */
export function parseProgressFile(content: string): ProgressFileData {
  const lines = content.split('\n');
  const result: ProgressFileData = {
    rawContent: content,
    moduleRows: new Map(),
    overallProgress: 0,
    priorityProgress: {
      P0: 0,
      P1: 0,
      P2: 0,
      P3: 0
    },
    stageProgress: new Map()
  };

  let currentSection = '';
  const moduleCountByPriority: Record<Priority, { total: number; sum: number }> = {
    P0: { total: 0, sum: 0 },
    P1: { total: 0, sum: 0 },
    P2: { total: 0, sum: 0 },
    P3: { total: 0, sum: 0 }
  };
  const stageCount: Map<string, { total: number; sum: number }> = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测阶段标题
    if (line.match(/^##\s+\d+-.+/)) {
      currentSection = line.replace(/^##\s+/, '').replace(/\s*\[\d+%\]$/, '');
      if (!stageCount.has(currentSection)) {
        stageCount.set(currentSection, { total: 0, sum: 0 });
      }
      continue;
    }

    // 解析模块行（格式：| 模块名 | 优先级 | 模式 | 状态 | 完成度 |）
    const tableMatch = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    if (tableMatch) {
      const moduleName = tableMatch[1].trim();
      const priorityLabel = tableMatch[2].trim();
      const mode = tableMatch[3].trim();
      const status = tableMatch[4].trim();
      const percentageStr = tableMatch[5].trim();

      // 提取百分比数值
      const percentageMatch = percentageStr.match(/(\d+)%/);
      const percentage = percentageMatch ? parseInt(percentageMatch[1], 10) : 0;

      // 提取优先级
      const priorityMatch = priorityLabel.match(/(P[0-3])/);
      const priority = priorityMatch ? (priorityMatch[1] as Priority) : 'P2';

      const rowData: ProgressRowData = {
        module: moduleName,
        priorityLabel,
        mode,
        status,
        percentage: percentageStr
      };

      result.moduleRows.set(moduleName, rowData);

      // 更新优先级统计
      if (moduleCountByPriority[priority]) {
        moduleCountByPriority[priority].total++;
        moduleCountByPriority[priority].sum += percentage;
      }

      // 更新阶段统计
      if (currentSection && stageCount.has(currentSection)) {
        const stageData = stageCount.get(currentSection)!;
        stageData.total++;
        stageData.sum += percentage;
      }
    }
  }

  // 计算各优先级平均进度
  for (const priority of ['P0', 'P1', 'P2', 'P3'] as Priority[]) {
    const data = moduleCountByPriority[priority];
    if (data.total > 0) {
      result.priorityProgress[priority] = Math.round(data.sum / data.total);
    }
  }

  // 计算各阶段进度
  for (const [stage, data] of stageCount.entries()) {
    if (data.total > 0) {
      result.stageProgress.set(stage, Math.round(data.sum / data.total));
    }
  }

  // 计算总体进度（所有模块的平均）
  let totalSum = 0;
  let totalCount = 0;
  for (const data of Object.values(moduleCountByPriority)) {
    totalSum += data.sum;
    totalCount += data.total;
  }
  if (totalCount > 0) {
    result.overallProgress = Math.round(totalSum / totalCount);
  }

  return result;
}

/**
 * 生成进度条字符串
 */
export function generateProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * 生成状态徽章
 */
export function getStatusBadge(status: string): string {
  switch (status.toLowerCase()) {
    case '未开始':
      return '🟢';
    case '进行中':
      return '🟡';
    case '已完成':
      return '✅';
    default:
      return '⚪';
  }
}

/**
 * 格式化进度显示
 */
export function formatProgress(percentage: number): string {
  const bar = generateProgressBar(percentage);
  return `${bar} ${percentage}%`;
}

/**
 * 更新模块进度行
 */
export function updateModuleProgressRow(
  content: string,
  moduleName: string,
  updates: Partial<ProgressRowData>
): string {
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 查找包含该模块的表格行
    if (line.includes(`| ${moduleName} |`)) {
      const parts = line.split('|').map(p => p.trim());

      // 更新各个字段
      if (updates.priorityLabel !== undefined) parts[2] = updates.priorityLabel;
      if (updates.mode !== undefined) parts[3] = updates.mode;
      if (updates.status !== undefined) parts[4] = updates.status;
      if (updates.percentage !== undefined) parts[5] = updates.percentage;

      // 重建行
      lines[i] = parts.map((p, idx) => {
        if (idx === 0 || idx === parts.length - 1) return p;
        return ` ${p} `;
      }).join('|');

      break;
    }
  }

  return lines.join('\n');
}

/**
 * 更新总体进度行
 */
export function updateOverallProgress(content: string, newPercentage: number): string {
  return content.replace(
    /## 总体进度：.+/,
    `## 总体进度：${formatProgress(newPercentage)}`
  );
}

/**
 * 更新优先级概览表格
 */
export function updatePriorityOverview(
  content: string,
  priorityProgress: Record<Priority, number>
): string {
  let result = content;

  for (const [priority, percentage] of Object.entries(priorityProgress)) {
    const emoji = { P0: '', P1: '', P2: '', P3: '' }[priority];
    const name = { P0: '必学', P1: '推荐', P2: '可选', P3: '了解' }[priority];
    const progressStr = formatProgress(percentage);

    result = result.replace(
      new RegExp(`\\| ${priority} ${emoji} ${name}[\\s\\|]+${progressStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
      `| ${priority} ${emoji} | ${progressStr} | ${name} |`
    );

    // 更新进度条
    result = result.replace(
      new RegExp(`P0?.*?${name}.*?░+█*`, 'g'),
      `| ${priority} ${emoji} | ${progressStr} | ${name} |`
    );
  }

  return result;
}

/**
 * 更新阶段进度
 */
export function updateStageProgress(
  content: string,
  stageName: string,
  newPercentage: number
): string {
  return content.replace(
    new RegExp(`## ${stageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\[\\d+%\\]`),
    `## ${stageName} [${newPercentage}%]`
  );
}

/**
 * 添加学习日志条目
 */
export function addLogEntry(
  content: string,
  date: string,
  module: string,
  event: string,
  notes: string = ''
): string {
  const lines = content.split('\n');
  const logTableStart = lines.findIndex(line => line.includes('## 学习日志'));

  if (logTableStart === -1) {
    return content; // 没有找到学习日志部分
  }

  // 找到表格头部
  const tableHeaderIndex = lines.findIndex((line, idx) =>
    idx > logTableStart && line.includes('|') && line.includes('日期')
  );

  if (tableHeaderIndex === -1) {
    return content;
  }

  // 找到分隔线
  const separatorIndex = tableHeaderIndex + 1;
  if (!lines[separatorIndex]?.includes('|---')) {
    return content;
  }

  // 构建新日志行
  const newLogLine = `| ${date} | ${module} | ${event} | ${notes} |`;

  // 插入新日志行（在第一行，保持倒序）
  lines.splice(separatorIndex + 1, 0, newLogLine);

  return lines.join('\n');
}

/**
 * 重新计算所有进度
 */
export function recalculateAllProgress(
  progressContent: string,
  moduleProgressData: Map<string, { percentage: number; status: string }>
): string {
  let result = progressContent;
  const parsed = parseProgressFile(progressContent);

  // 更新各模块行
  for (const [moduleName, data] of moduleProgressData.entries()) {
    const existingRow = parsed.moduleRows.get(moduleName);
    if (existingRow) {
      result = updateModuleProgressRow(result, moduleName, {
        percentage: `${data.percentage}%`,
        status: data.status
      });
    }
  }

  // 重新解析更新后的内容
  const updatedParsed = parseProgressFile(result);

  // 更新总体进度
  result = updateOverallProgress(result, updatedParsed.overallProgress);

  return result;
}

/**
 * 获取模块进度摘要
 */
export function getModuleProgressSummary(parsed: ProgressFileData): string {
  const summary: string[] = [];

  summary.push('## 进度摘要\n');
  summary.push(`总体进度：${formatProgress(parsed.overallProgress)}\n`);
  summary.push('### 优先级概览\n');

  for (const [priority, percentage] of Object.entries(parsed.priorityProgress)) {
    const emoji = { P0: '', P1: '', P2: '', P3: '' }[priority as Priority];
    const name = { P0: '必学', P1: '推荐', P2: '可选', P3: '了解' }[priority as Priority];
    summary.push(`- ${priority} ${emoji} ${name}: ${formatProgress(percentage)}`);
  }

  summary.push('\n### 各阶段进度\n');

  for (const [stage, percentage] of parsed.stageProgress.entries()) {
    summary.push(`- ${stage}: ${formatProgress(percentage)}`);
  }

  return summary.join('\n');
}
