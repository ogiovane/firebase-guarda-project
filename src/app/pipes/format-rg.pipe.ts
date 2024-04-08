import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'formatRg'
})
export class FormatRgPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Remove caracteres não numéricos
    const onlyNums = value.replace(/\D/g, '');
    // Aplica a formatação
    const formatted = onlyNums.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2-$3');
    return formatted;
  }

}
