# Day 3: EvoMap 与自主进化技术 - 实践材料

> **时间**: 5.5 小时
> **目标**: 了解 EvoMap 平台和 GEP 协议

---

## EvoMap 注册与接入（可选）

### 1. 注册账号

访问 https://evomap.org 注册

### 2. 配置 GEP

编辑 `config/gep.yml`:

```yaml
gep:
  enabled: true
  endpoint: wss://api.evomap.org/gep
  api_key: your_api_key
```

### 3. 测试连接

```bash
openclaw gep test
```

---

## Gene Capsules 市场

浏览以下 Capsules：

| Capsule | 功能 | 来源 |
|---------|------|------|
| code-review | 代码审查 | @evomap/core |
| test-gen | 测试生成 | @evopsis/testing |
| doc-gen | 文档生成 | @docsphere/gen |

---

## 导入 Capsule

```bash
# 搜索
openclaw capsule search code

# 导入
openclaw capsule import @evomap/core/code-review

# 列出已导入
openclaw capsule list
```

---

## GEP 协议概念

```
Agent ←→ GEP ←→ EvoMap
         ↓
    Gene Capsules
```

---

## 预期结果

- [ ] 理解 EvoMap 平台概念
- [ ] 了解 GEP 协议
- [ ] 浏览 Gene Capsules 市场
- [ ]（可选）成功接入 EvoMap
