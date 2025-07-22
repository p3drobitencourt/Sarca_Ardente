"use client";

import * as React from "react";
import { useState } from "react";
import { Member } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker"; // Importa o novo componente DatePicker

// Schema de validação com Zod
const memberFormSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  telefone: z.string().optional(),
  dataNascimento: z.date({ required_error: "A data de nascimento é obrigatória." }),
  dataDeIngresso: z.date({ required_error: "A data de ingresso é obrigatória." }),
  ativo: z.boolean(),
  professo: z.boolean(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

interface MemberFormProps {
  onSubmit: (data: Omit<Member, 'id'>) => Promise<void>;
  initialData?: Member | null;
  onClose: () => void;
}

export function MemberForm({ onSubmit, initialData, onClose }: MemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      nomeCompleto: initialData?.nomeCompleto || "",
      telefone: initialData?.telefone || "",
      dataNascimento: initialData?.dataNascimento ? initialData.dataNascimento.toDate() : undefined,
      dataDeIngresso: initialData?.dataDeIngresso ? initialData.dataDeIngresso.toDate() : undefined,
      ativo: initialData?.ativo ?? true,
      professo: initialData?.professo ?? false,
    },
  });

  const handleSubmit = async (data: MemberFormData) => {
    setIsLoading(true);
    const memberData = {
      ...data,
      dataNascimento: Timestamp.fromDate(data.dataNascimento),
      dataDeIngresso: Timestamp.fromDate(data.dataDeIngresso),
    };
    await onSubmit(memberData);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do membro" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="(35) 99999-9999" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                {/* A implementação antiga do Popover foi substituída por este componente */}
                <DatePicker 
                  value={field.value || null} 
                  onChange={field.onChange}
                  isDisabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataDeIngresso"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Ingresso</FormLabel>
                {/* A implementação antiga do Popover foi substituída por este componente */}
                <DatePicker 
                  value={field.value || null} 
                  onChange={field.onChange}
                  isDisabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 flex-1">
                <FormLabel>Ativo</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="professo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 flex-1">
                <FormLabel>Professo</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "A guardar..." : "Guardar Membro"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
