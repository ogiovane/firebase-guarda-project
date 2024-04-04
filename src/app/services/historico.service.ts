import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Historico } from '../interfaces/historico';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  constructor(private firestore: AngularFirestore) {}

  getHistorico(): Observable<Historico[]> {
    // Calcula a data de 15 dias atrás
    const quinzeDiasAtras = new Date();
    quinzeDiasAtras.setDate(quinzeDiasAtras.getDate() - 15);

    return this.firestore.collection<Historico>('historico', ref =>
      ref
        .where('dataHoraCautela', '>=', Timestamp.fromDate(quinzeDiasAtras))
        .orderBy('dataHoraCautela', 'desc')
    ).valueChanges({ idField: 'id' });
  }
}
