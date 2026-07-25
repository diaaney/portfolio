type Variant = "demos" | "intro" | "details" | "wrap-up";
type Letter = "W" | "O" | "R" | "K" | "A" | "B" | "P" | "U" | "T" | "D" | "E" | "I" | "L" | "S" | "G";

type Crop = { source: Variant; left: number; right: number; frame: number; scale: number; top?: number; height?: number };
type Piece = Crop | { synthetic: "K"; width: number };

// Letterforms are sampled from the original eight-frame films, preserving
// their actual outline, chalk grain, and changes between frames.
const glyphs: Record<Variant, Partial<Record<Letter, [number, number]>>> = {
  demos: { O: [565, 703] },
  intro: { O: [588, 705], T: [405, 502] },
  details: { E: [282, 382], A: [460, 564] },
  "wrap-up": { W: [194, 320], R: [316, 403], A: [399, 489], P: [487, 580], U: [598, 696] },
};

const words: Record<Variant, string> = {
  demos: "WORK",
  intro: "ABOUT",
  details: "DETAILS",
  "wrap-up": "GEAR",
};

const sources: Record<Variant, Partial<Record<Letter, Variant>>> = {
  demos: { W: "wrap-up", O: "demos", R: "wrap-up" },
  intro: { A: "wrap-up", B: "wrap-up", O: "intro", U: "wrap-up", T: "intro" },
  details: {},
  "wrap-up": { G: "intro", E: "details", A: "wrap-up", R: "wrap-up" },
};

const borrowedFrames: Record<Variant, Partial<Record<Variant, number[]>>> = {
  demos: { "wrap-up": [0, 7, 7, 4, 7, 7, 7, 0] },
  intro: { "wrap-up": [0, 1, 2, 3, 4, 5, 7, 0] },
  details: {},
  "wrap-up": {
    intro: [0, 1, 2, 3, 4, 5, 6, 6],
    details: [0, 1, 3, 4, 1, 4, 4, 7],
  },
};

const sourceHeight: Record<Variant, number> = {
  demos: 95, intro: 81, details: 84, "wrap-up": 76,
};

const detailBounds: Partial<Record<Letter, [number, number][]>> = {
  E: [[282, 382], [280, 390], [300, 405], [292, 390], [282, 382], [242, 350], [275, 382], [280, 380]],
  A: [[460, 564], [460, 572], [473, 590], [470, 570], [470, 570], [450, 595], [450, 560], [465, 563]],
};

function pieceFor(variant: Variant, letter: Letter, frame: number): Piece {
  if (letter === "K") {
    return { synthetic: letter, width: sourceHeight[variant] * 1.15 };
  }

  const source = sources[variant][letter]!;
  const sourceFrame = borrowedFrames[variant][source]?.[frame] ?? frame;
  const sourceLetter = letter === "G" ? "O" : letter === "B" ? "P" : letter;
  const [left, right] = source === "details"
    ? detailBounds[sourceLetter]?.[sourceFrame] ?? glyphs[source][sourceLetter]!
    : glyphs[source][sourceLetter]!;
  return {
    source,
    left,
    right,
    frame: sourceFrame,
    scale: sourceHeight[variant] / sourceHeight[source],
  };
}

function pieceWidth(piece: Piece) {
  return "synthetic" in piece ? piece.width : (piece.right - piece.left) * piece.scale;
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

function SyntheticGlyph({ variant, frame, x, width }: {
  variant: Variant; frame: number; x: number; width: number;
}) {
  const outlined = (variant === "demos" && frame === 3) || (variant === "intro" && frame === 4);
  const clean = frame === 0 || frame === 7;
  const height = sourceHeight[variant] * 1.4;
  const shape = "M13 10 H38 V47 L76 10 H105 L63 53 L103 100 H71 L42 65 L38 70 V100 H13 Z";

  return (
    <svg x={x} y={160 - height / 2 + 24} width={width} height={height} viewBox="0 0 110 110" overflow="visible">
      <path
        d={shape}
        fill={outlined ? "none" : "white"}
        stroke={outlined ? "white" : "none"}
        strokeWidth={outlined ? 4.5 : 0}
        strokeLinejoin="round"
        filter={clean || outlined ? undefined : `url(#${variant}-grain-${frame})`}
        transform="skewX(-8) translate(8 0)"
      />
    </svg>
  );
}

function CompositeB({ crop, x, frame }: { crop: Crop; x: number; frame: number }) {
  const width = pieceWidth(crop);
  const outline = frame === 4;
  const clean = frame === 0 || frame === 7;

  return (
    <g>
      <Glyph crop={crop} x={x} />
      <path
        d={`M${x + width * 0.22} 185 C${x + width * 0.65} 182 ${x + width * 0.98} 190 ${x + width * 0.94} 202 C${x + width * 0.92} 217 ${x + width * 0.6} 222 ${x + width * 0.2} 218`}
        fill="none"
        stroke="white"
        strokeWidth={outline ? 4 : 11}
        strokeLinecap="round"
        filter={clean || outline ? undefined : `url(#intro-grain-${frame})`}
      />
    </g>
  );
}

function GearG({ crop, x, frame }: { crop: Crop; x: number; frame: number }) {
  const width = pieceWidth(crop);
  const outlined = frame === 4;
  const clean = frame === 0;

  return (
    <g>
      <Glyph crop={crop} x={x} />
      <path d={`M${x + width * 0.77} 147 H${x + width + 3} V182 H${x + width * 0.78} Z`} fill="black" />
      <path
        d={`M${x + width * 0.55} 178 H${x + width * 0.93} V197 H${x + width * 0.81} V189 H${x + width * 0.55} Z`}
        fill={outlined ? "none" : "white"}
        stroke={outlined ? "white" : "none"}
        strokeWidth={outlined ? 4 : 0}
        filter={clean || outlined ? undefined : `url(#wrap-up-grain-${frame})`}
      />
    </g>
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
  const playback = frame === null ? undefined : { animation: "none", transform: `translateY(-${frame * 12.5}%)` };

  if (variant === "details") {
    return (
      <div className="hand-title" role="img" aria-label="DETAILS, animación original">
        <div className="title-frames" aria-hidden="true" style={{ backgroundImage: "url(/details-sprite.png)", ...playback }} />
      </div>
    );
  }

  return (
    <div className="hand-title" role="img" aria-label={`${words[variant]}, animación ${variant}`}>
      <div className="hand-strip" aria-hidden="true" style={playback}>
        {Array.from({ length: 8 }, (_, frame) => {
          const letters = words[variant].split("") as Letter[];
          const pieces = letters.map((letter) => pieceFor(variant, letter, frame));
          const spacing = 3;
          const width = pieces.reduce((sum, piece) => sum + pieceWidth(piece), 0) + spacing * (pieces.length - 1);
          const start = (976 - width) / 2;
          let x = start;

          return (
            <svg className="hand-slide" key={frame} viewBox="0 0 976 320">
              <defs>
                <filter id={`${variant}-grain-${frame}`} x="-15%" y="-20%" width="130%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.07 0.12" numOctaves="2" seed={frame + 2} result="edge" />
                  <feDisplacementMap in="SourceGraphic" in2="edge" scale="3" xChannelSelector="R" yChannelSelector="G" result="rough" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.34" numOctaves="3" seed={frame + 7} result="noise" />
                  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.333 0.333 0.334 0 0" result="luma" />
                  <feComponentTransfer in="luma" result="grain">
                    <feFuncA type="discrete" tableValues="0.05 0.2 0.65 1 1 1 1 1" />
                  </feComponentTransfer>
                  <feComposite in="rough" in2="grain" operator="in" />
                </filter>
              </defs>
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
                {pieces.map((piece, index) => {
                  const position = x;
                  x += pieceWidth(piece) + spacing;
                  const synthetic = "synthetic" in piece;
                  const outlined = !synthetic && frame === 4 && (variant === "intro" || variant === "wrap-up") && piece.source !== variant && letters[index] !== "G" && letters[index] !== "B";
                  const zigzag = variant === "demos" && frame === 4 && (synthetic || piece.source !== variant);
                  return (
                    <g
                      key={index}
                      filter={outlined ? `url(#${variant}-outline)` : zigzag ? "url(#demos-zigzag)" : undefined}
                      mask={zigzag ? "url(#demos-hatches-mask)" : undefined}
                    >
                      {synthetic ? (
                        <SyntheticGlyph variant={variant} frame={frame} x={position} width={piece.width} />
                      ) : letters[index] === "G" ? (
                        <GearG crop={piece} x={position} frame={frame} />
                      ) : letters[index] === "B" ? (
                        <CompositeB crop={piece} x={position} frame={frame} />
                      ) : (
                        <Glyph crop={piece} x={position} />
                      )}
                      {!synthetic && piece.source === "wrap-up" && frame > 0 && frame < 7 &&
                        ((variant === "demos" && (letters[index] === "W" || letters[index] === "R")) ||
                          (variant === "intro" && letters[index] === "A")) && (
                          <rect x={position} y="0" width={pieceWidth(piece)} height="87" fill="black" />
                        )}
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
