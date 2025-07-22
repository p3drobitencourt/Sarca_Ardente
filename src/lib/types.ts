
import { Timestamp } from 'firebase/firestore';

// Interface para a coleção 'membros'
export interface Member {
  id?: string; // O ID do documento do Firestore
  nomeCompleto: string;
  telefone?: string;
  dataNascimento: Timestamp;
  dataDeIngresso: Timestamp;
  ativo: boolean;
  professo: boolean;
}

// Interface para a coleção 'classes'
export interface Classe {
  id?: string;
  nome: string;
}

// Interface para a coleção 'reunioes'
export interface Reuniao {
  id?: string;
  nome: string;
}

// Interface para a coleção 'presencas'
export interface Presenca {
  id?: string;
  dataRegistro: Timestamp;
  membroId: string;
  membroNome: string; // Denormalizado
  classeId: string;
  classeNome: string; // Denormalizado
  reuniaoId: string;
  reuniaoNome: string; // Denormalizado
  registradoPorId: string; // UserID do Auth
}
