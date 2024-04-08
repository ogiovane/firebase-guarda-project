import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SortPipe } from '../../pipes/sort.pipe';
import { MensagemService } from '../../services/message.service';

interface Material {
  id: string;
  tipo: string;
  status: string;
  descricaoMaterial: string;
  motivoBaixa: string;
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
  imports: [CommonModule, FormsModule, SortPipe]
})
export class ListaMateriaisComponent implements OnInit {
  cartoesDisponiveis: Observable<number>;
  cartoesCautelados: Observable<number>;
  chavesDisponiveis: Observable<number>;
  chavesCauteladas: Observable<number>;
  materiais$: Observable<Material[]>;
  filtroStatus: string = 'todos';
  materiaisFiltrados: Material[] = [];
  exibirMensagemSemResultados: boolean = false;
  mensagemSucesso: string = '';



  constructor(private firestore: AngularFirestore, private router: Router, private dialog: MatDialog, private mensagemService: MensagemService) {}

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

    this.mensagemService.mensagemAtual.subscribe(mensagem => {
      if (mensagem) {
        this.mensagemSucesso = mensagem;
        setTimeout(() => {
          this.mensagemSucesso = '';
          this.mensagemService.limparMensagem(); // Limpa a mensagem no serviço
        }, 5000); // Limpa a mensagem após 3 segundos
      }
    });
  }


  editarMaterial(id: string): void {
    // Supondo que a rota para editar material seja '/editar-material/{id}'
    this.router.navigate(['/editar-material', id]);
  }

  baixarMaterial(id: string): void {
    // Supondo que a rota para baixar material seja '/baixar-material/{id}'
    this.router.navigate(['/baixar-material', id]);
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

    this.materiais$.subscribe({
      next: (materiais) => {
        this.exibirMensagemSemResultados = materiais.length === 0;
      },
    });
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

  receberMaterial(id: string): void {
    if (confirm('Tem certeza que deseja receber este material?')) {
      // Atualize o status do material para 'Disponível'
      this.firestore.collection('materiais').doc(id).update({ status: 'Disponível', motivoBaixa: '', integranteP4: '' });
    }
  }
}
