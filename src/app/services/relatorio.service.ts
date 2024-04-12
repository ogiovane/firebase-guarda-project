// src/app/relatorio/relatorio.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  constructor(private firestore: AngularFirestore) {}

  buscarHistorico(dataInicio: string, dataFim: string) {
    // Consulta para documentos onde dataHoraEmprestimo está no intervalo especificado
    const emprestimoQuery = this.firestore.collection('historico', ref => ref
      .where('dataHoraEmprestimo', '>=', new Date(dataInicio))
      .where('dataHoraEmprestimo', '<=', new Date(dataFim))
      .orderBy('dataHoraCautela', 'asc') // Adicionando ordenação
    ).snapshotChanges();

    // Consulta para documentos onde dataHoraDevolucao está no intervalo especificado, se definido
    const devolucaoQuery = this.firestore.collection('historico', ref => ref
      .where('dataHoraDevolucao', '>=', new Date(dataInicio))
      .where('dataHoraDevolucao', '<=', new Date(dataFim))
      .orderBy('dataHoraCautela', 'asc') // Adicionando ordenação
    ).snapshotChanges();

    // Combinar os resultados das duas consultas e remover duplicatas
    return combineLatest([emprestimoQuery, devolucaoQuery]).pipe(
      map(([emprestimos, devolucoes]) => {
        const allDocs = [...emprestimos, ...devolucoes];
        const uniqueDocs = new Map();

        // Ordenar os documentos antes de eliminar duplicatas
        allDocs.sort((a, b) => {
          const dataA = a.payload.doc.data() as any;
          const dataB = b.payload.doc.data() as any;
          return dataA.dataHoraCautela.toDate() - dataB.dataHoraCautela.toDate();
        });

        for (const doc of allDocs) {
          const data = doc.payload.doc.data() as any;
          const id = doc.payload.doc.id;
          if (!uniqueDocs.has(id)) {
            uniqueDocs.set(id, { id, ...data });
          }
        }

        return Array.from(uniqueDocs.values());
      })
    );
  }
}
