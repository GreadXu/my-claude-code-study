/**
 * Study Workflow Skill - JavaScript Implementation
 * 学习工作流程管理 - JavaScript 实现
 *
 * 这是一个简化的 JavaScript 版本，可以直接被 Claude Code 调用
 * 无需 TypeScript 编译
 */

// ==================== 类型常量 ====================

const PRIORITIES = {
  P0: { emoji: '', name: '必学', color: 'red' },
  P1: { emoji: '', name: '推荐', color: 'yellow' },
  P2: { emoji: '', name: '可选', color: 'green' },
  P3: { emoji: '', name: '了解', color: 'blue' }
};

const STATUS_ICONS = {
  '未开始': '🟢',
  '进行中': '🟡',
  '已完成': '✅'
};

// ==================== 模块定义 ====================

const MODULES = [
  // 01-基础入门
  {
    name: 'claude-code-core',
    path: '01-基础入门/claude-code-core',
    stageNumber: '01',
    stageName: '基础入门',
    priority: 'P0'
  },
  {
    name: 'mcp-basics',
    path: '01-基础入门/mcp-basics',
    stageNumber: '01',
    stageName: '基础入门',
    priority: 'P1'
  },
  // 02-进阶探索
  {
    name: 'agent-sdk',
    path: '02-进阶探索/agent-sdk',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P1'
  },
  {
    name: 'mcp-advanced',
    path: '02-进阶探索/mcp-advanced',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P2'
  },
  {
    name: 'everything-claude-code',
    path: '02-进阶探索/everything-claude-code',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P3'
  },
  // 03-实战应用
  {
    name: 'cc-switch',
    path: '03-实战应用/cc-switch',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P2'
  },
  {
    name: 'spec-kit',
    path: '03-实战应用/spec-kit',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P2'
  },
  {
    name: 'projects',
    path: '03-实战应用/projects',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P1'
  }
];

// ==================== 工具函数 ====================

/**
 * 查找模块
 */
function findModule(input) {
  const normalized = input.toLowerCase().trim();

  // 精确匹配
  for (const module of MODULES) {
    if (module.name === normalized || module.path.toLowerCase() === normalized) {
      return module;
    }
  }

  // 部分匹配
  for (const module of MODULES) {
    if (module.name.includes(normalized) || normalized.includes(module.name)) {
      return module;
    }
  }

  // 路径匹配
  const parts = input.split('/');
  const lastPart = parts[parts.length - 1].toLowerCase();
  for (const module of MODULES) {
    if (module.name === lastPart) {
      return module;
    }
  }

  return null;
}

/**
 * 获取所有模块
 */
function getAllModules() {
  return MODULES;
}

/**
 * 解析 checklist.md 内容
 */
function parseChecklist(content) {
  const lines = content.split('\n');
  const result = {
    mode: null,  // 'quick' | 'complete' | null
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
        // 不在任何模式章节中的 checkbox，计入完整模式
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
    // 未选择模式时，基于完整模式计算
    if (parsed.completeTotal === 0) return 0;
    return Math.round((parsed.completeCompleted / parsed.completeTotal) * 100);
  }
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
 * 设置学习模式
 */
function setStudyMode(content, mode) {
  const lines = content.split('\n');
  const result = [];

  let inModeSelection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('学习模式选择')) {
      inModeSelection = true;
    }

    if (inModeSelection && line.includes('快速模式') && line.includes('- [')) {
      if (mode === 'quick') {
        result.push(line.replace('- [ ]', '- [x]'));
      } else {
        result.push(line.replace('- [x]', '- [ ]'));
      }
    } else if (inModeSelection && line.includes('完整模式') && line.includes('- [')) {
      if (mode === 'complete') {
        result.push(line.replace('- [ ]', '- [x]'));
      } else {
        result.push(line.replace('- [x]', '- [ ]'));
      }
    } else {
      result.push(line);
    }

    // 超过模式选择区域后停止
    if (inModeSelection && line.startsWith('## ') && !line.includes('学习模式')) {
      inModeSelection = false;
    }
  }

  return result.join('\n');
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
 * 更新 notes.md
 */
function updateNotes(content, mode, status) {
  const date = getCurrentDate();
  const modeText = mode === 'quick' ? '快速模式' : '完整模式';
  let result = content;

  // 更新学习模式
  result = result.replace(
    /> \*\*学习模式\*\*：.+/,
    `> **学习模式**：${modeText}`
  );

  // 更新日期
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
 * 更新 PROGRESS.md 中的模块行
 */
function updateProgressRow(content, moduleName, mode, status, percentage, priorityLabel) {
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(`| ${moduleName} |`)) {
      const parts = line.split('|').map(p => p.trim());

      parts[3] = mode === 'quick' ? '快速模式' : '完整模式';
      parts[4] = status;
      parts[5] = `${percentage}%`;

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
 * 添加日志条目
 */
function addLogEntry(content, date, module, event, notes = '') {
  const lines = content.split('\n');
  const logTableStart = lines.findIndex(line => line.includes('## 学习日志'));

  if (logTableStart === -1) return content;

  const tableHeaderIndex = lines.findIndex((line, idx) =>
    idx > logTableStart && line.includes('|') && line.includes('日期')
  );

  if (tableHeaderIndex === -1) return content;

  const newLogLine = `| ${date} | ${module} | ${event} | ${notes} |`;
  lines.splice(tableHeaderIndex + 2, 0, newLogLine);

  return lines.join('\n');
}

/**
 * 获取未完成项
 */
function getIncompleteItems(content) {
  const lines = content.split('\n');
  const incomplete = [];
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
    }

    const match = line.match(/^[\s]*-\s*\[ \]\s*(.+)$/);
    if (match) {
      incomplete.push(`[${currentSection}] ${match[1].trim()}`);
    }
  }

  return incomplete;
}

// ==================== 输出格式化 ====================

/**
 * 格式化模块卡片
 */
function formatModuleCard(module, mode, status, percentage) {
  const priorityConfig = PRIORITIES[module.priority];
  const modeText = mode ? (mode === 'quick' ? '📚 快速模式' : '🛠️ 完整模式') : '⚪ 未选择';
  const statusIcon = STATUS_ICONS[status] || '⚪';

  return `
┌──────────────────────────────────────────────────┐
│ ${module.name} [${module.priority}${priorityConfig.emoji} ${priorityConfig.name}]
├──────────────────────────────────────────────────┤
│ 模式: ${modeText}
│ 状态: ${statusIcon} ${status}
│ 进度: ${generateProgressBar(percentage, 20)} ${percentage}%
└──────────────────────────────────────────────────┘`;
}

/**
 * 格式化错误信息
 */
function formatError(message, details = []) {
  let output = `\n❌ 错误: ${message}\n`;
  if (details.length > 0) {
    output += '\n详细信息:\n';
    for (const detail of details) {
      output += `  - ${detail}\n`;
    }
  }
  return output;
}

/**
 * 格式化成功信息
 */
function formatSuccess(message, details = []) {
  let output = `\n✅ ${message}\n`;
  if (details.length > 0) {
    for (const detail of details) {
      output += `  ${detail}\n`;
    }
  }
  return output;
}

/**
 * 格式化警告信息
 */
function formatWarning(message, details = []) {
  let output = `\n⚠️  ${message}\n`;
  if (details.length > 0) {
    for (const detail of details) {
      output += `  - ${detail}\n`;
    }
  }
  return output;
}

// ==================== 导出 ====================

// 导出所有函数供 Claude Code 调用
export {
  // 模块查找
  findModule,
  getAllModules,

  // 解析函数
  parseChecklist,
  calculateProgress,
  getIncompleteItems,

  // 更新函数
  setStudyMode,
  updateNotes,
  updateProgressRow,
  addLogEntry,

  // 工具函数
  getCurrentDate,
  generateProgressBar,

  // 格式化函数
  formatModuleCard,
  formatError,
  formatSuccess,
  formatWarning,

  // 常量
  PRIORITIES,
  STATUS_ICONS,
  MODULES
};

export default {
  findModule,
  getAllModules,
  parseChecklist,
  calculateProgress,
  getIncompleteItems,
  setStudyMode,
  updateNotes,
  updateProgressRow,
  addLogEntry,
  getCurrentDate,
  generateProgressBar,
  formatModuleCard,
  formatError,
  formatSuccess,
  formatWarning,
  PRIORITIES,
  STATUS_ICONS,
  MODULES
};
