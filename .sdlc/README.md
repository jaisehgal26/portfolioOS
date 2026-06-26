# .sdlc — Context Handoff Between Agents

This folder is how the SDLC subagents (in `.cursor/agents/`) pass context to each other. There is **no shared memory** between agents — this folder is the single source of truth.

## How it works

1. For each task/feature, there is **one handoff file**: `.sdlc/<task-slug>.md` (e.g. `.sdlc/add-dark-mode.md`).
2. The first agent (**scope-analyst**) creates it by copying `TEMPLATE.md`.
3. Every agent then:
   - **Reads the entire handoff file first** to understand what happened before.
   - **Fills in only its own section.** Never edits or deletes another agent's section.
4. The next agent picks up where the last one left off.

## The phases (in order)

| # | Section            | Agent            | Writes code? |
|---|--------------------|------------------|--------------|
| 1 | Scope              | `scope-analyst`  | No           |
| 2 | Plan               | `planner`        | No           |
| 3 | Implementation     | `implementer`    | Yes          |
| 4 | Testing            | `tester`         | No (runs/tests) |
| 5 | Impact / Regression| `impact-checker` | No (analyzes)|
| 6 | Ship               | `shipper`        | No           |

## Rules
- One handoff file per task. Name it after the task in `kebab-case`.
- Keep entries short, factual, and skimmable — bullets over essays.
- If an agent can't proceed (blocked, missing info), it writes a **🚧 BLOCKED** note in its section and stops.
- Done tasks can be moved to `.sdlc/done/` to keep the folder clean.
