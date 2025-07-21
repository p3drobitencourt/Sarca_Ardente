"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Loader } from "@/components/ui/loader";
import {
  Home,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Info,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Ínicio", icon: Home },
  { href: "/attendance/record", label: "Registrar Presença", icon: ClipboardCheck },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/attendance/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/dashboard", label: "Painel de Controle", icon: LayoutDashboard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth(); // Usando o hook de autenticação
  const [aboutOpen, setAboutOpen] = useState(false);

  // Lógica de proteção de rotas e redirecionamento
  useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Mostra um loader em tela cheia enquanto a verificação inicial acontece
  if (!user && pathname !== "/login") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  // Renderiza apenas o conteúdo da página de login, sem o shell
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Renderiza o AppShell completo para usuários autenticados
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
              <AvatarImage src={user?.photoURL || ''} alt={`Foto de ${user?.displayName}`} />
              <AvatarFallback>
                {user?.displayName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user?.displayName}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <SidebarMenuButton tooltip="Sair" onClick={handleSignOut}>
            <LogOut />
            <span>Sair</span>
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

// O componente AboutUsDialog e TeamMember permanecem os mesmos
export function AboutUsDialog({open, onOpenChange}: {open: boolean, onOpenChange: (open: boolean) => void}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sobre o Projeto</DialogTitle>
          <DialogDescription>
            Sarça Ardente é uma aplicação feita para gerenciar membros de congregações religiosas, com foco em facilitar o registro e acompanhamento de presenças nas reuniões.
          </DialogDescription>
        </DialogHeader>

        <Separator />

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
            <div className="text-[10px] sm:text-xs text-muted-foreground gap-2 flex items-center">
              <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYJCPQABgeUdo7EH4fRZRar89eOG1XdYEE3IfJUWWMykIwi1q7Sbm7v2GntSXMdeGad8&usqp=CAU"
              alt="IFSULDEMINAS Logo"
              className="inline h-4"
              />
              Sistemas de Informação IFSULDEMINAS - Campus Machado
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
  const username = github.replace("https://github.com/", "");
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={`https://github.com/${username}.png`} />
        <AvatarFallback>{name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</AvatarFallback>
      </Avatar>
      <a href={github} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {name}
      </a>
    </div>
  );
}
