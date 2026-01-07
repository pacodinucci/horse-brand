"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Package,
  House,
  HandCoins,
  Users,
  ShoppingBag,
  Warehouse,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { BackofficeUserButton } from "./backoffice-user-button";

const firstSection = [
  {
    icon: House,
    label: "Inicio",
    href: "/backoffice",
  },
  {
    icon: ShoppingBag,
    label: "Productos",
    href: "/backoffice/products",
  },
  {
    icon: Package,
    label: "Stock",
    href: "/backoffice/stock",
  },
  {
    icon: HandCoins,
    label: "Ventas",
    href: "/backoffice/orders",
  },
  {
    icon: Users,
    label: "Clientes",
    href: "/backoffice/customers",
  },
  {
    icon: Warehouse,
    label: "Depósitos",
    href: "/backoffice/warehouses",
  },
];

export const BackofficeSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground h-23 py-0">
        <Link href="/" className="flex items-center justify-center gap-2 px-2">
          <Image
            src="/logos/HB lite positivo.svg"
            height={200}
            width={100}
            alt="Horse Brand"
          />
          {/* <p className="text-2xl font-semibold">Horse Brand</p> */}
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-50 bg-[var(--var-brown-grey)]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname === item.href &&
                        "bg-linear-to-r/oklch border-[#5D6B68]/10"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5 " />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <div className="px-4 py-2">
          <Separator className="opacity-40 bg-[var(--var-brown-grey)]" />
        </div> */}
      </SidebarContent>
      <SidebarFooter className="text-neutral-800">
        <BackofficeUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
