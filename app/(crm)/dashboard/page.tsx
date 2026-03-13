"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Topbar } from "@/components/crm/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type LeadPhase, type Lead, PHASE_LABELS, MOCK_LEADS } from "@/lib/crm-data";

type PeriodOption = "last7" | "currentMonth" | "custom";

type DateRange = {
  start: Date;
  end: Date;
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function createLast7DaysRange(today = new Date()): DateRange {
  const end = endOfDay(today);
  const start = startOfDay(new Date(today));
  start.setDate(start.getDate() - 6);
  return { start, end };
}

function createCurrentMonthRange(today = new Date()): DateRange {
  const start = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
  const end = endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  return { start, end };
}

function createCustomRange(
  from: string,
  to: string,
  fallback: DateRange
): DateRange {
  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;
  if (!fromDate || isNaN(fromDate.getTime()) || !toDate || isNaN(toDate.getTime())) {
    return fallback;
  }
  if (fromDate > toDate) {
    return fallback;
  }
  return { start: startOfDay(fromDate), end: endOfDay(toDate) };
}

function getPreviousRange(range: DateRange): DateRange {
  const oneDay = 24 * 60 * 60 * 1000;
  const lengthDays =
    Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / oneDay) + 1);
  const prevEnd = endOfDay(new Date(range.start.getTime() - oneDay));
  const prevStart = startOfDay(
    new Date(prevEnd.getTime() - (lengthDays - 1) * oneDay)
  );
  return { start: prevStart, end: prevEnd };
}

function isWithinRange(date: Date, range: DateRange): boolean {
  const time = date.getTime();
  return time >= range.start.getTime() && time <= range.end.getTime();
}

function buildCreatedSeries(leads: Lead[]) {
  const map = new Map<string, number>();
  for (const lead of leads) {
    const month = (lead.createdAt || "").slice(0, 7);
    if (!month) continue;
    map.set(month, (map.get(month) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}

function formatDelta(current: number, previous: number) {
  const diff = current - previous;
  if (previous === 0 && current === 0) {
    return { text: "Sin cambios", tone: "muted" as const };
  }
  if (previous === 0) {
    return { text: `+${current}`, tone: "positive" as const };
  }
  if (diff === 0) {
    return { text: "Sin cambios", tone: "muted" as const };
  }
  const pct = Math.round((diff / previous) * 100);
  const sign = diff > 0 ? "+" : "";
  return {
    text: `${sign}${diff} (${sign}${pct}%)`,
    tone: diff > 0 ? ("positive" as const) : ("negative" as const),
  };
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodOption>("last7");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [comparePrevious, setComparePrevious] = useState(false);

  const currentRange = useMemo(() => {
    const today = new Date();
    const defaultRange = createLast7DaysRange(today);
    if (period === "last7") return defaultRange;
    if (period === "currentMonth") return createCurrentMonthRange(today);
    return createCustomRange(customFrom, customTo, defaultRange);
  }, [period, customFrom, customTo]);

  const previousRange = useMemo(
    () => (comparePrevious ? getPreviousRange(currentRange) : null),
    [comparePrevious, currentRange]
  );

  const { currentLeads, previousLeads } = useMemo(() => {
    const current: Lead[] = [];
    const previous: Lead[] = [];
    for (const lead of MOCK_LEADS) {
      const created = new Date(lead.createdAt);
      if (!isNaN(created.getTime()) && isWithinRange(created, currentRange)) {
        current.push(lead);
      } else if (
        previousRange &&
        !isNaN(created.getTime()) &&
        isWithinRange(created, previousRange)
      ) {
        previous.push(lead);
      }
    }
    return { currentLeads: current, previousLeads: previous };
  }, [currentRange, previousRange]);

  const totalLeads = currentLeads.length;

  const leadsByPhase = useMemo(() => {
    const phases: LeadPhase[] = [
      "noticia",
      "concertada",
      "valorada",
      "cualificada",
      "encargo",
      "vender",
    ];

    return phases.map((phase) => ({
      phase,
      name: PHASE_LABELS[phase],
      value: currentLeads.filter((l) => l.phase === phase).length,
    }));
  }, [currentLeads]);

  const leadsByStatus = useMemo(() => {
    const base = { seguimiento: 0, caliente: 0, desestimada: 0 };
    const currentCounts = currentLeads.reduce(
      (acc, l) => {
        acc[l.status] += 1;
        return acc;
      },
      { ...base } as Record<keyof typeof base, number>
    );
    const previousCounts = previousLeads.reduce(
      (acc, l) => {
        acc[l.status] += 1;
        return acc;
      },
      { ...base } as Record<keyof typeof base, number>
    );
    return { current: currentCounts, previous: previousCounts };
  }, [currentLeads, previousLeads]);

  const leadsCreatedSeries = useMemo(
    () => buildCreatedSeries(currentLeads),
    [currentLeads]
  );

  return (
    <>
      <Topbar title="Dashboard" />

      <main className="flex flex-col flex-1 overflow-hidden mt-14 min-h-0">
        {/* Header with date range selector */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6 py-2.5">
          <span className="text-xs text-muted-foreground">
            Resumen de actividad de leads
          </span>
          <div className="flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setPeriod("last7")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-colors",
                  period === "last7"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Últimos 7 días
              </button>
              <button
                type="button"
                onClick={() => setPeriod("currentMonth")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-colors",
                  period === "currentMonth"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mes actual
              </button>
              <button
                type="button"
                onClick={() => setPeriod("custom")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-colors",
                  period === "custom"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Rango personalizado
              </button>
            </div>

            {period === "custom" && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <label className="flex items-center gap-1.5">
                  <span>Desde</span>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="h-7 rounded-md border border-border bg-background px-2 text-[11px] text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </label>
                <label className="flex items-center gap-1.5">
                  <span>Hasta</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="h-7 rounded-md border border-border bg-background px-2 text-[11px] text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </label>
              </div>
            )}

            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                checked={comparePrevious}
                onChange={(e) => setComparePrevious(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border text-primary"
              />
              <span>Comparar con período anterior</span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Leads totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">
                  {totalLeads}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Basado en datos actuales (mock)
                </div>
                {comparePrevious && (
                  <div
                    className={cn(
                      "mt-1 text-[11px]",
                      formatDelta(totalLeads, previousLeads.length).tone === "positive"
                        ? "text-emerald-600"
                        : formatDelta(totalLeads, previousLeads.length).tone ===
                          "negative"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    )}
                  >
                    vs período anterior:{" "}
                    {formatDelta(totalLeads, previousLeads.length).text}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estado</CardTitle>
              </CardHeader>

              <CardContent className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Seguimiento</span>
                  <span className="font-medium tabular-nums">
                    {leadsByStatus.current.seguimiento}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Caliente</span>
                  <span className="font-medium tabular-nums">
                    {leadsByStatus.current.caliente}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Desestimada</span>
                  <span className="font-medium tabular-nums">
                    {leadsByStatus.current.desestimada}
                  </span>
                </div>
                {comparePrevious && (
                  <div className="pt-1 text-[11px] text-muted-foreground">
                    Comparando distribución de estado con el período anterior.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Fase top</CardTitle>
              </CardHeader>

              <CardContent>
                {(() => {
                  const top = [...leadsByPhase].sort((a, b) => b.value - a.value)[0];

                  return (
                    <>
                      <div className="text-2xl font-semibold">
                        {top?.name ?? "—"}
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {top ? `${top.value} leads` : "Sin datos"}
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* CHARTS */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Leads por fase */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Leads por fase</CardTitle>
              </CardHeader>

              <CardContent>
                <ChartContainer
                  className="h-[260px] w-full"
                  config={{
                    value: { label: "Leads", color: "hsl(var(--primary))" },
                  }}
                >
                  <ResponsiveContainer>
                    <BarChart data={leadsByPhase} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid vertical={false} />

                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickMargin={8}
                        fontSize={11}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={28}
                        fontSize={11}
                        allowDecimals={false}
                      />

                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />

                      <Bar
                        dataKey="value"
                        fill="var(--color-value)"
                        radius={6}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Leads por mes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Leads creados (por mes)
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ChartContainer
                  className="h-[260px] w-full"
                  config={{
                    value: { label: "Leads", color: "hsl(var(--primary))" },
                  }}
                >
                  <ResponsiveContainer>
                    <LineChart data={leadsCreatedSeries} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid vertical={false} />

                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />

                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={28}
                        fontSize={11}
                        allowDecimals={false}
                      />

                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </>
  );
}