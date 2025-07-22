"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { Classe, Reuniao, Presenca, Member } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from "../ui/date-range-picker";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";

interface ReportStats {
  totalPresences: number;
  uniqueMeetings: number;
  averageAttendance: number;
  attendanceRate: number;
}

interface ChartData {
  date: string;
  Presenças: number;
}

export function ReportsClient() {
  const { toast } = useToast();
  
  // Dados brutos do Firestore
  const [allPresences, setAllPresences] = useState<Presenca[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Estado dos filtros
  const [selectedReuniaoId, setSelectedReuniaoId] = useState<string>("");
  const [selectedClasseId, setSelectedClasseId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);

  // Busca inicial de dados para os filtros
  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, "classes"), (snapshot) => setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Classe)))),
      onSnapshot(collection(db, "reunioes"), (snapshot) => setReunioes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reuniao)))),
      onSnapshot(collection(db, "membros"), (snapshot) => setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)))),
    ];
    return () => unsubscribers.forEach(unsub => unsub());
  }, []);
  
  // Busca de presenças com base no intervalo de datas
  useEffect(() => {
    setIsLoading(true);
    if (!dateRange?.from) return;

    const q = query(
      collection(db, "presencas"),
      where("dataRegistro", ">=", Timestamp.fromDate(dateRange.from)),
      where("dataRegistro", "<=", Timestamp.fromDate(dateRange.to || dateRange.from))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const presencesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Presenca));
      setAllPresences(presencesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar presenças:", error);
      toast({ title: "Erro", description: "Não foi possível carregar os dados de presença.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dateRange, toast]);

  // Lógica para filtrar e calcular os dados do relatório
  const { filteredPresences, stats, chartData } = useMemo(() => {
    let filtered = allPresences;
    if (selectedReuniaoId) {
      filtered = filtered.filter(p => p.reuniaoId === selectedReuniaoId);
    }
    if (selectedClasseId) {
      filtered = filtered.filter(p => p.classeId === selectedClasseId);
    }

    const totalPresences = filtered.length;
    const meetingDates = new Set(filtered.map(p => p.dataRegistro.toDate().toLocaleDateString()));
    const uniqueMeetings = meetingDates.size;
    const averageAttendance = uniqueMeetings > 0 ? totalPresences / uniqueMeetings : 0;
    const totalActiveMembers = members.filter(m => m.ativo).length;
    const attendanceRate = (uniqueMeetings > 0 && totalActiveMembers > 0) ? (totalPresences / (uniqueMeetings * totalActiveMembers)) * 100 : 0;

    const stats: ReportStats = {
      totalPresences,
      uniqueMeetings,
      averageAttendance: parseFloat(averageAttendance.toFixed(1)),
      attendanceRate: parseFloat(attendanceRate.toFixed(1)),
    };

    const groupedByDate = filtered.reduce((acc, p) => {
      const date = format(p.dataRegistro.toDate(), "dd/MM");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData: ChartData[] = Object.entries(groupedByDate)
      .map(([date, count]) => ({ date, Presenças: count }))
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

    return { filteredPresences: filtered, stats, chartData };
  }, [allPresences, selectedReuniaoId, selectedClasseId, members]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios de Presença</h1>
          <p className="text-muted-foreground">Analise a frequência dos membros nas reuniões e classes.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione os critérios para gerar o relatório.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Intervalo de Datas</Label>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
          <div className="grid gap-2">
            <Label>Reunião (Opcional)</Label>
            <Select value={selectedReuniaoId} onValueChange={setSelectedReuniaoId}>
              <SelectTrigger><SelectValue placeholder="Todas as reuniões" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as reuniões</SelectItem>
                {reunioes.map(r => <SelectItem key={r.id} value={r.id!}>{r.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Classe (Opcional)</Label>
            <Select value={selectedClasseId} onValueChange={setSelectedClasseId}>
              <SelectTrigger><SelectValue placeholder="Todas as classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as classes</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.id!}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>Total de Presenças</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.totalPresences}</CardContent></Card>
        <Card><CardHeader><CardTitle>Reuniões no Período</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.uniqueMeetings}</CardContent></Card>
        <Card><CardHeader><CardTitle>Média por Reunião</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.averageAttendance}</CardContent></Card>
        <Card><CardHeader><CardTitle>Taxa de Presença</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : `${stats.attendanceRate}%`}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Tendência de Presença</CardTitle></CardHeader>
        <CardContent className="h-[350px]">
          {isLoading ? <Skeleton className="h-full w-full" /> : 
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Presenças" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Detalhes das Presenças</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Membro</TableHead><TableHead>Reunião</TableHead><TableHead>Classe</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-5 w-full" /></TableCell></TableRow>) :
               filteredPresences.length > 0 ? filteredPresences.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.membroNome}</TableCell>
                  <TableCell>{p.reuniaoNome}</TableCell>
                  <TableCell>{p.classeNome}</TableCell>
                  <TableCell>{format(p.dataRegistro.toDate(), "dd/MM/yyyy")}</TableCell>
                </TableRow>
               )) : <TableRow><TableCell colSpan={4} className="text-center">Nenhum registro encontrado para os filtros selecionados.</TableCell></TableRow>
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
