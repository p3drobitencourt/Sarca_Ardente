"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/attendance/record", label: "Registrar Presença", icon: ClipboardCheck },
  { href: "/attendance/reports", label: "Relatórios", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Sarça Ardente</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Professor" data-ai-hint="person"/>
              <AvatarFallback>PF</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Professor</span>
              <span className="text-xs text-muted-foreground">professor@exemplo.com</span>
            </div>
          </div>
           <SidebarMenuButton asChild tooltip="Sair">
            <Link href="/login">
                <LogOut />
                <span>Sair</span>
            </Link>
           </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                {/* Optional Header Content */}
            </div>
            <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5"/>
            </Button>
        </header>
        <main className="flex-1 flex-col bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
