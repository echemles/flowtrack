export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--navy)',
        color: 'var(--paper)',
        borderTop: '1px solid var(--rule)',
        padding: '36px 0',
      }}
    >
      <div
        className="lc"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--mute)',
          }}
        >
          © 2026 FlowTrack · An Innovtex Product · For prospective enterprise customers
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--mute)',
          }}
        >
          <span style={{ color: 'var(--paper)' }}>EN</span>
          <span>·</span>
          <span>ES</span>
          <span>·</span>
          <span>ZH</span>
        </div>
      </div>
    </footer>
  );
}
