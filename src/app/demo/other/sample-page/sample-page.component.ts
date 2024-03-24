// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export class SamplePageComponent {

  cadastroForm: FormGroup;

  constructor() {
    this.cadastroForm = new FormGroup({
      postoGraduacao: new FormControl(''),
      nome: new FormControl(''),
      rg: new FormControl(''),
      numeroFuncional: new FormControl(''),
      celular: new FormControl(''),
      lotacao: new FormControl('')
    });
  }

  onSubmit(): void {
    // TODO: Enviar dados do formulário para o servidor
    console.log(this.cadastroForm.value);
  }
}
