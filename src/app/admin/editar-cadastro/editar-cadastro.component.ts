import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastrosService } from '../../services/cadastros.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './editar-cadastro.component.html',
  styleUrl: './editar-cadastro.component.scss'
})
export class CadastrosEditComponent implements OnInit {
  cadastroId: string;
  cadastro: any = {};
  postos : string[];
  lotacoes: string[];

  constructor(
    private route: ActivatedRoute,
    private cadastrosService: CadastrosService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.postos = this.cadastrosService.postos;
    this.lotacoes = this.cadastrosService.lotacoes;
    this.cadastroId = this.route.snapshot.params['id'];
    const cadastroId = this.route.snapshot.paramMap.get('id');
    if (cadastroId) {
      this.cadastrosService.getCadastroById(cadastroId).subscribe(cadastro => {
        this.cadastro = cadastro;
      });
    }
  }

  updateCadastro(): void {
    this.cadastrosService.updateCadastro(this.cadastroId, this.cadastro).then(() => {
      // Redireciona para a lista de cadastros após a atualização bem-sucedida
      this.router.navigate(['/lista-cadastros']);
    }).catch(error => {
      console.error('Erro ao atualizar o cadastro:', error);
    });
  }

  onPostoChange(posto: string): void {
    this.cadastro.posto = posto;
  }

  cancelarEdicao() {
    this.router.navigate(['/lista-cadastros']);
  }

  excluirMilitar() {
    const confirmacao = confirm('Tem certeza que deseja excluir este cadastro?');
    if (confirmacao) {
      this.cadastrosService.deleteCadastro(this.cadastroId).then(() => {
        alert('Cadastro excluído com sucesso.');
        this.router.navigate(['/lista-cadastros']);
      }).catch(error => {
        console.error('Erro ao excluir cadastro:', error);
        alert('Ocorreu um erro ao tentar excluir o cadastro.');
      });
    }
  }
}

