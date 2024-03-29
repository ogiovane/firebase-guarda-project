// src/app/services/materiais.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Material {
  id: string;
  tipo: string;
  status: string;
  // Inclua outros campos conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class MateriaisService {
  constructor(private firestore: AngularFirestore) {}

  buscarTotaisMateriais() {
    return this.firestore.collection('materiais').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as { tipo: string, status: string }; // Ajuste para incluir campos conhecidos
        const id = a.payload.doc.id;
        return { id, ...data } as Material; // Assegura que o retorno é tipado como Material
      })),
      map(materiais => {
        // Processamento dos totais por tipo
        const totaisPorTipo = materiais.reduce((acc, material) => {
          if (!acc[material.tipo]) {
            acc[material.tipo] = { disponiveis: 0, cautelados: 0, total: 0 };
          }
          if (material.status === 'Disponível') {
            acc[material.tipo].disponiveis += 1;
          } else if (material.status === 'Cautelado') {
            acc[material.tipo].cautelados += 1;
          }
          acc[material.tipo].total += 1;

          return acc;
        }, {});
        return totaisPorTipo;
      })
    );
  }

  getMateriaisDisponiveisPorTipo(tipo: string): Observable<any[]> {
    return this.firestore.collection('materiais', ref => ref.where('tipo', '==', tipo).where('status', '==', 'Disponível')).valueChanges({ idField: 'id' });
  }
}
