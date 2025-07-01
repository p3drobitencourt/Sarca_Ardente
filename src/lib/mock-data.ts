import { Member, MemberStatus, Class, Meeting, Attendance } from './types';

export const mockMembers: Member[] = [
  { id: 'mem-1', name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321', status: MemberStatus.Active },
  { id: 'mem-2', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(21) 91234-5678', status: MemberStatus.Active },
  { id: 'mem-3', name: 'Carla Dias', email: 'carla.dias@example.com', phone: '(31) 95555-8888', status: MemberStatus.Active },
  { id: 'mem-4', name: 'Daniel Alves', email: 'daniel.alves@example.com', phone: '(41) 94444-7777', status: MemberStatus.Inactive },
  { id: 'mem-5', name: 'Eduarda Lima', email: 'eduarda.lima@example.com', phone: '(51) 93333-6666', status: MemberStatus.Active },
  { id: 'mem-6', name: 'Fábio Melo', email: 'fabio.melo@example.com', phone: '(61) 92222-5555', status: MemberStatus.Active },
];

export const mockClasses: Class[] = [
  { id: 'cls-1', name: 'Classe de Jovens' },
  { id: 'cls-2', name: 'Classe de Adultos' },
  { id: 'cls-3', name: 'Classe de Crianças' },
  { id: 'cls-4', name: 'Estudo Bíblico Avançado' },
];

export const mockMeetings: Meeting[] = [
  { id: 'meet-1', name: 'Culto de Domingo', date: new Date('2024-05-19T10:00:00') },
  { id: 'meet-2', name: 'Reunião de Oração', date: new Date('2024-05-22T19:30:00') },
  { id: 'meet-3', name: 'Escola Dominical', date: new Date('2024-05-26T09:00:00') },
];

export const mockAttendance: Attendance[] = [
    { id: 'att-1', memberId: 'mem-1', classId: 'cls-1', meetingId: 'meet-1', date: new Date('2024-05-19T10:00:00') },
    { id: 'att-2', memberId: 'mem-2', classId: 'cls-1', meetingId: 'meet-1', date: new Date('2024-05-19T10:00:00') },
    { id: 'att-3', memberId: 'mem-3', classId: 'cls-2', meetingId: 'meet-1', date: new Date('2024-05-19T10:00:00') },
    { id: 'att-4', memberId: 'mem-5', classId: 'cls-2', meetingId: 'meet-1', date: new Date('2024-05-19T10:00:00') },
    { id: 'att-5', memberId: 'mem-1', classId: 'cls-4', meetingId: 'meet-2', date: new Date('2024-05-22T19:30:00') },
    { id: 'att-6', memberId: 'mem-2', classId: 'cls-4', meetingId: 'meet-2', date: new Date('2024-05-22T19:30:00') },
];
