import { Pipe, PipeTransform } from '@angular/core';
import { Cadastro } from '../interfaces/cadastro';

@Pipe({
  standalone: true,
  name: 'filterMilitar'
})
export class FilterMilitarPipe implements PipeTransform {

  transform(items: Cadastro[], searchText: string): Cadastro[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return item.nome.toLowerCase().includes(searchText);
    });
  }

}
