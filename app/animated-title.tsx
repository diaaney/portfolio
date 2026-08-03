type Variant = "demos" | "intro" | "details" | "wrap-up";

type Props = {
  variant: Variant;
  frame: number | null;
};

const title = {
  demos: { word: "WORK", width: 500, size: 151, baseline: 231 },
  intro: { word: "ABOUT", width: 500, size: 146, baseline: 231 },
  details: { word: "DETAILS", width: 600, size: 135, baseline: 226 },
  "wrap-up": { word: "GEAR", width: 410, size: 146, baseline: 227 },
} as const;

function Decorations({
  variant,
  frame,
  start,
  end,
}: {
  variant: Variant;
  frame: number;
  start: number;
  end: number;
}) {
  if (variant === "demos") {
    if (frame < 2 || frame === 7) return null;
    if (frame === 4) {
      return (
        <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d={"M" + (start - 69) + " 129 l-14 -20 13 -15 -9 -17 17 -7"} />
          <path d={"M" + (end + 29) + " 133 l14 -14 -8 -16 12 -9 -8 -19"} />
          <path d={"M" + (start - 63) + " 191 l-13 20 14 17 -8 19"} />
          <path d={"M" + (end + 24) + " 199 l15 10 -12 17 13 19"} />
        </g>
      );
    }
    return (
      <g fill="none" stroke="#fff" strokeWidth={frame === 3 ? 7 : 5} strokeLinecap="round">
        <path d={"M" + (start - 34) + " 150 q-15 31 0 66"} />
        {frame > 2 && <path d={"M" + (start - 60) + " 163 q-11 29 -2 51"} />}
        <path d={"M" + (end + 30) + " 150 q19 32 3 69"} />
        {frame > 2 && <path d={"M" + (end + 59) + " 162 q15 26 5 52"} />}
      </g>
    );
  }

  if (variant === "intro") {
    if (frame < 2 || frame === 7) return null;
    const outline = frame === 4;
    const left = start - (frame >= 4 ? 34 : 15);
    const right = end - 22;
    return (
      <g
        fill={outline ? "none" : "#fff"}
        stroke="#fff"
        strokeWidth={outline ? 5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {frame >= 4 && (
          <>
            <path d={"M" + left + " 198 Q" + (left - 19) + " 236 " + (left + 7) + " 260"} fill="none" />
            <path d={"M" + (left - 9) + " 240 q14 25 43 32"} fill="none" strokeWidth="3" />
          </>
        )}
        {frame >= 5 && (
          <path d={"M" + (left - 19) + " 224 q-1 42 28 61"} fill="none" strokeWidth="3" />
        )}
        <path d={"M" + (right - 7) + " 99 l13 4 -2 7 -17 -3 Z"} />
        <path d={"M" + (right + 33) + " 81 l16 7 -5 10 -17 -7 Z"} />
        {frame === 3 || frame === 4 ? (
          <path d={"M" + (right + 73) + " 105 l18 -7 3 16 -21 1 Z"} />
        ) : (
          <path d={"M" + (right + 71) + " 107 l12 -4 -4 8 Z"} />
        )}
      </g>
    );
  }

  if (variant === "details") {
    if (frame !== 5) return null;
    return (
      <g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d={"M" + (start - 31) + " 177 q-11 37 24 72"} />
        <path d={"M" + (start - 51) + " 187 q-2 28 25 52"} />
        <path d={"M" + (start - 70) + " 199 q4 19 19 33"} />
      </g>
    );
  }

  if (frame === 0) return null;
  const marks = [
    { x: start + 19, y: 100, length: 18 },
    { x: start + 64, y: 89, length: 11 },
    { x: start + 110, y: 106, length: 7 },
    { x: end - 103, y: 98, length: 9 },
    { x: end - 46, y: 89, length: 14 },
  ];
  const visible = frame === 1 ? 2 : frame === 2 ? 3 : frame === 3 ? 4 : 5;
  return (
    <g stroke="#fff" strokeWidth="5" strokeLinecap="round">
      {marks.slice(0, visible).map((mark, index) => (
        <path
          key={index}
          d={"M" + mark.x + " " + mark.y + " l" + (index % 2 ? 3 : -2) + " -" + mark.length}
        />
      ))}
    </g>
  );
}

function WordFrame({ variant, frame }: { variant: Variant; frame: number }) {
  const config = title[variant];
  const start = (976 - config.width) / 2;
  const end = start + config.width;
  const roughId = variant + "-rough-" + frame;
  const revealId = variant + "-reveal-" + frame;
  const stripeId = variant + "-stripe-" + frame;
  const clean =
    (variant === "demos" && (frame === 0 || frame === 7)) ||
    (variant === "intro" && (frame === 0 || frame === 7)) ||
    (variant === "details" && frame === 0) ||
    (variant === "wrap-up" && frame === 0);
  const outline =
    (variant === "intro" && frame === 4) ||
    (variant === "wrap-up" && frame === 4);
  const revealWidth = [112, 208, 315, 420, 420, 420, 420, 420][frame];
  const sketch = variant === "details" && (frame === 2 || frame === 6);
  const striped = variant === "wrap-up" && frame === 6;
  const noisy = !clean;

  return (
    <svg className="hand-slide" viewBox="0 0 976 320" role="img" aria-label={config.word}>
      <defs>
        <filter id={roughId} x="-12%" y="-28%" width="124%" height="156%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065 0.11" numOctaves="2" seed={frame + 8} result="edge" />
          <feDisplacementMap in="SourceGraphic" in2="edge" scale={sketch ? 7 : 6} xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.31" numOctaves="3" seed={frame + 17} result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.333 0.333 0.334 0 0"
            result="luma"
          />
          <feComponentTransfer in="luma" result="holes">
            <feFuncA type="discrete" tableValues="0.10 0.28 0.60 0.92 1 1 1 1" />
          </feComponentTransfer>
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
        <clipPath id={revealId}>
          <rect x={start - 12} y="0" width={variant === "wrap-up" ? revealWidth : config.width + 24} height="320" />
        </clipPath>
        <pattern id={stripeId} patternUnits="userSpaceOnUse" width="9" height="9">
          <rect x="0" y="0" width="9" height="5" fill="#fff" />
        </pattern>
        <mask id={stripeId + "-mask"}>
          <rect x="0" y="0" width="976" height="320" fill={striped ? "url(#" + stripeId + ")" : "#fff"} />
        </mask>
      </defs>
      <g clipPath={"url(#" + revealId + ")"} mask={"url(#" + stripeId + "-mask)"}>
        <text
          x="488"
          y={config.baseline}
          textAnchor="middle"
          textLength={config.width}
          lengthAdjust="spacingAndGlyphs"
          fontFamily={sketch ? "Segoe Print, Comic Sans MS, cursive" : "Arial, Helvetica, sans-serif"}
          fontWeight={sketch ? "400" : "900"}
          fontStyle={sketch ? "normal" : "italic"}
          fontSize={config.size}
          fill={outline ? "none" : "#fff"}
          stroke={outline ? "#fff" : "none"}
          strokeWidth={outline ? (sketch ? 4 : 3) : undefined}
          strokeLinejoin="round"
          filter={noisy ? "url(#" + roughId + ")" : undefined}
        >
          {config.word}
        </text>
      </g>
      <Decorations variant={variant} frame={frame} start={start} end={end} />
    </svg>
  );
}

export function AnimatedTitle({ variant, frame }: Props) {
  return (
    <div className="hand-title">
      <div
        className="hand-strip"
        style={frame === null ? undefined : { animation: "none", transform: "translateY(-" + frame * 12.5 + "%)" }}
      >
        {Array.from({ length: 8 }, (_, index) => (
          <WordFrame key={index} variant={variant} frame={index} />
        ))}
      </div>
    </div>
  );
}
