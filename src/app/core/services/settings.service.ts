import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly language = new BehaviorSubject('');
  readonly language$ = this.language.asObservable();

  readonly translations = [
    'Pokémon',
    'Покемон',
    'ポケモン',
    '宝可梦',
    '寶可夢',
    '포켓몬',
    'โปเกมอน',
    'פוקימון',
    'بوكيمون',
    'पोकेमोन',
  ];

  setLanguage(language: string) {
    this.language.next(language);
  }
}
