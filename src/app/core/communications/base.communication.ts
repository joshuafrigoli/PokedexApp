import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseCommunication {
  private readonly http = inject(HttpClient);

  protected get<T>(
    url: string,
    options?: {
      headers?: HttpHeaders | Record<string, string | string[]>;
      params?:
        | HttpParams
        | Record<
            string,
            string | number | boolean | ReadonlyArray<string | number | boolean>
          >;
    }
  ) {
    return this.http.get<T>(url, options);
  }
}
