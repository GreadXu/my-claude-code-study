/**
 * Module Locator - 模块路径解析和定位
 * 支持多种输入格式：短名称、相对路径、部分匹配
 */

import { ModuleInfo, ModuleMap, ModuleSearchResult, Priority } from './types.js';

/** 所有预定义的模块列表 */
const ALL_MODULES: ModuleInfo[] = [
  // 01-基础入门
  {
    name: 'claude-code-core',
    path: '01-基础入门/claude-code-core',
    stageNumber: '01',
    stageName: '基础入门',
    priority: 'P0',
    readmePath: '01-基础入门/claude-code-core/README.md',
    checklistPath: '01-基础入门/claude-code-core/checklist.md',
    notesPath: '01-基础入门/claude-code-core/notes.md'
  },
  {
    name: 'mcp-basics',
    path: '01-基础入门/mcp-basics',
    stageNumber: '01',
    stageName: '基础入门',
    priority: 'P1',
    readmePath: '01-基础入门/mcp-basics/README.md',
    checklistPath: '01-基础入门/mcp-basics/checklist.md',
    notesPath: '01-基础入门/mcp-basics/notes.md'
  },
  // 02-进阶探索
  {
    name: 'agent-sdk',
    path: '02-进阶探索/agent-sdk',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P1',
    readmePath: '02-进阶探索/agent-sdk/README.md',
    checklistPath: '02-进阶探索/agent-sdk/checklist.md',
    notesPath: '02-进阶探索/agent-sdk/notes.md'
  },
  {
    name: 'mcp-advanced',
    path: '02-进阶探索/mcp-advanced',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P2',
    readmePath: '02-进阶探索/mcp-advanced/README.md',
    checklistPath: '02-进阶探索/mcp-advanced/checklist.md',
    notesPath: '02-进阶探索/mcp-advanced/notes.md'
  },
  {
    name: 'everything-claude-code',
    path: '02-进阶探索/everything-claude-code',
    stageNumber: '02',
    stageName: '进阶探索',
    priority: 'P3',
    readmePath: '02-进阶探索/everything-claude-code/README.md',
    checklistPath: '02-进阶探索/everything-claude-code/checklist.md',
    notesPath: '02-进阶探索/everything-claude-code/notes.md'
  },
  // 03-实战应用
  {
    name: 'cc-switch',
    path: '03-实战应用/cc-switch',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P2',
    readmePath: '03-实战应用/cc-switch/README.md',
    checklistPath: '03-实战应用/cc-switch/checklist.md',
    notesPath: '03-实战应用/cc-switch/notes.md'
  },
  {
    name: 'spec-kit',
    path: '03-实战应用/spec-kit',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P2',
    readmePath: '03-实战应用/spec-kit/README.md',
    checklistPath: '03-实战应用/spec-kit/checklist.md',
    notesPath: '03-实战应用/spec-kit/notes.md'
  },
  {
    name: 'projects',
    path: '03-实战应用/projects',
    stageNumber: '03',
    stageName: '实战应用',
    priority: 'P1',
    readmePath: '03-实战应用/projects/README.md',
    checklistPath: '03-实战应用/projects/checklist.md',
    notesPath: '03-实战应用/projects/notes.md'
  }
];

/**
 * 获取所有模块的映射
 */
export function getAllModules(): ModuleMap {
  const map = new Map<string, ModuleInfo>();
  for (const module of ALL_MODULES) {
    map.set(module.name, module);
    // 也添加路径作为键
    map.set(module.path, module);
  }
  return map;
}

/**
 * 根据名称或路径查找模块
 */
export function findModule(input: string): ModuleInfo | null {
  const modules = getAllModules();

  // 精确匹配
  if (modules.has(input)) {
    return modules.get(input)!;
  }

  // 尝试提取模块名（如果输入是路径）
  const pathParts = input.split('/');
  const moduleName = pathParts[pathParts.length - 1];
  if (modules.has(moduleName)) {
    return modules.get(moduleName)!;
  }

  return null;
}

/**
 * 搜索模块（支持部分匹配和建议）
 */
export function searchModule(input: string): ModuleSearchResult {
  const modules = getAllModules();
  const normalizedInput = input.toLowerCase().trim();

  const result: ModuleSearchResult = {
    exact: null,
    partial: [],
    suggestions: []
  };

  // 1. 精确匹配
  if (modules.has(input)) {
    result.exact = modules.get(input)!;
    return result;
  }

  // 2. 模块名精确匹配
  for (const module of ALL_MODULES) {
    if (module.name === normalizedInput) {
      result.exact = module;
      return result;
    }
  }

  // 3. 路径匹配
  for (const module of ALL_MODULES) {
    if (module.path.toLowerCase() === normalizedInput) {
      result.exact = module;
      return result;
    }
  }

  // 4. 部分匹配（模块名包含输入）
  for (const module of ALL_MODULES) {
    if (module.name.includes(normalizedInput) || normalizedInput.includes(module.name)) {
      result.partial.push(module);
    }
  }

  // 5. 模糊匹配建议（计算相似度）
  for (const module of ALL_MODULES) {
    const similarity = calculateSimilarity(normalizedInput, module.name.toLowerCase());
    if (similarity > 0.4) {
      if (!result.partial.some(m => m.name === module.name)) {
        result.partial.push(module);
      }
    }
  }

  // 6. 生成建议
  if (result.partial.length === 0) {
    result.suggestions = ALL_MODULES.map(m => m.name);
  }

  return result;
}

/**
 * 计算两个字符串的相似度（简单的编辑距离算法）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return 0;
  if (len2 === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  return 1 - matrix[len2][len1] / maxLen;
}

/**
 * 获取指定优先级的所有模块
 */
export function getModulesByPriority(priority: Priority): ModuleInfo[] {
  return ALL_MODULES.filter(m => m.priority === priority);
}

/**
 * 获取指定阶段的所有模块
 */
export function getModulesByStage(stageNumber: string): ModuleInfo[] {
  return ALL_MODULES.filter(m => m.stageNumber === stageNumber);
}

/**
 * 获取所有模块名称列表
 */
export function getAllModuleNames(): string[] {
  return ALL_MODULES.map(m => m.name);
}

/**
 * 验证模块是否存在
 */
export function moduleExists(input: string): boolean {
  return findModule(input) !== null;
}

/**
 * 获取模块的相对路径
 */
export function getModuleRelativePath(module: ModuleInfo, subPath: string): string {
  return `${module.path}/${subPath}`;
}

/**
 * 从路径中提取模块名
 */
export function extractModuleNameFromPath(path: string): string | null {
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];

  const module = findModule(lastPart);
  return module ? module.name : null;
}

/**
 * 获取模块的完整信息字符串
 */
export function getModuleInfoString(module: ModuleInfo): string {
  const priorityConfig = {
    P0: { emoji: '', label: '必学' },
    P1: { emoji: '', label: '推荐' },
    P2: { emoji: '', label: '可选' },
    P3: { emoji: '', label: '了解' }
  };

  const config = priorityConfig[module.priority];
  return `${module.name} [${module.priority}${config.emoji} ${config.label}]`;
}
