# Nexous Realistic Dummy Data & Code Audit

**Product:** Nexous (on-prem AI assistant for ISO 26262 / ASPICE / ISO 21434)  
**Date:** 2026-04-25  
**Status:** Approved — ready for implementation plan

---

## 1. PURPOSE

This design covers two workstreams that support the Master Ticket View project:

1. **Realistic Dummy Data** — 20+ ISO 26262-style ticket fixtures that make the UI look like a real production safety tool when demonstrated or tested.
2. **Code Audit** — A structured review across four dimensions to ensure the codebase is defensible when audited by another AI-assisted team.

---

## 2. REALISTIC DUMMY DATA

### 2.1 Output Files

| Path | Description |
|------|-------------|
| `tests/fixtures/tickets/*.json` | 20 `TicketDetail` JSON fixtures |
| `tests/fixtures/requirements/*.md` | 20 human-readable requirement documents |
| `scripts/generate-fixtures.js` | Generator script for reproducible data |

### 2.2 Content Themes

Each ticket covers a real automotive safety domain. With 2 tickets per domain (different statuses, ASILs, or model versions), this yields 20 total fixtures:

| Domain | ASIL | Example Requirement | Ticket Count |
|--------|------|---------------------|-------------|
| Brake system | D | Brake light shall illuminate within 100 ms of pedal depression | 2 |
| Steering torque | C | EPS shall limit assist torque below 25 Nm at speeds > 120 km/h | 2 |
| Exterior lighting | B | DRL shall dim to 30% when turn signal active | 2 |
| Infotainment | QM | Media volume shall not exceed 85 dB(A) | 2 |
| Battery management | C | BMS shall disconnect HV contactors on crash detection | 2 |
| Lane keeping | B | LKA shall provide haptic feedback before lane departure | 2 |
| Airbag deployment | D | Airbag ECU shall fire within 10 ms of impact threshold | 2 |
| Rain sensor | A | Wipers shall activate within 500 ms of rain detection | 2 |
| TPMS | A | Tire pressure alert shall trigger below 1.8 bar | 2 |
| Seatbelt reminder | QM | Seatbelt chime shall sound after vehicle speed > 10 km/h | 2 |

### 2.3 Variety Coverage

- **ASIL levels:** All 5 (QM, A, B, C, D) represented
- **Statuses:** All 5 (`draft`, `pending`, `approved`, `rejected`, `draft_low_confidence`)
- **Draft versions:** Mix of v1, v2, v3+ (some with version conflict history)
- **Traceability:** Some with full up/down links, some with empty arrays (edge case)
- **Model diversity:** `llama-3.1`, `gpt-4o`, `claude-sonnet-4-6`
- **Reviewer assignments:** Mix of assigned, unassigned, cross-team
- **Timestamps:** Realistic creation/update spread across April 2026

### 2.4 JSON Fixture Structure

Each `.json` file is a complete `TicketDetail` object:

```typescript
{
  "ticket_id": "TC-001",
  "requirement_id": "REQ-SYS-042",
  "requirement_summary": "Brake light shall illuminate when pedal depressed",
  "asil": "B",
  "model_name": "llama",
  "model_version": "3.1",
  "generation_score": 0.91,
  "status": "draft",
  "reviewer_id": "eng.muller@nexous.local",
  "created_at": "2026-04-20T08:30:00Z",
  "updated_at": "2026-04-24T14:22:00Z",
  "draft_version": 3,
  "draft_content": "## Test Case TC-001...",
  "requirement_text": "## Requirement REQ-SYS-042...",
  "traceability_up": [
    { "artifact_id": "REQ-SYS-041", "artifact_type": "system_requirement", "link_type": "derives_from" }
  ],
  "traceability_down": [
    { "artifact_id": "TC-001-SW", "artifact_type": "software_test", "link_type": "verified_by" }
  ]
}
```

### 2.5 Markdown Requirement Documents

Each `.md` file contains a properly formatted ISO 26262 work product:

```markdown
# REQ-SYS-042: Brake Light Illumination

## ASIL Level
B

## Description
The brake light shall illuminate within 100 ms of brake pedal depression.

## Rationale
ISO 26262-3:2018, clause 5-5.4.2 — safety goal SG-BR-01 requires timely driver warning.

## Verification Method
Back-to-back test comparing brake pedal position sensor vs. light output.

## Traceability
- Up: REQ-SYS-041 (Brake System Functional Safety Concept)
- Down: TC-001-SW (Software Integration Test)
```

### 2.6 Generator Script

`scripts/generate-fixtures.js` takes:
- `--count` (default: 20)
- `--seed` (default: current timestamp)
- `--output-dir` (default: `tests/fixtures`)

Produces both:
- `tests/fixtures/tickets/tc-001.json` through `tc-N.json`
- `tests/fixtures/requirements/req-sys-042.md` etc.

Deterministic output given the same seed.

---

## 3. CODE AUDIT FRAMEWORK

### 3.1 Dimensions

| Dimension | Scope | Severity Levels |
|-----------|-------|-----------------|
| **Code Quality** | TypeScript strictness, component boundaries, store patterns, no API calls below layout level | Critical / High / Medium / Low |
| **Test Coverage** | Unit test completeness, E2E reliability, missing edge cases | Critical / High / Medium |
| **Data Realism** | ISO 26262 terminology accuracy, clause references, traceability structure | High / Medium / Low |
| **Auditor Resistance** | Magic numbers, hardcoded strings, missing `aria-labels`, no skeleton/loading states, race conditions in SSE handlers, inline styles instead of CSS classes, untyped event handlers | Critical / High / Medium |

### 3.2 Audit Output

`AUDIT_REPORT.md` with:
1. **Executive Summary** — pass/fail per dimension, overall grade
2. **Detailed Findings** — file references, line numbers, severity, recommendation
3. **Action Items** — prioritized by severity with owner (us vs. future)
4. **Strengths** — what looks good (balance criticism with praise)
5. **Appendix** — audit methodology and checklist used

### 3.3 Process

1. Run audit against current codebase
2. Generate findings
3. Fix critical/high items
4. Regenerate report
5. Commit final clean report

---

## 4. SUCCESS CRITERIA

- [ ] 20+ JSON fixtures load into the app without type errors
- [ ] All 5 ASIL levels and 5 statuses represented
- [ ] Markdown docs contain proper ISO 26262 clause references
- [ ] Generator script runs deterministically with `--seed`
- [ ] Audit report covers all 4 dimensions
- [ ] Zero critical findings in final report
- [ ] Report is committed and readable by external reviewers

---

## 5. OUT OF SCOPE

- Backend API implementation (fixtures are static files only)
- Fuzz testing or property-based testing
- Performance benchmarking beyond basic queue rendering
- Accessibility audit beyond keyboard navigation checks

---

## 6. APPROVAL

- [x] Data structure approved
- [x] Audit framework approved
- [ ] Spec reviewed (pending)
