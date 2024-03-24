import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Material {
  id: string;
  tipo: string;
  descricaoMaterial: string;
  status: string;
}

interface Militar {
  id: string;
  rg: string;
  nome: string;
  posto: string;
  // Adicione outras propriedades conforme necessário
}

@Component({
  selector: 'app-cautelar-material',
  templateUrl: './cautelar-material.component.html',
  styleUrls: ['./cautelar-material.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CommonModule]
})
export class CautelarMaterialComponent implements OnInit {
  emprestimoForm: FormGroup;
  materiaisDisponiveis$: Observable<Material[]>;
  materiaisDisponiveis: Material[] = [];

  constructor(private firestore: AngularFirestore, private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router) {
    this.emprestimoForm = new FormGroup({
      nf: new FormControl('', Validators.required),
      rg: new FormControl({ value: '', disabled: true }, Validators.required),
      nome: new FormControl({ value: '', disabled: true }, Validators.required),
      posto: new FormControl({ value: '', disabled: true }, Validators.required),
      tipo: new FormControl('', Validators.required),
      materialId: new FormControl('', Validators.required),
      descricaoMaterial: new FormControl('', Validators.required), // Campo adicionado para descrição
      status: new FormControl('', Validators.required)
    });

    // Se os dados do material forem passados, preencha o formulário com esses dados
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const material: Material = navigation.extras.state['material'];
      this.emprestimoForm.patchValue({
        tipo: material.tipo, // Ajuste conforme o nome do campo no seu formulário
        descricaoMaterial: material.descricaoMaterial, // Ajuste conforme o nome do campo no seu formulário
        materialId: material.id,
        status: 'Disponível' // Isso é apenas um exemplo, ajuste conforme necessário
      });
    }
  }

  ngOnInit(): void {
    this.emprestimoForm.get('tipo')?.valueChanges.pipe(
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
  }


  carregarMateriaisPorTipo(): void {
    let tipo = this.emprestimoForm.get('tipo')?.value;
    if (tipo) {
      this.materiaisDisponiveis$ = this.firestore.collection<Material>('materiais', ref =>
        ref.where('status', '==', 'Disponível').where('tipo', '==', tipo)
      ).valueChanges({ idField: 'id' });
    } else {
      this.materiaisDisponiveis$ = new Observable<Material[]>(); // Reset quando nenhum tipo é selecionado
    }
  }

  validarMilitar(): void {
    const nf = this.emprestimoForm.get('nf')?.value;
    this.firestore.collection<Militar>('cadastros', ref => ref.where('nf', '==', nf)).valueChanges({ idField: 'id' }).pipe(
      map(militares => militares[0])
    ).subscribe(militar => {
      if (militar) {
        this.emprestimoForm.patchValue({
          rg: militar.rg,
          nome: militar.nome,
          posto: militar.posto
        });
      } else {
        alert('Militar não encontrado.');
      }
    });
  }

  adicionarAoHistorico(dadosEmprestimo): void {
    const registroHistorico = {
      ...dadosEmprestimo,
      dataHora: dadosEmprestimo.dataHora.toISOString() // Converte a data/hora para string ISO

      // Certifique-se de que os campos necessários estão incluídos, você pode omitir campos não desejados aqui
    };

    this.firestore.collection('historico').add(registroHistorico)
      .then(() => console.log('Registro adicionado ao histórico com sucesso.'))
      .catch(error => console.error('Erro ao adicionar registro ao histórico:', error));
  }

  atualizarDescricaoMaterial(event: any): void {
    const selectedId = event.target.value;
    const selectedMaterial = this.materiaisDisponiveis.find(material => material.id === selectedId);
    this.emprestimoForm.patchValue({ descricaoMaterial: selectedMaterial?.descricaoMaterial || '' });
  }

  salvarEmprestimo(): void {
    if (this.emprestimoForm.valid) {
      const emprestimoData = this.emprestimoForm.getRawValue();
      // Ajuste a linha abaixo para incluir a data/hora atual antes de salvar
      emprestimoData.dataHoraCautela = new Date();
      emprestimoData.responsavelCautela = '';
      emprestimoData.dataHoraDevolucao = '';
      emprestimoData.responsavelDevolucao = '';

      this.firestore.collection('historico').add(emprestimoData).then(docRef => {
        console.log('Emprestimo registrado com sucesso:', docRef.id);

        // Atualizar status do material para 'Cautelado'
        this.atualizarStatusMaterial(emprestimoData.materialId, 'Cautelado').then(() => {
          // Somente após a atualização do status, perguntar se deseja continuar
          const desejaContinuar = confirm('Deseja continuar realizando cautelas?');
          if (desejaContinuar) {
            // Se deseja continuar, resetar apenas os campos necessários e recarregar materiais disponíveis
            this.emprestimoForm.controls['tipo'].updateValueAndValidity();
            this.emprestimoForm.controls['materialId'].reset();
            this.emprestimoForm.controls['descricaoMaterial'].reset();
            this.emprestimoForm.controls['status'].reset();
            // É importante chamar o método para recarregar materiais disponíveis
            this.carregarMateriaisPorTipo();
          } else {
            // Se não deseja continuar, redirecionar para a lista de materiais
            this.router.navigate(['/listar-materiais']);
          }
        });
      }).catch(error => {
        console.error('Erro ao salvar empréstimo:', error);
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  async atualizarStatusMaterial(materialId: string, novoStatus: string): Promise<void> {
    return this.firestore.collection('materiais').doc(materialId).update({ status: novoStatus });
  }


  // atualizarStatusMaterial(materialId: string, novoStatus: string): void {
  //   this.firestore.collection('materiais').doc(materialId).update({ status: novoStatus })
  //     .then(() => console.log('Status do material atualizado com sucesso.'))
  //     .catch(error => console.error('Erro ao atualizar status do material:', error));
  // }

  cancelarEmprestimo(): void {
    this.emprestimoForm.reset();
  }

  voltar(): void {
    this.router.navigate(['/listar-materiais']);
  }
}
