# REQ-SYS-043: Navigation display shall update position within 1 s of GPS fix

## ASIL Level
QM

## Description
Navigation display shall update position within 1 s of GPS fix.

## Rationale
ISO 26262-3:2018, clause 5-5.4.2 — safety goal SG-IN-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: REQ-SYS-042 (system_requirement)
- Down: TC-004-SW (software_test)
