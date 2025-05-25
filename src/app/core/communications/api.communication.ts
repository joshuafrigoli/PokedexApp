import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { BaseCommunication } from './base.communication';
import {
  CustomPokemon,
  Pokemon,
} from 'src/app/shared/interfaces/pokemon/pokemon';
import { GenericResponse } from 'src/app/shared/interfaces/pokemon/api';
import { Type } from 'src/app/shared/interfaces/pokemon/type';
import { Pokedex } from 'src/app/shared/interfaces/pokemon/pokedex';
import { Species } from 'src/app/shared/interfaces/pokemon/species';
import { Ability } from 'src/app/shared/interfaces/pokemon/ability';
import { Evolution } from 'src/app/shared/interfaces/pokemon/evolution';
import { Move } from 'src/app/shared/interfaces/pokemon/move';
import { Item } from 'src/app/shared/interfaces/pokemon/item';

@Injectable({
  providedIn: 'root',
})
export class ApiCommunication extends BaseCommunication {
  private readonly dbUrl = ENV.DB_URL;
  private readonly apiBaseUrl = ENV.API.BASE_URL;

  getPokedexStorage() {
    return super.get<CustomPokemon[]>(this.dbUrl);
  }

  getPokedexes(url?: string) {
    const firstUrl = this.apiBaseUrl + '/pokedex/';
    return super.get<GenericResponse>(url || firstUrl);
  }

  getTypes() {
    const url = this.apiBaseUrl + '/type/';
    return super.get<GenericResponse>(url);
  }

  getPokedex(url: string) {
    return super.get<Pokedex>(url);
  }

  getPokemon(nameOrId: string) {
    const url = `${this.apiBaseUrl}/pokemon/${nameOrId}`;
    return super.get<Pokemon>(url);
  }

  getSpecies(url: string) {
    return super.get<Species>(url);
  }

  getAbility(url: string) {
    return super.get<Ability>(url);
  }

  getType(url: string) {
    return super.get<Type>(url);
  }

  getEvolutionChain(url: string) {
    return super.get<Evolution>(url);
  }

  getItem(url: string) {
    return super.get<Item>(url);
  }

  getMove(url: string) {
    return super.get<Move>(url);
  }
}
