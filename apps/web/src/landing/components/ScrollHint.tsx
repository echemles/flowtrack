export function ScrollHint() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        border: '1px solid var(--rule)',
        borderRadius: 999,
        color: 'var(--paper)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      }}
    >
      Scroll
      <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 0.6 }}>
        <span className="chev-bounce">↓</span>
        <span className="chev-bounce-2">↓</span>
      </span>
    </div>
  );
}
