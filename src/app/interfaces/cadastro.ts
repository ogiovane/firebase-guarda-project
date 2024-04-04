export interface Cadastro {
  id?: string;
  lotacao?: string; // Firestore Timestamp
  nf: string;
  nome: string;
  posto: string;
  rg: string;
  email?: string;
  celular?: string;
}
