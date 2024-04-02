import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Historico {
  dataHoraCautela: any; // Firestore Timestamp
  tipo: string;
  descricaoMaterial: string;
  nome: string;
  dataHoraDevolucao?: any; // Firestore Timestamp
  responsavelDevolucao?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  constructor(private firestore: AngularFirestore) {}

  getHistorico(): Observable<Historico[]> {
    return this.firestore.collection<Historico>('historico', ref => ref.orderBy('dataHoraCautela', 'desc'))
      .valueChanges({ idField: 'id' });
  }
}
