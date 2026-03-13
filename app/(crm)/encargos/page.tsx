import { Topbar } from "@/components/crm/topbar";
import { cn } from "@/lib/utils";
import { FileText, Circle } from "lucide-react";

type EncargosStatus = "activo" | "pausado" | "vendido" | "caducado";

interface Encargo {
  id: string;
  owner: string;
  property: string;
  agent: string;
  startDate: string;
  status: EncargosStatus;
  notes?: string;
}

const MOCK_ENCARGOS: Encargo[] = [
  {
    id: "enc1",
    owner: "Roberto Navarro Lara",
    property: "C/ Fuencarral 120, Madrid — 3 hab. / 95 m²",
    agent: "Pedro Ruiz",
    startDate: "2025-02-15",
    status: "activo",
    notes: "Publicado en Idealista y Fotocasa. Precio de salida 380.000 €.",
  },
  {
    id: "enc2",
    owner: "Cristina Molina Pérez",
    property: "Av. Tibidabo 8, Barcelona — 4 hab. / 140 m²",
    agent: "Laura Soto",
    startDate: "2025-02-18",
    status: "activo",
    notes: "Exclusiva 6 meses. Primera visita programada el 20 de marzo.",
  },
  {
    id: "enc3",
    owner: "Andrés Serrano Roca",
    property: "Paseo Recoletos 10, Madrid — 2 hab. / 80 m²",
    agent: "Ana García",
    startDate: "2025-02-10",
    status: "pausado",
    notes: "Propietario solicita pausar la comercialización hasta abril.",
  },
  {
    id: "enc4",
    owner: "Nuria Ramírez Font",
    property: "C/ Conde Peñalver 5, Madrid — 3 hab. / 105 m²",
    agent: "Pedro Ruiz",
    startDate: "2025-01-30",
    status: "vendido",
    notes: "Precio de cierre 430.000 €. Escritura firmada el 10 de marzo.",
  },
  {
    id: "enc5",
    owner: "Marcos Gil Aranda",
    property: "Av. Sarrià 90, Barcelona — 3 hab. / 98 m²",
    agent: "Laura Soto",
    startDate: "2025-02-02",
    status: "activo",
    notes: "3 ofertas recibidas. Negociación en curso con el mejor postor.",
  },
  {
    id: "enc6",
    owner: "Pablo Torres Muñoz",
    property: "C/ Goya 34, Madrid — 2 hab. / 72 m²",
    agent: "Laura Soto",
    startDate: "2025-03-01",
    status: "activo",
  },
  {
    id: "enc7",
    owner: "Elena Castro Vidal",
    property: "Gran Via de les Corts 701, Barcelona — 2 hab. / 68 m²",
    agent: "Ana García",
    startDate: "2024-11-15",
    status: "caducado",
    notes: "Encargo expirado sin operación. El propietario decidió no vender.",
  },
];

const STATUS_CONFIG: Record<
  EncargosStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  activo: {
    label: "Activo",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pausado: {
    label: "Pausado",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  vendido: {
    label: "Vendido",
    dotClass: "bg-primary",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  caducado: {
    label: "Caducado",
    dotClass: "bg-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

const activeCount = MOCK_ENCARGOS.filter((e) => e.status === "activo").length;

export default function EncargosPage() {
  return (
    <>
      <Topbar title="Encargos" />

      <main className="flex flex-col flex-1 overflow-hidden mt-14 min-h-0">
        {/* Sub-header — read-only, no action button */}
        <div className="flex shrink-0 items-center gap-4 border-b border-border bg-card px-6 py-2.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {activeCount} encargos activos de {MOCK_ENCARGOS.length} registrados
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Propietario
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Inmueble
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Agente
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Inicio
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ENCARGOS.map((enc, i) => {
                const sc = STATUS_CONFIG[enc.status];
                return (
                  <tr
                    key={enc.id}
                    className={cn(
                      "border-b border-border",
                      i % 2 === 0 ? "bg-card" : "bg-background",
                      enc.status === "caducado" && "opacity-55"
                    )}
                  >
                    {/* Propietario */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground leading-tight">
                        {enc.owner}
                      </span>
                    </td>

                    {/* Inmueble */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {enc.property}
                      </span>
                    </td>

                    {/* Agente */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary uppercase">
                          {enc.agent
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {enc.agent}
                        </span>
                      </div>
                    </td>

                    {/* Inicio */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(enc.startDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                          sc.badgeClass
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            sc.dotClass
                          )}
                        />
                        {sc.label}
                      </span>
                    </td>

                    {/* Notas */}
                    <td className="px-4 py-3 max-w-[260px]">
                      {enc.notes ? (
                        <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {enc.notes}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
