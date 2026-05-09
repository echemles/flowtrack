import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoEquirectangular } from 'd3-geo';

const W = 900;
const H = 360;

function projectionFor(a: [number, number], b: [number, number]) {
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2;
  const dist = Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), 20);
  const scale = Math.min(380, 5500 / dist);
  return geoEquirectangular()
    .scale(scale)
    .center([cx, cy])
    .translate([W / 2, H / 2]);
}

function ay(a: number[], b: number[], tv: number) {
  return (
    a[1] +
    (b[1] - a[1]) * tv -
    Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.18 * Math.sin(Math.PI * tv)
  );
}

export type RouteMapProps = {
  origin: [number, number];
  dest: [number, number];
  originLabel?: string;
  destLabel?: string;
  percent: number;
  /** Optional banner inside top-left of map (e.g. mode banner) */
  topLeft?: React.ReactNode;
  /** Optional caption inside bottom-right of map */
  bottomRight?: React.ReactNode;
  /** Aspect ratio class for outer container; defaults to auto height matching SVG aspect */
  aspectClass?: string;
};

/**
 * Live-tracking style world map with origin/dest points + animated arc.
 * Shared between LiveTrackingPanel and ShipmentQuickViewModal.
 */
export function RouteMap({
  origin,
  dest,
  originLabel,
  destLabel,
  percent,
  topLeft,
  bottomRight,
  aspectClass,
}: RouteMapProps) {
  const proj = projectionFor(origin, dest);
  const ax = proj(origin) ?? [0, 0];
  const bx = proj(dest) ?? [0, 0];
  const t = Math.max(0, Math.min(1, percent / 100));
  const cur: [number, number] = [
    ax[0] + (bx[0] - ax[0]) * t,
    ay(ax, bx, t),
  ];
  const mx = (ax[0] + bx[0]) / 2;
  const my = (ax[1] + bx[1]) / 2 - Math.hypot(bx[0] - ax[0], bx[1] - ax[1]) * 0.25;
  const arcD = `M ${ax[0]},${ax[1]} Q ${mx},${my} ${bx[0]},${bx[1]}`;

  // Default sizing: graceful min-height on mobile, capped on large screens, aspect preserved.
  // 4:3 on phones (square-ish, readable), 16:9 on small tablets, ~5:3 on desktop split.
  const defaultAspect =
    'min-h-[280px] max-h-[480px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[5/3]';
  const sizeClass = aspectClass ?? defaultAspect;

  return (
    <div className={`relative w-full overflow-hidden bg-[#0B1220] ${sizeClass}`}>
      {topLeft ? <div className="absolute left-3 top-3 z-10">{topLeft}</div> : null}
      <ComposableMap
        width={W}
        height={H}
        projection={proj as any}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
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
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        <path d={arcD} fill="none" stroke="#011C4D" strokeWidth={2} strokeOpacity={0.55} />
        <path
          d={arcD}
          fill="none"
          stroke="#F32735"
          strokeWidth={2.5}
          strokeOpacity={0.95}
          pathLength={1}
          style={{ strokeDasharray: '1', strokeDashoffset: 1 - t }}
        />
        <circle cx={ax[0]} cy={ay(ax, bx, 0)} r={4} fill="#F4F1EB" />
        {originLabel ? (
          <text x={ax[0]} y={ax[1] - 8} fontSize="10" fill="#F4F1EB" textAnchor="middle">
            {originLabel}
          </text>
        ) : null}
        <circle cx={bx[0]} cy={bx[1]} r={4} fill="#F4F1EB" />
        {destLabel ? (
          <text x={bx[0]} y={bx[1] - 8} fontSize="10" fill="#F4F1EB" textAnchor="middle">
            {destLabel}
          </text>
        ) : null}
        <circle cx={cur[0]} cy={cur[1]} r={6} fill="#F32735" stroke="#F4F1EB" strokeWidth={1.5} />
      </ComposableMap>
      {bottomRight ? (
        <div className="pointer-events-none absolute bottom-3 right-3 hidden text-right text-[11px] text-brand-paper/75 sm:block">
          {bottomRight}
        </div>
      ) : null}
    </div>
  );
}

export function ModeBanner({ mode }: { mode: string }) {
  const label =
    mode === 'sea'
      ? 'SEA FREIGHT · LIVE'
      : mode === 'air'
        ? 'AIR FREIGHT · LIVE'
        : mode === 'road'
          ? 'ROAD FREIGHT · LIVE'
          : 'IN TRANSIT · LIVE';
  return (
    <span className="ft-micro inline-flex items-center border border-brand-paper/25 bg-brand-ink/70 px-2 py-1 text-brand-paper">
      {label}
    </span>
  );
}
