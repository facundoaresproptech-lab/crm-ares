"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/crm/topbar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/hooks/useUser";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Visita = {
  id: number;
  opportunity_id: number | null;
  planning: string | null;
  fecha_visita: string | null;
  hora: string | null;
  equipo: string | null;
  medio: string | null;
  resultado: string | null;
  planner: string | null;
  owner: string | null;
  buyer: string | null;
  notas: string | null;
  created_by: string;
  created_at: string;
};

type InmuebleOption = {
  id: number;
  label: string;
  propietario: string | null;
  domicilio: string | null;
  owner: string | null;
};

const RESULTADO_OPTIONS = [
  "Pendiente",
  "Realizada",
  "Cancelada",
  "No presentado",
  "Interés",
  "Sin interés",
];

const MEDIO_OPTIONS = [
  "Presencial",
  "Online",
  "Telefónica",
];

function fmt(d: string | null) {
  if (!d) return "—";
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function VisitasPage() {
  const { userWithRole } = useUser();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [inmuebles, setInmuebles] = useState<InmuebleOption[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    opportunity_id: "",
    planning: "",
    fecha_visita: "",
    hora: "",
    equipo: "",
    medio: "Presencial",
    resultado: "Pendiente",
    planner: "",
    owner: "",
    buyer: "",
    notas: "",
  });

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function loadVisitas() {
    setLoading(true);

    const rol = userWithRole?.crmUser.rol;
    const nombre = userWithRole?.crmUser.name;
    const isVisitador = userWithRole?.crmUser.is_visitador;

    let query = supabase
      .from("visitas")
      .select("*")
      .order("fecha_visita", { ascending: false });

    // Comercial no visitador: solo ve sus visitas
    if (rol === "Comercial" && !isVisitador && nombre) {
      query = query.or(`owner.eq.${nombre},planner.eq.${nombre}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error cargando visitas:", error);
      setLoading(false);
      return;
    }

    setVisitas((data ?? []) as Visita[]);
    setLoading(false);
  }

  async function loadInmuebles() {
    const { data, error } = await supabase
      .from("crm_leads_view")
      .select("id, propietario, domicilio, comercial_name")
      .eq("fase_name", "Encargo")
      .order("propietario", { ascending: true });

    if (error) {
      console.error("Error cargando inmuebles:", error);
      return;
    }

    const mapped = (data ?? []).map((row) => ({
      id: row.id as number,
      label: `${row.domicilio || "Sin dirección"} — ${row.propietario || "Sin propietario"}`,
      propietario: row.propietario as string | null,
      domicilio: row.domicilio as string | null,
      owner: row.comercial_name as string | null,
    }));

    setInmuebles(mapped);
  }

  useEffect(() => {
    if (userWithRole) {
      void loadVisitas();
      void loadInmuebles();
    }
  }, [userWithRole]);

  async function handleSaveVisita() {
    if (!form.opportunity_id) return;
    setSaving(true);

    const { error } = await supabase.from("visitas").insert({
      opportunity_id: Number(form.opportunity_id),
      planning: form.planning || null,
      fecha_visita: form.fecha_visita || null,
      hora: form.hora || null,
      equipo: form.equipo || null,
      medio: form.medio || null,
      resultado: form.resultado || null,
      planner: form.planner || null,
      owner: form.owner || null,
      buyer: form.buyer || null,
      notas: form.notas || null,
      created_by: userWithRole?.crmUser.name ?? "Sistema",
    });

    setSaving(false);

    if (error) {
      console.error("Error guardando visita:", error);
      return;
    }

    setModalOpen(false);
    setForm({
      opportunity_id: "",
      planning: "",
      fecha_visita: "",
      hora: "",
      equipo: "",
      medio: "Presencial",
      resultado: "Pendiente",
      planner: "",
      owner: "",
      buyer: "",
      notas: "",
    });

    void loadVisitas();
  }

  const filteredVisitas = visitas.filter((v) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return [
      v.planning,
      v.fecha_visita,
      v.equipo,
      v.planner,
      v.owner,
      v.buyer,
      v.resultado,
      v.medio,
      v.notas,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <>
      <Topbar title="Visitas" />

      <main className="mt-14 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6 py-2.5">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {filteredVisitas.length} visitas en total
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar visitas..."
                className="h-8 w-[260px] rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs font-semibold"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar Visita
          </Button>
        </div>

        {loading && (
          <div className="shrink-0 border-b border-border bg-muted/40 px-6 py-2 text-xs text-muted-foreground">
            Cargando visitas desde Supabase...
          </div>
        )}

        <div className="relative flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: 1400 }}>
            <thead className="sticky top-0 z-20 bg-card">
              <tr className="border-b border-border bg-card/95 text-left backdrop-blur">
                {["Planning", "F. Visita", "Hora", "Equipo", "Inmueble", "Propietario", "Teléfono", "Medio", "Resultado", "Planner", "Owner", "Buyer"].map((col) => (
                  <th key={col} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-background">
              {filteredVisitas.length === 0 && !loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-10 text-center text-xs text-muted-foreground">
                    No hay visitas registradas
                  </td>
                </tr>
              ) : (
                filteredVisitas.map((v, i) => {
                  const inmueble = inmuebles.find((im) => im.id === v.opportunity_id);
                  return (
                    <tr
                      key={v.id}
                      className={cn(
                        "border-b border-border transition-colors hover:bg-accent/40",
                        i % 2 === 0 ? "bg-card" : "bg-background"
                      )}
                    >
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.planning || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{fmt(v.fecha_visita)}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.hora || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.equipo || "—"}</td>
                      <td className="max-w-[200px] truncate px-3 py-2.5 text-xs text-muted-foreground">
                        {inmueble?.domicilio || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-xs font-medium text-foreground">
                        {inmueble?.propietario || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">—</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.medio || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.resultado || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.planner || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.owner || "—"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{v.buyer || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Agregar Visita</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Registrá una nueva visita a un inmueble en encargo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Inmueble (Encargo) *</Label>
              <Select value={form.opportunity_id} onValueChange={(v) => {
                const inmueble = inmuebles.find((im) => String(im.id) === v);
                setField("opportunity_id", v);
                if (inmueble?.owner) setField("owner", inmueble.owner);
              }}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Seleccioná un inmueble..." />
                </SelectTrigger>
                <SelectContent>
                  {inmuebles.map((im) => (
                    <SelectItem key={im.id} value={String(im.id)} className="text-sm">
                      {im.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Planning</Label>
              <Input value={form.planning} onChange={(e) => setField("planning", e.target.value)} className="h-8 text-sm" placeholder="Ej: Alcorcón" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Fecha visita</Label>
              <Input type="date" value={form.fecha_visita} onChange={(e) => setField("fecha_visita", e.target.value)} className="h-8 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Hora</Label>
              <Input type="time" value={form.hora} onChange={(e) => setField("hora", e.target.value)} className="h-8 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Medio</Label>
              <Select value={form.medio} onValueChange={(v) => setField("medio", v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIO_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Resultado</Label>
              <Select value={form.resultado} onValueChange={(v) => setField("resultado", v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESULTADO_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o} className="text-sm">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Equipo</Label>
              <Input value={form.equipo} onChange={(e) => setField("equipo", e.target.value)} className="h-8 text-sm" placeholder="Ej: Abdel, Gonza" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Planner</Label>
              <Input value={form.planner} onChange={(e) => setField("planner", e.target.value)} className="h-8 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Owner</Label>
              <Input value={form.owner} onChange={(e) => setField("owner", e.target.value)} className="h-8 text-sm" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Buyer</Label>
              <Input value={form.buyer} onChange={(e) => setField("buyer", e.target.value)} className="h-8 text-sm" placeholder="Nombre del comprador" />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Notas</Label>
              <Textarea value={form.notas} onChange={(e) => setField("notas", e.target.value)} className="text-sm min-h-[72px] resize-none" placeholder="Observaciones de la visita..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => void handleSaveVisita()} disabled={saving || !form.opportunity_id}>
              {saving ? "Guardando..." : "Guardar visita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}