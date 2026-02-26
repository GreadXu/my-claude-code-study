/**
 * Study Workflow Implementation
 * 学习工作流程实现 - 可直接调用的版本
 *
 * 这个文件包含可以直接在 Claude Code 对话中调用的函数
 * 用于执行学习工作流程的各个操作
 */

// ==================== 模块定义 ====================

const MODULE_MAP = {
  'claude-code-core': {
    name: 'claude-code-core',
    path: '01-基础入门/claude-code-core',
    priority: 'P0',
    priorityLabel: 'P0 🔴',
    priorityName: '必学'
  },
  'mcp-basics': {
    name: 'mcp-basics',
    path: '01-基础入门/mcp-basics',
    priority: 'P1',
    priorityLabel: 'P1 🟡',
    priorityName: '推荐'
  },
  'agent-sdk': {
    name: 'agent-sdk',
    path: '02-进阶探索/agent-sdk',
    priority: 'P1',
    priorityLabel: 'P1 🟡',
    priorityName: '推荐'
  },
  'mcp-advanced': {
    name: 'mcp-advanced',
    path: '02-进阶探索/mcp-advanced',
    priority: 'P2',
    priorityLabel: 'P2 🟢',
    priorityName: '可选'
  },
  'everything-claude-code': {
    name: 'everything-claude-code',
    path: '02-进阶探索/everything-claude-code',
    priority: 'P3',
    priorityLabel: 'P3 🔵',
    priorityName: '了解'
  },
  'cc-switch': {
    name: 'cc-switch',
    path: '03-实战应用/cc-switch',
    priority: 'P2',
    priorityLabel: 'P2 🟢',
    priorityName: '可选'
  },
  'spec-kit': {
    name: 'spec-kit',
    path: '03-实战应用/spec-kit',
    priority: 'P2',
    priorityLabel: 'P2 🟢',
    priorityName: '可选'
  },
  'projects': {
    name: 'projects',
    path: '03-实战应用/projects',
    priority: 'P1',
    priorityLabel: 'P1 🟡',
    priorityName: '推荐'
  }
};

// ==================== 工具函数 ====================

/**
 * 查找模块
 */
function findModule(input) {
  const normalized = input.toLowerCase().trim();

  // 精确匹配
  if (MODULE_MAP[normalized]) {
    return MODULE_MAP[normalized];
  }

  // 路径匹配
  const parts = input.split('/');
  const lastPart = parts[parts.length - 1].toLowerCase();
  if (MODULE_MAP[lastPart]) {
    return MODULE_MAP[lastPart];
  }

  return null;
}

/**
 * 获取当前日期
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 生成进度条
 */
function generateProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * 解析 checklist.md 计算进度
 */
function parseChecklistForProgress(content) {
  const lines = content.split('\n');
  const result = {
    mode: null,
    quickTotal: 0,
    quickCompleted: 0,
    completeTotal: 0,
    completeCompleted: 0
  };

  let inQuickMode = false;
  let inCompleteMode = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // 检测学习模式选择
    if (trimmed.includes('快速模式') && trimmed.includes('[x]')) {
      result.mode = 'quick';
    } else if (trimmed.includes('完整模式') && trimmed.includes('[x]')) {
      result.mode = 'complete';
    }

    // 检测快速模式章节
    if (trimmed.startsWith('## ') && trimmed.includes('快速模式')) {
      inQuickMode = true;
      inCompleteMode = false;
      continue;
    }

    // 检测完整模式章节
    if (trimmed.startsWith('## ') && trimmed.includes('完整模式')) {
      inQuickMode = false;
      inCompleteMode = true;
      continue;
    }

    // 检测其他二级标题
    if (trimmed.startsWith('## ')) {
      inQuickMode = false;
      inCompleteMode = false;
      continue;
    }

    // 统计 checkbox
    const match = trimmed.match(/^[\s]*-\s*\[([ x])\]/);
    if (match) {
      const isChecked = match[1] === 'x';

      if (inQuickMode) {
        result.quickTotal++;
        if (isChecked) result.quickCompleted++;
      } else if (inCompleteMode) {
        result.completeTotal++;
        if (isChecked) result.completeCompleted++;
      } else {
        result.completeTotal++;
        if (isChecked) result.completeCompleted++;
      }
    }
  }

  return result;
}

/**
 * 计算进度百分比
 */
function calculateProgress(parsed) {
  if (parsed.mode === 'quick') {
    if (parsed.quickTotal === 0) return 0;
    return Math.round((parsed.quickCompleted / parsed.quickTotal) * 100);
  } else if (parsed.mode === 'complete') {
    if (parsed.completeTotal === 0) return 0;
    return Math.round((parsed.completeCompleted / parsed.completeTotal) * 100);
  } else {
    if (parsed.completeTotal === 0) return 0;
    return Math.round((parsed.completeCompleted / parsed.completeTotal) * 100);
  }
}

// ==================== 文件更新函数 ====================

/**
 * 设置 checklist.md 的学习模式
 */
function setChecklistMode(content, mode) {
  const lines = content.split('\n');
  const result = [];

  for (const line of lines) {
    if (line.includes('快速模式') && line.includes('- [')) {
      result.push(line.replace('- [ ]', '- [x]'));
      // 取消完整模式
    } else if (line.includes('完整模式') && line.includes('- [')) {
      result.push(line.replace('- [x]', '- [ ]'));
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * 更新 checklist.md 为完整模式
 */
function setChecklistCompleteMode(content) {
  const lines = content.split('\n');
  const result = [];

  for (const line of lines) {
    if (line.includes('快速模式') && line.includes('- [')) {
      result.push(line.replace('- [x]', '- [ ]'));
    } else if (line.includes('完整模式') && line.includes('- [')) {
      result.push(line.replace('- [ ]', '- [x]'));
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * 更新 notes.md 开始日期
 */
function setNotesStartDate(content, mode) {
  const date = getCurrentDate();
  const modeText = mode === 'quick' ? '快速模式' : '完整模式';
  let result = content;

  result = result.replace(/> \*\*学习模式\*\*：.+/g, `> **学习模式**：${modeText}`);
  result = result.replace(/> \*\*开始日期\*\*：.+/g, `> **开始日期**：${date}`);

  return result;
}

/**
 * 更新 notes.md 完成日期
 */
function setNotesCompleteDate(content) {
  const date = getCurrentDate();
  let result = content;

  result = result.replace(/> \*\*完成日期\*\*：.+/g, `> **完成日期**：${date}`);

  return result;
}

/**
 * 更新 PROGRESS.md 模块行
 */
function updateProgressModuleRow(content, moduleName, mode, status, percentage) {
  const lines = content.split('\n');
  const modeText = mode === 'quick' ? '快速模式' : '完整模式';

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`| ${moduleName} |`)) {
      // 匹配表格行格式: | name | priority | mode | status | percentage |
      const parts = lines[i].split('|').map(p => p.trim());

      if (parts.length >= 6) {
        parts[3] = modeText;
        parts[4] = status;
        parts[5] = `${percentage}%`;

        lines[i] = parts.map((p, idx) => {
          if (idx === 0 || idx === parts.length - 1) return p;
          return ` ${p} `;
        }).join('|');
      }

      break;
    }
  }

  return lines.join('\n');
}

/**
 * 添加学习日志
 */
function addLearningLog(content, date, module, event, notes = '') {
  const lines = content.split('\n');

  // 找到日志表格位置
  const logTableStart = lines.findIndex(line => line.includes('## 学习日志'));
  if (logTableStart === -1) return content;

  // 找到表头后的分隔线
  const tableHeaderIndex = lines.findIndex((line, idx) =>
    idx > logTableStart && line.includes('|') && line.includes('日期')
  );

  if (tableHeaderIndex === -1) return content;

  // 在表头后插入新日志
  const newLogLine = `| ${date} | ${module} | ${event} | ${notes} |`;
  lines.splice(tableHeaderIndex + 2, 0, newLogLine);

  return lines.join('\n');
}

// ==================== 输出格式化 ====================

/**
 * 格式化开始确认信息
 */
function formatStartPreview(module, mode) {
  const modeText = mode === 'quick' ? '📚 快速模式' : '🛠️ 完整模式';
  const date = getCurrentDate();

  return `
╔═══════════════════════════════════════════════════════╗
║           开始学习确认 - ${module.name}              ║
╠═══════════════════════════════════════════════════════╣
║ 模块: ${module.name.padEnd(30)} ║
║ 优先级: ${module.priorityLabel} ${module.priorityName.padEnd(10)}           ║
║ 模式: ${modeText.padEnd(24)} ║
║ 开始日期: ${date.padEnd(26)} ║
╠═══════════════════════════════════════════════════════╣
║ 将要更新以下文件:                                     ║
║  1. ${module.path}/checklist.md  ║
║  2. ${module.path}/notes.md          ║
║  3. PROGRESS.md                                     ║
╚═══════════════════════════════════════════════════════╝
`;
}

/**
 * 格式化进度更新预览
 */
function formatUpdatePreview(moduleName, oldProgress, newProgress, status) {
  return `
╔═══════════════════════════════════════════════════════╗
║           进度更新预览 - ${moduleName}               ║
╠═══════════════════════════════════════════════════════╣
║ 进度变化: ${oldProgress}% -> ${newProgress}%                                 ║
║ ${generateProgressBar(newProgress, 45)} ║
║ 状态: ${status.padEnd(40)} ║
╠═══════════════════════════════════════════════════════╣
║ 将要更新: PROGRESS.md                               ║
╚═══════════════════════════════════════════════════════╝
`;
}

/**
 * 格式化状态概览
 */
function formatStatusOverview(progressData) {
  const { overall, priorityBreakdown, modules } = progressData;

  let output = `
╔═══════════════════════════════════════════════════════╗
║              Claude Code 学习进度总览                ║
╠═══════════════════════════════════════════════════════╣
║ 总体进度: ${overall.percentage}% ${generateProgressBar(overall.percentage, 30)} ║
╠═══════════════════════════════════════════════════════╣
║ 优先级概览:                                          ║
║   P0 必学: ${priorityBreakdown.P0.percentage}% ${generateProgressBar(priorityBreakdown.P0.percentage, 28)} ║
║   P1 推荐: ${priorityBreakdown.P1.percentage}% ${generateProgressBar(priorityBreakdown.P1.percentage, 28)} ║
║   P2 可选: ${priorityBreakdown.P2.percentage}% ${generateProgressBar(priorityBreakdown.P2.percentage, 28)} ║
║   P3 了解: ${priorityBreakdown.P3.percentage}% ${generateProgressBar(priorityBreakdown.P3.percentage, 28)} ║
╠═══════════════════════════════════════════════════════╣
║ 模块状态:                                             ║
`;

  for (const mod of modules) {
    const statusIcon = mod.status === '已完成' ? '✅' : mod.status === '进行中' ? '🟡' : '🟢';
    output += `║   ${statusIcon} ${mod.name.padEnd(25)} ${mod.mode.padEnd(10)} ${mod.percentage}% ${generateProgressBar(mod.percentage, 10)} ║\n`;
  }

  output += `╚═══════════════════════════════════════════════════════╝`;

  return output;
}

/**
 * 格式化模块详细卡片
 */
function formatModuleCard(module) {
  const statusIcon = module.status === '已完成' ? '✅' : module.status === '进行中' ? '🟡' : '🟢';

  return `
╔═══════════════════════════════════════════════════════╗
║           ${module.name} - 模块详情                    ║
╠═══════════════════════════════════════════════════════╣
║ 优先级: ${module.priorityLabel} ${module.priorityName.padEnd(10)}                          ║
║ 学习模式: ${module.mode.padEnd(30)} ║
║ 状态: ${statusIcon} ${module.status.padEnd(30)} ║
║ 进度: ${module.percentage}% ${generateProgressBar(module.percentage, 34)} ║
╠═══════════════════════════════════════════════════════╣
║ 路径: ${module.path.padEnd(39)} ║
╚═══════════════════════════════════════════════════════╝`;
}

// ==================== 导出 ====================

export {
  // 模块查找
  findModule,
  MODULE_MAP,

  // 工具函数
  getCurrentDate,
  generateProgressBar,

  // 解析函数
  parseChecklistForProgress,
  calculateProgress,

  // 文件更新
  setChecklistMode,
  setChecklistCompleteMode,
  setNotesStartDate,
  setNotesCompleteDate,
  updateProgressModuleRow,
  addLearningLog,

  // 格式化输出
  formatStartPreview,
  formatUpdatePreview,
  formatStatusOverview,
  formatModuleCard
};

export default {
  findModule,
  MODULE_MAP,
  getCurrentDate,
  generateProgressBar,
  parseChecklistForProgress,
  calculateProgress,
  setChecklistMode,
  setChecklistCompleteMode,
  setNotesStartDate,
  setNotesCompleteDate,
  updateProgressModuleRow,
  addLearningLog,
  formatStartPreview,
  formatUpdatePreview,
  formatStatusOverview,
  formatModuleCard
};
