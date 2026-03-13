"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export interface NewTaskFormData {
  title: string;
  description: string;
  relatedLead: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedUser: string;
}

const EMPTY_FORM: NewTaskFormData = {
  title: "",
  description: "",
  relatedLead: "",
  priority: "",
  status: "",
  dueDate: "",
  assignedUser: "",
};

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewTaskFormData) => void;
}

export function NewTaskModal({ open, onOpenChange, onSubmit }: NewTaskModalProps) {
  const [form, setForm] = useState<NewTaskFormData>(EMPTY_FORM);

  function handleField(field: keyof NewTaskFormData, value: string) {
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
    form.title.trim() && form.priority && form.status && form.assignedUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Nueva tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title" className="text-xs font-medium">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Ej. Llamar al propietario para confirmar visita"
              value={form.title}
              onChange={(e) => handleField("title", e.target.value)}
              className="h-8 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc" className="text-xs font-medium">
              Descripción
              <span className="ml-1 text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="task-desc"
              placeholder="Añade detalles adicionales sobre la tarea..."
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
              className="text-sm resize-none min-h-[72px]"
            />
          </div>

          {/* Related lead (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-lead" className="text-xs font-medium">
              Lead relacionado
              <span className="ml-1 text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Select
              value={form.relatedLead}
              onValueChange={(v) => handleField("relatedLead", v)}
            >
              <SelectTrigger id="task-lead" className="h-8 text-sm">
                <SelectValue placeholder="Seleccionar lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carlos-sanchez">Carlos Sánchez Ruiz</SelectItem>
                <SelectItem value="maria-fernandez">María Fernández Gil</SelectItem>
                <SelectItem value="laura-jimenez">Laura Jiménez Soler</SelectItem>
                <SelectItem value="pablo-torres">Pablo Torres Muñoz</SelectItem>
                <SelectItem value="roberto-navarro">Roberto Navarro Lara</SelectItem>
                <SelectItem value="nuria-ramirez">Nuria Ramírez Font</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority + Status (2 col) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-priority" className="text-xs font-medium">
                Prioridad <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.priority}
                onValueChange={(v) => handleField("priority", v)}
              >
                <SelectTrigger id="task-priority" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-status" className="text-xs font-medium">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleField("status", v)}
              >
                <SelectTrigger id="task-status" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-curso">En curso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due date + Assigned user (2 col) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due" className="text-xs font-medium">
                Fecha límite
              </Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => handleField("dueDate", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-user" className="text-xs font-medium">
                Asignar a <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.assignedUser}
                onValueChange={(v) => handleField("assignedUser", v)}
              >
                <SelectTrigger id="task-user" className="h-8 text-sm">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana-garcia">Ana García</SelectItem>
                  <SelectItem value="pedro-ruiz">Pedro Ruiz</SelectItem>
                  <SelectItem value="laura-soto">Laura Soto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-2 flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={!isValid}>
              Crear tarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
