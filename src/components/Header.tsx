import { ModeToggle } from './ModeToggle';

interface HeaderProps {
  reconnecting?: boolean;
}

export function Header({ reconnecting }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 var(--space-lg)`,
      height: `var(--header-height)`,
      borderBottom: `1px solid var(--color-divider)`,
      background: 'var(--color-bg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: `var(--space-lg)` }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Nexous</span>
        <ModeToggle />
        {reconnecting && (
          <span aria-live="polite" style={{ fontSize: '12px', color: 'var(--color-amber)' }}>Reconnecting...</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: `var(--space-md)` }}>
        <input
          type="search"
          aria-label="Search tickets"
          placeholder="Search tickets..."
          style={{
            padding: `var(--space-xs) var(--space-sm)`,
            border: `1px solid var(--color-border)`,
            borderRadius: `var(--radius-md)`,
            fontSize: '13px'
          }}
        />
        <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>user@nexous.local</span>
      </div>
    </header>
  );
}
