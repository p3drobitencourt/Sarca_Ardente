"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockMembers, mockClasses, mockMeetings } from '@/lib/mock-data';
import type { Member } from '@/lib/types';
import { UserPlus, PlusCircle, ArrowRight, Trash2 } from 'lucide-react';

export default function AttendanceRecordPage() {
  const [availableMembers, setAvailableMembers] = useState<Member[]>(mockMembers);
  const [presentMembers, setPresentMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddMember = (member: Member) => {
    setPresentMembers((prev) => [...prev, member]);
    setAvailableMembers((prev) => prev.filter((m) => m.id !== member.id));
  };

  const handleRemoveMember = (member: Member) => {
    setAvailableMembers((prev) => [...prev, member]);
    setPresentMembers((prev) => prev.filter((m) => m.id !== member.id));
  }

  const filteredMembers = availableMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Registrar Presença</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Reunião</CardTitle>
              <CardDescription>Selecione a reunião e a classe para registrar a presença.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting">Reunião</Label>
                <Select>
                  <SelectTrigger id="meeting">
                    <SelectValue placeholder="Selecione uma reunião" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMeetings.map((meeting) => (
                      <SelectItem key={meeting.id} value={meeting.id}>{meeting.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Select>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Selecione uma classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Membros</CardTitle>
              <CardDescription>Procure e adicione membros à lista de presentes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mt-4 max-h-60 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {filteredMembers.map((member) => (
                    <li key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <span>{member.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleAddMember(member)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Lista de Presença</CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>Membros marcados como presentes nesta reunião.</CardDescription>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{presentMembers.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Separator />
              {presentMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground">Nenhum membro presente adicionado.</p>
                  <p className="text-sm text-muted-foreground">Use a busca para adicionar membros.</p>
                </div>
              ) : (
                <div className="mt-4 max-h-[30rem] overflow-y-auto pr-2">
                  <ul className="space-y-2">
                    {presentMembers.map((member) => (
                      <li key={member.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                        <span className="font-medium">{member.name}</span>
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member)}>
                           <Trash2 className="h-4 w-4 text-destructive" />
                         </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={presentMembers.length === 0}>
                Salvar Presenças
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
