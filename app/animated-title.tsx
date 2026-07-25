type Variant = "demos" | "intro" | "details" | "wrap-up";
type Look = "clean" | "chalk" | "outline" | "thin" | "scribble" | "smear";

const looks: Record<Variant, Look[]> = {
  demos: ["clean", "chalk", "chalk", "thin", "scribble", "chalk", "chalk", "clean"],
  intro: ["clean", "chalk", "chalk", "chalk", "outline", "outline", "chalk", "clean"],
  details: ["clean", "chalk", "thin", "thin", "outline", "chalk", "thin", "clean"],
  "wrap-up": ["clean", "chalk", "chalk", "chalk", "chalk", "smear", "chalk", "clean"],
};

const motion = [
  [0, 0, 0],
  [-2, 1, -0.7],
  [2, -2, 0.8],
  [-3, 0, -1.3],
  [3, 2, 1.4],
  [-1, -1, -0.9],
  [1, 1, 0.5],
  [0, 0, 0],
];

function Marks({ variant, frame }: { variant: Variant; frame: number }) {
  if (frame === 0 || frame === 7) return null;

  if (variant === "intro") {
    return (
      <g className="hand-marks" fill="none" stroke="white" strokeLinecap="round" strokeWidth="7">
        {frame >= 3 && <path d="M680 93 l-7 -25 M729 108 l22 -24 M752 148 l28 -4" />}
        {frame >= 5 && <path d="M211 207 q-17 30 26 67 M191 221 q-13 29 30 69" />}
      </g>
    );
  }

  if (variant === "demos") {
    return (
      <g className="hand-marks" fill="none" stroke="white" strokeLinecap="round" strokeWidth="7">
        {frame === 4 ? (
          <path d="M111 115 l20 32 -16 24 22 29 -11 30 21 27 M852 111 l-19 26 20 34 -18 31 15 24 -20 27" />
        ) : frame >= 2 ? (
          <path d="M177 143 q-25 45 0 88 M797 143 q25 45 0 88 M153 175 l-4 4 M821 172 l5 3" />
        ) : null}
      </g>
    );
  }

  if (variant === "details") {
    return frame >= 2 ? (
      <g className="hand-marks" fill="none" stroke="white" strokeLinecap="round" strokeWidth="5">
        <path d="M166 166 q-20 27 8 55 M146 174 q-17 25 8 54" />
        {frame <= 4 && <path d="M809 180 q22 17 7 45" />}
      </g>
    ) : null;
  }

  return (
    <g className="hand-marks" fill="none" stroke="white" strokeLinecap="round" strokeWidth="6">
      <path d={`M293 ${142 - frame * 5} q-8 22 -1 38 M335 ${129 - frame * 4} q-7 27 0 45 M380 ${147 - frame * 5} q-5 17 1 31`} />
      {frame >= 3 && <path d="M440 119 l-2 15 M256 131 l-4 7" />}
    </g>
  );
}

export function AnimatedTitle({ variant, word }: { variant: Variant; word: string }) {
  return (
    <div className="hand-title" role="img" aria-label={word}>
      <div className="hand-strip" aria-hidden="true">
        {looks[variant].map((look, frame) => {
          const [x, y, angle] = motion[frame];
          const grainId = `${variant}-grain-${frame}`;
          const warpId = `${variant}-warp-${frame}`;
          const filter = look === "clean" ? undefined : `url(#${look === "scribble" || look === "smear" ? warpId : grainId})`;

          return (
            <svg className="hand-slide" key={frame} viewBox="0 0 976 320">
              <defs>
                <filter id={grainId} x="-20%" y="-45%" width="140%" height="190%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.024 0.075" numOctaves="2" seed="8" result="edge" />
                  <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" seed="13" result="noise" />
                  <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.33 0.33 0.34 0 0" result="luma" />
                  <feComponentTransfer in="luma" result="paper">
                    <feFuncA type="discrete" tableValues="0.55 0.7 0.8 0.9 1 1 1 1" />
                  </feComponentTransfer>
                  <feComposite in="rough" in2="paper" operator="in" />
                </filter>
                <filter id={warpId} x="-25%" y="-50%" width="150%" height="200%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.034 0.12" numOctaves="2" seed="5" result="wave" />
                  <feDisplacementMap in="SourceGraphic" in2="wave" scale="18" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g transform={`translate(${x} ${y}) rotate(${angle} 488 175)`}>
                <text x="488" y="220" textAnchor="middle" className={`hand-word hand-word--${look}`} filter={filter}>
                  {word}
                </text>
                <Marks variant={variant} frame={frame} />
              </g>
            </svg>
          );
        })}
      </div>
    </div>
  );
}
