# 学习系统数据目录

> 本目录存储学习系统的所有个人数据，与课程内容分离。

## 目录结构

```
.learning/
├── goals/                          # 学习目标
│   ├── active-goal.md              # 当前激活的学习目标（符号链接/引用）
│   ├── active/                     # 进行中的目标
│   ├── paused/                     # 暂停的目标
│   ├── completed/                  # 已完成的目标
│   └── archived/                   # 已归档的目标
│
├── courses/                        # 课程定义
│   └── <course-name>/              # 课程目录
│       └── course.md               # 课程定义文件
│
├── cache/                          # 知识缓存
│   ├── shared/                     # 共享知识库
│   │   └── <topic-name>/           # 可被多个课程引用
│   └── courses/                    # 课程专属缓存
│       └── <course-name>/          # 课程缓存
│
├── progress/                       # 学习进度
│   └── <goal-name>-progress.md     # 目标进度文件
│
├── bookmarks/                      # 书签
│   └── <goal-name>-bookmarks.md    # 目标语签文件
│
└── notes/                          # 学习笔记
    └── <goal-name>-notes.md        # 目标笔记文件
```

## 数据隔离原则

1. **课程内容** (`.templates/modules/`)：系统维护的模板，用户可修改
2. **个人数据** (`.learning/`)：完全个人化，不受同步影响

## 向后兼容

- 旧版本的 `PROGRESS.md` 将迁移到 `.learning/progress/`
- 旧版本的 `LEARNING_BOOKMARKS.md` 将迁移到 `.learning/bookmarks/`
- 旧版本的模块 `notes.md` 将整合到目标笔记中
