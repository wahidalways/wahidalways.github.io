/*
 * One line drawing per case study. The page has no product screenshots to show,
 * so each project gets the diagram an analyst would sketch on a whiteboard in
 * the first workshop: a funnel, an org structure, a route, a journey. Same
 * viewBox, same stroke, same type: a set, not four illustrations.
 */
export type SchematicKind = "funnel" | "tree" | "route" | "journey";

const Label = ({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    className="fill-current font-mono uppercase"
    style={{ fontSize: 9, letterSpacing: "0.08em" }}
  >
    {children}
  </text>
);

const Funnel = () => {
  const stages = ["Browse", "Cart", "Checkout", "Order"];
  return (
    <>
      {stages.map((s, i) => {
        const w = 360 - i * 80;
        const x = (400 - w) / 2;
        const y = 8 + i * 38;
        const last = i === stages.length - 1;
        return (
          <g key={s}>
            <rect
              x={x}
              y={y}
              width={w}
              height={28}
              rx={3}
              className={last ? "fill-accent stroke-accent" : "fill-none stroke-current"}
              strokeWidth={1}
            />
            <g className={last ? "text-accent-foreground" : ""}>
              <Label x={200} y={y + 17.5} anchor="middle">
                {s}
              </Label>
            </g>
          </g>
        );
      })}
    </>
  );
};

const Tree = () => {
  const children = [
    { x: 20, label: "HRIS" },
    { x: 150, label: "Payroll" },
    { x: 280, label: "ATS" },
  ];
  return (
    <>
      <rect x={140} y={8} width={120} height={30} rx={3} className="fill-accent stroke-accent" />
      <g className="text-accent-foreground">
        <Label x={200} y={27} anchor="middle">
          Workforce
        </Label>
      </g>
      <path d="M200 38 V74 M70 74 H330 M70 74 V112 M200 74 V112 M330 74 V112" className="stroke-current" fill="none" strokeWidth={1} />
      {children.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={112} width={100} height={30} rx={3} className="fill-none stroke-current" strokeWidth={1} />
          <Label x={c.x + 50} y={131} anchor="middle">
            {c.label}
          </Label>
        </g>
      ))}
    </>
  );
};

const Route = () => {
  const nodes = [
    { x: 24, y: 118, label: "Order", dy: 22 },
    { x: 142, y: 62, label: "Kitchen", dy: -14 },
    { x: 262, y: 104, label: "Rider", dy: 22 },
    { x: 376, y: 40, label: "Door", dy: -14 },
  ];
  return (
    <>
      <path
        d="M24 118 C 70 118, 96 62, 142 62 S 214 104, 262 104 S 330 40, 376 40"
        className="stroke-current"
        fill="none"
        strokeWidth={1}
        strokeDasharray="4 5"
      />
      {nodes.map((n, i) => {
        const last = i === nodes.length - 1;
        return (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={last ? 7 : 5} className={last ? "fill-accent" : "fill-background stroke-current"} strokeWidth={1} />
            <Label x={n.x} y={n.y + n.dy} anchor={i === 0 ? "start" : last ? "end" : "middle"}>
              {n.label}
            </Label>
          </g>
        );
      })}
    </>
  );
};

const Journey = () => {
  const steps = ["Enquiry", "Visa", "Travel", "Treatment"];
  const xs = [30, 143, 256, 370];
  return (
    <>
      <path d="M30 82 H370" className="stroke-current" strokeWidth={1} />
      {xs.slice(0, -1).map((x, i) => (
        <path key={i} d={`M${x + 56} 78 l6 4 -6 4`} className="stroke-current" fill="none" strokeWidth={1} />
      ))}
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const up = i % 2 === 0;
        return (
          <g key={s}>
            <path d={`M${xs[i]} ${up ? 82 : 82} V${up ? 50 : 114}`} className="stroke-current" strokeWidth={1} strokeDasharray="2 3" />
            <rect
              x={xs[i] - 8}
              y={74}
              width={16}
              height={16}
              rx={2}
              className={last ? "fill-accent stroke-accent" : "fill-background stroke-current"}
              strokeWidth={1}
            />
            <Label x={xs[i]} y={up ? 40 : 132} anchor={i === 0 ? "start" : last ? "end" : "middle"}>
              {s}
            </Label>
          </g>
        );
      })}
    </>
  );
};

const CaseSchematic = ({ kind, className = "" }: { kind: SchematicKind; className?: string }) => (
  <svg
    viewBox="0 0 400 152"
    aria-hidden="true"
    className={`w-full h-auto overflow-visible text-muted-foreground ${className}`}
  >
    {kind === "funnel" && <Funnel />}
    {kind === "tree" && <Tree />}
    {kind === "route" && <Route />}
    {kind === "journey" && <Journey />}
  </svg>
);

export default CaseSchematic;
