"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Attendance, Member, Class, Meeting } from "@/lib/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsClientProps {
  attendanceData: Attendance[];
  members: Member[];
  classes: Class[];
  meetings: Meeting[];
}

export function ReportsClient({ attendanceData, members, classes, meetings }: ReportsClientProps) {
  const [filters, setFilters] = useState({
    memberId: 'all',
    classId: 'all',
    meetingId: 'all',
  });

  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m.name])), [members]);
  const classMap = useMemo(() => new Map(classes.map(c => [c.id, c.name])), [classes]);
  const meetingMap = useMemo(() => new Map(meetings.map(m => [m.id, m.name])), [meetings]);

  const filteredData = useMemo(() => {
    return attendanceData.filter(item => {
      const memberMatch = filters.memberId === 'all' || item.memberId === filters.memberId;
      const classMatch = filters.classId === 'all' || item.classId === filters.classId;
      const meetingMatch = filters.meetingId === 'all' || item.meetingId === filters.meetingId;
      return memberMatch && classMatch && meetingMatch;
    });
  }, [attendanceData, filters]);

  const handleFilterChange = (filterName: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrar Relatórios</CardTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <Select value={filters.memberId} onValueChange={handleFilterChange('memberId')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por membro..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Membros</SelectItem>
              {members.map(member => (
                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.classId} onValueChange={handleFilterChange('classId')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por classe..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Classes</SelectItem>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.meetingId} onValueChange={handleFilterChange('meetingId')}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por reunião..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Reuniões</SelectItem>
              {meetings.map(meeting => (
                <SelectItem key={meeting.id} value={meeting.id}>{meeting.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Reunião</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{memberMap.get(item.memberId) || 'N/A'}</TableCell>
                  <TableCell>{classMap.get(item.classId) || 'N/A'}</TableCell>
                  <TableCell>{meetingMap.get(item.meetingId) || 'N/A'}</TableCell>
                  <TableCell>{format(item.date, "dd 'de' MMMM, yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                      Presente
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
