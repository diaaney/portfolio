/**
 * Letterforms drawn as paths so the animated frames can change words without
 * cutting glyphs out of the reference artwork. Coordinates use a 100-unit
 * cap height; the caller places the whole word in the requested SVG box.
 */
type Variant = "demos" | "intro" | "details" | "wrap-up";

type Props = {
  word: string;
  variant: Variant;
  frame: number;
  x: number;
  y: number;
  width: number;
  height: number;
  idPrefix?: string;
};

type Glyph = { advance: number; strokes: readonly string[] };

// Each stroke is an authored pen gesture. Slightly uneven curves and terminals
// are deliberate: the chalk frames in the reference are redrawn by hand.
const glyphs: Record<string, Glyph> = {
  A: {
    advance: 70,
    strokes: [
      "M5 83 C13 58 22 31 34 7 C35 5 37 5 39 9 C48 33 55 59 63 83",
      "M16 58 C27 53 43 53 53 56",
    ],
  },
  B: {
    advance: 68,
    strokes: [
      "M10 84 C12 60 13 28 17 8",
      "M17 8 C42 5 58 15 55 31 C52 45 35 46 12 46",
      "M13 46 C39 42 61 52 57 68 C54 81 35 86 10 84",
    ],
  },
  D: {
    advance: 70,
    strokes: [
      "M10 82 C12 57 15 31 19 8",
      "M19 8 C48 7 64 21 63 43 C62 65 43 83 10 82",
    ],
  },
  E: {
    advance: 63,
    strokes: [
      "M55 9 C41 6 27 7 15 9 L8 82 C22 84 42 81 56 81",
      "M12 45 C24 44 37 42 49 43",
    ],
  },
  G: {
    advance: 73,
    strokes: [
      "M62 21 C51 6 29 2 16 12 C4 20 3 40 7 57 C11 75 23 84 41 82 C56 81 64 71 65 55",
      "M65 55 C55 54 45 53 38 54",
    ],
  },
  I: { advance: 29, strokes: ["M17 8 C14 31 10 60 8 83"] },
  K: {
    advance: 68,
    strokes: [
      "M17 7 C14 32 10 61 8 83",
      "M61 8 C46 25 31 41 13 51",
      "M33 41 C41 53 52 70 61 83",
    ],
  },
  L: {
    advance: 64,
    strokes: ["M17 7 C13 30 9 59 8 81 C25 82 43 79 58 81"],
  },
  O: {
    advance: 73,
    strokes: [
      "M39 7 C20 3 9 18 7 37 C4 57 12 78 29 82 C48 87 64 72 67 51 C70 29 61 10 39 7 Z",
    ],
  },
  R: {
    advance: 70,
    strokes: [
      "M10 83 C13 59 15 31 18 8",
      "M18 8 C45 5 60 16 57 31 C54 46 38 50 13 48",
      "M36 49 C43 58 54 72 61 83",
    ],
  },
  S: {
    advance: 69,
    strokes: [
      "M61 17 C51 5 28 3 16 13 C7 20 6 32 14 40 C22 47 43 48 54 56 C66 65 55 81 36 83 C20 85 10 78 7 70",
    ],
  },
  T: {
    advance: 67,
    strokes: [
      "M7 9 C23 7 43 5 63 8",
      "M37 8 C34 32 29 60 27 83",
    ],
  },
  U: {
    advance: 73,
    strokes: [
      "M14 8 C9 28 7 49 10 64 C12 77 22 84 36 83 C53 82 60 72 64 56 C67 42 67 24 69 8",
    ],
  },
  W: {
    advance: 85,
    strokes: [
      "M8 8 C8 32 8 59 14 82 C24 66 31 45 39 26 C38 47 41 68 48 82 C61 65 68 36 77 8",
    ],
  },
};

// The fourth WORK frame bends each pen stroke, not only the whole letters.
const bentWork: Partial<Record<string, readonly string[]>> = {
  W: [
    "M8 8 C5 23 12 33 9 48 C8 62 12 76 15 83 C24 71 31 46 40 27 C38 41 41 58 46 72 Q47 79 49 82 C57 74 60 57 68 35 C72 23 74 18 78 8",
  ],
  O: [
    "M38 9 C24 3 11 18 10 32 Q7 39 8 47 C5 60 15 78 29 82 Q41 89 53 74 C64 68 67 48 66 39 C65 24 59 13 46 9 Q42 7 38 9 Z",
  ],
  R: [
    "M16 9 C14 23 17 35 14 46 Q14 63 11 83",
    "M17 9 C33 3 53 10 57 24 Q62 38 50 43 C40 50 26 48 14 46",
    "M34 48 Q41 54 46 63 C52 73 59 77 62 82",
  ],
  K: [
    "M18 8 C15 19 18 31 14 43 C13 57 8 68 10 83",
    "M62 8 Q54 16 48 25 C36 38 26 45 14 51",
    "M32 42 Q38 49 43 59 C48 68 56 76 62 83",
  ],
};

// The last DETAILS drawing briefly turns into softer, wandering outlines.
const looseDetails: Partial<Record<string, readonly string[]>> = {
  A: [
    "M8 83 C16 65 18 31 34 9 C44 19 43 40 54 53 C61 63 58 74 63 83",
    "M17 61 C30 51 40 64 54 57",
  ],
  D: [
    "M13 13 C23 4 42 5 48 11 C52 16 50 24 57 33 C67 45 62 53 55 61 C50 67 54 73 43 81 C29 89 12 82 9 72 C6 61 17 54 15 44 C12 35 3 26 13 13 Z",
  ],
  E: [
    "M55 11 C36 0 19 13 16 19 C5 27 17 40 14 47 C6 61 7 77 15 83 C30 73 43 89 58 78",
    "M14 45 C29 37 41 51 54 43",
  ],
  I: ["M17 8 C8 25 17 41 9 58 C4 67 13 76 8 84"],
  L: ["M17 8 C10 26 17 39 9 52 C4 62 6 70 8 82 C24 77 30 88 41 80 C50 75 54 84 61 82"],
  S: [
    "M60 19 C45 -2 27 13 15 12 C8 15 5 27 13 36 C19 44 31 44 45 50 C60 58 63 68 51 79 C40 91 26 74 17 83 C11 80 7 74 8 69",
  ],
  T: [
    "M5 13 C18 2 24 17 34 10 C46 4 51 15 62 8",
    "M34 12 C23 28 28 39 25 53 C21 67 29 74 28 83",
  ],
};

const thinDetails: Partial<Record<string, readonly string[]>> = {
  D: ["M10 82 C13 52 20 27 24 8", "M24 8 Q55 17 62 46 Q55 68 10 82"],
  E: ["M57 9 Q37 4 17 11 L7 81 Q31 75 56 82", "M12 45 Q30 40 51 44"],
  T: ["M5 12 Q30 5 62 10", "M38 10 Q28 40 24 83"],
  A: ["M6 83 Q19 44 36 7 Q52 42 63 82", "M19 57 Q34 54 51 60"],
  I: ["M18 7 Q14 35 8 83"],
  L: ["M18 8 Q9 50 8 81 Q30 77 60 81"],
  S: ["M60 19 Q47 3 28 9 Q9 17 13 30 Q17 43 41 51 C66 60 56 76 42 81 Q23 87 8 72"],
};

// The first brush pass has open, quick shoulders; the fifth is heavier and
// more angular. The skinny and wobbly passes above keep their own outlines.
const brushDetails: Partial<Record<string, readonly string[]>> = {
  D: [
    "M18 8 C14 29 9 58 7 82",
    "M18 8 C46 7 64 24 59 44 C54 67 36 78 7 82",
  ],
  E: [
    "M55 9 C39 8 27 8 15 11 C13 30 8 60 6 80 C26 81 42 78 56 79",
    "M11 45 Q30 40 49 44",
  ],
  T: ["M7 11 Q38 4 64 9", "M37 8 C32 29 31 63 26 82"],
  A: [
    "M5 81 Q20 37 36 7 Q52 31 62 82",
    "M18 61 Q32 54 53 55",
  ],
  I: ["M19 7 Q15 32 8 82"],
  L: ["M19 8 Q11 44 8 80 Q27 79 57 78"],
  S: ["M58 17 C46 3 24 5 14 18 C5 31 17 42 38 49 C58 54 62 68 52 78 C40 88 20 81 8 70"],
};

const energeticDetails: Partial<Record<string, readonly string[]>> = {
  D: [
    "M15 9 C12 32 8 59 7 84",
    "M15 9 C44 4 64 19 63 43 C62 68 38 84 7 84",
  ],
  E: [
    "M56 9 C43 6 26 10 15 9 L7 81 Q33 82 57 79",
    "M12 45 C27 45 38 41 51 45",
  ],
  T: ["M6 11 Q34 6 65 9", "M36 8 C31 33 29 60 27 83"],
  A: [
    "M6 83 C14 56 25 24 36 8 C47 32 55 59 63 83",
    "M17 58 C31 50 45 56 54 54",
  ],
  I: ["M18 7 C17 29 9 60 8 83"],
  L: ["M19 7 C14 32 8 60 8 82 Q33 78 59 82"],
  S: ["M60 17 C48 5 27 4 15 16 C7 25 7 35 17 42 C30 50 49 49 56 61 C64 73 50 84 32 83 C21 83 11 78 7 70"],
};

const solidDetails: Record<number, Partial<Record<string, readonly string[]>>> = {
  3: {
    D: ["M14 8 C12 29 9 56 8 82", "M14 8 C42 8 64 22 61 43 C59 66 39 84 8 82"],
    E: ["M56 10 Q37 7 16 9 L8 81 Q32 80 58 81", "M10 45 Q29 41 49 43"],
    A: ["M7 83 Q18 48 34 9 Q50 43 63 83", "M18 58 Q37 54 52 57"],
    S: ["M60 18 Q48 5 30 8 Q11 11 12 28 C12 40 28 45 41 50 C61 57 60 71 47 80 Q27 88 8 70"],
  },
  4: {
    D: ["M13 8 L8 82", "M13 8 Q44 5 59 22 Q69 35 59 58 Q49 78 8 82"],
    E: ["M55 8 Q34 9 16 10 L7 82 Q33 81 58 79", "M10 43 Q31 46 48 43"],
    T: ["M5 10 Q31 7 63 8", "M36 9 Q32 45 27 83"],
    A: ["M6 82 Q20 38 35 7 Q50 35 62 82", "M18 57 Q36 55 51 57"],
    S: ["M60 18 C46 3 24 5 14 17 C6 29 13 38 33 46 C58 55 64 69 48 80 C35 89 17 78 8 70"],
  },
  7: {
    D: ["M15 8 C11 36 8 58 7 82", "M15 8 Q46 5 61 25 Q68 45 54 66 Q41 82 7 82"],
    E: ["M56 8 Q37 7 16 10 L8 82 Q32 82 56 80", "M12 45 Q31 43 50 44"],
    A: ["M5 83 Q21 40 36 8 Q53 44 63 83", "M17 59 Q33 54 52 56"],
    S: ["M59 17 Q45 4 27 8 Q10 12 12 28 C15 42 38 47 50 55 C63 65 57 80 39 82 Q20 85 8 70"],
  },
};

const gearOutline: Partial<Record<string, readonly string[]>> = {
  G: ["M62 21 Q48 5 29 9 Q8 14 7 38 Q5 63 18 76 Q32 89 51 78 Q63 69 64 54", "M64 54 Q51 51 38 54"],
  E: ["M55 9 Q36 7 16 9 L8 82 Q35 82 56 79", "M11 44 Q30 42 49 44"],
  A: ["M5 83 Q18 43 35 7 Q50 39 63 83", "M17 57 Q37 53 53 57"],
  R: ["M10 82 L17 8", "M17 8 Q45 3 57 19 Q64 33 51 43 Q38 52 12 47", "M34 48 Q49 69 61 83"],
};

const gearStriped: Partial<Record<string, readonly string[]>> = {
  G: ["M61 21 C47 5 22 5 11 22 C2 39 6 61 18 75 C30 87 53 84 63 64 L64 54", "M64 54 L38 54"],
  E: ["M56 9 L16 9 L8 82 L57 82", "M12 45 L50 45"],
  A: ["M5 82 L35 8 L63 82", "M17 58 L53 58"],
  R: ["M10 82 L17 9", "M17 9 C47 5 60 17 56 32 C53 47 36 50 12 48", "M35 49 L61 82"],
};

// The fifth WORK drawing winds visible horizontal chalk lines around the
// hand-drawn letter paths, with the gaps between passes left intact.
const scribbleWork: Partial<Record<string, readonly string[]>> = {
  W: [
    "M7 8 L13 12 L6 16 L14 20 L7 24 L14 28 L8 33 L15 37 L9 42 L16 47 L11 52 L19 57 L14 62 L22 68 L18 73 L25 82",
    "M25 82 L27 74 L26 68 L32 65 L29 58 L35 55 L33 49 L39 45 L35 40 L41 36 L38 29",
    "M38 29 L43 36 L39 41 L46 47 L41 52 L48 57 L45 63 L51 68 L49 74 L55 82",
    "M55 82 L57 73 L54 68 L62 63 L58 57 L65 52 L61 47 L69 41 L65 36 L73 30 L70 24 L77 8",
  ],
  O: [
    "M36 7 L43 10 L47 7 L53 14 L57 13 L60 21 L65 24 L63 31 L69 36 L65 42 L69 48 L64 53 L67 59 L60 64 L61 69 L53 72 L52 78 L43 77 L40 83 L32 79 L27 84 L21 77 L16 79 L14 71 L8 68 L11 61 L5 56 L9 50 L5 43 L10 38 L7 31 L13 26 L11 21 L18 18 L19 13 L27 13 L30 8 Z",
  ],
  R: [
    "M14 7 L20 11 L12 16 L19 21 L11 26 L17 31 L10 36 L17 41 L9 47 L16 52 L8 57 L15 63 L7 68 L13 74 L8 83",
    "M14 8 L24 12 L30 7 L36 13 L43 10 L49 16 L55 17 L54 24 L60 27 L55 33 L58 38 L51 42 L47 47 L39 44 L34 50 L26 46 L17 50",
    "M34 49 L42 54 L39 59 L48 64 L45 68 L55 73 L52 77 L61 83",
  ],
  K: [
    "M15 7 L21 13 L13 17 L19 22 L11 27 L18 32 L10 37 L17 42 L8 48 L15 54 L7 59 L14 65 L6 70 L13 76 L8 83",
    "M63 8 L57 14 L60 19 L51 23 L54 28 L45 32 L49 37 L39 41 L42 47 L32 50 L35 55 L23 57 L17 51",
    "M33 46 L41 51 L38 56 L47 62 L45 67 L53 72 L51 77 L62 83",
  ],
};

function scratchHash(seed: number) {
  let value = Math.imul(seed + 0x9e3779b9, 1664525);
  value ^= value >>> 16;
  return value >>> 0;
}

function spaghettiStrokes(paths: readonly string[], letterIndex: number) {
  return paths.map((path, pathIndex) => {
    const coordinates = (path.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    const points: [number, number][] = [];
    for (let index = 0; index < coordinates.length; index += 2) {
      points.push([coordinates[index], coordinates[index + 1]]);
    }

    let strokes = "";
    for (let row = 0; row < points.length; row++) {
      const [baseX, baseY] = points[row];
      const seed = letterIndex * 100003 + pathIndex * 7001 + row * 223;
      const span = 18 + scratchHash(seed + 1) % 9;
      const x = baseX + (scratchHash(seed + 2) % 7 - 3) * 0.65;
      const y = baseY + (scratchHash(seed + 3) % 5 - 2) * 0.55;
      const bend = (scratchHash(seed + 4) % 9 - 4) * 0.7;
      const tilt = (scratchHash(seed + 5) % 7 - 3) * 0.4;
      strokes += `M${(x - span / 2).toFixed(1)} ${y.toFixed(1)} ` +
        `l${(span * 0.52).toFixed(1)} ${bend.toFixed(1)} ` +
        `l${(span * 0.48).toFixed(1)} ${(tilt - bend).toFixed(1)} `;

      if (scratchHash(seed + 6) % 4 === 0) {
        const echo = span * 0.57;
        strokes += `M${(x - echo / 2 + 1).toFixed(1)} ${(y + 2.3).toFixed(1)} ` +
          `l${echo.toFixed(1)} ${(tilt * 0.55).toFixed(1)} `;
      }
    }
    return strokes;
  });
}

function SpaghettiLetter({ paths, letterIndex }: {
  paths: readonly string[];
  letterIndex: number;
}) {
  return (
    <g stroke="white" strokeLinecap="round" strokeLinejoin="round">
      {spaghettiStrokes(paths, letterIndex).map((d, index) => (
        <path
          key={index}
          d={d}
          strokeWidth={3.5 + (scratchHash(index * 37 + letterIndex * 71) % 7) * 0.19}
        />
      ))}
    </g>
  );
}

function isOutline(variant: Variant, frame: number) {
  return (variant === "intro" || variant === "wrap-up") && frame === 4;
}

// The photographed DETAILS animation redraws its letters at every stage.
// These small changes keep the stems, shoulders and baselines from repeating
// as a rigid font while leaving the word legible.
const detailsAngles: Record<number, readonly number[]> = {
  1: [-5, 2, -3, 3, -4, 3, -5],
  2: [-3, 2, -2, 1, -3, 3, -2],
  3: [3, -3, 2, -2, 4, -3, 3],
  4: [-2, 1, -1, 2, -3, 2, -2],
  5: [5, -4, 3, -4, 2, -3, 4],
  6: [-4, 3, -3, 4, -2, 3, -3],
  7: [-2, 2, 0, -2, 2, -2, 2],
};

const detailsVerticals: Record<number, readonly number[]> = {
  1: [1, -3, 1, 3, -2, 2, -1],
  2: [-1, 2, -2, 1, -1, 2, -1],
  3: [0, 2, -3, 1, 2, -1, 1],
  4: [1, -2, 1, -1, 2, -2, 1],
  5: [-3, 2, -2, 2, -1, 3, -2],
  6: [1, -2, 2, -2, 1, -1, 2],
  7: [0, 1, -1, 0, 2, -1, 1],
};

const workAngles: Record<number, readonly number[]> = {
  1: [-3, 2, -2, 3], 2: [-2, 3, -3, 2],
  4: [-2, 3, -2, 2], 5: [3, -2, 2, -3], 6: [-2, 2, -3, 2],
};
const aboutAngles: Record<number, readonly number[]> = {
  1: [-3, 2, -2, 3, -3], 2: [2, -3, 3, -2, 2],
  3: [-2, 3, -2, 2, -3], 4: [2, -2, 2, -3, 2],
  5: [-3, 2, -3, 2, -2], 6: [2, -2, 3, -2, 2],
};

function shearForFrame(variant: Variant, frame: number) {
  if (variant === "demos") return [0, -10, -8, 0, -4, -8, -6, 0][frame];
  if (variant === "intro") return [0, -11, -9, -8, -5, -9, -8, 0][frame];
  if (variant === "details") return [0, -13, -9, -7, -8, -10, 0, -7][frame];
  return [0, -8, -7, -8, -5, -8, -6, -8][frame];
}

function widthForFrame(variant: Variant, frame: number) {
  if (variant === "demos") return [14, 19, 21, 14.25, 9.2, 21, 18, 14][frame];
  if (variant === "intro") return [14, 18, 20, 21, 17, 22, 20, 14][frame];
  if (variant === "details") return [14, 14, 5.4, 17, 19, 16, 6.3, 17][frame];
  return [14, 17, 19, 20, 17, 20, 19, 18][frame];
}

export function HandLettering({ word, variant, frame, x, y, width, height, idPrefix = "letter" }: Props) {
  const letters = Array.from(word.toUpperCase()).filter((letter) => glyphs[letter]);
  const spacing = 3;
  const totalWidth = letters.reduce((sum, letter) => sum + glyphs[letter].advance, 0) +
    Math.max(0, letters.length - 1) * spacing;
  const scaleX = width / totalWidth;
  const scaleY = height / 100;
  const outline = isOutline(variant, frame);
  const loose = variant === "details" && frame === 6;
  const scribble = variant === "demos" && frame === 4;
  const strokeWidth = widthForFrame(variant, frame);
  const shear = shearForFrame(variant, frame);
  const shearOffset = -Math.tan((shear * Math.PI) / 180) * 45 * scaleX;

  let advance = 0;
  return (
    <g
      transform={"translate(" + (x + shearOffset) + " " + y + ") scale(" + scaleX + " " + scaleY + ") skewX(" + shear + ")"}
      fill="none"
      strokeLinecap={scribble || loose || (variant === "demos" && (frame === 1 || frame === 2 || frame === 3)) ? "round" : "square"}
      strokeLinejoin={scribble || loose || (variant === "demos" && (frame === 1 || frame === 2 || frame === 3)) ? "round" : "bevel"}
      aria-label={word}
    >
      {letters.map((letter, index) => {
        const glyph = glyphs[letter];
        const letterX = advance;
        advance += glyph.advance + spacing;
        const strokes = scribble
          ? scribbleWork[letter] || glyph.strokes
          : variant === "demos" && frame === 3
            ? bentWork[letter] || glyph.strokes
          : loose
            ? looseDetails[letter] || glyph.strokes
            : variant === "details" && frame === 2
              ? thinDetails[letter] || glyph.strokes
            : variant === "details" && frame === 1
              ? brushDetails[letter] || glyph.strokes
              : variant === "details" && frame === 5
                ? energeticDetails[letter] || glyph.strokes
                : variant === "details" && solidDetails[frame]
                  ? solidDetails[frame][letter] || glyph.strokes
                  : variant === "wrap-up" && frame === 4
                    ? gearOutline[letter] || glyph.strokes
                    : variant === "wrap-up" && frame === 6
                      ? gearStriped[letter] || glyph.strokes
                      : glyph.strokes;
        const maskId = "hand-" + idPrefix + "-" + variant + "-" + frame + "-" + index;
        const hatchId = maskId + "-hatch";
        const innerMaskId = maskId + "-inner";
        const angle = variant === "details"
          ? detailsAngles[frame]?.[index] || 0
          : variant === "demos"
            ? workAngles[frame]?.[index] || 0
            : variant === "intro"
              ? aboutAngles[frame]?.[index] || 0
              : index % 2 === 0 ? -2 : 2;
        const vertical = variant === "demos" && frame === 3
          ? 0
          : variant === "details"
          ? detailsVerticals[frame]?.[index] || 0
          : frame === 0 ? 0 : [-1, 2, -2, 1, 0][index % 5];
        const strokeWeight = strokeWidth * (letter === "I" ? 0.88 : index % 3 === 1 ? 0.94 : 1);
        return (
          <g
            key={index}
            transform={"translate(" + letterX + " " + vertical + ") rotate(" + angle + " " + (glyph.advance / 2) + " 45)"}
          >
            {scribble ? (
              <SpaghettiLetter
                paths={strokes}
                letterIndex={index}
              />
            ) : outline ? (
              <>
                <defs>
                  <mask id={maskId} maskUnits="userSpaceOnUse" x="-12" y="-12" width={glyph.advance + 24} height="116">
                    {strokes.map((d, strokeIndex) => (
                      <path key={strokeIndex} d={d} stroke="white" strokeWidth={strokeWeight} />
                    ))}
                    {strokes.map((d, strokeIndex) => (
                      <path key={strokeIndex} d={d} stroke="black" strokeWidth="10.5" />
                    ))}
                  </mask>
                  {variant === "wrap-up" && frame === 4 && (
                    <>
                      <mask id={innerMaskId} maskUnits="userSpaceOnUse" x="-12" y="-12" width={glyph.advance + 24} height="116">
                        {strokes.map((d, strokeIndex) => (
                          <path key={strokeIndex} d={d} stroke="white" strokeWidth="9.5" />
                        ))}
                      </mask>
                      <pattern id={hatchId} patternUnits="userSpaceOnUse" width="9" height="8">
                        <path d="M0 7 L9 4" stroke="white" strokeWidth="1.6" />
                      </pattern>
                    </>
                  )}
                </defs>
                <rect x="-12" y="-12" width={glyph.advance + 24} height="116" fill="white" mask={"url(#" + maskId + ")"} />
                {variant === "wrap-up" && frame === 4 && (
                  <rect
                    x="-12"
                    y="-12"
                    width={glyph.advance + 24}
                    height="116"
                    fill={"url(#" + hatchId + ")"}
                    mask={"url(#" + innerMaskId + ")"}
                  />
                )}
              </>
            ) : (
              strokes.map((d, strokeIndex) => (
                <g key={strokeIndex}>
                  <path
                    d={d}
                    stroke="white"
                    strokeWidth={strokeWeight * (strokeIndex > 0 ? 0.92 : 1)}
                  />
                </g>
              ))
            )}
          </g>
        );
      })}
    </g>
  );
}
