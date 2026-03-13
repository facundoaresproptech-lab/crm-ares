"use client";

import { useState } from "react";
import { Topbar } from "@/components/crm/topbar";
import { NewTaskModal } from "@/components/crm/new-task-modal";
import { Plus, Circle, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TaskPriority = "alta" | "media" | "baja";
type TaskStatus = "pendiente" | "en-curso" | "completada";

interface Task {
  id: string;
  title: string;
  description?: string;
  relatedLead?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedUser: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Llamar a Carlos Sánchez para confirmar visita",
    relatedLead: "Carlos Sánchez Ruiz",
    priority: "alta",
    status: "pendiente",
    dueDate: "2025-03-15",
    assignedUser: "Ana García",
  },
  {
    id: "t2",
    title: "Enviar valoración a Laura Jiménez",
    description: "Adjuntar informe comparativo de mercado.",
    relatedLead: "Laura Jiménez Soler",
    priority: "alta",
    status: "en-curso",
    dueDate: "2025-03-14",
    assignedUser: "Laura Soto",
  },
  {
    id: "t3",
    title: "Preparar contrato de encargo para Pablo Torres",
    relatedLead: "Pablo Torres Muñoz",
    priority: "media",
    status: "pendiente",
    dueDate: "2025-03-18",
    assignedUser: "Pedro Ruiz",
  },
  {
    id: "t4",
    title: "Publicar inmueble de Roberto Navarro en portales",
    relatedLead: "Roberto Navarro Lara",
    priority: "media",
    status: "completada",
    assignedUser: "Ana García",
  },
  {
    id: "t5",
    title: "Seguimiento semanal a Javier Ortega",
    priority: "baja",
    status: "pendiente",
    dueDate: "2025-03-20",
    assignedUser: "Pedro Ruiz",
  },
];

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string; dot: string }> = {
  alta: {
    label: "Alta",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  media: {
    label: "Media",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  baja: {
    label: "Baja",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; dot: string }> = {
  pendiente: { label: "Pendiente", dot: "bg-blue-400" },
  "en-curso": { label: "En curso", dot: "bg-amber-400" },
  completada: { label: "Completada", dot: "bg-emerald-500" },
};

export default function TareasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <>
      <Topbar title="Tareas" />

      <main className="flex flex-col flex-1 overflow-hidden mt-14 min-h-0">
        {/* Sub-header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6 py-2.5">
          <span className="text-xs text-muted-foreground">
            {tasks.filter((t) => t.status !== "completada").length} tareas pendientes
          </span>
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs font-semibold"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva tarea
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Tarea</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Lead relacionado</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Prioridad</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Fecha límite</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground">Agente</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr
                  key={task.id}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-accent/60",
                    i % 2 === 0 ? "bg-card" : "bg-background",
                    task.status === "completada" && "opacity-60"
                  )}
                >
                  {/* Tarea */}
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          "font-medium text-foreground leading-tight",
                          task.status === "completada" && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Lead */}
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {task.relatedLead ?? (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>

                  {/* Prioridad */}
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                        PRIORITY_CONFIG[task.priority].className
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          PRIORITY_CONFIG[task.priority].dot
                        )}
                      />
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          STATUS_CONFIG[task.status].dot
                        )}
                      />
                      {STATUS_CONFIG[task.status].label}
                    </span>
                  </td>

                  {/* Fecha límite */}
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {task.dueDate ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>

                  {/* Agente */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary uppercase">
                        {task.assignedUser
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {task.assignedUser}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <NewTaskModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
