"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, writeBatch, Timestamp, doc, addDoc } from "firebase/firestore";
import { Member, Classe, Reuniao } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "../ui/label";
import { Icons } from "../icons";

import { MemberForm } from "../members/member-form"; // Importando o formulário de membro

export function AttendanceRecordClient() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);

  const [selectedClasseId, setSelectedClasseId] = useState<string>("");
  const [selectedReuniaoId, setSelectedReuniaoId] = useState<string>("");
  const [presentMembers, setPresentMembers] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false); // Estado para o novo diálogo


  // Efeito para buscar todos os dados necessários em tempo real
  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, "membros"), (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(membersData.filter(m => m.ativo)); // Apenas membros ativos
      }),
      onSnapshot(collection(db, "classes"), (snapshot) => {
        const classesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classe));
        setClasses(classesData);
      }),
      onSnapshot(collection(db, "reunioes"), (snapshot) => {
        const reunioesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reuniao));
        setReunioes(reunioesData);
      })
    ];

    // Define o loading como false após um tempo para o caso de não haver dados
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    // Limpa os "ouvintes" e o timer ao desmontar
    return () => {
      unsubscribers.forEach(unsub => unsub());
      clearTimeout(timer);
    };
  }, []);

    // Nova função para adicionar um membro
    const handleAddNewMember = async (memberData: Omit<Member, 'id'>) => {
        try {
        await addDoc(collection(db, "membros"), memberData);
        toast({ title: "Sucesso!", description: "Novo membro adicionado com sucesso. A lista será atualizada." });
        setIsAddMemberDialogOpen(false); // Fecha o diálogo
        } catch (error) {
        console.error("Erro ao adicionar novo membro:", error);
        toast({ title: "Erro!", description: "Não foi possível adicionar o novo membro.", variant: "destructive" });
        }
    };


  const handlePresenceChange = (memberId: string, isChecked: boolean) => {
    setPresentMembers(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(memberId);
      } else {
        newSet.delete(memberId);
      }
      return newSet;
    });
  };

  const handleSavePresences = async () => {
    if (!selectedClasseId || !selectedReuniaoId) {
      toast({ title: "Atenção", description: "Por favor, selecione uma reunião e uma classe.", variant: "destructive" });
      return;
    }
    if (presentMembers.size === 0) {
      toast({ title: "Atenção", description: "Nenhum membro foi marcado como presente.", variant: "destructive" });
      return;
    }
    if (!user) {
        toast({ title: "Erro de Autenticação", description: "Utilizador não encontrado.", variant: "destructive" });
        return;
    }

    setIsSaving(true);
    try {
      const batch = writeBatch(db);
      const dataRegistro = Timestamp.now();
      
      const classeSelecionada = classes.find(c => c.id === selectedClasseId);
      const reuniaoSelecionada = reunioes.find(r => r.id === selectedReuniaoId);

      if (!classeSelecionada || !reuniaoSelecionada) {
        throw new Error("Classe ou Reunião não encontrada.");
      }

      presentMembers.forEach(memberId => {
        const membro = members.find(m => m.id === memberId);
        if (membro) {
          const presencaRef = doc(collection(db, "presencas"));
          batch.set(presencaRef, {
            dataRegistro,
            membroId: membro.id,
            membroNome: membro.nomeCompleto,
            classeId: classeSelecionada.id,
            classeNome: classeSelecionada.nome,
            reuniaoId: reuniaoSelecionada.id,
            reuniaoNome: reuniaoSelecionada.nome,
            registradoPorId: user.uid,
          });
        }
      });

      await batch.commit();
      toast({ title: "Sucesso!", description: `Presença de ${presentMembers.size} membro(s) registrada com sucesso.` });
      setPresentMembers(new Set()); // Limpa a seleção após salvar
    } catch (error) {
      console.error("Erro ao registrar presenças:", error);
      toast({ title: "Erro!", description: "Não foi possível registrar as presenças.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

    return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Registrar Presença</h1>
          <p className="text-muted-foreground">Selecione a reunião, a classe e marque os membros presentes.</p>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="grid gap-2">
            <Label>Reunião</Label>
            <Select value={selectedReuniaoId} onValueChange={setSelectedReuniaoId} disabled={isSaving}>
                <SelectTrigger><SelectValue placeholder="Selecione a reunião..." /></SelectTrigger>
                <SelectContent>
                    {reunioes.map(r => <SelectItem key={r.id} value={r.id!}>{r.nome}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Classe</Label>
            <Select value={selectedClasseId} onValueChange={setSelectedClasseId} disabled={isSaving}>
                <SelectTrigger><SelectValue placeholder="Selecione a classe..." /></SelectTrigger>
                <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id!}>{c.nome}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
      </div>

        
      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros</CardTitle>
          <CardDescription>Marque a caixa de seleção para os membros presentes.</CardDescription>
          
        </CardHeader>
        <CardContent>
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mx-w-4" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Novo  Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Membro</DialogTitle>
            </DialogHeader>
            <MemberForm
              onSubmit={handleAddNewMember}
              onClose={() => setIsAddMemberDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Presente</TableHead>
                <TableHead>Nome do Membro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  </TableRow>
                ))
              ) : members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={presentMembers.has(member.id!)}
                        onCheckedChange={(checked) => handlePresenceChange(member.id!, !!checked)}
                        disabled={isSaving}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Label htmlFor={`member-${member.id}`}>{member.nomeCompleto}</Label>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Nenhum membro ativo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSavePresences} disabled={isSaving}>
          {isSaving ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> A Guardar...</> : "Guardar Presenças"}
        </Button>
      </div>
    </div>
  );
}
