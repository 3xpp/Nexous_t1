import type { TicketDetail } from '../../src/types';

import tc001 from './tickets/tc001.json';
import tc002 from './tickets/tc002.json';
import tc003 from './tickets/tc003.json';
import tc004 from './tickets/tc004.json';
import tc005 from './tickets/tc005.json';
import tc006 from './tickets/tc006.json';
import tc007 from './tickets/tc007.json';
import tc008 from './tickets/tc008.json';
import tc009 from './tickets/tc009.json';
import tc010 from './tickets/tc010.json';
import tc011 from './tickets/tc011.json';
import tc012 from './tickets/tc012.json';
import tc013 from './tickets/tc013.json';
import tc014 from './tickets/tc014.json';
import tc015 from './tickets/tc015.json';
import tc016 from './tickets/tc016.json';
import tc017 from './tickets/tc017.json';
import tc018 from './tickets/tc018.json';
import tc019 from './tickets/tc019.json';
import tc020 from './tickets/tc020.json';

export const allTickets: TicketDetail[] = [
  tc001,
  tc002,
  tc003,
  tc004,
  tc005,
  tc006,
  tc007,
  tc008,
  tc009,
  tc010,
  tc011,
  tc012,
  tc013,
  tc014,
  tc015,
  tc016,
  tc017,
  tc018,
  tc019,
  tc020,
];

export function ticketById(id: string): TicketDetail | undefined {
  return allTickets.find(t => t.ticket_id === id);
}
