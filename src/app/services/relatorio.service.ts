// src/app/relatorio/relatorio.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  constructor(private firestore: AngularFirestore) {}

  buscarHistorico(dataInicio: string, dataFim: string) {
    return this.firestore.collection('historico', ref => ref
      .where('dataHoraCautela', '>=', new Date(dataInicio))
      .where('dataHoraDevolucao', '<=', new Date(dataFim))
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
