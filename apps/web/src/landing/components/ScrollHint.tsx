export function ScrollHint() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        color: 'var(--paper)',
        fontSize: 22,
        lineHeight: 1,
      }}
      className="chev-bounce"
    >
      ↓
    </span>
  );
}
