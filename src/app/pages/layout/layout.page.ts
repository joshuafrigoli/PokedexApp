import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  resource,
  viewChild,
} from '@angular/core';
import {
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { SelectComponent } from '../../shared/components/select/select.component';
import { HomePage } from './home/home.page';
import { ApiService } from 'src/app/core/services/api.service';
import { lastValueFrom, tap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ResponseList } from 'src/app/shared/interfaces/pokemon/api';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonContent,
    IonMenu,
    IonMenuToggle,
    IonToolbar,
    IonIcon,
    SelectComponent,
    HomePage,
    TranslatePipe,
    IonFab,
    IonFabButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPage {
  private readonly apiService = inject(ApiService);
  private readonly translateService = inject(TranslateService);

  private readonly contentRef = viewChild<IonContent>('contentRef');

  private currentPokedex = linkedSignal(() => {
    const pokedexes = this.pokedexes.value();
    if (pokedexes.names.length <= 0) return '';
    return pokedexes.names[0];
  });
  private currentType = linkedSignal(() => {
    const types = this.types.value();
    if (types.names.length <= 0) return '';
    return types.names[0];
  });

  readonly pokedexes = resource({
    defaultValue: { names: [], response: [] },
    loader: async () => {
      const data = await lastValueFrom(this.apiService.getPokedexes());
      return { names: data.map((dex) => dex.name), response: data };
    },
  });

  readonly types = resource({
    defaultValue: { names: [], response: [] },
    loader: async () => {
      const data = await lastValueFrom(this.apiService.getTypes());
      const allString: string = this.translateService.instant('select.all');
      const allObject: ResponseList = { name: allString, url: '' };
      console.log([allObject, ...data]);
      return {
        names: [
          allString,
          ...data.map((type) =>
            this.translateService.instant(`types.${type.name}`)
          ),
        ],
        response: [allObject, ...data],
      };
    },
  });

  handlePokedexChange(e: string) {
    this.currentPokedex.set(e);
    const pokedexUrl = this.pokedexes
      .value()
      .response.find((dex) => dex.name === this.currentPokedex())?.url;
    if (!pokedexUrl) {
      this.apiService.resetFilteredPokedex();
      return;
    }
    this.getFilteredPokedex(pokedexUrl, this.currentType());
  }

  handleTypeChange(e: string) {
    const currentType =
      this.types.value().response[this.types.value().names.indexOf(e)].name;
    this.currentType.set(currentType);
    const pokedexUrl = this.pokedexes
      .value()
      .response.find((dex) => dex.name === this.currentPokedex())?.url;
    if (!pokedexUrl) {
      this.apiService.resetFilteredPokedex();
      return;
    }
    this.getFilteredPokedex(pokedexUrl, this.currentType());
  }

  private getFilteredPokedex(pokedexUrl: string, type: string) {
    this.apiService
      .getPokedex(pokedexUrl)
      .pipe(
        tap((res) => {
          this.apiService.resetPokedex();
          this.apiService.filterPokedexByType(res, type);
          this.apiService.updatePokedex();
        })
      )
      .subscribe();
  }

  scrollToTop() {
    this.contentRef()?.scrollToTop(500);
  }
}
