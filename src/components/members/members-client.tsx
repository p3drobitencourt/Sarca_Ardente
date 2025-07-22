"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Member } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MemberForm } from "./member-form";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

export function MembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const membersCollectionRef = collection(db, "membros"); // Coleção 'membros'
    const unsubscribe = onSnapshot(membersCollectionRef, (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Member));
      setMembers(membersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar membros: ", error);
      toast({ title: "Erro de Conexão", description: "Não foi possível carregar os membros.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleFormSubmit = async (memberData: Omit<Member, 'id'>) => {
    try {
      if (editingMember) {
        const memberDocRef = doc(db, "membros", editingMember.id!);
        await updateDoc(memberDocRef, memberData as any);
        toast({ title: "Sucesso!", description: "Membro atualizado com sucesso." });
      } else {
        await addDoc(collection(db, "membros"), memberData);
        toast({ title: "Sucesso!", description: "Membro adicionado com sucesso." });
      }
      closeDialog();
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      toast({ title: "Erro!", description: "Não foi possível salvar o membro.", variant: "destructive" });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, "membros", memberId));
      toast({ title: "Sucesso!", description: "Membro apagado com sucesso." });
    } catch (error) {
      console.error("Erro ao apagar membro:", error);
      toast({ title: "Erro!", description: "Não foi possível apagar o membro.", variant: "destructive" });
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingMember(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Efeito para fechar o diálogo quando a edição terminar
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingMember(null);
    }
  }, [isDialogOpen]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Membros</h1>
          <p className="text-muted-foreground">Adicione, edite e visualize os membros da congregação.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Editar Membro" : "Adicionar Novo Membro"}</DialogTitle>
            </DialogHeader>
            <MemberForm
              onSubmit={handleFormSubmit}
              initialData={editingMember}
              onClose={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Data de Ingresso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Professo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : members.length > 0 ? (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.nomeCompleto}</TableCell>
                  <TableCell>
                    {member.dataDeIngresso instanceof Timestamp
                      ? member.dataDeIngresso.toDate().toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.ativo ? 'default' : 'secondary'}>
                      {member.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.professo ? 'outline' : 'secondary'}>
                      {member.professo ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Apagar</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isto irá apagar permanentemente o membro dos registos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDeleteMember(member.id!)}
                              >
                                Sim, apagar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum membro encontrado. Comece por adicionar um novo membro.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
