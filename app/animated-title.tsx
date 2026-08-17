import { HandLettering } from "./hand-lettering";

type Variant = "demos" | "intro" | "details" | "wrap-up";
type Props = { variant: Variant; frame: number | null };

const titles = {
  demos: { word: "WORK", x: 238, y: 122, width: 500, height: 130, cleanSize: 170, baseline: 246 },
  intro: { word: "ABOUT", x: 238, y: 125, width: 500, height: 106, cleanSize: 144, baseline: 227 },
  details: { word: "DETAILS", x: 180, y: 122, width: 616, height: 123, cleanSize: 150, baseline: 231 },
  "wrap-up": { word: "GEAR", x: 283, y: 130, width: 410, height: 105, cleanSize: 126, baseline: 220 },
} as const;

type PressureStop = readonly [y: number, sweep: number, thickness: number];

function profileAt(profile: readonly PressureStop[], y: number) {
  let next = 1;
  while (next < profile.length - 1 && y > profile[next][0]) next++;
  const [y0, sweep0, thickness0] = profile[next - 1];
  const [y1, sweep1, thickness1] = profile[next];
  const t = Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
  return {
    sweep: sweep0 + (sweep1 - sweep0) * t,
    thickness: thickness0 + (thickness1 - thickness0) * t,
  };
}

function SpaghettiColumn({ points, profile, zigzag, pitch, seed }: {
  points: readonly (readonly [number, number])[];
  profile: readonly PressureStop[];
  zigzag: number;
  pitch: number;
  seed: number;
}) {
  const top = points[0][1];
  const bottom = points[points.length - 1][1];
  const rows = Math.max(2, Math.round((bottom - top) / pitch));
  const turns: [number, number][] = [];

  for (let row = 0; row <= rows; row++) {
    const y = top + row * (bottom - top) / rows +
      (row === 0 || row === rows ? 0 : (noise(seed + row * 37) - 0.5) * 6);
    let next = 1;
    while (next < points.length - 1 && y > points[next][1]) next++;
    const [x0, y0] = points[next - 1];
    const [x1, y1] = points[next];
    const center = x0 + (x1 - x0) * (y - y0) / (y1 - y0) +
      Math.sin(row * 0.72) * zigzag;
    const { sweep } = profileAt(profile, y);
    const radius = sweep * (0.43 + noise(seed + row * 37 + 1) * 0.14);
    turns.push([center + (row % 2 === 0 ? -radius : radius), y]);
  }

  const samples: [number, number][] = [];
  for (let turn = 0; turn < turns.length - 1; turn++) {
    const p0 = turns[Math.max(0, turn - 1)];
    const p1 = turns[turn];
    const p2 = turns[turn + 1];
    const p3 = turns[Math.min(turns.length - 1, turn + 2)];
    for (let step = 0; step < 8; step++) {
      const t = step / 8;
      const t2 = t * t;
      const t3 = t2 * t;
      const interpolate = (axis: 0 | 1) => 0.5 * (
        2 * p1[axis] + (-p0[axis] + p2[axis]) * t +
        (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
        (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
      );
      samples.push([interpolate(0), interpolate(1)]);
    }
  }
  samples.push(turns[turns.length - 1]);

  // Fill a ribbon around the centerline so each turn can gain or lose pressure.
  const left: string[] = [];
  const right: string[] = [];
  for (let index = 0; index < samples.length; index++) {
    const [x, y] = samples[index];
    const before = samples[Math.max(0, index - 1)];
    const after = samples[Math.min(samples.length - 1, index + 1)];
    const dx = after[0] - before[0];
    const dy = after[1] - before[1];
    const distance = Math.hypot(dx, dy) || 1;
    const taper = 0.72 + 0.28 * Math.min(1, index / 4, (samples.length - 1 - index) / 4);
    const pressure = profileAt(profile, y).thickness * 1.4 *
      (1 + 0.18 * Math.sin(index * 0.43 + seed)) * taper / 2;
    const offsetX = -dy / distance * pressure;
    const offsetY = dx / distance * pressure;
    left.push(`${(x + offsetX).toFixed(1)} ${(y + offsetY).toFixed(1)}`);
    right.push(`${(x - offsetX).toFixed(1)} ${(y - offsetY).toFixed(1)}`);
  }
  const outline = `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
  return <path d={outline} fill="white" />;
}

function WordMarks({ variant, frame, start, end }: {
  variant: Variant; frame: number; start: number; end: number;
}) {
  if (variant === "demos") {
    if (frame < 2 || frame === 7) return null;
    if (frame === 2) return (
      <g fill="none" stroke="white" strokeWidth="17" strokeLinecap="round">
        <path d={"M" + (start - 31) + " 159 C" + (start - 43) + " 170 " + (start - 43) + " 190 " + (start - 31) + " 203"} />
        <path d={"M" + (end + 31) + " 166 C" + (end + 43) + " 177 " + (end + 43) + " 197 " + (end + 31) + " 210"} />
        <path d={"M" + (start - 70) + " 190 l-4 2 M" + (end + 70) + " 191 l4 1"} strokeWidth="5" />
      </g>
    );
    if (frame === 3) return (
      <g fill="none" stroke="white" strokeWidth="20.5" strokeLinecap="round">
        <path d={"M" + (start - 38) + " 128 Q" + (start - 59) + " 184 " + (start - 38) + " 242"} />
        <path d={"M" + (end + 37) + " 128 Q" + (end + 58) + " 185 " + (end + 37) + " 242"} />
        <path d={"M" + (start - 83) + " 164 Q" + (start - 95) + " 184 " + (start - 82) + " 208"} strokeWidth="15.5" />
        <path d={"M" + (end + 82) + " 163 Q" + (end + 95) + " 184 " + (end + 83) + " 209"} strokeWidth="15.5" />
      </g>
    );
    if (frame === 4) return (
      <g>
        <SpaghettiColumn points={[[start - 102, 72], [start - 128, 91], [start - 119, 111], [start - 159, 148]]} profile={[[72, 11, 4], [95, 20, 6], [122, 29, 10], [148, 27, 8]]} zigzag={7} pitch={12} seed={1100} />
        <SpaghettiColumn points={[[start - 177, 179], [start - 183, 217], [start - 169, 246], [start - 157, 269]]} profile={[[179, 11, 4], [210, 27, 8], [240, 39, 11], [269, 22, 6]]} zigzag={7} pitch={11.5} seed={1300} />
        <SpaghettiColumn points={[[start - 76, 145], [start - 95, 177], [start - 82, 201], [start - 101, 234], [start - 79, 267], [start - 61, 297]]} profile={[[145, 31, 10], [178, 33, 9], [215, 16, 4], [238, 15, 4], [273, 29, 9], [297, 25, 6]]} zigzag={8} pitch={12} seed={1500} />
        <SpaghettiColumn points={[[end + 47, 107], [end + 54, 163], [end + 52, 216]]} profile={[[107, 17, 5], [170, 28, 8], [193, 38, 11], [216, 18, 5]]} zigzag={5} pitch={14.5} seed={1700} />
        <SpaghettiColumn points={[[end + 59, 233], [end + 73, 271], [end + 70, 307]]} profile={[[233, 18, 6], [255, 32, 10], [281, 18, 6], [307, 7, 3]]} zigzag={5} pitch={13.5} seed={1900} />
        <SpaghettiColumn points={[[end + 148, 137], [end + 155, 194], [end + 151, 263]]} profile={[[137, 23, 8], [191, 12, 4], [224, 10, 4], [263, 31, 10]]} zigzag={4} pitch={15.5} seed={2100} />
      </g>
    );
    if (frame === 5) return (
      <g fill="none" stroke="white" strokeLinecap="round">
        <path d={`M${start - 53} 138 Q${start - 69} 182 ${start - 54} 226`} strokeWidth="14.5" />
        <path d={`M${start - 132} 165 Q${start - 124} 181 ${start - 126} 192`} strokeWidth="7.5" />
        <path d={`M${end + 65} 143 Q${end + 72} 178 ${end + 61} 224`} strokeWidth="11.5" />
        <path d={`M${end + 105} 177 Q${end + 117} 200 ${end + 109} 223`} strokeWidth="8.4" />
      </g>
    );
    // The third frame's marks turn upside down and exchange sides here.
    return (
      <g fill="none" stroke="white" strokeLinecap="round">
        <path d={`M${start - 53} 163 C${start - 63} 180 ${start - 63} 204 ${start - 55} 225`} strokeWidth="8.5" />
        <path d={`M${start - 101} 180 Q${start - 96} 182 ${start - 100} 185`} strokeWidth="7.5" />
        <path d={`M${end + 49} 146 Q${end + 67} 170 ${end + 50} 195`} strokeWidth="14" />
        <path d={`M${end + 103} 157 Q${end + 111} 165 ${end + 107} 173`} strokeWidth="6.5" />
      </g>
    );
  }

  if (variant === "intro") {
    if (frame < 2 || frame === 7) return null;
    if (frame === 2) return (
      <g fill="none" stroke="white" strokeWidth="6" strokeLinecap="round">
        <path d={"M" + (end - 49) + " 94 l17 5"} />
        <path d={"M" + (end + 4) + " 105 l14 9"} />
        <path d={"M" + (end + 31) + " 135 l3 13"} />
      </g>
    );
    if (frame === 3) return (
      <g fill="white" strokeLinejoin="round">
        <path d={`M${end - 51} 95 L${end - 45} 75 L${end - 39} 63 L${end - 28} 60 L${end - 16} 65 L${end - 24} 91 L${end - 29} 99 L${end - 43} 98 Z`} />
        <path d={`M${end + 3} 105 L${end + 13} 77 L${end + 21} 75 L${end + 42} 88 L${end + 44} 96 L${end + 35} 110 L${end + 17} 117 Z`} />
        <path d={`M${end + 31} 140 L${end + 61} 126 L${end + 71} 129 L${end + 74} 145 L${end + 43} 158 L${end + 33} 157 Z`} />
      </g>
    );
    if (frame === 4) return (
      <g fill="none" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${end - 49} 55 L${end - 27} 50 L${end - 5} 59 L${end - 18} 87 L${end - 50} 80 Z`} />
        <path d={`M${end + 11} 97 L${end + 39} 28 L${end + 66} 47 L${end + 45} 105 L${end + 24} 100 Z`} />
        <path d={`M${end + 49} 132 L${end + 97} 116 L${end + 104} 150 L${end + 55} 155 Z`} />
        <path strokeWidth="5" d={`M${start - 17} 200 C${start - 43} 228 ${start - 37} 266 ${start + 22} 296`} />
        <path strokeWidth="3.3" d={`M${start - 41} 276 C${start - 37} 288 ${start - 21} 302 ${start - 4} 309`} />
      </g>
    );
    if (frame === 5) return (
      <g fill="none" stroke="white" strokeWidth="7" strokeLinecap="round">
        <path d={"M" + (end - 48) + " 48 l-2 -30"} />
        <path d={"M" + (end + 9) + " 79 l22 -27"} />
        <path d={"M" + (end + 74) + " 138 l16 -3"} />
        <path d={"M" + (start - 48) + " 192 C" + (start - 90) + " 238 " + (start - 62) + " 281 " + (start - 20) + " 302"} />
        <path strokeWidth="5" d={"M" + (start - 67) + " 206 C" + (start - 107) + " 244 " + (start - 78) + " 283 " + (start - 35) + " 303"} />
        <path strokeWidth="4" d={"M" + (start - 95) + " 240 Q" + (start - 98) + " 272 " + (start - 70) + " 287"} />
      </g>
    );
    return (
      <g fill="none" stroke="white" strokeWidth="6" strokeLinecap="round">
        <path d={"M" + (end - 32) + " 50 l1 -26"} />
        <path d={"M" + (end + 25) + " 68 l17 -28"} />
        <path strokeWidth="3" d={"M" + (end + 88) + " 132 l4 -2"} />
        <path d={"M" + (start - 45) + " 204 C" + (start - 70) + " 245 " + (start - 45) + " 275 " + (start - 10) + " 291"} />
        <path strokeWidth="4" d={"M" + (start - 60) + " 234 C" + (start - 76) + " 260 " + (start - 55) + " 281 " + (start - 33) + " 291"} />
      </g>
    );
  }

  if (variant === "details") {
    if (frame !== 5) return null;
    return (
      <g fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
        <path d={"M" + (start - 40) + " 162 C" + (start - 66) + " 181 " + (start - 47) + " 220 " + (start - 20) + " 239"} />
        <path d={"M" + (start - 67) + " 170 C" + (start - 88) + " 191 " + (start - 69) + " 218 " + (start - 43) + " 232"} />
      </g>
    );
  }

  if (frame === 0) return null;
  const progress = [0, 0.10, 0.31, 0.49, 0.67, 0.84, 0.96, 1][frame];
  const center = start + (end - start) * progress;
  return (
    <g fill="none" stroke="white" strokeLinecap="round">
      <path d={"M" + (center - 19) + " 93 l4 -17"} strokeWidth="5" />
      <path d={"M" + (center + 4) + " 105 l18 -2"} strokeWidth="3.5" />
      {frame >= 2 && <path d={"M" + (center + 27) + " 69 l4 -16"} strokeWidth="5" />}
      {frame >= 3 && <path d={"M" + (center - 39) + " 116 l15 -3"} strokeWidth="3" />}
      {frame >= 4 && <path d={"M" + (center - 28) + " 74 l3 -11"} strokeWidth="4" />}
      {frame >= 5 && <path d={"M" + (center + 10) + " 51 l3 -10"} strokeWidth="4" />}
    </g>
  );
}

function noise(seed: number) {
  let value = Math.imul(seed + 0x9e3779b9, 1664525) + 1013904223;
  value ^= value >>> 16;
  value = Math.imul(value, 2246822519);
  value ^= value >>> 13;
  return (value >>> 0) / 4294967296;
}

function ChalkWear({ frame, start, y, width, height }: {
  frame: number; start: number; y: number; width: number; height: number;
}) {
  return (
    <g strokeLinecap="round">
      {Array.from({ length: 550 }, (_, index) => {
        const key = frame * 10000 + index * 13;
        const px = start + noise(key + 1) * width;
        const py = y + noise(key + 2) * height;
        const length = 1 + noise(key + 3) * (index % 19 === 0 ? 14 : 6);
        const shade = index % 11 === 0 ? "#000" : index % 3 === 0 ? "#555" : "#888";
        return (
          <path
            key={index}
            d={"M" + px + " " + py + " l" + length + " " + (noise(key + 4) - .5) * 2}
            stroke={shade}
            strokeWidth={0.6 + noise(key + 5) * 1.5}
          />
        );
      })}
    </g>
  );
}

function WordFrame({ variant, frame }: { variant: Variant; frame: number }) {
  const title = titles[variant];
  const id = variant + "-" + frame;
  const roughId = "letter-rough-" + id;
  const softId = "letter-soft-" + id;
  const wearId = "letter-wear-" + id;
  const revealId = "letter-reveal-" + id;
  const stripeId = "letter-stripe-" + id;
  const stripeMaskId = "letter-stripe-mask-" + id;
  const lowerFillId = "letter-lower-fill-" + id;
  const clean = frame === 0 || (frame === 7 && (variant === "demos" || variant === "intro"));
  const softenWork = variant === "demos" && (frame === 0 || frame === 7);
  const isWorkSpaghetti = variant === "demos" && frame === 4;
  const revealWidth = [115, 209, 310, 420, 420, 420, 420, 420][frame];
  const isGear = variant === "wrap-up";
  const isStriped = isGear && frame === 6;
  const grainProfile =
    isWorkSpaghetti
      ? "0.32 0.45 0.58 0.68 0.78 0.86 0.92 0.96 1 1 1 1"
      : variant === "intro" && frame !== 4
        ? "0.03 0.12 0.30 0.55 0.76 0.87 1 1 1 1 1 1"
        : variant === "details" && frame === 1
          ? "0.04 0.26 0.55 0.80 0.95 0.97 1 1 1 1 1 1"
          : (variant === "details" && (frame === 3 || frame === 4)) ||
              (isGear && frame >= 3 && frame !== 6)
            ? "0.03 0.17 0.40 0.66 0.83 0.91 0.96 1 1 1 1 1"
            : "0.04 0.26 0.55 0.80 0.90 0.97 1 1 1 1 1 1";

  return (
    <svg className="hand-slide" viewBox="0 0 976 320" role="img" aria-label={title.word}>
      <defs>
        {softenWork && (
          <filter id={softId} x="-3%" y="-6%" width="106%" height="112%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        )}
        <filter id={roughId} x="-12%" y="-22%" width="124%" height="144%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.11 0.17" numOctaves="2" seed={frame + 13} result="edge" />
          <feDisplacementMap in="SourceGraphic" in2="edge" scale={isWorkSpaghetti ? 4 : variant === "details" && frame === 6 ? 5 : 5.5} xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.67" numOctaves="2" seed={frame + 25} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .334 0 0" result="luma" />
          <feComponentTransfer in="luma" result="scratch">
            <feFuncA type="discrete" tableValues={grainProfile} />
          </feComponentTransfer>
          <feComposite in="rough" in2="scratch" operator="in" />
        </filter>
        <mask id={wearId} maskUnits="userSpaceOnUse" x="0" y="0" width="976" height="320">
          <HandLettering word={title.word} variant={variant} frame={frame} x={title.x} y={title.y} width={title.width} height={title.height} idPrefix={"wear-" + id} />
        </mask>
        <clipPath id={revealId}>
          <rect x={title.x - 8} y="0" width={isGear ? revealWidth : title.width + 16} height="320" />
        </clipPath>
        <clipPath id={lowerFillId}>
          <rect x={title.x - 8} y="185" width={title.width + 16} height="51" />
        </clipPath>
        <pattern id={stripeId} patternUnits="userSpaceOnUse" width="976" height="320">
          {Array.from({ length: 40 }, (_, line) => (
            <g key={line}>
              <rect x="0" y={line * 8} width="976" height={3.8 + noise(line + 201) * 1.6} fill="white" />
              {Array.from({ length: 6 }, (_, gap) => (
                <rect
                  key={gap}
                  x={noise(line * 29 + gap + 301) * 976}
                  y={line * 8}
                  width={2 + noise(line * 37 + gap + 401) * 12}
                  height="6"
                  fill="black"
                />
              ))}
            </g>
          ))}
        </pattern>
        <mask id={stripeMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="976" height="320">
          <rect x="0" y="0" width="976" height="320" fill={isStriped ? "url(#" + stripeId + ")" : "white"} />
        </mask>
      </defs>
      <g clipPath={"url(#" + revealId + ")"} mask={"url(#" + stripeMaskId + ")"}>
        {clean ? (
          <text
            x={title.x + title.width / 2}
            y={title.baseline}
            textAnchor="middle"
            textLength={title.width}
            lengthAdjust="spacingAndGlyphs"
            fontFamily={isGear ? "Segoe UI Black, Arial, sans-serif" : "Arial, Helvetica, sans-serif"}
            fontWeight="900"
            fontStyle="italic"
            fontSize={title.cleanSize}
            fill="white"
            filter={softenWork ? `url(#${softId})` : undefined}
          >
            {title.word}
          </text>
        ) : (
          <g filter={"url(#" + roughId + ")"}>
            {isGear && frame === 4 && (
              <g clipPath={"url(#" + lowerFillId + ")"} opacity="0.8">
                <HandLettering word={title.word} variant={variant} frame={5} x={title.x} y={title.y} width={title.width} height={title.height} idPrefix={"lower-" + id} />
              </g>
            )}
            <HandLettering word={title.word} variant={variant} frame={frame} x={title.x} y={title.y} width={title.width} height={title.height} idPrefix={"display-" + id} />
          </g>
        )}
        {!clean && !isWorkSpaghetti && (
          <g mask={"url(#" + wearId + ")"}>
            <ChalkWear frame={frame} start={title.x} y={title.y} width={title.width} height={title.height} />
          </g>
        )}
      </g>
      <g filter={clean ? undefined : "url(#" + roughId + ")"}>
        <WordMarks variant={variant} frame={frame} start={title.x} end={title.x + title.width} />
      </g>
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
