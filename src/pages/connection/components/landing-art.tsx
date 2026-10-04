/** Vector art for the factory search landing — crisp at any DPR */

/** Factory with a sprout, used on the CTA button */
export function FactorySproutIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path
        d="M4 35V20l8 5v-5l8 5v-5l8 5V12h6v23H4Z"
        fill="currentColor"
      />
      <rect x="9" y="28" width="3.5" height="3.5" rx=".6" fill="#14532d" />
      <rect x="16" y="28" width="3.5" height="3.5" rx=".6" fill="#14532d" />
      <rect x="23" y="28" width="3.5" height="3.5" rx=".6" fill="#14532d" />
      <path d="M31 12V8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M31 9c0-3.2 2.4-5.6 6-5.6 0 3.3-2.5 5.6-6 5.6Z" fill="#bef264" />
      <path d="M31 10.2c0-2.6-2-4.6-4.8-4.6 0 2.7 2 4.6 4.8 4.6Z" fill="#86efac" />
    </svg>
  );
}

/** Faint large leaf watermark for the sheet's top-right corner */
export function LeafWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <path
        d="M30 180C40 90 100 30 190 20c-6 90-60 150-160 160Z"
        fill="currentColor"
      />
      <path
        d="M34 176C80 120 130 70 186 24"
        stroke="#f7f5ee"
        strokeOpacity=".7"
        strokeWidth="3"
        fill="none"
      />
      {[0.25, 0.42, 0.58, 0.74].map((t) => {
        const x = 34 + (186 - 34) * t;
        const y = 176 + (24 - 176) * t;
        return (
          <g key={t} stroke="#f7f5ee" strokeOpacity=".5" strokeWidth="2" fill="none">
            <path d={`M${x} ${y}q18 -2 30 -18`} />
            <path d={`M${x} ${y}q-2 -18 -18 -30`} />
          </g>
        );
      })}
    </svg>
  );
}

/** Organic wavy top edge for the bottom sheet, with a thin accent line */
export function SheetCurve({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 64"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="fsl-curve-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bef264" stopOpacity="0" />
          <stop offset=".35" stopColor="#86efac" />
          <stop offset="1" stopColor="#22c55e" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path
        d="M0 44C58 14 124 6 196 26s128 30 194-16V64H0Z"
        fill="#f7f5ee"
      />
      <path
        d="M0 44C58 14 124 6 196 26s128 30 194-16"
        fill="none"
        stroke="url(#fsl-curve-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
