import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RelatorioService } from '../../services/relatorio.service';
import { AuthService } from '../../services/auth-service.service';
import { DatePipe } from '@angular/common';
import { CadastrosService } from '../../services/cadastros.service';

interface Historico {
  dataHoraCautela: Date;
  nome: string;
  tipo: string;
  descricaoMaterial: string;
  dataHoraDevolucao?: Date;
  responsavelDevolucao?: string;
}

@Component({
  selector: 'app-relatorio-cautelas',
  templateUrl: './relatorio-cautelas.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe
  ],
  styleUrls: ['./relatorio-cautelas.component.scss']
})
export class RelatorioComponent implements OnInit {

  form: FormGroup;
  historicos: any[] = [];
  userData: any;
  comandante: any;

  constructor(private fb: FormBuilder, private relatorioService: RelatorioService, private authService: AuthService, private cadastrosService: CadastrosService,) {
    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getUserData().then(data => {
      this.userData = data;
    });
  }

  buscarHistorico(): void {
    if (this.form.valid) {
      const { dataInicio, dataFim } = this.form.value;
      this.relatorioService.buscarHistorico(dataInicio, dataFim).subscribe(historicos => {
        this.historicos = historicos;
      });
    }
  }

  validarNF(): void {
    const nf = this.form.get('nf')?.value;
    this.cadastrosService.getCadastroByNf(nf).subscribe(data => {
      if (data.length > 0) {
        const comanandante = data[0];
        this.form.patchValue({
          rg: comanandante.rg,
          nome: comanandante.nome,
          posto: comanandante.posto
        });
        // Agora, ao invés de desabilitar os campos no HTML, fazemos isso aqui:
        this.form.get('rg')?.disable();
        this.form.get('nome')?.disable();
        this.form.get('posto')?.disable();
      }
    });
  }
}
