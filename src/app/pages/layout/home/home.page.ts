import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnDestroy,
  signal,
} from '@angular/core';
import { PokeballComponent } from '../../../shared/components/pokeball/pokeball.component';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IonMenuToggle,
  IonIcon,
  IonToolbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ApiService } from '../../../core/services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Router } from '@angular/router';
import { CustomPokemon } from '../../../shared/interfaces/pokemon/pokemon';
import { ToastProvider } from '../../../core/providers/toast.provider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonRow,
    IonGrid,
    IonCol,
    PokeballComponent,
    TranslatePipe,
    IonMenuToggle,
    IonIcon,
    SearchBarComponent,
    IonToolbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CardComponent,
    FormsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'm-4',
  },
})
export class HomePage implements OnDestroy {
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly toastProvider = inject(ToastProvider);

  readonly pokedex = toSignal(this.apiService.pokedex$, { initialValue: [] });
  readonly isEndOfPokedex = toSignal(this.apiService.isEndOfPokedex$, {
    initialValue: false,
  });

  readonly inputValue = model('');

  private readonly searchSuggestionIdx = signal(-1);
  readonly searchSuggestions = signal<CustomPokemon[]>([]);
  readonly activeSearchSuggestion = computed(() => {
    const searchSuggestions = this.searchSuggestions();
    const idx = this.searchSuggestionIdx();
    if (
      searchSuggestions.length === 0 ||
      idx < 0 ||
      idx >= searchSuggestions.length
    )
      return -1;
    return searchSuggestions[idx].id;
  });

  readonly isLoading = signal(false);

  ngOnDestroy(): void {
    console.log('destroying homepage...');
  }

  private resetUserSearch() {
    this.inputValue.set('');
    this.searchSuggestions.set([]);
    this.searchSuggestionIdx.set(-1);
  }

  handleSearchSuggestionEnter(e: Event) {
    (e.target as HTMLInputElement).blur(); // to hide smartphones keyboard in order to see toast
    const pokemon = this.apiService.getPokemonFromStorage(this.inputValue());
    if (!pokemon) {
      setTimeout(() => {
        this.toastProvider.openPokemonNotFound();
      }, 500);
      return;
    }
    this.router
      .navigateByUrl(`pokedex/${pokemon.id}`)
      .then(() => this.resetUserSearch());
  }

  handleSearchSuggestionArrowUp(e: Event) {
    e.preventDefault();
    const length = this.searchSuggestions().length;
    if (length <= 0) return;
    const idx = this.searchSuggestionIdx();
    if (idx === -1 || idx === 0) this.searchSuggestionIdx.set(length - 1);
    else this.searchSuggestionIdx.set(idx - 1);
    this.inputValue.set(
      this.searchSuggestions()[this.searchSuggestionIdx()].name
    );
  }

  handleSearchSuggestionArrowDown(e: Event) {
    e.preventDefault();
    const length = this.searchSuggestions().length;
    if (length <= 0) return;
    const idx = this.searchSuggestionIdx();
    if (idx === -1 || idx === length - 1) this.searchSuggestionIdx.set(0);
    else this.searchSuggestionIdx.set(idx + 1);
    this.inputValue.set(
      this.searchSuggestions()[this.searchSuggestionIdx()].name
    );
  }

  handleFocusOut() {
    setTimeout(() => this.searchSuggestions.set([]), 50);
  }

  handleSearchBarOnInput(e: string) {
    if (e === '') {
      this.searchSuggestions.set([]);
      this.searchSuggestionIdx.set(-1);
      return;
    }
    const suggestions = this.apiService.getSearchSuggestions(e);
    this.searchSuggestions.set(suggestions);
  }

  handleSearchSuggestionClick(pokemonId: CustomPokemon['id']) {
    this.router
      .navigateByUrl(`pokedex/${pokemonId}`)
      .then(() => this.resetUserSearch());
  }

  handleOnCardClick(pokemonId: CustomPokemon['id']) {
    this.router
      .navigateByUrl(`pokedex/${pokemonId}`)
      .then(() => this.resetUserSearch());
  }

  onScroll(e: Event) {
    if (this.pokedex().length <= 0 || this.isEndOfPokedex()) {
      (e as InfiniteScrollCustomEvent).target.complete();
      return;
    }
    this.isLoading.set(true);
    setTimeout(() => {
      this.apiService.updatePokedex();
      (e as InfiniteScrollCustomEvent).target.complete();
      this.isLoading.set(false);
    }, 500);
  }
}
