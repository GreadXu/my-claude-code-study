/**
 * /study status 命令处理器
 * 查看学习状态
 */

import { findModule, searchModule, getAllModules } from '../lib/module-locator.js';
import { parseChecklist, calculateProgress } from '../lib/progress-parser.js';
import { formatStatusOverview, formatSingleModuleStatus, formatError, formatModuleSuggestions } from '../lib/ui-formatter.js';
import { parseProgressFile } from '../lib/progress-calculator.js';

/**
 * 处理 /study status 命令
 */
export async function handle(args: { module?: string }, context: {
  rootDir: string;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  askUser: (question: string, options?: string[]) => Promise<string>;
}): Promise<string> {
  const { module: moduleInput } = args;
  const { readFile, rootDir } = context;

  // 如果指定了模块名，显示单个模块详情
  if (moduleInput) {
    return await showModuleStatus(moduleInput, context);
  }

  // 否则显示总体状态概览
  return await showOverallStatus(context);
}

/**
 * 显示单个模块状态
 */
async function showModuleStatus(moduleInput: string, context: {
  rootDir: string;
  readFile: (path: string) => Promise<string>;
}): Promise<string> {
  const { readFile, rootDir } = context;

  // 1. 查找模块
  const searchResult = searchModule(moduleInput);

  if (!searchResult.exact && searchResult.partial.length === 0) {
    return formatError('未找到模块', [
      `输入: "${moduleInput}"`,
      '请使用 /study status 查看所有可用模块'
    ]);
  }

  const module = searchResult.exact || searchResult.partial[0];

  // 2. 读取相关文件
  let checklistContent: string;
  let progressContent: string;

  try {
    checklistContent = await readFile(`${rootDir}/${module.checklistPath}`);
    progressContent = await readFile(`${rootDir}/PROGRESS.md`);
  } catch (error) {
    return formatError('无法读取模块文件', [
      `模块路径: ${module.path}`,
      '请确保模块目录结构完整'
    ]);
  }

  // 3. 解析数据
  const checklistData = parseChecklist(checklistContent);
  const progressParsed = parseProgressFile(progressContent);
  const progressRow = progressParsed.moduleRows.get(module.name) || {
    mode: '未选择',
    status: '未开始',
    percentage: '0%'
  };

  // 4. 格式化输出
  return formatSingleModuleStatus(module, checklistData, progressRow);
}

/**
 * 显示总体状态概览
 */
async function showOverallStatus(context: {
  rootDir: string;
  readFile: (path: string) => Promise<string>;
}): Promise<string> {
  const { readFile, rootDir } = context;

  // 1. 读取 PROGRESS.md
  let progressContent: string;

  try {
    progressContent = await readFile(`${rootDir}/PROGRESS.md`);
  } catch (error) {
    return formatError('无法读取 PROGRESS.md', [
      '请确保文件存在于根目录'
    ]);
  }

  // 2. 解析进度数据
  const progressParsed = parseProgressFile(progressContent);

  // 3. 读取各模块的 checklist 获取详细模式信息
  const moduleDetails = new Map<string, { mode: 'quick' | 'complete' | null; status: string }>();

  for (const [moduleName, rowData] of progressParsed.moduleRows) {
    // 从状态字符串推断
    let status = rowData.status;
    let mode: 'quick' | 'complete' | null = null;

    if (rowData.mode.includes('快速')) {
      mode = 'quick';
    } else if (rowData.mode.includes('完整')) {
      mode = 'complete';
    }

    moduleDetails.set(moduleName, { mode, status });
  }

  // 4. 格式化输出
  return formatStatusOverview(progressParsed, moduleDetails);
}

export default handle;
