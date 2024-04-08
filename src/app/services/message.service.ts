import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private mensagemSource = new BehaviorSubject<string>('');
  mensagemAtual = this.mensagemSource.asObservable();

  constructor() {}

  mudarMensagem(mensagem: string) {
    this.mensagemSource.next(mensagem);
  }

  limparMensagem() {
    this.mensagemSource.next('');
  }
}
