import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoEquirectangular, geoPath } from 'd3-geo';
import type { NetworkLane } from '@flowtrack/shared';
import { coordsFor } from '../../lib/cityCoords';

const WIDTH = 1100;
const HEIGHT = 460;

// projection used to compute arc endpoints for an SVG <path>
const projection = geoEquirectangular()
  .scale(160)
  .translate([WIDTH / 2, HEIGHT / 2 + 40]);

function curvedPath(a: [number, number], b: [number, number]) {
  const [ax, ay] = projection(a) ?? [0, 0];
  const [bx, by] = projection(b) ?? [0, 0];
  const mx = (ax + bx) / 2;
  // lift the control point by ~25% of distance to make a soft arc
  const dist = Math.hypot(bx - ax, by - ay);
  const my = (ay + by) / 2 - dist * 0.28;
  return { d: `M ${ax},${ay} Q ${mx},${my} ${bx},${by}`, ax, ay, bx, by };
}

export function GlobalNetworkMap({ lanes }: { lanes: NetworkLane[] }) {
  const valid = lanes.filter(
    (l) => coordsFor(l.origin_city) && coordsFor(l.dest_city),
  );
  return (
    <section className="overflow-hidden border border-brand-rule bg-brand-paper">
      <header className="flex items-center justify-between border-b border-brand-rule px-4 py-3">
        <div>
          <h3
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: 1.2,
              letterSpacing: '-0.005em',
            }}
          >
            Global network
          </h3>
          <p className="ft-micro mt-1 text-brand-navy/55">Origin-to-destination lanes, live</p>
        </div>
        <button className="ft-eyebrow text-brand-red hover:text-brand-redInk">
          View all lanes →
        </button>
      </header>
      <div className="bg-brand-ink p-4">
        <div className="mb-2 ft-micro flex items-center gap-2 text-brand-paper/70">
          <span className="ft-micro inline-flex items-center gap-1.5 border border-brand-ruleDark px-2 py-1 text-brand-paper">
            <span aria-hidden className="inline-block h-1.5 w-1.5 bg-brand-red" />
            Live network
          </span>
          <span>{valid.length} active lanes</span>
        </div>
        <div className="relative">
          <ComposableMap
            projectionConfig={{ scale: 160 }}
            width={WIDTH}
            height={HEIGHT}
            style={{ width: '100%', height: 'auto' }}
            projection="geoEquirectangular"
          >
            <defs>
              <radialGradient id="dotGlow">
                <stop offset="0%" stopColor="#F32735" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#F32735" stopOpacity="0" />
              </radialGradient>
            </defs>
            <Geographies geography={`${import.meta.env.BASE_URL}world-110m.json`}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#0F1A2E"
                    stroke="#1E2A44"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#13213b' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {valid.map((l) => {
              const a = coordsFor(l.origin_city)!;
              const b = coordsFor(l.dest_city)!;
              const { d, ax, ay, bx, by } = curvedPath(a, b);
              return (
                <g key={l.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#F32735"
                    strokeWidth={1.2}
                    strokeOpacity={0.7}
                  />
                  <circle cx={ax} cy={ay} r={6} fill="url(#dotGlow)" />
                  <circle cx={ax} cy={ay} r={2} fill="#F4F1EB" />
                  <circle cx={bx} cy={by} r={6} fill="url(#dotGlow)" />
                  <circle cx={bx} cy={by} r={2} fill="#F4F1EB" />
                </g>
              );
            })}
          </ComposableMap>
          <div className="ft-micro absolute bottom-2 right-2 border border-brand-ruleDark bg-brand-ink/80 px-2 py-1 text-brand-paper/70">
            Origin / Destination
          </div>
        </div>
      </div>
    </section>
  );
}

// expose the projection for tests
export { projection, geoPath };
