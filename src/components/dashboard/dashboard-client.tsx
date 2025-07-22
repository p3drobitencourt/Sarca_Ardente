"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Classe, Reuniao } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// Componente genérico para gerir uma lista (Classes ou Reuniões)
function ManagementList<T extends { id?: string; nome: string }>({
  collectionName,
  title,
  description,
}: {
  collectionName: "classes" | "reunioes";
  title: string;
  description: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [itemName, setItemName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const ref = collection(db, collectionName);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
      setItems(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName]);

  const handleSave = async () => {
    if (!itemName.trim()) {
      toast({ title: "Erro", description: "O nome não pode estar vazio.", variant: "destructive" });
      return;
    }

    try {
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id!), { nome: itemName });
        toast({ title: "Sucesso!", description: `${title} atualizada com sucesso.` });
      } else {
        await addDoc(collection(db, collectionName), { nome: itemName });
        toast({ title: "Sucesso!", description: `${title} adicionada com sucesso.` });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(`Erro ao salvar ${collectionName}:`, error);
      toast({ title: "Erro!", description: `Não foi possível salvar a ${title}.`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Sucesso!", description: `${title} apagada com sucesso.` });
    } catch (error) {
      console.error(`Erro ao apagar ${collectionName}:`, error);
      toast({ title: "Erro!", description: `Não foi possível apagar a ${title}.`, variant: "destructive" });
    }
  };

  const openDialog = (item: T | null = null) => {
    setEditingItem(item);
    setItemName(item ? item.nome : "");
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button onClick={() => openDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div key={item.id} className={`flex items-center justify-between p-4 ${index < items.length - 1 ? 'border-b' : ''}`}>
                <span className="font-medium">{item.nome}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita e irá apagar a {title} permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id!)} className="bg-destructive hover:bg-destructive/90">
                          Sim, apagar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">Nenhum item encontrado.</div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? `Editar ${title}` : `Adicionar Nova ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder={`Nome da ${title}`}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function DashboardClient() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">Algumas onfigurações e informações da aplicação.</p>
      </div>
      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">Gerir Classes</TabsTrigger>
          <TabsTrigger value="reunioes">Gerir Reuniões</TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
          <ManagementList<Classe>
            collectionName="classes"
            title="Classe"
            description="Crie e edite as classes para as reuniões (ex: Classe dos Jovens)."
          />
        </TabsContent>
        <TabsContent value="reunioes">
          <ManagementList<Reuniao>
            collectionName="reunioes"
            title="Reunião"
            description="Crie e edite as diferentes de reuniões (ex: Escola Bíblica Dominical)."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
