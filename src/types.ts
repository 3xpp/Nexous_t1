export type Mode = 'reviewer' | 'lead';

export type AsilLevel = 'QM' | 'A' | 'B' | 'C' | 'D';

export type TicketStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'draft_low_confidence';

export interface TicketSummary {
  ticket_id: string;
  requirement_id: string;
  requirement_summary: string;
  asil: AsilLevel;
  model_name: string;
  model_version: string;
  generation_score: number;
  status: TicketStatus;
  reviewer_id: string | null;
  created_at: string;
  updated_at: string;
  draft_version: number;
}

export interface TicketDetail extends TicketSummary {
  draft_content: string;
  requirement_text: string;
  traceability_up: TraceLink[];
  traceability_down: TraceLink[];
}

export interface TraceLink {
  artifact_id: string;
  artifact_type: string;
  link_type: string;
}

export interface TicketDelta {
  ticket_id: string;
  action: 'create' | 'update' | 'delete';
  payload: Partial<TicketSummary>;
  timestamp: string;
}

export interface AuditEntry {
  entry_id: string;
  actor: string;
  action: string;
  input_hash: string;
  output_hash: string;
  model: string;
  model_version: string;
  prompt_version: string;
  timestamp: string;
  run_id: string;
  prev_hash: string;
  payload_hash: string;
  entry_hash: string;
}

export interface TicketMetrics {
  total_drafts: number;
  pending_approval: number;
  approved_today: number;
  rejected_today: number;
  avg_review_time_minutes: number;
  queue_oldest_minutes: number;
  audit_chain_healthy: boolean;
}

export interface FilterState {
  project_id: string;
  status: TicketStatus | 'all';
  asil: AsilLevel | 'all';
  reviewer_id: string | 'all';
  search: string;
}
