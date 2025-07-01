import { MembersClient } from "@/components/members/members-client";
import { mockMembers } from "@/lib/mock-data";

export default async function MembersPage() {
  // In a real app, you would fetch this data from your database.
  const members = mockMembers;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membros</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua congregação.
          </p>
        </div>
      </div>
      <MembersClient data={members} />
    </div>
  );
}
