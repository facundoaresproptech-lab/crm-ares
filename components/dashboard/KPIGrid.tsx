"use client";

export type KPI = {
  title: string;
  value: number;
  change?: number;
};

type KPIGridProps = {
  items: KPI[];
};

function formatValue(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}

function formatChange(change: number): string {
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export default function KPIGrid({ items }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const changeClass =
          item.change === undefined
            ? ""
            : item.change > 0
              ? "text-green-600"
              : item.change < 0
                ? "text-red-600"
                : "text-muted-foreground";

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {item.title}
            </p>

            <div className="mt-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {formatValue(item.value)}
              </p>

              {item.change !== undefined && (
                <p className={`mt-2 text-sm font-medium ${changeClass}`}>
                  {formatChange(item.change)} vs período anterior
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}