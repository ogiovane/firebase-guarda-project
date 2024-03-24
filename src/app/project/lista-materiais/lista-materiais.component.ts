import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface Material {
  id: string;
  tipo: string;
  status: string;
  descricaoMaterial: string;
  rg: string;
  nf: string;
  posto: string;
  nome: string;
}

@Component({
  selector: 'app-lista-materiais',
  templateUrl: './lista-materiais.component.html',
  styleUrls: ['./lista-materiais.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListaMateriaisComponent implements OnInit {
  cartoesDisponiveis: Observable<number>;
  cartoesCautelados: Observable<number>;
  chavesDisponiveis: Observable<number>;
  chavesCauteladas: Observable<number>;
  materiais$: Observable<Material[]>;
  filtroStatus: string = 'todos';
  materiaisFiltrados: Material[] = [];

  constructor(private firestore: AngularFirestore, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.materiais$ = this.firestore.collection<Material>('materiais').valueChanges({ idField: 'id' });

    this.cartoesDisponiveis = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Disponível').where('tipo', '==', 'Cartão'))
      .valueChanges().pipe(map(materiais => materiais.length));

    this.cartoesCautelados = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Cautelado').where('tipo', '==', 'Cartão'))
      .valueChanges().pipe(map(materiais => materiais.length));

    this.chavesDisponiveis = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Disponível').where('tipo', '==', 'Chave'))
      .valueChanges().pipe(map(materiais => materiais.length));

    this.chavesCauteladas = this.firestore.collection<Material>('materiais', ref => ref.where('status', '==', 'Cautelado').where('tipo', '==', 'Chave'))
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

  redirecionarParaCautelar(): void {
    this.router.navigate(['/cautelar-material']);
  }

  devolverMaterial(material: Material): void {
    this.router.navigate(['/devolver-material'], { state: { material } });
  }

  /*  devolverMaterial(material: Material): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Lógica para salvar a devolução na base de dados historico
          const devolucaoData = {
            dataHoraDevolucao: new Date().toISOString(),
            tipo: material.tipo,
            descricao: material.descricao,
            rg: material.rg, // Suponha que esses dados sejam acessíveis no objeto material
            nf: material.nf,
            posto: material.posto,
            nome: material.nome,
            usuario: 'UsuárioFuturo' // Será substituído pela implementação de login
          };

          this.firestore.collection('historico').add(devolucaoData).then(() => {
            console.log('Devolução registrada com sucesso.');
          }).catch(error => {
            console.error('Erro ao registrar devolução:', error);
          });

          // Atualize o status do material para 'Disponível'
          this.firestore.collection('materiais').doc(material.id).update({ status: 'Disponível' });
        }
      });
    }*/
}
