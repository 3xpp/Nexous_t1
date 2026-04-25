# Nexous Code Audit Report

**Date:** 2026-04-25
**Auditor:** Claude Code (self-audit)
**Scope:** Master Ticket View SPA

---

## Executive Summary

| Dimension | Grade | Status |
|-----------|-------|--------|
| Code Quality | B+ | 2 boundary violations, 1 HTML semantics issue, 1 unimplemented handler |
| Test Coverage | C | 4 unit files, 3 E2E tests; ~76% of components untested |
| Data Realism | A | Fixtures cover all ASIL levels, statuses, timestamps validated |
| Auditor Resistance | B+ | tsc clean, no console/debugger, but API leaks in components |

---

## 1. Code Quality Findings

### F-001: Component directly calls API (High)
- **File:** `src/components/DashboardPane.tsx`
- **Line:** 15
- **Impact:** Violates the store-boundary rule. `fetchMetrics` is imported from `../api` and invoked inside a component lifecycle. If the API contract changes, the fix must be made in multiple presentation-layer files.
- **Recommendation:** Introduce a `metricsStore` (or extend `ticketStore`) to own the `fetchMetrics` call. `DashboardPane` should read `metricsStore.data.value` and trigger `metricsStore.load(projectId)` via `useEffect`.

### F-002: Layout component directly creates EventSource (Medium)
- **File:** `src/components/MasterTicketView.tsx`
- **Line:** 22
- **Impact:** `createTicketStream` is an API primitive. Managing SSE connections, reconnection backoff, and cleanup inside a layout component blurs the boundary between presentation and data layer.
- **Recommendation:** Move `createTicketStream` orchestration into `ticketStore.initStream(projectId)` so the component only calls `ticketStore.init(projectId)` and `ticketStore.cleanup()`.

### F-003: Invalid HTML nesting (Medium)
- **File:** `src/components/FilteredQueueTable.tsx`
- **Line:** 32
- **Impact:** `TicketRow` renders a `<div>`, but `FilteredQueueTable` wraps it in a `<tr>`. A `<div>` is not a valid child of `<tr>`, which can cause unexpected rendering in strict mode or with CSS table layouts.
- **Recommendation:** Either render `TicketRow` as a fragment of `<td>` elements inside the `<tr>`, or switch the table to a CSS-grid / flex layout.

### F-004: Unimplemented save handler (Low)
- **File:** `src/components/DraftTab.tsx`
- **Line:** 73
- **Impact:** The "Save Edit" button has an inline comment `/* save editContent */` with no actual mutation. Users can enter edit mode, type changes, and click Save, but nothing persists.
- **Recommendation:** Wire the save action to `ticketDetailStore.saveDraft(editContent)` (add the method to the store if it does not exist).

### F-005: Unused prop (Low)
- **File:** `src/components/Header.tsx`
- **Line:** 4, 8
- **Impact:** `projectId` is declared in `HeaderProps` and destructured but never referenced. Creates misleading contract for consumers.
- **Recommendation:** Remove `projectId` from `HeaderProps` and from the call site in `MasterTicketView`.

### F-006: Duplicate global keydown listeners (Low)
- **Files:** `src/components/QueuePane.tsx`, `src/components/TicketDetailPane.tsx`, `src/hooks/useKeyboardShortcuts.ts`
- **Impact:** Three separate modules attach `window.addEventListener('keydown', ...)`. The order of execution is implicit and can lead to shortcuts being swallowed or double-handled.
- **Recommendation:** Consolidate keyboard handling into `useKeyboardShortcuts` and expose a registry so individual components register their shortcuts declaratively instead of imperatively attaching listeners.

---

## 2. Static Analysis

| Check | Result |
|-------|--------|
| `tsc --noEmit` | **PASS** (exit 0, zero errors) |
| `console.log / warn / error` | **PASS** (zero occurrences) |
| `debugger` statements | **PASS** (zero occurrences) |

---

## 3. Component Boundary Review

| Component | API Calls | Props Typed | Focused | Verdict |
|-----------|-----------|-------------|---------|---------|
| AuditTab.tsx | via `auditStore` | n/a (no props) | yes | pass |
| DashboardPane.tsx | **direct `fetchMetrics`** | yes | yes | **fail** |
| DraftTab.tsx | via `ticketDetailStore` | n/a | yes* | pass* |
| ErrorInline.tsx | none | yes | yes | pass |
| FilteredQueueTable.tsx | via `ticketStore` | n/a | yes | pass |
| Header.tsx | none | yes | yes | pass |
| LeadLayout.tsx | none | yes | yes | pass |
| MasterTicketView.tsx | **direct `createTicketStream`** | yes | yes | **fail** |
| ModeToggle.tsx | via `ticketStore` | n/a | yes | pass |
| QueuePane.tsx | via `ticketStore` | n/a | yes | pass |
| RequirementTab.tsx | via `ticketDetailStore` | n/a | yes | pass |
| ResizableSplit.tsx | none | yes | yes | pass |
| ReviewerLayout.tsx | none | n/a | yes | pass |
| SkeletonShimmer.tsx | none | yes | yes | pass |
| TicketDetailPane.tsx | via `ticketDetailStore` | n/a | yes | pass |
| TicketRow.tsx | none | yes | yes | pass |
| TraceabilityTab.tsx | via `ticketDetailStore` | n/a | yes | pass |

*DraftTab has an unimplemented save handler (F-004).

---

## 4. Test Coverage Snapshot

| Layer | Files | Coverage Assessment |
|-------|-------|---------------------|
| Stores | `ticketStore.test.ts`, `ticketDetailStore.test.ts` | Core logic covered (mode, delta merge, approve, conflict) |
| Components | `ticketRow.test.tsx`, `resizableSplit.test.tsx` | 2 of 17 components tested |
| Hooks | none | `useKeyboardShortcuts`, `useResizable` untested |
| API | none | `api.ts` untested |
| E2E | `masterTicketView.spec.ts` | 3 smoke tests (mode switch, keyboard shortcut, fixture load) |
| Fixtures | `fixtures.test.ts` | Validates shape, ASIL/status coverage, timestamps |

**Recommendation:** Add component tests for `DraftTab` (approve/reject flow), `DashboardPane` (metrics render), and `QueuePane` (keyboard navigation). Add a unit test for `useResizable` to cover drag math.

---

## 5. Auditor Resistance Notes

- **No dead code artifacts:** Working tree is clean, no commented-out blocks of significance, no `TODO`/`FIXME` markers in production source.
- **No anti-debugging:** No `debugger` stripping, no `eval`, no obfuscation.
- **Type safety:** Strict TypeScript configuration, no `any` leakage observed in component files.
- **Weakness:** The two API-boundary leaks (F-001, F-002) are exactly what an external auditor would flag as architectural inconsistency. Fixing them improves both maintainability and audit posture.

---

*End of report*
