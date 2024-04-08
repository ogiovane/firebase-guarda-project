import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Material } from '../interfaces/material';

@Injectable({
  providedIn: 'root'
})
export class HistoricoCautelasService {
  constructor(private firestore: AngularFirestore) {
  }

  addCautela(cautela: any): Promise<any> {
    return this.firestore.collection('historico-cautelas').add(cautela);
  }

  buscarMateriaisCautelados() {
    return this.firestore.collection('historico', ref => ref.where('status', '==', 'Cautelado')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  buscarMateriaisBaixados(): Observable<Material[]> {
    // Query para materiais com status 'Baixado'
    const baixados$ = this.firestore.collection('materiais', ref =>
      ref.where('status', '==', 'Baixado')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Material; // Tipagem explícita aqui
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    // Query para materiais com status 'P4'
    const p4$ = this.firestore.collection('materiais', ref =>
      ref.where('status', '==', 'P4')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Material; // Tipagem explícita aqui
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    // Combinar resultados das duas queries
    return combineLatest([baixados$, p4$]).pipe(
      map(([baixados, p4]) => [...baixados, ...p4])
    );
  }
}
