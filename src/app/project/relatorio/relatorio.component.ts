// src/app/relatorio/relatorio.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RelatorioService } from '../services/relatorio.service';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
  form: FormGroup;
  historicos: any[] = [];

  constructor(private fb: FormBuilder, private relatorioService: RelatorioService) {
    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  buscarHistorico(): void {
    if (this.form.valid) {
      const { dataInicio, dataFim } = this.form.value;
      this.relatorioService.buscarHistorico(dataInicio, dataFim).subscribe(historicos => {
        this.historicos = historicos;
      });
    }
  }
}
