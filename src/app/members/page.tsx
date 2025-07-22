// src/app/members/page.tsx

import { MembersClient } from "@/components/members/members-client";

export default function MembersPage() {
  // A página não busca dados. Ela apenas renderiza o componente cliente.
  // O MembersClient irá tratar da conexão com o Firestore.
  return <MembersClient />;
}