import { ModeToggle } from './ModeToggle';

interface HeaderProps {
  projectId: string;
  reconnecting?: boolean;
}

export function Header({ reconnecting }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '48px',
      borderBottom: '1px solid #e5e7eb',
      background: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Nexous</span>
        <ModeToggle />
        {reconnecting && (
          <span style={{ fontSize: '12px', color: '#f59e0b' }}>Reconnecting...</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="search"
          placeholder="Search tickets..."
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        />
        <span style={{ fontSize: '13px', color: '#6b7280' }}>user@nexous.local</span>
      </div>
    </header>
  );
}
