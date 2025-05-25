import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'undash',
  standalone: true,
})
export class UndashPipe implements PipeTransform {
  private firstCharToUpperCase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  transform(string: string, titlecase = true): string {
    return string.split('-').length > 1
      ? titlecase
        ? string
            .split('-')
            .map((word) => this.firstCharToUpperCase(word))
            .join(' ')
        : this.firstCharToUpperCase(string.split('-')[0]) +
          ' ' +
          string.split('-').slice(1).join(' ')
      : this.firstCharToUpperCase(string);
  }
}
