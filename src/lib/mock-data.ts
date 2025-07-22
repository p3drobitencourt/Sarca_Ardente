import { Member, Classe, Reuniao, Presenca } from './types';
import { Timestamp } from 'firebase/firestore';

// Membros de exemplo
export const mockMembers: Member[] = [
  {
    id: 'mem-1',
    nomeCompleto: 'João Silva',
    telefone: '(35) 99999-1111',
    dataNascimento: Timestamp.fromDate(new Date('2000-01-01')),
    dataDeIngresso: Timestamp.fromDate(new Date('2020-01-01')),
    ativo: true,
    professo: true,
  },
  {
    id: 'mem-2',
    nomeCompleto: 'Maria Souza',
    telefone: '(35) 98888-2222',
    dataNascimento: Timestamp.fromDate(new Date('1995-05-10')),
    dataDeIngresso: Timestamp.fromDate(new Date('2021-03-15')),
    ativo: true,
    professo: false,
  },
  {
    id: 'mem-3',
    nomeCompleto: 'Carlos Oliveira',
    telefone: '(35) 97777-3333',
    dataNascimento: Timestamp.fromDate(new Date('1988-09-20')),
    dataDeIngresso: Timestamp.fromDate(new Date('2019-07-22')),
    ativo: false,
    professo: true,
  },
];

// Classes de exemplo
export const mockClasses: Classe[] = [
  { id: 'cls-1', nome: 'Classe de Jovens' },
  { id: 'cls-2', nome: 'Classe de Adultos' },
  { id: 'cls-3', nome: 'Classe de Crianças' },
  { id: 'cls-4', nome: 'Estudo Bíblico Avançado' },
];

// Reuniões de exemplo
export const mockMeetings: Reuniao[] = [
  { id: 'meet-1', nome: 'Culto de Domingo' },
  { id: 'meet-2', nome: 'Reunião de Oração' },
  { id: 'meet-3', nome: 'Escola Dominical' },
];

// Presenças de exemplo
export const mockAttendance: Presenca[] = [
  {
    id: 'att-1',
    dataRegistro: Timestamp.fromDate(new Date('2024-05-19T10:00:00')),
    membroId: 'mem-1',
    membroNome: 'João Silva',
    classeId: 'cls-1',
    classeNome: 'Classe de Jovens',
    reuniaoId: 'meet-1',
    reuniaoNome: 'Culto de Domingo',
    registradoPorId: 'user-1',
  },
  {
    id: 'att-2',
    dataRegistro: Timestamp.fromDate(new Date('2024-05-19T10:00:00')),
    membroId: 'mem-2',
    membroNome: 'Maria Souza',
    classeId: 'cls-1',
    classeNome: 'Classe de Jovens',
    reuniaoId: 'meet-1',
    reuniaoNome: 'Culto de Domingo',
    registradoPorId: 'user-1',
  },
  {
    id: 'att-3',
    dataRegistro: Timestamp.fromDate(new Date('2024-05-19T10:00:00')),
    membroId: 'mem-3',
    membroNome: 'Carlos Oliveira',
    classeId: 'cls-2',
    classeNome: 'Classe de Adultos',
    reuniaoId: 'meet-1',
    reuniaoNome: 'Culto de Domingo',
    registradoPorId: 'user-2',
  },
  {
    id: 'att-4',
    dataRegistro: Timestamp.fromDate(new Date('2024-05-22T19:30:00')),
    membroId: 'mem-1',
    membroNome: 'João Silva',
    classeId: 'cls-4',
    classeNome: 'Estudo Bíblico Avançado',
    reuniaoId: 'meet-2',
    reuniaoNome: 'Reunião de Oração',
    registradoPorId: 'user-1',
     },
];