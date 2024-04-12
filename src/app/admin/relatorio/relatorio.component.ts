// src/app/relatorio/relatorio.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RelatorioService } from '../../services/relatorio.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule
  ],
  providers: [DatePipe],
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
  form: FormGroup;
  historicos: any[] = [];
  // userData: any;
  // dadosCarregados: boolean = false;


  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    // private authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.authService.getUserData().then(data => {
    //   this.userData = data;
    // });
  }

  exportarPDF(): void {
    // Chama a função de buscar histórico passando true para também exportar para PDF após a busca
    this.buscarHistorico(true);
  }

  buscarHistorico(exportarPDF = false): void {
    if (this.form.valid) {
      const { dataInicio, dataFim } = this.form.value;
      this.relatorioService.buscarHistorico(dataInicio, dataFim).subscribe({
        next: (historicos) => {
          this.historicos = historicos;
          if (historicos.length > 0) {
            if (exportarPDF) {
              this.gerarPDF(); // Chama a função para gerar PDF se for para exportar
            }
          } else {
            console.log('Nenhum dado disponível para o período selecionado.');
          }
        },
        error: (error) => {
          console.error('Erro ao buscar históricos:', error);
        }
      });
    } else {
      console.error('Formulário inválido');
    }
  }

  gerarPDF(): void {
    const doc = new jsPDF();
    const startDate = this.datePipe.transform(this.form.value.dataInicio, 'dd/MM/yyyy HH:mm');
    const endDate = this.datePipe.transform(this.form.value.dataFim, 'dd/MM/yyyy HH:mm');

    doc.setFontSize(16);
    doc.text('Relatório de Cautelas - Guarda 1° BPM', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Período: ${startDate}h a ${endDate}h`, 105, 30, { align: 'center' });

    autoTable(doc, {
      startY: 40,
      head: [['Data Cautela', 'Descrição', 'Militar', 'Ab. Num.', 'Data Devolução', 'Responsável Devolução']],
      body: this.historicos.map(h => [
        this.datePipe.transform(h.dataHoraCautela.toDate(), 'dd/MM/yyyy HH:mm'),
        `${h.tipo} ${h.descricaoMaterial}`,
        `${h.posto} ${h.nome}`,
        h.cupomAbastecimento || '-',
        h.dataHoraDevolucao ? this.datePipe.transform(new Date(h.dataHoraDevolucao.seconds * 1000), 'dd/MM/yyyy HH:mm') : '-',
        h.responsavelDevolucao
      ]),
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 139], halign: 'center' }, // Azul indigo
      margin: { horizontal: 10 },
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle' },
      bodyStyles: { valign: 'top' },
      showHead: 'everyPage',
      tableWidth: 'auto'
    });

    doc.save('relatorio-cautelas.pdf');
  }
}
