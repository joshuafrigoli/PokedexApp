import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonToolbar,
  IonIcon,
  IonButton,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { UndashPipe } from 'src/app/core/pipes/undash.pipe';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { TypeColorDirective } from 'src/app/core/directives/type-color.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalProvider } from 'src/app/core/providers/modal.provider';
import { AbilityComponent } from 'src/app/shared/components/ability/ability.component';
import { MapstatPipe } from 'src/app/core/pipes/mapstat.pipe';
import { MoveComponent } from 'src/app/shared/components/move/move.component';
import { FontSizeDirective } from 'src/app/core/directives/font-size.directive';
import { IonRippleDirective } from 'src/app/core/directives/ion-ripple.directive';

interface CryListener {
  name: string;
  callBack: () => void;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonProgressBar,
    IonIcon,
    IonContent,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink,
    UndashPipe,
    TypeColorDirective,
    IonButton,
    TranslatePipe,
    RouterLink,
    MapstatPipe,
    FontSizeDirective,
    IonRippleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage implements OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly modalProvider = inject(ModalProvider);

  readonly id = input.required<string>();

  readonly propertyNotFound = '--';
  readonly charactersThreshold = 8;

  readonly pokemon = resource({
    loader: async () => {
      const data = await firstValueFrom(this.apiService.getPokemon(this.id()));
      return data;
    },
  });
  readonly species = resource({
    request: () => this.pokemon.value(),
    loader: async (pokemon) => {
      if (!pokemon) return undefined;
      const data = await firstValueFrom(
        this.apiService.getSpecies(pokemon.request!.species.url)
      );
      return data;
    },
  });
  readonly name = resource({
    defaultValue: this.propertyNotFound,
    request: () => ({
      pokemon: this.pokemon.value(),
      species: this.species.value(),
    }),
    loader: async (req) => {
      if (!req.request.pokemon || !req.request.species)
        return this.propertyNotFound;
      const data = await firstValueFrom(
        this.apiService.getName(req.request.species, req.request.pokemon.name)
      );
      return data || this.propertyNotFound;
    },
  });
  readonly gender = computed(() => {
    const species = this.species.value();
    if (!species) return { male: 0, female: 0 };
    return {
      male:
        species.gender_rate === -1
          ? 0
          : Math.ceil(((8 - species!.gender_rate) * 100) / 8),
      female:
        species.gender_rate === -1
          ? 0
          : Math.floor((species!.gender_rate * 100) / 8),
    };
  });

  readonly isShiny = signal(false);
  readonly sprite = computed(() => {
    const pokemon = this.pokemon.value();
    const isShiny = this.isShiny();
    return isShiny
      ? pokemon?.sprites.other['official-artwork'].front_shiny
      : pokemon?.sprites.other['official-artwork'].front_default;
  });
  readonly shinyIcon = computed(() =>
    this.isShiny() ? 'star-outline' : 'star'
  );

  private readonly cry = computed(() =>
    this.pokemon.value()
      ? {
          cry: new Audio(
            this.pokemon.value()?.cries.latest
          ) as HTMLAudioElement | null,
          listeners: [] as CryListener[],
        }
      : { cry: new Audio() as HTMLAudioElement | null, listeners: [] }
  );
  readonly isCryPlaying = signal(false);
  readonly cryIcon = computed(() =>
    this.isCryPlaying() ? 'pause' : 'barcode'
  );

  readonly genus = computed(() => {
    const genuses = this.species.value()?.genera;
    if (!genuses) return this.propertyNotFound;
    return this.apiService.getGenus(genuses) || this.propertyNotFound;
  });
  readonly height = computed(() => {
    const height = this.pokemon.value()?.height;
    if (!height) return this.propertyNotFound;
    return (height / 10).toString();
  });
  readonly weight = computed(() => {
    const weight = this.pokemon.value()?.weight;
    if (!weight) return this.propertyNotFound;
    return (weight / 10).toString();
  });

  readonly abilities = resource({
    defaultValue: [],
    request: () => this.pokemon.value(),
    loader: async (pokemon) => {
      if (!pokemon) return [];
      const promiseArray = await Promise.all(
        pokemon.request!.abilities.map(async (ability) => {
          const abilities = await firstValueFrom(
            this.apiService.getAbility(ability)
          );
          return abilities;
        })
      );
      return promiseArray;
    },
  });

  readonly evolutions = resource({
    defaultValue: [],
    request: () => this.species.value(),
    loader: async (species) => {
      if (!species) return [];
      const data = await lastValueFrom(
        this.apiService.getEvolutionChain(species.request!.evolution_chain.url)
      );
      console.log(data);
      return data;
    },
  });
  readonly varieties = computed(() =>
    this.evolutions
      .value()
      .map((v) => v.varieties)
      .reduce((acc, val) => acc.concat(val), [])
  );

  readonly moves = resource({
    defaultValue: [],
    request: () => this.pokemon.value(),
    loader: async (pokemon) => {
      if (!pokemon) return [];
      const data = await Promise.all(
        pokemon.request!.moves.map((move) => {
          return firstValueFrom(this.apiService.getMove(move));
        })
      );
      return data;
    },
  });
  readonly TMMoves = computed(() => {
    const moves = this.moves.value();
    return moves.filter((m) => m.learn_method === 'machine');
  });
  readonly eggMoves = computed(() => {
    const moves = this.moves.value();
    return moves.filter((m) => m.learn_method === 'egg');
  });
  readonly levelupMoves = computed(() => {
    const moves = this.moves.value();
    return moves.filter((m) => m.learn_method === 'level-up');
  });
  readonly tutorMoves = computed(() => {
    const moves = this.moves.value();
    return moves.filter((m) => m.learn_method === 'tutor');
  });

  readonly previous = computed(() => {
    const pokemon = this.pokemon.value();
    if (!pokemon) return undefined;
    const max = this.apiService.getPokedexMax();
    const regularMax = this.apiService.getRegularPokedexMax();
    let id = pokemon.id - 1;
    if (id === 0) id = max + 10 * 1000 - regularMax;
    if (id === 10 * 1000 - 1) id = regularMax;
    console.log(id);
    return this.apiService.getPokemonFromStorage(id.toString());
  });

  readonly next = computed(() => {
    const pokemon = this.pokemon.value();
    if (!pokemon) return undefined;
    const max = this.apiService.getPokedexMax();
    const regularMax = this.apiService.getRegularPokedexMax();
    let id = pokemon.id + 1;
    if (id > max) id = 1;
    if (id > regularMax) id = 10 * 1000 + (10 * 1000 - pokemon.id);
    return this.apiService.getPokemonFromStorage(id.toString());
  });

  constructor() {
    effect(() => this.initCry());

    effect(() => {
      console.log(this.pokemon.value());
      console.log(this.species.value());
      console.log('var:: ', this.varieties());
    });
  }

  ngOnDestroy(): void {
    this.removeCryListeners();
  }

  private initCry() {
    const cryEl = this.cry().cry;
    if (!cryEl) return;
    cryEl.load();

    const onPlaying = () => {
      console.log('playing');
      this.isCryPlaying.set(true);
    };
    const onPause = () => {
      console.log('pause');
      this.isCryPlaying.set(false);
    };
    const onEnded = () => {
      console.log('ended');
      this.isCryPlaying.set(false);
    };

    cryEl.addEventListener('playing', onPlaying);
    cryEl.addEventListener('pause', onPause);
    cryEl.addEventListener('ended', onEnded);

    this.cry().listeners.push(
      { name: 'playing', callBack: onPlaying },
      { name: 'pause', callBack: onPause },
      { name: 'ended', callBack: onEnded }
    );
  }

  private removeCryListeners() {
    const cry = this.cry().cry;
    if (!cry) return;
    this.cry().cry!.pause();
    this.cry().cry = null;
    this.cry().listeners.forEach((l) =>
      cry.removeEventListener(l.name, l.callBack)
    );
    this.cry().listeners = [];
  }

  TTSDescription() {}

  isAudioPlaying() {
    return false;
  }

  playPokemonCry() {
    const cry = this.cry().cry;
    if (!cry) return;
    const isPlaying = this.isCryPlaying();
    if (isPlaying) {
      cry.pause();
      return;
    }
    cry.play();
  }

  handleShinyClick() {
    this.isShiny.update((val) => !val);
  }

  handleAbilityClick(ability: {
    name: string;
    description: string;
    is_hidden: boolean;
  }) {
    this.modalProvider.open(
      AbilityComponent,
      { ability },
      { cssClass: ['custom-modal', 'ability'] }
    );
  }

  handleMoveClick(move: {
    name: string;
    accuracy: number;
    type: string;
    power: number;
    pp: number;
    damage_class: string;
    level_learned_at: number;
    learn_method: string;
    description: string;
  }) {
    this.modalProvider.open(
      MoveComponent,
      { move },
      { cssClass: ['custom-modal', 'move'] }
    );
  }
}
