import SkillBridgeNavbar from "@/components/navbar1";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <SkillBridgeNavbar role="admin" />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 container mx-auto px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}