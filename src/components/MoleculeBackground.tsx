// Decorative SVG molecular network & chemical double helix — rendered as a background layer
export function MoleculeBackground({ className = "" }: { className?: string }) {
  const nodes = [
    { id: 0,  cx: 80,   cy: 120, r: 4 },
    { id: 1,  cx: 200,  cy: 60,  r: 3 },
    { id: 2,  cx: 170,  cy: 190, r: 5 },
    { id: 3,  cx: 340,  cy: 40,  r: 3 },
    { id: 4,  cx: 300,  cy: 145, r: 4 },
    { id: 5,  cx: 460,  cy: 85,  r: 5 },
    { id: 6,  cx: 430,  cy: 230, r: 3 },
    { id: 7,  cx: 590,  cy: 30,  r: 3 },
    { id: 8,  cx: 560,  cy: 165, r: 5 },
    { id: 9,  cx: 680,  cy: 105, r: 3 },
    { id: 10, cx: 650,  cy: 270, r: 4 },
    { id: 11, cx: 800,  cy: 55,  r: 3 },
    { id: 12, cx: 775,  cy: 200, r: 5 },
    { id: 13, cx: 900,  cy: 130, r: 3 },
    { id: 14, cx: 870,  cy: 315, r: 4 },
    { id: 15, cx: 1010, cy: 80,  r: 3 },
    { id: 16, cx: 985,  cy: 245, r: 4 },
    { id: 17, cx: 1110, cy: 160, r: 5 },
    { id: 18, cx: 1180, cy: 280, r: 3 },
    { id: 19, cx: 110,  cy: 370, r: 4 },
    { id: 20, cx: 240,  cy: 420, r: 5 },
    { id: 21, cx: 360,  cy: 380, r: 3 },
    { id: 22, cx: 480,  cy: 445, r: 4 },
    { id: 23, cx: 600,  cy: 400, r: 3 },
    { id: 24, cx: 720,  cy: 470, r: 5 },
    { id: 25, cx: 840,  cy: 420, r: 3 },
    { id: 26, cx: 960,  cy: 480, r: 4 },
    { id: 27, cx: 1080, cy: 415, r: 3 },
    { id: 28, cx: 1175, cy: 490, r: 3 },
  ];

  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [4, 6],
    [5, 7], [5, 8], [7, 9], [8, 9], [8, 10], [9, 11], [10, 12],
    [11, 12], [11, 15], [12, 13], [12, 14], [13, 17], [14, 16],
    [15, 17], [16, 17], [17, 18], [6, 21], [10, 22], [14, 25],
    [2, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24],
    [24, 25], [25, 26], [26, 27], [27, 28], [8, 23], [12, 24],
  ];

  // Helper to construct a Benzene Hexagon Ring
  const makeBenzene = (cx: number, cy: number, r: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return points;
  };

  const ring1 = makeBenzene(150, 320, 25);
  const ring2 = makeBenzene(950, 140, 25);
  const ring3 = makeBenzene(550, 380, 22);

  // Generate helix points
  const helixRungs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const helixStrand1: { x: number; y: number }[] = [];
  const helixStrand2: { x: number; y: number }[] = [];
  const startY = 40;
  const endY = 480;
  const step = 20;
  const helixCenterX = 1140;
  const amplitude = 30;

  for (let y = startY; y <= endY; y += step) {
    const angle = (y - startY) / 35;
    const x1 = helixCenterX + amplitude * Math.sin(angle);
    const x2 = helixCenterX + amplitude * Math.sin(angle + Math.PI);
    
    helixStrand1.push({ x: x1, y });
    helixStrand2.push({ x: x2, y });
    
    // Draw cross rungs at intervals
    if ((y - startY) % 40 === 0) {
      helixRungs.push({ x1, y1: y, x2, y2: y });
    }
  }

  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <g className="molecule-bg">
        {/* Connection networks */}
        {edges.map(([a, b]) => {
          const na = nodes[a];
          const nb = nodes[b];
          return (
            <line
              key={`${a}-${b}`}
              x1={na.cx} y1={na.cy}
              x2={nb.cx} y2={nb.cy}
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.25"
            />
          );
        })}

        {/* Benzene Ring 1 */}
        <polygon
          points={ring1.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        {/* Double bonds for Ring 1 */}
        <line x1={ring1[0][0]-3} y1={ring1[0][1]+3} x2={ring1[1][0]-3} y2={ring1[1][1]-3} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <line x1={ring1[2][0]+3} y1={ring1[2][1]-3} x2={ring1[3][0]+3} y2={ring1[3][1]+3} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <line x1={ring1[4][0]} y1={ring1[4][1]-4} x2={ring1[5][0]} y2={ring1[5][1]-4} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <text x={ring1[2][0]-14} y={ring1[2][1]+4} fill="currentColor" fillOpacity="0.6" className="text-[9px] font-bold">N</text>
        <text x={ring1[5][0]+5} y={ring1[5][1]+4} fill="currentColor" fillOpacity="0.6" className="text-[9px] font-bold">OH</text>

        {/* Benzene Ring 2 */}
        <polygon
          points={ring2.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        {/* Double bonds for Ring 2 */}
        <line x1={ring2[1][0]-3} y1={ring2[1][1]+3} x2={ring2[2][0]-3} y2={ring2[2][1]-3} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <line x1={ring2[3][0]+3} y1={ring2[3][1]-3} x2={ring2[4][0]+3} y2={ring2[4][1]+3} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <line x1={ring2[5][0]} y1={ring2[5][1]-4} x2={ring2[0][0]} y2={ring2[0][1]-4} stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
        <text x={ring2[3][0]-14} y={ring2[3][1]+4} fill="currentColor" fillOpacity="0.6" className="text-[9px] font-bold">O</text>

        {/* Benzene Ring 3 */}
        <polygon
          points={ring3.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />
        <text x={ring3[0][0]+5} y={ring3[0][1]+4} fill="currentColor" fillOpacity="0.6" className="text-[8px] font-bold">CH₃</text>

        {/* DNA Double Helix Strands on the right */}
        {/* Rungs */}
        {helixRungs.map((rung, i) => (
          <line
            key={`rung-${i}`}
            x1={rung.x1} y1={rung.y1}
            x2={rung.x2} y2={rung.y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.3"
          />
        ))}
        {/* Strand 1 Line */}
        <path
          d={`M ${helixStrand1.map(p => `${p.x} ${p.y}`).join(" L ")}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        {/* Strand 2 Line */}
        <path
          d={`M ${helixStrand2.map(p => `${p.x} ${p.y}`).join(" L ")}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        {/* Helix base pair nodes */}
        {helixStrand1.map((p, idx) => (
          idx % 2 === 0 && (
            <circle key={`hs1-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="currentColor" fillOpacity="0.6" />
          )
        ))}
        {helixStrand2.map((p, idx) => (
          idx % 2 === 0 && (
            <circle key={`hs2-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="currentColor" fillOpacity="0.6" />
          )
        ))}

        {/* Primary network nodes */}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="currentColor"
            fillOpacity="0.5"
          />
        ))}
      </g>
    </svg>
  );
}
