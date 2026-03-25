"use client";

import KPIGrid, { type KPI } from "@/components/dashboard/KPIGrid";

const kpis: KPI[] = [
  { title: "Leads totales", value: 1542, change: 8.4 },
  { title: "Leads nuevos", value: 128, change: 12.1 },
  { title: "Leads activos", value: 1096, change: 4.7 },
  { title: "Calientes", value: 214, change: -2.3 },
  { title: "Desestimados", value: 189, change: 3.1 },
  { title: "Identificar", value: 96, change: -6.8 },
  { title: "Valorados", value: 402, change: 9.2 },
  { title: "Encargos", value: 67, change: 5.5 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del rendimiento de leads.
        </p>
      </div>

      <KPIGrid items={kpis} />

      <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted-foreground shadow-sm">
        Aquí iremos añadiendo los siguientes bloques del dashboard:
        evolución temporal, origen de leads y pipeline.
      </div>
    </div>
  );
}