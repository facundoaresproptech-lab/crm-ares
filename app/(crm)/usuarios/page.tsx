import { Topbar } from "@/components/crm/topbar";
import { UserCog, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

export default function UsuariosPage() {
  return (
    <>
      <Topbar title="Usuarios" />
      <main className="flex flex-col flex-1 overflow-hidden mt-14 min-h-0">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6 py-2.5">
          <span className="text-xs text-muted-foreground">
            Equipo y permisos de acceso
          </span>
          <Button size="sm" className="h-7 gap-1.5 text-xs font-semibold">
            <UserPlus className="h-3.5 w-3.5" />
            Invitar usuario
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Empty
            icon={<UserCog className="h-8 w-8 text-muted-foreground/40" />}
            title="Sin usuarios adicionales"
            description="Invita a los agentes de tu equipo para colaborar en el pipeline."
          />
        </div>
      </main>
    </>
  );
}
