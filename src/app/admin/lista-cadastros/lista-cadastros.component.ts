import { Component, OnInit } from '@angular/core';
import { CadastrosService } from '../../services/cadastros.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cadastro } from '../../interfaces/cadastro';
import { CommonModule } from '@angular/common';
import { FilterMilitarPipe } from '../../pipes/filter-militar.pipe';

@Component({
  selector: 'app-lista-cadastros',
  standalone: true,
  imports: [FormsModule, CommonModule, FilterMilitarPipe],
  templateUrl: './lista-cadastros.component.html',
  styleUrls: ['./lista-cadastros.component.scss']
})
export class CadastrosListComponent implements OnInit {
  cadastros: Cadastro[] = [];
  paginatedCadastros: Cadastro[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 20;
  searchText: string = '';

  constructor(private cadastrosService: CadastrosService, private router: Router) {}

  ngOnInit(): void {
    this.loadCadastros();
  }

  loadCadastros(): void {
    this.cadastrosService.getCadastros().subscribe(data => {
      this.cadastros = data;
      this.applyFilterAndPagination();
    });
  }

  applyFilterAndPagination(): void {
    // Filtra os cadastros se houver texto de busca; caso contrário, usa todos os cadastros.
    let filtered = this.searchText ? this.cadastros.filter(c => c.nome.toLowerCase().includes(this.searchText.toLowerCase())) : this.cadastros;
    this.paginatedCadastros = filtered.slice(this.currentPage * this.itemsPerPage, (this.currentPage + 1) * this.itemsPerPage);
  }

  changePage(newPage: number, event?: MouseEvent): void {
    event?.preventDefault();
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.currentPage = newPage;
    this.applyFilterAndPagination();
  }

  get totalPages(): number {
    let filteredLength = this.searchText ? this.cadastros.filter(c => c.nome.toLowerCase().includes(this.searchText.toLowerCase())).length : this.cadastros.length;
    return Math.ceil(filteredLength / this.itemsPerPage);
  }

  editCadastro(id: string): void {
    this.router.navigate(['/editar-cadastro', id]);
  }

  deleteCadastro(id: string): void {
    const isConfirmed = confirm('Tem certeza que deseja excluir este cadastro?');
    if (isConfirmed) {
      this.cadastrosService.deleteCadastro(id).then(() => {
        // Opcional: Recarregar a lista de cadastros ou remover o item localmente
        alert('Cadastro excluído com sucesso.');
        this.loadCadastros(); // Recarrega a lista de cadastros após a exclusão
      }).catch((error) => {
        console.error('Erro ao excluir cadastro:', error);
        alert('Ocorreu um erro ao tentar excluir o cadastro.');
      });
    }
  }
}
