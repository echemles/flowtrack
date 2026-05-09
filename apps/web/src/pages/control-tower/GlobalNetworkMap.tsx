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
    <section className="rounded-lg border border-border-subtle bg-surface-card overflow-hidden">
      <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Global network</h3>
          <p className="text-xs text-text-secondary">Origin-to-destination lanes, live</p>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:underline">
          View all lanes →
        </button>
      </header>
      <div className="bg-[#0B1220] p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-200/80">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-blue-200 ring-1 ring-blue-400/40">
            ◉ Live network
          </span>
          <span className="text-blue-100/70">{valid.length} active lanes</span>
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
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </radialGradient>
            </defs>
            <Geographies geography="/world-110m.json">
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
                    stroke="#60a5fa"
                    strokeWidth={1.2}
                    strokeOpacity={0.7}
                  />
                  <circle cx={ax} cy={ay} r={6} fill="url(#dotGlow)" />
                  <circle cx={ax} cy={ay} r={2} fill="#7dd3fc" />
                  <circle cx={bx} cy={by} r={6} fill="url(#dotGlow)" />
                  <circle cx={bx} cy={by} r={2} fill="#7dd3fc" />
                </g>
              );
            })}
          </ComposableMap>
          <div className="absolute bottom-2 right-2 rounded-md bg-[#111d33]/80 px-2 py-1 text-[10px] text-blue-100/70 ring-1 ring-blue-400/20">
            Origin / Destination
          </div>
        </div>
      </div>
    </section>
  );
}

// expose the projection for tests
export { projection, geoPath };
