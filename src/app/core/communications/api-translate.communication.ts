import { Injectable } from '@angular/core';
import { BaseCommunication } from './base.communication';
import { ENV } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiTranslate } from 'src/app/shared/interfaces/api-translate/api-translate';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiTranslateCommunication extends BaseCommunication {
  private readonly apiBaseUrl = ENV.TRANSLATE.BASE_URL;

  getTranslation(
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
  ) {
    return super
      .get<ApiTranslate>(this.apiBaseUrl, { params })
      .pipe(
        map((res) =>
          res.responseData.translatedText.split(' ').join('-').toLowerCase()
        )
      );
  }
}
