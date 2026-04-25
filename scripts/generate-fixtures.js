#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAINS = [
  { name: 'Brake system', asil: 'D', reqs: [
    'Brake light shall illuminate within 100 ms of pedal depression',
    'ABS shall prevent wheel lock-up on all road surfaces'
  ]},
  { name: 'Steering torque', asil: 'C', reqs: [
    'EPS shall limit assist torque below 25 Nm at speeds > 120 km/h',
    'Steering ECU shall detect and mitigate torque sensor failure within 50 ms'
  ]},
  { name: 'Exterior lighting', asil: 'B', reqs: [
    'DRL shall dim to 30% when turn signal active',
    'Headlamp auto-leveling shall respond within 200 ms of pitch change'
  ]},
  { name: 'Infotainment', asil: 'QM', reqs: [
    'Media volume shall not exceed 85 dB(A)',
    'Navigation display shall update position within 1 s of GPS fix'
  ]},
  { name: 'Battery management', asil: 'C', reqs: [
    'BMS shall disconnect HV contactors on crash detection',
    'Cell balancing shall maintain delta V < 5 mV across all modules'
  ]},
  { name: 'Lane keeping', asil: 'B', reqs: [
    'LKA shall provide haptic feedback before lane departure',
    'Camera ECU shall detect faded lane markings at > 80% confidence'
  ]},
  { name: 'Airbag deployment', asil: 'D', reqs: [
    'Airbag ECU shall fire within 10 ms of impact threshold',
    'Seat occupancy sensor shall distinguish adult vs. child within 500 ms'
  ]},
  { name: 'Rain sensor', asil: 'A', reqs: [
    'Wipers shall activate within 500 ms of rain detection',
    'Sensor shall ignore false positives from condensation'
  ]},
  { name: 'TPMS', asil: 'A', reqs: [
    'Tire pressure alert shall trigger below 1.8 bar',
    'TPMS shall report pressure within ±0.05 bar accuracy'
  ]},
  { name: 'Seatbelt reminder', asil: 'QM', reqs: [
    'Seatbelt chime shall sound after vehicle speed > 10 km/h',
    'Reminder shall suppress after 30 s of continuous driving'
  ]}
];

const MODELS = [
  { name: 'llama', version: '3.1' },
  { name: 'gpt-4o', version: '2024-08-06' },
  { name: 'claude-sonnet-4-6', version: '20251001' }
];

const STATUSES = ['draft', 'pending', 'approved', 'rejected', 'draft_low_confidence'];
const REVIEWERS = ['eng.muller@nexous.local', 'eng.schmidt@nexous.local', null, 'eng.weber@nexous.local'];

const ISO_CLAUSES = {
  'Brake system': 'ISO 26262-4:2018, clause 6-6.4.1',
  'Steering torque': 'ISO 26262-4:2018, clause 6-7.4.2',
  'Exterior lighting': 'ISO 26262-3:2018, clause 5-6.4.3',
  'Infotainment': 'ISO 26262-3:2018, clause 5-5.4.2',
  'Battery management': 'ISO 26262-5:2018, clause 7-8.4.1',
  'Lane keeping': 'ISO 26262-3:2018, clause 5-7.4.2',
  'Airbag deployment': 'ISO 26262-4:2018, clause 6-8.4.1',
  'Rain sensor': 'ISO 26262-3:2018, clause 5-5.4.2',
  'TPMS': 'ISO 26262-3:2018, clause 5-5.4.2',
  'Seatbelt reminder': 'ISO 26262-3:2018, clause 5-5.4.2'
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateFixture(index, rand) {
  const domain = DOMAINS[index % DOMAINS.length];
  const reqIndex = Math.floor(rand() * domain.reqs.length);
  const model = MODELS[Math.floor(rand() * MODELS.length)];
  const status = STATUSES[Math.floor(rand() * STATUSES.length)];
  const reviewer = REVIEWERS[Math.floor(rand() * REVIEWERS.length)];
  const ticketId = `TC-${String(index + 1).padStart(3, '0')}`;
  const reqId = `REQ-SYS-${String(40 + index).padStart(3, '0')}`;
  const draftVersion = 1 + Math.floor(rand() * 4);
  const generationScore = 0.7 + rand() * 0.28;
  const createdAt = new Date(2026, 3, 10 + Math.floor(rand() * 15), 8 + Math.floor(rand() * 10), Math.floor(rand() * 60));
  const updatedAt = new Date(createdAt.getTime() + rand() * 86400000 * 5);

  const ticket = {
    ticket_id: ticketId,
    requirement_id: reqId,
    requirement_summary: domain.reqs[reqIndex],
    asil: domain.asil,
    model_name: model.name,
    model_version: model.version,
    generation_score: Math.round(generationScore * 100) / 100,
    status,
    reviewer_id: reviewer,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
    draft_version: draftVersion,
    draft_content: generateDraftContent(ticketId, reqId, domain),
    requirement_text: generateRequirementText(reqId, domain),
    traceability_up: generateTraceabilityUp(reqId, rand),
    traceability_down: generateTraceabilityDown(ticketId, rand)
  };

  return ticket;
}

function generateDraftContent(ticketId, reqId, domain) {
  return `## Test Case ${ticketId}

**Derived from:** ${reqId}
**ASIL:** ${domain.asil}

### Objective
Verify that ${domain.reqs[0].toLowerCase()}.

### Preconditions
- Vehicle ignition ON
- System under test operational

### Test Steps
1. Establish initial conditions
2. Trigger event described in requirement
3. Measure response time and correctness
4. Record result

### Acceptance Criteria
- Response within specified time bound
- No diagnostic faults triggered
- Traceability link maintained

### References
- ${ISO_CLAUSES[domain.name] || 'ISO 26262-3:2018, clause 5-5.4.2'}
- Safety goal SG-${domain.name.substring(0, 2).toUpperCase()}-01`;
}

function generateRequirementText(reqId, domain) {
  return `# ${reqId}: ${domain.name} Safety Requirement

## ASIL Level
${domain.asil}

## Description
${domain.reqs[0]}.

## Rationale
${ISO_CLAUSES[domain.name] || 'ISO 26262-3:2018, clause 5-5.4.2'} — safety goal SG-${domain.name.substring(0, 2).toUpperCase()}-01 requires ${domain.name.toLowerCase()} functional safety.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: ${reqId.replace(/\d{3}/, (m) => String(parseInt(m) - 1).padStart(3, '0'))} (${domain.name} Functional Safety Concept)
- Down: ${reqId.replace('REQ', 'TC')}-SW (Software Integration Test)`;
}

function generateTraceabilityUp(reqId, rand) {
  if (rand() > 0.3) {
    return [{
      artifact_id: reqId.replace(/\d{3}/, (m) => String(parseInt(m) - 1).padStart(3, '0')),
      artifact_type: 'system_requirement',
      link_type: 'derives_from'
    }];
  }
  return [];
}

function generateTraceabilityDown(ticketId, rand) {
  if (rand() > 0.3) {
    return [{
      artifact_id: `${ticketId}-SW`,
      artifact_type: 'software_test',
      link_type: 'verified_by'
    }];
  }
  return [];
}

function generateMarkdownFile(ticket) {
  return `# ${ticket.requirement_id}: ${ticket.requirement_summary}

## ASIL Level
${ticket.asil}

## Description
${ticket.requirement_summary}.

## Rationale
${ISO_CLAUSES[ticket.requirement_summary] || 'ISO 26262-3:2018, clause 5-5.4.2'} — safety goal SG-${ticket.requirement_summary.substring(0, 2).toUpperCase()}-01 requires timely functional safety response.

## Verification Method
Back-to-back test comparing sensor input vs. actuator output.

## Traceability
- Up: ${ticket.traceability_up.map(t => `${t.artifact_id} (${t.artifact_type})`).join(', ') || 'None'}
- Down: ${ticket.traceability_down.map(t => `${t.artifact_id} (${t.artifact_type})`).join(', ') || 'None'}
`;
}

function main() {
  const args = process.argv.slice(2);
  let count = 20;
  let seed = Date.now();
  let outputDir = path.join(__dirname, '..', 'tests', 'fixtures');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) count = parseInt(args[i + 1]);
    if (args[i] === '--seed' && args[i + 1]) seed = parseInt(args[i + 1]);
    if (args[i] === '--output-dir' && args[i + 1]) outputDir = args[i + 1];
  }

  const rand = seededRandom(seed);
  const ticketsDir = path.join(outputDir, 'tickets');
  const reqsDir = path.join(outputDir, 'requirements');

  fs.mkdirSync(ticketsDir, { recursive: true });
  fs.mkdirSync(reqsDir, { recursive: true });

  const tickets = [];
  for (let i = 0; i < count; i++) {
    const ticket = generateFixture(i, rand);
    tickets.push(ticket);

    fs.writeFileSync(
      path.join(ticketsDir, `${ticket.ticket_id.toLowerCase().replace(/-/g, '')}.json`),
      JSON.stringify(ticket, null, 2)
    );

    fs.writeFileSync(
      path.join(reqsDir, `${ticket.requirement_id.toLowerCase().replace(/_/g, '-')}.md`),
      generateMarkdownFile(ticket)
    );
  }

  const indexContent = `import type { TicketDetail } from '../../src/types';\n\n${tickets.map(t => `import ${t.ticket_id.toLowerCase().replace(/-/g, '')} from './tickets/${t.ticket_id.toLowerCase().replace(/-/g, '')}.json';`).join('\n')}\n\nexport const allTickets: TicketDetail[] = [\n${tickets.map(t => `  ${t.ticket_id.toLowerCase().replace(/-/g, '')},`).join('\n')}\n];\n\nexport function ticketById(id: string): TicketDetail | undefined {\n  return allTickets.find(t => t.ticket_id === id);\n}\n`;
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

  console.log(`Generated ${count} fixtures with seed ${seed}`);
  console.log(`Tickets: ${ticketsDir}`);
  console.log(`Requirements: ${reqsDir}`);
}

main();
