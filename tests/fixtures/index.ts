import type { TicketDetail } from '../../src/types';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadTicket(filename: string): TicketDetail {
  const path = resolve(__dirname, 'tickets', filename);
  return JSON.parse(readFileSync(path, 'utf-8')) as TicketDetail;
}

export const allTickets: TicketDetail[] = [
  loadTicket('tc001.json'),
  loadTicket('tc002.json'),
  loadTicket('tc003.json'),
  loadTicket('tc004.json'),
  loadTicket('tc005.json'),
  loadTicket('tc006.json'),
  loadTicket('tc007.json'),
  loadTicket('tc008.json'),
  loadTicket('tc009.json'),
  loadTicket('tc010.json'),
  loadTicket('tc011.json'),
  loadTicket('tc012.json'),
  loadTicket('tc013.json'),
  loadTicket('tc014.json'),
  loadTicket('tc015.json'),
  loadTicket('tc016.json'),
  loadTicket('tc017.json'),
  loadTicket('tc018.json'),
  loadTicket('tc019.json'),
  loadTicket('tc020.json'),
];

export function ticketById(id: string): TicketDetail | undefined {
  return allTickets.find(t => t.ticket_id === id);
}
