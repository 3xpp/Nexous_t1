# REQ-SYS-050: Brake light shall illuminate within 100 ms of pedal depression

## ASIL Level
D

## Description
Brake light shall illuminate within 100 ms of pedal depression.

## Rationale
ISO 26262-4:2018, clause 6-6.4.1 — safety goal SG-BR-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: REQ-SYS-049 (system_requirement)
- Down: TC-011-SW (software_test)
