"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BackofficeNavbar } from "@/modules/backoffice/ui/components/backoffice-navbar";
import { BackofficeSidebar } from "@/modules/backoffice/ui/components/backoffice-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client"; // Ajustá según tu auth

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const BackofficeLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) return null;

  return (
    <SidebarProvider>
      <BackofficeSidebar />
      <main className="flex flex-col min-h-screen w-screen bg-muted overflow-x-scroll">
        <BackofficeNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default BackofficeLayout;
