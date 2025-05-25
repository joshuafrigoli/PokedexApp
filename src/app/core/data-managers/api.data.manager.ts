import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CustomPokemon } from 'src/app/shared/interfaces/pokemon/pokemon';

@Injectable({
  providedIn: 'root',
})
export class ApiDataManager {
  private readonly translateService = inject(TranslateService);

  private pokedexStorage = <CustomPokemon[]>[];
  private filteredPokedexStorage = <CustomPokemon[]>[];
  private readonly pokedex = new BehaviorSubject<CustomPokemon[]>([]);
  readonly pokedex$ = this.pokedex.asObservable();

  private readonly isEndOfPokedex = new BehaviorSubject(false);
  readonly isEndOfPokedex$ = this.isEndOfPokedex.asObservable();

  private limit = 36;
  private offset = 0;

  setPokedexStorage(pokedexStorage: CustomPokemon[]) {
    this.pokedexStorage = pokedexStorage;
  }

  filterPokedexStorage(pokedex: string[], type?: string) {
    this.filteredPokedexStorage = pokedex
      .map((pokemon) =>
        this.pokedexStorage.find((poke) => poke.name === pokemon)
      )
      .filter((pkmn) => pkmn !== undefined);

    if (type && type.trim() !== this.translateService.instant('select.all')) {
      this.filteredPokedexStorage = this.filteredPokedexStorage.filter((pkmn) =>
        pkmn.types.includes(type)
      );
    }
  }

  setPokedex(pokedex: CustomPokemon[]) {
    this.pokedex.next(pokedex);
  }

  resetPokedex() {
    this.offset = 0;
    this.pokedex.next([]);
    this.isEndOfPokedex.next(false);
  }

  updatePokedex() {
    const pokedexStorage =
      this.filteredPokedexStorage.length > 0
        ? this.filteredPokedexStorage
        : this.pokedexStorage;
    const pokedex = [];
    if (!pokedexStorage) return;
    for (let i = this.offset; i < this.offset + this.limit; i++) {
      const pokemon = pokedexStorage[i];
      if (!pokemon) {
        break;
      }
      pokedex.push(pokemon);
    }
    console.log('pokedex:: ', pokedex);
    this.pokedex.next([...this.pokedex.getValue(), ...pokedex]);
    this.offset = this.offset + this.limit;
    if (this.pokedex.getValue().length >= pokedexStorage.length) {
      this.isEndOfPokedex.next(true);
    }
  }

  getSearchSuggestions(inputValue: string) {
    return [...this.pokedexStorage]
      .filter(
        (pokemon) =>
          pokemon.id.toString().includes(inputValue) ||
          pokemon.name.includes(inputValue)
      )
      .slice(0, 4);
  }

  getPokemon(inputValue: string) {
    return [...this.pokedexStorage].find(
      (pokemon) =>
        pokemon.id.toString() === inputValue || pokemon.name === inputValue
    );
  }

  getRegularPokedexMax() {
    return [...this.pokedexStorage].filter((pokemon) => pokemon.id < 10 * 1000)
      .length;
  }

  getPokedexMax() {
    return [...this.pokedexStorage].length;
  }
}
