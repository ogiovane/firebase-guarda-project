import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

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

  buscarMateriaisBaixados()  {
    return this.firestore.collection('materiais', ref => ref.where('status', '==', 'Baixado')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


}
