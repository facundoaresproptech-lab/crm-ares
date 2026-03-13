import { PipelineColumn, type PipelinePhase } from "./pipeline-column";
import { type Lead } from "./lead-card";

const COLUMNS: { phase: PipelinePhase; label: string; accentColor: string }[] =
  [
    { phase: "noticia", label: "Noticia", accentColor: "#94a3b8" },
    { phase: "concertada", label: "Concertada", accentColor: "#60a5fa" },
    { phase: "valorada", label: "Valorada", accentColor: "#a78bfa" },
    { phase: "cualificada", label: "Cualificada", accentColor: "#f59e0b" },
    { phase: "encargo", label: "Encargo", accentColor: "#10b981" },
    { phase: "vender", label: "Vender", accentColor: "#ef4444" },
  ];

const MOCK_LEADS: Record<PipelinePhase, Lead[]> = {
  noticia: [
    {
      id: "n1",
      ownerName: "Carlos Sánchez Ruiz",
      phone: "+34 612 345 678",
      status: "seguimiento",
      source: "Referido",
      propertyAddress: "C/ Gran Vía 45, Madrid",
    },
    {
      id: "n2",
      ownerName: "Isabel Mora López",
      phone: "+34 699 871 234",
      status: "seguimiento",
      source: "Web",
      propertyAddress: "Av. Diagonal 211, Barcelona",
    },
    {
      id: "n3",
      ownerName: "Tomás Vega Nieto",
      phone: "+34 677 564 321",
      status: "desestimada",
      source: "Portales",
      propertyAddress: "P.º de la Castellana 100",
    },
  ],
  concertada: [
    {
      id: "c1",
      ownerName: "María Fernández Gil",
      phone: "+34 645 123 456",
      status: "caliente",
      source: "LinkedIn",
      propertyAddress: "C/ Serrano 12, Madrid",
    },
    {
      id: "c2",
      ownerName: "Javier Ortega Blanco",
      phone: "+34 610 987 654",
      status: "seguimiento",
      source: "Referido",
      propertyAddress: "Rambla Catalunya 55, BCN",
    },
  ],
  valorada: [
    {
      id: "v1",
      ownerName: "Laura Jiménez Soler",
      phone: "+34 655 234 789",
      status: "caliente",
      source: "Portales",
      propertyAddress: "C/ Alcalá 200, Madrid",
    },
    {
      id: "v2",
      ownerName: "Antonio Reyes Cano",
      phone: "+34 633 456 789",
      status: "seguimiento",
      source: "Web",
      propertyAddress: "Av. Meridiana 340, BCN",
    },
    {
      id: "v3",
      ownerName: "Sofía Delgado Pons",
      phone: "+34 601 321 654",
      status: "seguimiento",
      source: "Referido",
      propertyAddress: "C/ Velázquez 88, Madrid",
    },
  ],
  cualificada: [
    {
      id: "q1",
      ownerName: "Pablo Torres Muñoz",
      phone: "+34 678 432 100",
      status: "caliente",
      source: "Referido",
      propertyAddress: "C/ Goya 34, Madrid",
    },
    {
      id: "q2",
      ownerName: "Elena Castro Vidal",
      phone: "+34 644 876 543",
      status: "seguimiento",
      source: "Web",
      propertyAddress: "Gran Via de les Corts 701",
    },
  ],
  encargo: [
    {
      id: "e1",
      ownerName: "Roberto Navarro Lara",
      phone: "+34 690 543 210",
      status: "caliente",
      source: "Portales",
      propertyAddress: "C/ Fuencarral 120, Madrid",
    },
    {
      id: "e2",
      ownerName: "Cristina Molina Pérez",
      phone: "+34 617 890 234",
      status: "caliente",
      source: "LinkedIn",
      propertyAddress: "Av. Tibidabo 8, Barcelona",
    },
    {
      id: "e3",
      ownerName: "Andrés Serrano Roca",
      phone: "+34 666 111 222",
      status: "seguimiento",
      source: "Referido",
      propertyAddress: "Paseo Recoletos 10",
    },
  ],
  vender: [
    {
      id: "s1",
      ownerName: "Nuria Ramírez Font",
      phone: "+34 654 678 901",
      status: "caliente",
      source: "Referido",
      propertyAddress: "C/ Conde Peñalver 5",
    },
    {
      id: "s2",
      ownerName: "Marcos Gil Aranda",
      phone: "+34 629 345 012",
      status: "caliente",
      source: "Web",
      propertyAddress: "Av. Sarrià 90, Barcelona",
    },
  ],
};

export function KanbanBoard() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-0">
      {COLUMNS.map(({ phase, label, accentColor }) => (
        <PipelineColumn
          key={phase}
          phase={phase}
          label={label}
          leads={MOCK_LEADS[phase]}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}
