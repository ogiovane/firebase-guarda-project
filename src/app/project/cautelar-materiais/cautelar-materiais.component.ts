// src/app/components/cautelar-materiais/cautelar-materiais.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastrosService } from '../services/cadastros.service';
import { MateriaisService } from '../services/materiais.service';
import { HistoricoCautelasService } from '../services/historico-cautelas.service';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';

interface Material {
  id: string;
  tipo: string;
  descricaoMaterial: string;
  status: string;
}

@Component({
  selector: 'app-cautelar-materiais',
  templateUrl: './cautelar-materiais.component.html',
  styleUrls: ['./cautelar-materiais.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CautelarMateriaisComponent implements OnInit {
  form: FormGroup;
  usuarioLogado: any; // Substitua por seu modelo de usuário, se necessário
  materiaisDisponiveis$: Observable<Material[]>;
  materiaisDisponiveis: Material[] = [];

  constructor(
    private fb: FormBuilder,
    private cadastrosService: CadastrosService,
    private materiaisService: MateriaisService,
    private historicoCautelasService: HistoricoCautelasService,
    private authService: AuthService, // Assumindo que você tenha um AuthService
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.form = this.fb.group({
      nf: ['', Validators.required],
      rg: [{value: '', disabled: true}, Validators.required],
      nome: [{value: '', disabled: true}, Validators.required],
      posto: [{value: '', disabled: true}, Validators.required],
      tipoMaterial: ['', Validators.required],
      descricaoMaterial: [{value: '', disabled: false}, Validators.required], // Habilitado para seleção
      status: ['', Validators.required] // Novo campo de status
    });

  }

  ngOnInit(): void {
    this.form.get('tipo')?.valueChanges.pipe(
      switchMap(tipo => {
        if (tipo) {
          return this.firestore.collection<Material>('materiais', ref =>
            ref.where('status', '==', 'Disponível').where('tipo', '==', tipo)
          ).valueChanges({ idField: 'id' });
        } else {
          // Se nenhum tipo for selecionado, limpa a lista
          return of([]);
        }
      })
    ).subscribe(materiais => {
      this.materiaisDisponiveis = materiais; // Garanta que esta linha está correta
    });

    //Autenticacao
    this.authService.getCurrentUser().subscribe(user => {
      this.usuarioLogado = user; // Garanta que este método retorne o usuário atualmente logado
    });
  }

  selecionarTipo(event: Event): void {
    const tipo = (event.target as HTMLSelectElement).value;
    this.carregarMateriaisDisponiveis(tipo);
  }

  // Método para carregar materiais disponíveis por tipo
  carregarMateriaisDisponiveis(tipo: string): void {
    this.materiaisService.getMateriaisDisponiveisPorTipo(tipo).subscribe({
      next: (materiais) => {
        this.materiaisDisponiveis = materiais.length ? materiais : [{ id: 'none', descricao: 'Nenhum item cadastrado deste tipo' }];
        this.form.get('descricaoMaterial').setValue('');
        this.form.get('descricaoMaterial').enable();
        this.form.get('status').setValue('');
      },
      error: (erro) => {
        console.error('Erro ao carregar materiais:', erro);
        // Implemente o tratamento de erro conforme necessário
      }
    });
  }

  validarNF(): void {
    const nf = this.form.get('nf')?.value;
    this.cadastrosService.getCadastroByNf(nf).subscribe(data => {
      if (data.length > 0) {
        const cadastro = data[0];
        this.form.patchValue({
          rg: cadastro.rg,
          nome: cadastro.nome,
          posto: cadastro.posto
        });
        // Agora, ao invés de desabilitar os campos no HTML, fazemos isso aqui:
        this.form.get('rg')?.disable();
        this.form.get('nome')?.disable();
        this.form.get('posto')?.disable();
      }
    });
  }

  carregarMateriaisPorTipo(): void {
    let tipo = this.form.get('tipo')?.value;
    if (tipo) {
      this.materiaisDisponiveis$ = this.firestore.collection<Material>('materiais', ref =>
        ref.where('status', '==', 'Disponível').where('tipo', '==', tipo)
      ).valueChanges({ idField: 'id' });
    } else {
      this.materiaisDisponiveis$ = new Observable<Material[]>(); // Reset quando nenhum tipo é selecionado
    }
  }
  atualizarStatus(): void {
    const materialSelecionado = this.form.get('descricaoMaterial').value;
    if (materialSelecionado === 'none') {
      this.form.get('status').disable();
    } else {
      this.form.get('status').enable();
      // Aqui você pode adicionar lógica adicional para definir o status com base no material selecionado
    }
  }

  atualizarDescricaoMaterial(event: any): void {
    const selectedId = event.target.value;
    const selectedMaterial = this.materiaisDisponiveis.find(material => material.id === selectedId);
    this.form.patchValue({ descricaoMaterial: selectedMaterial?.descricaoMaterial || '' });
  }

  salvar(): void {
    if (this.form.valid) {
      const formData = this.form.getRawValue(); // Use getRawValue para incluir valores de campos desabilitados
      // Aqui, implemente a lógica para salvar os dados no Firebase
      this.historicoCautelasService.addCautela(formData).then(() => {
        console.log('Cautela salva com sucesso!');
        // Implemente ações pós-salvamento, como redirecionamento ou exibição de mensagem de sucesso
      }).catch(error => {
        console.error('Erro ao salvar a cautela:', error);
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/listar-materiais']); // Usando o Router para redirecionar
  }
}
