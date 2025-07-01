import { ReportsClient } from "@/components/attendance/reports-client";
import { mockAttendance, mockMembers, mockClasses, mockMeetings } from "@/lib/mock-data";

export default function AttendanceReportsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios de Presença</h2>
      </div>
      <ReportsClient 
        attendanceData={mockAttendance}
        members={mockMembers}
        classes={mockClasses}
        meetings={mockMeetings}
      />
    </div>
  );
}
