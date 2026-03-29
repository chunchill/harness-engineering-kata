# Harness Engineering Kata 落地实施指南

> 基于 PROJECT-PURPOSE.md + OpenAI Harness Engineering 博文编写
> 工具环境：Cursor（Codex 底层引擎）

---

## 一、实验目标（对齐 OpenAI）


| 指标   | 目标                           |
| ---- | ---------------------------- |
| 时间   | 5 个月周期                       |
| 代码量  | 逐步增长，从 MVP 到完整功能             |
| 核心约束 | **人类一行代码都不写**，只做 Middle Loop |
| 吞吐量  | 目标逐步提升（从 1 PR/天 开始）          |


---

## 二、技术栈选择


| 层级  | 技术选型                      | 理由        |
| --- | ------------------------- | --------- |
| 前端  | React + TypeScript + Vite | 生态成熟、类型友好 |
| 后端  | Spring Boot 3.x + Java 17 | 企业级主流     |
| 构建  | Gradle                    | 灵活        |
| 持久化 | H2（开发）/ MySQL（生产）         | CI 友好     |
| CI  | GitHub Actions            | 生态广       |
| 编辑器 | **Cursor**（Agent 模式）      | 底层是 Codex |


### Harness 工具链


| 工具                        | 作用            |
| ------------------------- | ------------- |
| **ArchUnit**              | 架构约束（分层、依赖方向） |
| **SpotBugs / ErrorProne** | 静态代码分析        |
| **Checkstyle**            | 代码规范          |
| **OpenAPI Generator**     | API 文档同步      |
| **Docker**                | 环境一致性         |


---

## 三、OpenAI 核心经验：人类只做 Middle Loop

### 3.1 人类专属任务清单

> **核心原则**：人类**一行代码都不写**，只负责设计、监督、反馈


| 任务            | 说明                               |
| ------------- | -------------------------------- |
| **拆任务**       | 把需求拆成 Agent 可执行的小任务（每个 30-60 分钟） |
| **写约束**       | 更新 AGENTS.md、docs/、验收标准          |
| **验收结果**      | 跑 CI、检查输出、对照验收标准                 |
| **改 Harness** | 当结果不对时，**改规则/文档**，不是改代码          |
| **编码 taste**  | 把 review feedback 编码成规则，持续生效     |


### 3.2 人类禁止做的事

- ❌ 亲手写业务代码（一行都不行）
- ❌ 帮 Agent 填坑、改 Bug
- ❌ 逐行审查 Agent 写的代码

### 3.3 Agent 失败时的心态

```
当 Agent 失败时：
❌ 不要说 "再试一次"
✅ 而是问："缺了什么能力？如何让 Agent 也能理解和执行？"
✅ 然后：补工具 / 加约束 / 写文档 → 再让 Agent 重跑
```

---

## 四、项目结构设计

```
harness-engineering-kata/
├── .github/workflows/
│   ├── ci.yml              # CI: lint → test → build
│   └── doc-lint.yml        # 文档一致性检查
├── frontend/               # React + TS + Vite
├── backend/                # Spring Boot + Gradle
│   └── src/main/java/com/harness/kata/
│       ├── types/          # 类型层（最底层）
│       ├── config/         # 配置层
│       ├── repo/           # 数据访问层
│       ├── service/        # 业务逻辑层
│       ├── runtime/        # API/运行时层
│       └── ui/             # 前端（如果有）
├── docs/                   # 知识库（系统唯一真相）
│   ├── ARCHITECTURE.md     # 架构图、分层
│   ├── API-CONTRACT.md     # API 契约
│   ├── DOMAIN.md           # 领域文档
│   └── QUALITY.md          # 质量评分表
├── tests/                  # 集成测试
├── AGENTS.md               # ~100 行目录（不是手册！）
├── Harness.md              # 约束规则清单
├── RULES.md                # Golden Principles（编码 taste）
└── .cursor/                # Cursor 特定配置
    └── rules/              # Cursor Rules
```

---

## 五、OpenAI 经验 1：知识管理

### 5.1 AGENTS.md 是目录，不是手册


| ❌ 失败做法                | ✅ 推荐做法                           |
| --------------------- | -------------------------------- |
| 超大 AGENTS.md（1000+ 行） | ~100 行，只做**目录**                  |
| 文档放 Google Docs/Slack | **全在 repo 内**，版本控制               |
| 文档过期无人维护              | **CI 自动检查** + "doc-gardening" 任务 |


### 5.2 知识分层结构

```
AGENTS.md（入口，仅 ~100 行）
    ↓
docs/
    ├── ARCHITECTURE.md     → 架构图、分层
    ├── API-CONTRACT.md     → API 契约
    ├── DOMAIN.md           → 领域文档
    └── QUALITY.md          → 质量评分
    → 各类设计文档
```

### 5.3 文档维护

- **CI 检查**：docs/ 目录结构、交叉链接、最后更新时间
- **doc-gardening**：定期任务扫描过期文档，自动提修复 PR

---

## 六、OpenAI 经验 2：让应用可读给 Agent

### 6.1 应用可观测性


| 能力        | 实现方式                        |
| --------- | --------------------------- |
| **独立启动**  | 每个 worktree 可独立启动 App       |
| **日志查询**  | 本地日志文件，Agent 可用 grep/LogQL  |
| **指标监控**  | 本地 Prometheus + Grafana（可选） |
| **Trace** | 本地 Jaeger（可选）               |


### 6.2 Cursor 特定配置

```markdown
# .cursor/rules/README.md
- 用 Cursor Rules 定义项目规范
- 配置每次会话的 system prompt 前置上下文
```

### 6.3 Agent 自主验证

OpenAI 经验：单个任务可运行 **6 小时**，Agent 能自主：

- 验证当前状态
- 复现 bug
- 实现修复
- 验证修复
- 开 PR + 响应反馈

---

## 七、OpenAI 经验 3：架构约束

### 7.1 固定分层模型（参考 OpenAI）

```
Types → Config → Repo → Service → Runtime → UI
           ↑
        Providers（跨域入口）
```

### 7.2 约束规则


| 规则   | 工具              |
| ---- | --------------- |
| 分层方向 | **ArchUnit** 测试 |
| 依赖方向 | 自定义 Lint        |
| 命名规范 | Checkstyle      |
| 日志格式 | 自定义 Lint（结构化日志） |
| 文件大小 | 自定义 Lint        |


### 7.3 自定义 Lint 示例

```java
// ArchUnit 示例：Controller 不能直接访问 Repo
layeredArchitecture()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Repo").definedBy("..repo..")
    .whereLayer("Controller").mayNotAccessAnyLayer()
    .whereLayer("Service").mayOnlyAccessLayers("Repo", "Types");
```

**关键点**：Lint 错误信息**自带修复指引**给 Agent！

---

## 八、OpenAI 经验 4：熵管理

### 8.1 Golden Principles

编码到 repo 的 opinionated 规则，如：

```
1. 优先用共享工具包，不手写 helper
2. 数据边界必须校验，不 "YOLO-style"
3. 所有日志必须是结构化日志
4. 每个 domain 必须有对应的测试
```

### 8.2 定期清理任务


| 任务              | 频率    | 内容                   |
| --------------- | ----- | -------------------- |
| **doc-garding** | 每周    | 扫描过期文档，提修复 PR        |
| **code-gc**     | 每天/每周 | 扫描代码味道，提 refactor PR |
| **dep-upgrade** | 每月    | 依赖升级                 |


### 8.3 技术债务哲学

> 技术债务 = 高利贷
> **小步还**比大批划算

人类 taste 一次捕获 → 编码成规则 → 持续生效

---

## 九、OpenAI 经验 5：Merge 哲学


| 传统做法              | 新做法（Agent 时代）             |
| ----------------- | ------------------------- |
| 严格 blocking gates | 最小阻塞门禁                    |
| 等待所有 test pass    | Test flakes 用重跑解决         |
| 详细 code review    | **Agent-to-Agent review** |


**核心逻辑**：Agent 吞吐量 >> 人类注意力，修正成本低，等待成本高。

---

## 十、Middle Loop 完整流程

```
┌─────────────────────────────────────────────────────────────┐
│  需求 / Bug                                         人类处理 │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  1. 明确任务目标 & 验收标准                                  │
│  2. 更新 AGENTS.md / docs/（如有必要）                       │
│  3. 拆成 Agent 可执行的小任务                                │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  交给 Cursor（Agent）                  Agent处理 │
│  (Inner Loop: 写代码、自检、跑测试)                           │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. 人类验收：跑 CI、对照验收标准                            │
│  5. 通过？→ merge         失败？→ 改 Harness，重跑          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. 把 taste 编码成规则（可选）                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 十一、下一步行动


| 步骤  | 任务                                                | 状态  |
| --- | ------------------------------------------------- | --- |
| 1   | 确认技术栈（React + TS / Spring Boot + Gradle）          | ✅   |
| 2   | 初始化项目骨架                                           | ⬜   |
| 3   | 设计分层架构（Types → Config → Repo → Service → Runtime） | ⬜   |
| 4   | 写 AGENTS.md（目录风格）                                 | ⬜   |
| 5   | 配置 ArchUnit 规则                                    | ⬜   |
| 6   | 第一个任务：技术栈初始化                                      | ⬜   |


---

## 十二、讨论点

1. 技术栈确定后，先从哪个层开始？
2. 需要先定义 Golden Principles 吗？
3. 是否需要配置 Cursor Rules？

---

*本文档是 Harness Engineering Kata 的落地实施指南，随着项目演进可能持续更新。*