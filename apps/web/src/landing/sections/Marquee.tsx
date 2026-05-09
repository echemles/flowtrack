const ITEMS = [
  '→ Air',
  '· Sea',
  '· Road',
  '· Ecom',
  '· Courier',
  '· 9 Active Lanes',
  '· 12 Shipments Live',
  '· 4 / 28 Integrations',
  '· On-time 100%',
  '· Value in transit $371K',
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
          {loop.map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
