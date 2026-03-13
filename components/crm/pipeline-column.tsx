import { LeadCard, type Lead } from "./lead-card";
import { Plus } from "lucide-react";

export type PipelinePhase =
  | "noticia"
  | "concertada"
  | "valorada"
  | "cualificada"
  | "encargo"
  | "vender";

interface PipelineColumnProps {
  phase: PipelinePhase;
  label: string;
  leads: Lead[];
  accentColor: string;
}

export function PipelineColumn({
  label,
  leads,
  accentColor,
}: PipelineColumnProps) {
  return (
    <div className="flex w-64 shrink-0 flex-col rounded-xl border border-border bg-column-bg overflow-hidden">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            {label}
          </span>
        </div>
        <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-muted border border-border px-1.5 text-[11px] font-semibold text-muted-foreground">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-2 flex-1 min-h-[200px]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {/* Add card */}
      <div className="px-2 pb-2">
        <button className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-card hover:text-foreground hover:border hover:border-border transition-all">
          <Plus className="h-3.5 w-3.5" />
          Añadir lead
        </button>
      </div>
    </div>
  );
}
