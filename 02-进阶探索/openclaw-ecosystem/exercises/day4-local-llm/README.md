# Day 4: 本地 LLM 与成本优化 - 实践材料

> **时间**: 5.5 小时
> **目标**: 部署本地 LLM 并集成到 OpenClaw

---

## Ollama 部署

### 安装 Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载安装包 https://ollama.com/download
```

### 下载模型

```bash
# Qwen2.5 7B (推荐)
ollama pull qwen2.5:7b

# DeepSeek-R1 7B (推理专用)
ollama pull deepseek-r1:7b

# 测试运行
ollama run qwen2.5:7b "你好"
```

---

## OpenClaw 集成

编辑 `config/llm.yml`:

```yaml
llm:
  provider: ollama
  endpoint: http://localhost:11434
  model: qwen2.5:7b
  temperature: 0.7
  max_tokens: 2048
```

重启 OpenClaw:
```bash
docker restart openclaw
```

---

## 成本对比测试

| 模型 | Token 消耗 | 响应时间 | 质量 |
|------|-----------|----------|------|
| Claude API | | | |
| Qwen2.5 7B | | | |
| DeepSeek-R1 7B | | | |

---

## 性能调优

### 模型量化

```bash
# 下载量化版本（更小更快）
ollama pull qwen2.5:7b-q4_0
```

### GPU 加速

```bash
# 检查 GPU 支持
ollama ps
```

---

## 预期结果

- [ ] Ollama 成功部署
- [ ] 至少下载一个模型
- [ ] OpenClaw 能使用本地 LLM
- [ ] 完成成本对比测试

---

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 模型下载慢 | 使用镜像源 |
| 内存不足 | 使用更小的模型 |
| 响应慢 | 启用 GPU 加速 |
