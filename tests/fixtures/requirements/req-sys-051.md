# REQ-SYS-051: Steering ECU shall detect and mitigate torque sensor failure within 50 ms

## ASIL Level
C

## Description
Steering ECU shall detect and mitigate torque sensor failure within 50 ms.

## Rationale
ISO 26262-3:2018, clause 5-5.4.2 — safety goal SG-ST-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: REQ-SYS-050 (system_requirement)
- Down: TC-012-SW (software_test)
