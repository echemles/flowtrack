// Trim marker: items beyond the first 5 are hidden on <480px so the
// marquee doesn't run out of breath on tight phones.
const ITEMS: { text: string; trim?: boolean }[] = [
  { text: '→ Air' },
  { text: '· Sea' },
  { text: '· Road' },
  { text: '· Ecom' },
  { text: '· Courier' },
  { text: '· 9 Active Lanes', trim: true },
  { text: '· 12 Shipments Live', trim: true },
  { text: '· 4 / 28 Integrations', trim: true },
  { text: '· On-time 100%', trim: true },
  { text: '· Value in transit $371K', trim: true },
];

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <section
      style={{
        background: 'var(--paper)',
        color: 'var(--navy)',
        borderTop: '1px solid var(--rule-light)',
        borderBottom: '1px solid var(--rule-light)',
        padding: '22px 0',
      }}
    >
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((it, i) => (
            <span
              key={i}
              className={it.trim ? 'marquee-item-trim' : undefined}
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {it.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
