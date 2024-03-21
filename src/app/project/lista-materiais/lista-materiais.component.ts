import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Material {
  id: string;
  tipo: string;
  status: string;
  descricao: string;
}

@Component({
  selector: 'app-lista-materiais',
  templateUrl: './lista-materiais.component.html',
  styleUrls: ['./lista-materiais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListaMateriaisComponent implements OnInit {
  materiaisDisponiveis$: Observable<number>;
  materiaisCautelados$: Observable<number>;
  materiais$: Observable<Material[]>;
  filtroStatus: string = 'todos';
  materiaisFiltrados: Material[] = [];

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.materiais$ = this.firestore.collection<Material>('materiais').valueChanges({ idField: 'id' });

    this.materiaisDisponiveis$ = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Disponível').where('tipo', '==', 'Cartão'))
      .valueChanges().pipe(map(materiais => materiais.length));

    this.materiaisCautelados$ = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Cautelado').where('tipo', '==', 'Cartão'))
      .valueChanges().pipe(map(materiais => materiais.length));

    this.firestore.collection<Material>('materiais').valueChanges({ idField: 'id' })
      .subscribe(materiais => {
        this.materiaisFiltrados = materiais;
        this.aplicarFiltro(); // Aplica o filtro inicialmente, se necessário
      });
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'todos') {
      // Se 'todos' estiver selecionado, não filtre os materiais
      this.materiais$ = this.firestore.collection<Material>('materiais').valueChanges({ idField: 'id' });
    } else {
      // Filtra os materiais baseado no status selecionado
      this.materiais$ = this.firestore.collection<Material>('materiais', ref =>
        ref.where('status', '==', this.filtroStatus)).valueChanges({ idField: 'id' });
    }
  }

  cadastrarMilitar(): void {
    // Implemente ou redirecione para a lógica de cadastro do militar
  }

  cadastrarMaterial(): void {
    // Implemente ou redirecione para a lógica de cadastro de material
  }

  redirecionarParaCautelar(id: string): void {
    // Aqui você pode passar o ID como um estado ou parâmetro de rota, se necessário
    this.router.navigate(['/cautelar-material']);
  }
}
