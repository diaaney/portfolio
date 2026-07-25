type Variant = "demos" | "intro" | "details" | "wrap-up";
type Letter = "D" | "I" | "A" | "N" | "E";

type Crop = { source: Variant; left: number; right: number; frame: number; scale: number; top?: number; height?: number };

// Letterforms are sampled from the original eight-frame films, preserving
// their actual outline, chalk grain, and changes between frames.
const glyphs: Record<Variant, Partial<Record<Letter, [number, number]>>> = {
  demos: { D: [175, 306], E: [306, 411] },
  intro: { I: [255, 287], N: [287, 407] },
  details: { D: [160, 282], E: [282, 382], I: [568, 598], A: [460, 564] },
  "wrap-up": { A: [399, 489] },
};

const sources: Record<Variant, Record<Letter, Variant>> = {
  demos: { D: "demos", I: "details", A: "details", N: "intro", E: "demos" },
  intro: { D: "details", I: "intro", A: "details", N: "intro", E: "details" },
  details: { D: "details", I: "details", A: "details", N: "intro", E: "details" },
  "wrap-up": { D: "details", I: "details", A: "wrap-up", N: "intro", E: "details" },
};

const borrowedFrames: Record<Variant, Partial<Record<Variant, number[]>>> = {
  demos: { intro: [0, 1, 2, 4, 1, 5, 6, 7], details: [0, 1, 1, 2, 1, 4, 4, 0] },
  intro: { details: [0, 1, 3, 3, 1, 4, 4, 0] },
  details: { intro: [0, 1, 4, 3, 5, 5, 4, 7] },
  "wrap-up": {
    intro: [0, 1, 2, 3, 1, 5, 6, 6],
    details: [0, 1, 3, 4, 1, 4, 4, 7],
    "wrap-up": [0, 1, 2, 3, 4, 5, 5, 7],
  },
};

const sourceHeight: Record<Variant, number> = {
  demos: 95, intro: 81, details: 84, "wrap-up": 76,
};

const letters: Letter[] = ["D", "I", "A", "N", "E"];

const detailBounds: Partial<Record<Letter, [number, number][]>> = {
  D: [[160, 282], [168, 283], [195, 310], [180, 293], [155, 282], [93, 242], [140, 273], [163, 280]],
  E: [[282, 382], [280, 390], [300, 405], [292, 390], [282, 382], [242, 350], [275, 382], [280, 380]],
  A: [[460, 564], [460, 572], [473, 590], [470, 570], [470, 570], [450, 595], [450, 560], [465, 563]],
  I: [[568, 598], [575, 610], [595, 625], [576, 606], [572, 610], [588, 618], [565, 600], [568, 601]],
};

function cropFor(variant: Variant, letter: Letter, frame: number): Crop {
  const source = sources[variant][letter];
  const sourceFrame = borrowedFrames[variant][source]?.[frame] ?? frame;
  const [left, right] = source === "details"
    ? detailBounds[letter]?.[sourceFrame] ?? glyphs[source][letter]!
    : glyphs[source][letter]!;
  return {
    source,
    left,
    right,
    frame: sourceFrame,
    scale: sourceHeight[variant] / sourceHeight[source],
  };
}

function Glyph({ crop, x }: { crop: Crop; x: number }) {
  const width = (crop.right - crop.left) * crop.scale;
  const sourceHeight = crop.height ?? 190;
  const height = sourceHeight * crop.scale;

  return (
    <svg
      x={x}
      y={160 - height / 2}
      width={width}
      height={height}
      viewBox={`${crop.left} ${crop.frame * 320 + (crop.top ?? 65)} ${crop.right - crop.left} ${sourceHeight}`}
      preserveAspectRatio="none"
      overflow="hidden"
    >
      <image href={`/${crop.source}-sprite.png`} width="976" height="2560" />
    </svg>
  );
}

function Accent({ variant, frame, x, width }: { variant: Variant; frame: number; x: number; width: number }) {
  if (variant === "demos" && frame >= 2 && frame <= 6) {
    return (
      <>
        <Glyph crop={{ source: "demos", left: frame === 4 ? 5 : 70, right: 178, frame, scale: 1 }} x={x - 110} />
        <Glyph crop={{ source: "demos", left: 820, right: frame === 4 ? 970 : 940, frame, scale: 1 }} x={x + width + 2} />
      </>
    );
  }

  if (variant === "intro" && frame >= 4 && frame <= 6) {
    return (
      <>
        <Glyph crop={{ source: "intro", left: 135, right: 245, frame, scale: 1, top: 40, height: 240 }} x={x - 110} />
        <Glyph crop={{ source: "intro", left: 700, right: 815, frame, scale: 1, top: 40, height: 240 }} x={x + width + 5} />
      </>
    );
  }

  return null;
}

export function AnimatedTitle({ variant, frame }: { variant: Variant; frame: number | null }) {
  return (
    <div className="hand-title" role="img" aria-label={`DIANE, animación ${variant}`}>
      <div
        className="hand-strip"
        aria-hidden="true"
        style={frame === null ? undefined : { animation: "none", transform: `translateY(-${frame * 12.5}%)` }}
      >
        {Array.from({ length: 8 }, (_, frame) => {
          const crops = letters.map((letter) => cropFor(variant, letter, frame));
          const spacing = 3;
          const width = crops.reduce((sum, crop) => sum + (crop.right - crop.left) * crop.scale, 0) + spacing * 4;
          const start = (976 - width) / 2;
          let x = start;

          return (
            <svg className="hand-slide" key={frame} viewBox="0 0 976 320">
              {frame === 4 && (variant === "intro" || variant === "wrap-up") && (
                <defs>
                  <filter id={`${variant}-outline`} x="-10%" y="-10%" width="120%" height="120%">
                    <feColorMatrix
                      in="SourceGraphic"
                      type="matrix"
                      values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.333 0.333 0.334 0 0"
                      result="glyph"
                    />
                    <feMorphology in="glyph" operator="erode" radius="4" result="inner" />
                    <feComposite in="glyph" in2="inner" operator="out" />
                  </filter>
                </defs>
              )}
              {variant === "demos" && frame === 4 && (
                <defs>
                  <filter id="demos-zigzag" x="-20%" y="-15%" width="140%" height="130%">
                    <feTurbulence type="turbulence" baseFrequency="0.008 0.18" numOctaves="1" seed="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="21" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                  <pattern id="demos-hatches" patternUnits="userSpaceOnUse" width="20" height="10">
                    <path d="M0 6 L5 2 L10 6 L15 2 L20 6" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
                  </pattern>
                  <mask id="demos-hatches-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="976" height="320">
                    <rect width="976" height="320" fill="url(#demos-hatches)" />
                  </mask>
                </defs>
              )}
              {variant === "wrap-up" && frame === 6 && (
                <defs>
                  <pattern id="wrap-lines" patternUnits="userSpaceOnUse" width="8" height="8">
                    <rect width="8" height="2.8" fill="white" />
                  </pattern>
                  <mask id="wrap-lines-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="976" height="320">
                    <rect width="976" height="320" fill="url(#wrap-lines)" />
                  </mask>
                </defs>
              )}
              <g mask={variant === "wrap-up" && frame === 6 ? "url(#wrap-lines-mask)" : undefined}>
                {crops.map((crop, index) => {
                  const position = x;
                  x += (crop.right - crop.left) * crop.scale + spacing;
                  const outlined = frame === 4 && (variant === "intro" || variant === "wrap-up") && crop.source !== variant;
                  const zigzag = variant === "demos" && frame === 4 && crop.source !== variant;
                  return (
                    <g
                      key={index}
                      filter={outlined ? `url(#${variant}-outline)` : zigzag ? "url(#demos-zigzag)" : undefined}
                      mask={zigzag ? "url(#demos-hatches-mask)" : undefined}
                    >
                      <Glyph crop={crop} x={position} />
                    </g>
                  );
                })}
              </g>
              <Accent variant={variant} frame={frame} x={start} width={width} />
            </svg>
          );
        })}
      </div>
    </div>
  );
}
