import { Sidebar } from "@/components/crm/sidebar";

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-56 min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
