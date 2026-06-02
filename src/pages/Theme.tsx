import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { chartAxisProps, chartGridProps, chartTooltipStyle, chartTooltipLabelStyle, chartColors } from "@/lib/chart-theme";

const tokens = [
  { name: "background", varName: "--background" },
  { name: "foreground", varName: "--foreground" },
  { name: "card", varName: "--card" },
  { name: "primary", varName: "--primary" },
  { name: "accent", varName: "--accent" },
  { name: "success", varName: "--success" },
  { name: "warning", varName: "--warning" },
  { name: "destructive", varName: "--destructive" },
  { name: "border", varName: "--border" },
  { name: "muted", varName: "--muted" },
];

const series = [
  { x: "T1", a: 42, b: 30, c: 18 },
  { x: "T2", a: 51, b: 38, c: 24 },
  { x: "T3", a: 63, b: 47, c: 32 },
  { x: "T4", a: 72, b: 55, c: 38 },
  { x: "T5", a: 78, b: 62, c: 44 },
  { x: "T6", a: 85, b: 68, c: 51 },
];

const radarData = [
  { skill: "Clarity", score: 82 },
  { skill: "Confidence", score: 74 },
  { skill: "Structure", score: 68 },
  { skill: "Flow", score: 88 },
  { skill: "Pacing", score: 71 },
  { skill: "Fillers", score: 79 },
];

const Theme = () => {
  return (
    <DashboardLayout module="MOD_QA // THEME_AUDIT" meta="ENV: PREVIEW">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>MOD_QA // THEME_AUDIT</span>
            <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-primary/70">SPEC_v0.4</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            Theme <span className="text-gradient">QA</span>
          </h1>
          <p className="text-muted-foreground text-sm">Visual audit of every token, surface and chart primitive used across the dashboard.</p>
        </div>

        {/* Color tokens */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// 01 · COLOR_TOKENS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {tokens.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-3 space-y-2">
                  <div
                    className="h-16 rounded-xl border border-white/5"
                    style={{ background: `hsl(var(${t.varName}))` }}
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest">{t.varName}</p>
                    <p className="text-sm font-semibold">{t.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// 02 · TYPOGRAPHY</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Display · Bricolage Grotesque</p>
                <p className="font-display text-4xl font-extrabold tracking-tight">The quick brown fox</p>
              </div>
              <Separator className="bg-white/5" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Body · Fredoka</p>
                <p className="text-base">Communication training that actually rewires how you speak under pressure.</p>
              </div>
              <Separator className="bg-white/5" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Mono · JetBrains Mono</p>
                <p className="font-mono text-sm">CONF: 82.4 · CLAR: 71.0 · FLOW: 88.2</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Controls */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// 03 · CONTROLS</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button className="btn-gradient text-primary-foreground border-0">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Standard input" />
                <Input placeholder="Disabled" disabled />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge className="btn-gradient text-primary-foreground border-0">Gradient</Badge>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">PROGRESS · 64%</p>
                <Progress value={64} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Surfaces */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// 04 · SURFACES</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">.glass</p>
              <p className="text-sm">Translucent card surface used everywhere.</p>
            </div>
            <div className="glass rounded-2xl p-6 neon-glow">
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">.neon-glow</p>
              <p className="text-sm">Cyan halo for active elements.</p>
            </div>
            <div className="rounded-2xl p-6 grid-bg border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">.grid-bg</p>
              <p className="text-sm">Blueprint grid backdrop.</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// 05 · CHARTS</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Area</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series}>
                      <CartesianGrid {...chartGridProps} />
                      <XAxis dataKey="x" {...chartAxisProps} />
                      <YAxis {...chartAxisProps} />
                      <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                      <Area type="monotone" dataKey="a" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.18} strokeWidth={2} />
                      <Area type="monotone" dataKey="b" stroke={chartColors.accent} fill={chartColors.accent} fillOpacity={0.12} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Line</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                      <CartesianGrid {...chartGridProps} />
                      <XAxis dataKey="x" {...chartAxisProps} />
                      <YAxis {...chartAxisProps} />
                      <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                      <Line type="monotone" dataKey="a" stroke={chartColors.primary} strokeWidth={2} dot={{ fill: chartColors.primary, r: 3 }} />
                      <Line type="monotone" dataKey="c" stroke={chartColors.warning} strokeWidth={2} dot={{ fill: chartColors.warning, r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Bar</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={series}>
                      <CartesianGrid {...chartGridProps} />
                      <XAxis dataKey="x" {...chartAxisProps} />
                      <YAxis {...chartAxisProps} />
                      <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} cursor={{ fill: "hsl(var(--primary) / 0.08)" }} />
                      <Bar dataKey="a" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
                      <Bar dataKey="b" fill={chartColors.accent} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Radar</CardTitle></CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "JetBrains Mono, monospace" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                      <Radar dataKey="score" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.22} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Theme;
