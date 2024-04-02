import { Component, OnInit } from '@angular/core';
import { CadastrosService } from '../../services/cadastros.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-cadastros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-cadastros.component.html',
  styleUrl: './lista-cadastros.component.scss'
})
export class CadastrosListComponent implements OnInit {
  cadastros: any[] = [];
  orderBy: string = '';
  searchText: string = '';

  constructor(private cadastrosService: CadastrosService,
              private router: Router ) {}

  ngOnInit(): void {
    this.loadCadastros();
  }

  loadCadastros() {
    this.cadastrosService.getCadastros(this.searchText).subscribe(cadastros => {
      this.cadastros = cadastros;
    });
  }

  buscaPorNome() {
    this.searchText = this.searchText.toUpperCase();
    this.loadCadastros();
  }

  editCadastro(id: string): void {
    this.router.navigate(['/editar-cadastro', id]);  // Navega para a página de edição com o ID do cadastro
  }

  deleteCadastro(id: string): void {
    if(confirm('Tem certeza que deseja excluir este cadastro?')) {
      this.cadastrosService.deleteCadastro(id).then(() => {
        // Feedback de sucesso ou erro para o usuário
      });
    }
  }
}
