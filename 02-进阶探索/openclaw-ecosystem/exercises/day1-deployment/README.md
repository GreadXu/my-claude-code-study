# Day 1: OpenClaw 部署与基础使用 - 实践材料

> **时间**: 6 小时
> **目标**: 成功部署 OpenClaw 并发送第一条测试消息

---

## 实践任务

### 任务 1: Docker 部署

```bash
# 1. 拉取镜像
docker pull openclaw/openclaw:latest

# 2. 创建数据目录
mkdir -p ~/openclaw_data

# 3. 运行容器
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v ~/openclaw_data:/app/data \
  openclaw/openclaw:latest

# 4. 检查状态
docker ps | grep openclaw
docker logs openclaw
```

### 任务 2: 配置飞书通道

1. 在飞书开放平台创建应用
2. 获取 App ID 和 App Secret
3. 配置事件订阅
4. 测试连接

### 任务 3: 发送测试消息

向配置的飞书机器人发送：`hello`

---

## 预期结果

- [ ] OpenClaw 容器正常运行
- [ ] WebSocket 端口可访问
- [ ] 飞书通道配置成功
- [ ] 收到 OpenClaw 的回复

---

## 故障排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 容器启动失败 | 端口被占用 | 检查 18789 端口是否被占用 |
| 无法连接飞书 | 配置错误 | 检查 App ID 和 Secret |
| 无响应消息 | 事件未订阅 | 检查飞书事件订阅配置 |
