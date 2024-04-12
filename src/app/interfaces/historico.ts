export interface Historico {
  dataHoraCautela: any; // Firestore Timestamp
  tipo: string;
  descricaoMaterial: string;
  utilizacao: string;
  nome: string;
  dataHoraDevolucao?: any; // Firestore Timestamp
  responsavelDevolucao?: string;
  responsavelCautela?: string;
  cupomAbastecimento?: string
}
