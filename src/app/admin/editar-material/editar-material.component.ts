import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { CadastrosService } from '../../services/cadastros.service';
import { MateriaisService } from '../../services/materiais.service';

@Component({
  selector: 'app-editar-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-material.component.html',
  styleUrl: './editar-material.component.scss'
})
export class EditarMaterialComponent implements OnInit {
  material: any = { status: '', motivoBaixa: '' };
  materialId: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router, private materialService: MateriaisService) {}

  ngOnInit(): void {
    this.materialId = this.route.snapshot.params['id'];
    this.firestore.collection('materiais').doc(this.materialId).valueChanges().subscribe(material => {
      this.material = material;
    });
  }

  onStatusChange(status: string): void {
    this.material.status = status;
    // Seu código adicional para lidar com a mudança de status, se necessário
  }

  editarMaterial(): void {
    // Prepara o objeto com as atualizações do material
    const updateData = {
      descricaoMaterial: this.material.descricaoMaterial,
      status: this.material.status,
      tipo: this.material.tipo
    };

    // Se o status é 'Disponível', garante que o motivo da baixa seja limpo
    if (this.material.status === 'Disponível') {
      updateData['motivoBaixa'] = ''; // Limpa o motivo da baixa
      updateData['integranteP4'] = '';
    } else if (this.material.status === 'P4') {
      updateData['motivoBaixa'] = '';
      updateData['integranteP4'] = 'Entregue a: ' + this.material.integranteP4;
    } else {
      // Garante que o motivo da baixa seja mantido ou atualizado conforme fornecido
      updateData['integranteP4'] = '';
      updateData['motivoBaixa'] = this.material.motivoBaixa;
    }

    // Verifica a unicidade de 'tipo' e 'descricaoMaterial' antes de atualizar
    this.firestore.collection('materiais', ref => ref
      .where('tipo', '==', this.material.tipo)
      .where('descricaoMaterial', '==', this.material.descricaoMaterial)
      .limit(1))
      .get()
      .toPromise()
      .then((resultado) => {
        // Verifica se o documento encontrado não é o mesmo que está sendo editado
        const existeMaterialDuplicado = resultado.docs.some(doc => doc.id !== this.materialId);
        if (existeMaterialDuplicado) {
          alert('Já existe um material com o mesmo tipo e descrição.');
        } else {
          // Prossiga com a atualização
          this.firestore.collection('materiais').doc(this.materialId).update(updateData).then(() => {
            this.router.navigate(['/listar-materiais']); // Ajuste a rota conforme necessário
          }).catch(error => {
            console.error("Erro ao atualizar material:", error);
          });
        }
      })
      .catch(error => {
        console.error("Erro ao verificar duplicidade:", error);
      });
  }

  onDescricaoChange(event: any) {
    const valor = event.target.value;
    this.material.descricaoMaterial = valor.replace(/\s+/g, '').toUpperCase();
  }

  cancelarEdicao(): void {
    this.router.navigate(['/listar-materiais']);
  }

  excluirMaterial(): void {
    const confirmacao = confirm('Tem certeza que deseja excluir este material?');
    if (confirmacao) {
      // Aqui, substitua 'this.idDoMaterial' pelo mecanismo correto que você tem para acessar o ID do material
      this.materialService.deleteMaterial(this.materialId).then(() => {
        alert('Material excluído com sucesso.');
        this.router.navigate(['/listar-materiais']);
      }).catch(error => {
        console.error('Erro ao excluir material:', error);
        alert('Ocorreu um erro ao tentar excluir o material.');
      });
    }
  }
}
