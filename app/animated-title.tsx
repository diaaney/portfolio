import { HandLettering } from "./hand-lettering";

type Variant = "demos" | "intro" | "details" | "wrap-up";
type Props = { variant: Variant; frame: number | null };

const titles = {
  demos: { word: "WORK", x: 238, y: 122, width: 500, height: 130, cleanSize: 170, baseline: 246 },
  intro: { word: "ABOUT", x: 238, y: 125, width: 500, height: 106, cleanSize: 144, baseline: 227 },
  details: { word: "DETAILS", x: 180, y: 122, width: 616, height: 123, cleanSize: 150, baseline: 231 },
  "wrap-up": { word: "GEAR", x: 283, y: 130, width: 410, height: 105, cleanSize: 126, baseline: 220 },
} as const;

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
    if (frame === 4) return (
      <g fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d={"M" + (start - 74) + " 73 l-24 13 15 15 -18 17 16 18 -17 15 15 20 -15 14 17 21 -13 17 13 20 -12 23"} />
        <path d={"M" + (start - 154) + " 108 l-21 16 14 18 -19 18 18 20 -19 20 18 20 -17 18 14 20 -14 18"} />
        <path d={"M" + (start - 200) + " 178 l-13 15 17 15 -15 18 18 21 -12 18"} />
        <path d={"M" + (end + 70) + " 79 l15 16 -12 17 17 17 -13 17 18 19 -14 17 16 19 -13 16 16 23 -15 25"} />
        <path d={"M" + (end + 150) + " 104 l16 16 -15 17 19 19 -13 18 14 20 -12 17 16 21 -12 21"} />
        <path d={"M" + (end + 190) + " 169 l13 14 -15 17 17 19 -14 17 12 20"} />
      </g>
    );
    return (
      <g fill="none" stroke="white" strokeWidth={frame === 3 ? 7 : 5} strokeLinecap="round">
        <path d={"M" + (start - 38) + " 145 Q" + (start - 59) + " 184 " + (start - 38) + " 225"} />
        <path d={"M" + (end + 37) + " 145 Q" + (end + 58) + " 185 " + (end + 37) + " 225"} />
        {(frame === 3 || frame === 5) && <>
          <path d={"M" + (start - 70) + " 148 Q" + (start - 91) + " 184 " + (start - 69) + " 222"} />
          <path d={"M" + (end + 69) + " 147 Q" + (end + 91) + " 184 " + (end + 70) + " 223"} />
        </>}
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
      <g fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d={"M" + (end - 51) + " 61 l17 7"} />
        <path d={"M" + (end + 4) + " 80 l17 11 -9 13"} />
        <path d={"M" + (end + 60) + " 134 l20 -5 -1 17"} />
      </g>
    );
    if (frame === 4) return (
      <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d={"M" + (end - 56) + " 58 l10 -18 20 9 -11 25 Z"} />
        <path d={"M" + (end + 5) + " 51 l16 -24 17 21 -17 30 Z"} />
        <path d={"M" + (end + 70) + " 107 l26 -12 2 25 -27 4 Z"} />
        <path d={"M" + (start - 29) + " 198 C" + (start - 57) + " 241 " + (start - 28) + " 283 " + (start + 1) + " 304"} />
        <path strokeWidth="3" d={"M" + (start - 41) + " 237 Q" + (start - 44) + " 276 " + (start - 5) + " 309"} />
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
  const wearId = "letter-wear-" + id;
  const revealId = "letter-reveal-" + id;
  const stripeId = "letter-stripe-" + id;
  const stripeMaskId = "letter-stripe-mask-" + id;
  const lowerFillId = "letter-lower-fill-" + id;
  const clean = frame === 0 || (frame === 7 && (variant === "demos" || variant === "intro"));
  const revealWidth = [115, 209, 310, 420, 420, 420, 420, 420][frame];
  const isGear = variant === "wrap-up";
  const isStriped = isGear && frame === 6;
  const grainProfile =
    variant === "intro" && frame !== 4
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
        <filter id={roughId} x="-12%" y="-22%" width="124%" height="144%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.11 0.17" numOctaves="2" seed={frame + 13} result="edge" />
          <feDisplacementMap in="SourceGraphic" in2="edge" scale={variant === "details" && frame === 6 ? 5 : 5.5} xChannelSelector="R" yChannelSelector="G" result="rough" />
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
        {!clean && (
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
