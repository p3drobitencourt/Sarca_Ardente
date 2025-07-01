"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Member, MemberStatus } from "@/lib/types";
import { MemberForm } from "./member-form";

interface MembersClientProps {
  data: Member[];
}

export function MembersClient({ data }: MembersClientProps) {
  const [members, setMembers] = useState<Member[]>(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleOpenForm = (member?: Member) => {
    setSelectedMember(member || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMember(null);
  };

  const handleOpenAlert = (member: Member) => {
    setSelectedMember(member);
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setSelectedMember(null);
  };

  const handleFormSubmit = (values: any) => {
    // In a real app, you would send this to your API
    if (selectedMember) {
      // Update member
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id ? { ...m, ...values } : m
        )
      );
    } else {
      // Add new member
      setMembers([...members, { ...values, id: `mem-${Date.now()}` }]);
    }
    handleCloseForm();
  };

  const handleDeactivate = () => {
    if (selectedMember) {
      setMembers(
        members.map((m) =>
          m.id === selectedMember.id
            ? { ...m, status: MemberStatus.Inactive }
            : m
        )
      );
    }
    handleCloseAlert();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length ? (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === MemberStatus.Active ? "default" : "secondary"} className={member.status === MemberStatus.Active ? 'bg-green-500' : 'bg-red-500'}>
                      {member.status === MemberStatus.Active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenForm(member)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenAlert(member)}
                          className="text-destructive"
                        >
                          Desativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedMember ? "Editar Membro" : "Adicionar Membro"}</DialogTitle>
            <DialogDescription>
              {selectedMember
                ? "Atualize as informações do membro."
                : "Preencha as informações para adicionar um novo membro."}
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            initialData={selectedMember}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá desativar o membro &quot;{selectedMember?.name}&quot;. Ele não poderá ser marcado como presente em reuniões.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlert}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} className="bg-destructive hover:bg-destructive/90">Desativar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
