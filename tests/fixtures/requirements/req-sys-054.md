# REQ-SYS-054: Cell balancing shall maintain delta V < 5 mV across all modules

## ASIL Level
C

## Description
Cell balancing shall maintain delta V < 5 mV across all modules.

## Rationale
ISO 26262-5:2018, clause 7-8.4.1 — safety goal SG-BA-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: None
- Down: TC-015-SW (software_test)
