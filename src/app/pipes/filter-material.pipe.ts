import { Pipe, PipeTransform } from '@angular/core';
import { Historico } from '../services/historico.service';

@Pipe({
  standalone: true,
  name: 'filterMaterial'
})
export class FilterMaterialPipe implements PipeTransform {

  transform(items: Historico[], searchText: string): Historico[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return item.descricaoMaterial.toLowerCase().includes(searchText);
    });
  }

}
