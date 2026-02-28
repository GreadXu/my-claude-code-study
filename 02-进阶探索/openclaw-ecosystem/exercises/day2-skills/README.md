# Day 2: Skills 系统与插件生态 - 实践材料

> **时间**: 6 小时
> **目标**: 安装并测试 5 个常用 Skills

---

## 推荐安装的 Skills

### 1. Weather Skill
```bash
openclaw skill install weather
openclaw skill config weather api_key=your_api_key
```
测试: `上海今天天气`

### 2. Search Skill
```bash
openclaw skill install search
openclaw skill config search engine=bing
```
测试: `搜索 Claude Code 最新版本`

### 3. Calculator Skill
```bash
openclaw skill install calculator
```
测试: `计算 123 * 456`

### 4. Memory Skill
```bash
openclaw skill install memory
```
测试: `记住我喜欢蓝色`

### 5. Time Skill
```bash
openclaw skill install time
```
测试: `现在几点`

---

## Skill 链式调用示例

```
查询上海天气 -> 如果下雨 -> 提醒带伞
```

---

## 预期结果

- [ ] 5 个 Skills 安装成功
- [ ] 每个 Skill 能正常响应
- [ ] 理解 Skill 配置方式
- [ ] 测试链式调用

---

## 自定义 Skill 模板

```python
# skills/my_skill.py
from openclaw import Skill

class MySkill(Skill):
    def __init__(self):
        super().__init__(
            name="my_skill",
            description="My custom skill"
        )

    def handle(self, message):
        # 处理逻辑
        return "Response"
```
