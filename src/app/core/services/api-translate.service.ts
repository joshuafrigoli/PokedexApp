import { inject, Injectable } from '@angular/core';
import { ApiTranslateCommunication } from '../communications/api-translate.communication';
import { SettingsService } from './settings.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiTranslateService {
  private readonly apiTranslateCommunication = inject(
    ApiTranslateCommunication
  );
  private readonly settingsService = inject(SettingsService);
  private readonly language = toSignal(
    this.settingsService.language$.pipe(map((lang) => lang.split('-')[0])),
    { initialValue: '' }
  );

  getTranslation(text: string, from: string, to?: string) {
    const params: any = {
      q: text,
      langpair: `${from}|${to || this.language()}`,
    };
    return this.apiTranslateCommunication.getTranslation(params);
  }
}
