# RULES.md — Golden Principles（编码 taste）

> 人类 taste 编码为规则，Agent 与人类共同遵守。修订权在人类。

---

1. **优先用共享工具包，不手写 helper**  
   已有工具或库能做的事，不重复实现；新 helper 放对层（如 types 或 config），并符合分层。

2. **数据边界必须校验，不 "YOLO-style"**  
   入参、持久化读写、跨层边界要做校验与合理错误处理；不假定输入或存储必然正确。

3. **所有日志必须是结构化日志**  
   后端日志使用结构化格式（如 key-value 或 JSON），便于检索与可观测；避免仅打印自由文本。

4. **每个 domain 必须有对应的测试**  
   新增或修改领域逻辑时，须有对应单测或集成测试；测试失败即不可合并。

5. **遵循 OpenSpec 流程**  
   功能/非平凡改动先 Proposal，再按 tasks.md 实现，再验收与 Archive；不跳过 proposal 或 validate。

6. **分层不可打破**  
   Runtime 不直接访问 Repo；Service 不依赖 Runtime；新代码通过 ArchUnit。

---

*人类可根据 review 反馈在此追加规则；Agent 实现时以本文件与 [Harness.md](Harness.md)、[AGENTS.md](AGENTS.md) 为准。*
