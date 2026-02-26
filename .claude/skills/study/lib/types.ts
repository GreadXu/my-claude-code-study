/**
 * Study Workflow Skill - Type Definitions
 * 学习工作流程 Skill - 类型定义
 */

/**
 * 学习模式
 */
export type StudyMode = 'quick' | 'complete';

/**
 * 学习状态
 */
export type StudyStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * 优先级
 */
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

/**
 * 优先级对应的表情符号和颜色
 */
export const PriorityConfig: Record<Priority, { emoji: string; color: string; name: string }> = {
  P0: { emoji: '', color: 'red', name: '必学' },
  P1: { emoji: '', color: 'yellow', name: '推荐' },
  P2: { emoji: '', color: 'green', name: '可选' },
  P3: { emoji: '', color: 'blue', name: '了解' }
};

/**
 * 模块信息
 */
export interface ModuleInfo {
  /** 模块名称（如 claude-code-core） */
  name: string;
  /** 模块路径（如 01-基础入门/claude-code-core） */
  path: string;
  /** 阶段编号（如 01） */
  stageNumber: string;
  /** 阶段名称（如 基础入门） */
  stageName: string;
  /** 优先级 */
  priority: Priority;
  /** README 文件路径 */
  readmePath: string;
  /** checklist 文件路径 */
  checklistPath: string;
  /** notes 文件路径 */
  notesPath: string;
}

/**
 * 解析后的 checklist 数据
 */
export interface ChecklistData {
  /** 学习模式 */
  mode: StudyMode | null;
  /** 快速模式总项数 */
  quickTotal: number;
  /** 快速模式已完成项数 */
  quickCompleted: number;
  /** 完整模式总项数 */
  completeTotal: number;
  /** 完整模式已完成项数 */
  completeCompleted: number;
  /** 原始内容 */
  rawContent: string;
  /** 各段落的完成情况 */
  sections: ChecklistSection[];
}

/**
 * 清单段落
 */
export interface ChecklistSection {
  /** 段落标题 */
  title: string;
  /** 段落类型（quick/complete/other） */
  type: 'quick' | 'complete' | 'other';
  /** 总项数 */
  total: number;
  /** 已完成项数 */
  completed: number;
  /** 原始内容 */
  content: string;
  /** 起始行号 */
  startLine: number;
  /** 结束行号 */
  endLine: number;
}

/**
 * 进度数据
 */
export interface ProgressData {
  /** 完成百分比 */
  percentage: number;
  /** 进度条字符串 */
  progressBar: string;
  /** 已完成项数 */
  completed: number;
  /** 总项数 */
  total: number;
}

/**
 * PROGRESS.md 中的模块行数据
 */
export interface ProgressRowData {
  /** 模块名称 */
  module: string;
  /** 优先级标签 */
  priorityLabel: string;
  /** 学习模式 */
  mode: string;
  /** 状态 */
  status: string;
  /** 完成百分比 */
  percentage: string;
}

/**
 * PROGRESS.md 解析结果
 */
export interface ProgressFileData {
  /** 原始内容 */
  rawContent: string;
  /** 所有模块行数据 */
  moduleRows: Map<string, ProgressRowData>;
  /** 总体进度 */
  overallProgress: number;
  /** 各优先级进度 */
  priorityProgress: Record<Priority, number>;
  /** 各阶段进度 */
  stageProgress: Map<string, number>;
}

/**
 * 学习日志条目
 */
export interface LogEntry {
  /** 日期 */
  date: string;
  /** 模块名称 */
  module: string;
  /** 事件类型 */
  event: 'start' | 'update' | 'complete' | 'mode-change';
  /** 备注 */
  notes: string;
}

/**
 * 文件更新操作
 */
export interface FileUpdate {
  /** 文件路径 */
  path: string;
  /** 更新类型 */
  type: 'modify' | 'create';
  /** 原始内容 */
  original: string;
  /** 新内容 */
  updated: string;
  /** 变更描述 */
  description: string;
}

/**
 * 更新预览结果
 */
export interface UpdatePreview {
  /** 模块名称 */
  module: string;
  /** 进度变化 */
  progressChange: { from: number; to: number };
  /** 状态变化 */
  statusChange: { from: string; to: string };
  /** 学习模式 */
  mode: StudyMode | null;
  /** 文件更新列表 */
  fileUpdates: FileUpdate[];
  /** 进度条 */
  progressBar: string;
}

/**
 * Skill 配置
 */
export interface SkillConfig {
  /** 根目录路径 */
  rootDir: string;
  /** 进度文件路径 */
  progressFile: string;
  /** 日期格式 */
  dateFormats: {
    short: string;
    long: string;
  };
}

/**
 * 所有可用模块的映射
 */
export type ModuleMap = Map<string, ModuleInfo>;

/**
 * 模块搜索结果
 */
export interface ModuleSearchResult {
  /** 精确匹配 */
  exact: ModuleInfo | null;
  /** 部分匹配 */
  partial: ModuleInfo[];
  /** 模糊匹配建议 */
  suggestions: string[];
}
