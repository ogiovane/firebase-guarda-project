import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CadastrosService } from '../../services/cadastros.service';

@Component({
  selector: 'app-editar-cadastro',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './editar-cadastro.component.html',
  styleUrl: './editar-cadastro.component.scss'
})
export class CadastrosEditComponent implements OnInit {
  cadastroId: string;
  cadastro: any = {};
  postos = ['AL SD', 'SD', 'CB', '3º SGT', '2º SGT', '1º SGT', 'SUBTEN', 'AL OF', 'ASP OF', 'TEN', 'CAP', 'MAJ', 'TEN-CEL', 'CEL'];
  lotacoes = ['1ª Cia', '2ª Cia', '4ª Cia', '5ª Cia', 'PCS', 'FT', 'Outros'];

  constructor(
    private route: ActivatedRoute,
    private cadastrosService: CadastrosService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
}

