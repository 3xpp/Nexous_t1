import { QueuePane } from './QueuePane';
import { TicketDetailPane } from './TicketDetailPane';
import { ResizableSplit } from './ResizableSplit';

export function ReviewerLayout() {
  return (
    <ResizableSplit initialLeftWidth={360} minLeftWidth={280} maxLeftWidth={520}>
      <QueuePane />
      <TicketDetailPane />
    </ResizableSplit>
  );
}
