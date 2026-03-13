"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AGENT_OPTIONS,
  PHASE_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/crm-data";

export interface NewLeadFormData {
  ownerName: string;
  address: string;
  distrito: string;
  cp: string;
  valor: string;
  phone: string;
  source: string;
  status: string;
  phase: string;
  fechaNoticia: string;
  fechaContacto: string;
  fechaValoracion: string;
  hora: string;
  owner: string;
  notes: string;
}

const EMPTY_FORM: NewLeadFormData = {
  ownerName: "",
  address: "",
  distrito: "",
  cp: "",
  valor: "",
  phone: "",
  source: "",
  status: "",
  phase: "",
  fechaNoticia: "",
  fechaContacto: "",
  fechaValoracion: "",
  hora: "",
  owner: "",
  notes: "",
};

interface NewLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewLeadFormData) => void;
}

export function NewLeadModal({ open, onOpenChange, onSubmit }: NewLeadModalProps) {
  const [form, setForm] = useState<NewLeadFormData>(EMPTY_FORM);

  function handleField(field: keyof NewLeadFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(form);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  const isValid =
    form.ownerName.trim() &&
    form.address.trim() &&
    form.phone.trim() &&
    form.source &&
    form.status &&
    form.phase;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Nuevo lead</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Introduce los datos principales del nuevo lead. Podrás completar o editar la
            información más adelante.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-5">
          {/* Datos del propietario */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ownerName" className="text-xs font-medium text-foreground">
                Propietario <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ownerName"
                placeholder="Ej. Carlos Sánchez Ruiz"
                value={form.ownerName}
                onChange={(e) => handleField("ownerName", e.target.value)}
                className="h-8 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                Teléfono <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ej. +34 612 345 678"
                value={form.phone}
                onChange={(e) => handleField("phone", e.target.value)}
                className="h-8 text-sm"
                required
              />
            </div>
          </div>

          {/* Inmueble */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="address" className="text-xs font-medium text-foreground">
                Domicilio <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Ej. C/ Serrano 12"
                value={form.address}
                onChange={(e) => handleField("address", e.target.value)}
                className="h-8 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="distrito" className="text-xs font-medium text-foreground">
                Distrito
              </Label>
              <Input
                id="distrito"
                placeholder="Ej. Salamanca"
                value={form.distrito}
                onChange={(e) => handleField("distrito", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp" className="text-xs font-medium text-foreground">
                CP
              </Label>
              <Input
                id="cp"
                placeholder="Ej. 28001"
                value={form.cp}
                onChange={(e) => handleField("cp", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <Label htmlFor="valor" className="text-xs font-medium text-foreground">
                Valor estimado
              </Label>
              <Input
                id="valor"
                placeholder="Ej. 450.000 €"
                value={form.valor}
                onChange={(e) => handleField("valor", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Pipeline */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source" className="text-xs font-medium text-foreground">
                Origen <span className="text-destructive">*</span>
              </Label>
              <Select value={form.source} onValueChange={(v) => handleField("source", v)}>
                <SelectTrigger id="source" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phase" className="text-xs font-medium text-foreground">
                Fase <span className="text-destructive">*</span>
              </Label>
              <Select value={form.phase} onValueChange={(v) => handleField("phase", v)}>
                <SelectTrigger id="phase" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar fase" />
                </SelectTrigger>
                <SelectContent>
                  {PHASE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs font-medium text-foreground">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select value={form.status} onValueChange={(v) => handleField("status", v)}>
                <SelectTrigger id="status" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fechas y hora */}
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="fechaNoticia"
                className="text-xs font-medium text-foreground"
              >
                Fecha noticia
              </Label>
              <Input
                id="fechaNoticia"
                type="date"
                value={form.fechaNoticia}
                onChange={(e) => handleField("fechaNoticia", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="fechaContacto"
                className="text-xs font-medium text-foreground"
              >
                Fecha contacto
              </Label>
              <Input
                id="fechaContacto"
                type="date"
                value={form.fechaContacto}
                onChange={(e) => handleField("fechaContacto", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="fechaValoracion"
                className="text-xs font-medium text-foreground"
              >
                Fecha valoración
              </Label>
              <Input
                id="fechaValoracion"
                type="date"
                value={form.fechaValoracion}
                onChange={(e) => handleField("fechaValoracion", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hora" className="text-xs font-medium text-foreground">
                Hora
              </Label>
              <Input
                id="hora"
                type="time"
                value={form.hora}
                onChange={(e) => handleField("hora", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Asignación */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="owner" className="text-xs font-medium text-foreground">
                Owner
              </Label>
              <Select value={form.owner} onValueChange={(v) => handleField("owner", v)}>
                <SelectTrigger id="owner" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar agente" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_OPTIONS.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observaciones iniciales */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="text-xs font-medium text-foreground">
              Observaciones iniciales
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => handleField("notes", e.target.value)}
              className="min-h-[72px] text-sm resize-none"
              placeholder="Notas u observaciones iniciales sobre el lead..."
            />
          </div>

          <DialogFooter className="mt-1 flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={!isValid}>
              Crear lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
