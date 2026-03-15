# 可观测性（Observability）

> 与 IMPLEMENTATION-GUIDE 第六节、RULES.md 结构化日志约定对齐。

---

## 健康检查

- **GET /health** — 返回 `{ "status": "UP" }`，用于就绪探测与负载均衡。
- 实现位置：`backend` → `runtime.HealthController`。

---

## 日志

- **约定**：遵循 RULES.md「所有日志必须是结构化日志」；后端使用统一 pattern，便于 grep/检索。
- **当前**：`application.yml` 中 `logging.pattern.console` 为 `时间 级别 [logger] 消息`，后续可改为 JSON 或 key=value 以接入 ELK/Loki。

---

## 可选扩展

- **Prometheus/Grafana**：可增加 micrometer 与 `/actuator/prometheus`。
- **Trace**：可接入 Sleuth/Zipkin 或 OpenTelemetry。
