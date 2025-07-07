"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Info,
  CircleUser,
} from "lucide-react";

import { useState } from "react";

const navItems = [
  { href: "/", label: "Ínicio", icon: Home },
  { href: "/attendance/record", label: "Registrar Presença", icon: ClipboardCheck },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/attendance/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard", label: "Painel de Controle", icon: LayoutDashboard },
];

const user = {
  name: "Ricardo 123",
  email: "ricardo@gmail.com",
  imageUrl: "",
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [aboutOpen, setAboutOpen] = useState(false);

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
          <div className="flex items-center gap-2 p-2 rounded-md">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.imageUrl} alt={`Foto do ${user.name}`} data-ai-hint="person"/>
                <AvatarFallback>
                <img
                  src="https://api.dicebear.com/9.x/thumbs/svg"
                  alt="Foto do Usuário"
                  data-ai-hint="person"
                  className="h-full w-full object-cover"
                />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
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
            <Button variant="ghost" size="icon" onClick={() => setAboutOpen(true)}>
              <Info className="h-5 w-5"/>
            </Button>
          <AboutUsDialog open={aboutOpen} onOpenChange={setAboutOpen} />
        </header>
        <main className="flex-1 flex-col bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AboutUsDialog({open, onOpenChange}: {open: boolean, onOpenChange: (open: boolean) => void}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sobre o Projeto</DialogTitle>
          <DialogDescription>
            Sarça Ardente é uma aplicação feita para gerenciar membros de congregações religiosas, como foco em facilitar o registro e acompanhamento de presenças nas reuniões.
          </DialogDescription>
        </DialogHeader>

        <Separator className="max-w-xs sm:max-w-none" />

        <Card>
          <CardHeader>
            <CardTitle>Equipe de Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <TeamMember name="Luis Gustavo" github="https://github.com/luisgustavo52" />
            <TeamMember name="Pedro Bitencourt" github="https://github.com/p3drobitencourt" />
            <TeamMember name="Enrique Lobo" github="https://github.com/EnrLobo" />
            <TeamMember name="João Henrique" github="https://github.com/kkjaokk" />
            <Separator/>
            <div className="text-[10px] sm:text-xs text-muted-foreground gap-2 flex">
              <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYJCPQABgeUdo7EH4fRZRar89eOG1XdYEE3IfJUWWMykIwi1q7Sbm7v2GntSXMdeGad8&usqp=CAU"
              alt="IFSULDEMINAS Logo"
              className="inline h-4 align-middle mr-1"
              />
              Sistemas Informação IFSULDEMINAS - Campus Machado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Telefone: (35) 99838-6148</div>
            <div>Email: pedro.bitencourt@alunos.ifsuldeminas.edu.br</div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function TeamMember({ name, github }: { name: string; github: string }) {
  // Extrai o usuário do link do GitHub para usar na imagem/avatar
  const username = github.replace("https://github.com/", "");
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={`https://github.com/${username}.png`} />
        <AvatarFallback>{name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 3)}</AvatarFallback>
      </Avatar>
      <a href={github} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    </div>
  );
}
