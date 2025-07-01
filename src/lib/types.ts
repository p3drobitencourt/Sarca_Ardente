export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: MemberStatus;
}

export interface Class {
  id: string;
  name: string;
}

export interface Meeting {
  id: string;
  name: string;
  date: Date;
}

export interface Attendance {
  id: string;
  memberId: string;
  classId: string;
  meetingId: string;
  date: Date;
}
