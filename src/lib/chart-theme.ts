// Shared Recharts styling tokens for the terminal theme.
// Use these so every chart in the app inherits the same dark-glass look.

export const chartAxisProps = {
  tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "JetBrains Mono, monospace" },
  stroke: "hsl(var(--border))",
  tickLine: { stroke: "hsl(var(--border))" },
  axisLine: { stroke: "hsl(var(--border))" },
} as const;

export const chartGridProps = {
  stroke: "hsl(var(--border))",
  strokeDasharray: "2 4",
  strokeOpacity: 0.4,
} as const;

export const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card) / 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid hsl(var(--primary) / 0.25)",
  borderRadius: "12px",
  fontSize: "11px",
  fontFamily: "JetBrains Mono, monospace",
  color: "hsl(var(--foreground))",
  boxShadow: "0 12px 40px -8px hsl(220 80% 2% / 0.6)",
} as const;

export const chartTooltipLabelStyle = {
  color: "hsl(var(--primary))",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
};

export const chartColors = {
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  info: "hsl(var(--info))",
  muted: "hsl(var(--muted-foreground))",
};
