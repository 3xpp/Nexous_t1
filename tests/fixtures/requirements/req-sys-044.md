# REQ-SYS-044: Cell balancing shall maintain delta V < 5 mV across all modules

## ASIL Level
C

## Description
Cell balancing shall maintain delta V < 5 mV across all modules.

## Rationale
ISO 26262-3:2018, clause 5-5.4.2 — safety goal SG-CE-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: None
- Down: TC-005-SW (software_test)
