export default function Home() {
  const label = "DEMOS";

  return (
    <main className="demo-stage">
      <h1 className="sr-only">{label}</h1>

      <svg
        className="demo-title"
        viewBox="0 0 1000 400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="chalk" x="-15%" y="-40%" width="130%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.065" numOctaves="2" seed="7" result="warp" />
            <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="12" result="texture" />
            <feColorMatrix
              in="texture"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.33 0.33 0.34 0 0"
              result="grainColor"
            />
            <feComponentTransfer in="grainColor" result="grain">
              <feFuncA type="discrete" tableValues="0.65 0.75 0.85 0.95 1 1 1 1" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="grain" operator="in" result="ink" />
            <feDisplacementMap in="ink" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <filter id="scribble" x="-20%" y="-50%" width="140%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032 0.14" numOctaves="2" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="23" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g className="demo-clean">
          <text x="500" y="257" textAnchor="middle" className="demo-clean-text">{label}</text>
        </g>

        <g className="demo-chalk">
          <text x="500" y="257" textAnchor="middle" className="demo-chalk-text">{label}</text>
          <g className="demo-marks" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round">
            <path d="M120 177 Q102 201 117 232" />
            <path d="M875 180 Q894 205 878 232" />
            <path d="M92 208 l-3 2 M910 206 l3 2" strokeWidth="5" />
          </g>
        </g>

        <g className="demo-scribble">
          <text x="500" y="257" textAnchor="middle" className="demo-scribble-text">{label}</text>
          <g fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" filter="url(#scribble)">
            <path d="M75 145 l16 23 -12 17 19 14 -9 19 17 25" />
            <path d="M918 145 l-16 23 13 17 -19 14 9 19 -17 25" />
          </g>
        </g>
      </svg>
    </main>
  );
}
