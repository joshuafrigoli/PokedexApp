import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'mapstat',
  standalone: true,
})
export class MapstatPipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  transform(stat: string): string {
    switch (stat) {
      case 'hp':
        return this.translateService.instant('stats.hp');
      case 'attack':
        return this.translateService.instant('stats.attack');
      case 'defense':
        return this.translateService.instant('stats.defense');
      case 'special-attack':
        return this.translateService.instant('stats.special_attack');
      case 'special-defense':
        return this.translateService.instant('stats.special_defense');
      case 'speed':
        return this.translateService.instant('stats.speed');
      default:
        return '';
    }
  }
}
