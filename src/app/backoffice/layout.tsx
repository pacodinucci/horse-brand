import { SidebarProvider } from "@/components/ui/sidebar";
import { BackofficeNavbar } from "@/modules/backoffice/ui/components/backoffice-navbar";
import { BackofficeSidebar } from "@/modules/backoffice/ui/components/backoffice-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const BackofficeLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <BackofficeSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        <BackofficeNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default BackofficeLayout;
