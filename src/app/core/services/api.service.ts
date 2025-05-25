import { inject, Injectable } from '@angular/core';
import { ApiDataManager } from '../data-managers/api.data.manager';
import { ApiCommunication } from '../communications/api.communication';
import { concatMap, forkJoin, map, Observable, of, tap } from 'rxjs';
import { SettingsService } from './settings.service';
import { ResponseList } from 'src/app/shared/interfaces/pokemon/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pokemon } from 'src/app/shared/interfaces/pokemon/pokemon';
import { Species } from 'src/app/shared/interfaces/pokemon/species';
import { Item } from 'src/app/shared/interfaces/pokemon/item';
import { ApiTranslateService } from './api-translate.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiTranslateService = inject(ApiTranslateService);
  private readonly apiCommunication = inject(ApiCommunication);
  private readonly apiDataManager = inject(ApiDataManager);
  private readonly settingsService = inject(SettingsService);

  private readonly language = toSignal(this.settingsService.language$, {
    initialValue: '',
  });

  readonly pokedex$ = this.apiDataManager.pokedex$;
  readonly isEndOfPokedex$ = this.apiDataManager.isEndOfPokedex$;

  constructor() {
    this.getPokedexStorage().subscribe();
  }

  ///API MANAGER///

  getPokedexStorage() {
    return this.apiCommunication.getPokedexStorage().pipe(
      tap((res) => {
        this.apiDataManager.setPokedexStorage(res);
        this.apiDataManager.updatePokedex();
      })
    );
  }

  getSearchSuggestions(inputValue: string) {
    return this.apiDataManager.getSearchSuggestions(inputValue);
  }

  getPokemonFromStorage(inputValue: string) {
    return this.apiDataManager.getPokemon(inputValue);
  }

  updatePokedex() {
    this.apiDataManager.updatePokedex();
  }

  resetPokedex() {
    this.apiDataManager.resetPokedex();
  }

  resetFilteredPokedex() {
    this.apiDataManager.filterPokedexStorage([]);
  }

  filterPokedexByType(pokedex: string[], type: string) {
    this.apiDataManager.filterPokedexStorage(pokedex, type);
  }

  getRegularPokedexMax() {
    return this.apiDataManager.getRegularPokedexMax();
  }

  getPokedexMax() {
    return this.apiDataManager.getPokedexMax();
  }

  ///API COMMUNICATION///

  getPokedexes(
    url?: string,
    collectedData: ResponseList[] = []
  ): Observable<ResponseList[]> {
    return this.apiCommunication.getPokedexes(url).pipe(
      concatMap((res) => {
        const updatedData = [...collectedData, ...res.results];
        return res.next
          ? this.getPokedexes(res.next, updatedData)
          : of(updatedData);
      })
    );
  }

  getTypes() {
    let types: ResponseList[] = [];
    return this.apiCommunication.getTypes().pipe(
      map((res) => res.results),
      tap((res) => types.push(...res)),
      concatMap((res) =>
        forkJoin(
          res.map((t) =>
            this.apiCommunication.getType(t.url).pipe(
              tap((r) => {
                if (r.pokemon.length <= 0) {
                  types = types.filter((tp) => tp.name !== r.name);
                }
              })
            )
          )
        )
      ),
      map(() => types)
    );
  }

  getPokedex(url: string) {
    return this.apiCommunication
      .getPokedex(url)
      .pipe(
        map((res) =>
          res.pokemon_entries.map((pokemon) => pokemon.pokemon_species.name)
        )
      );
  }

  getPokemon(nameOrId: string | number) {
    return this.apiCommunication.getPokemon(nameOrId.toString());
  }

  getSpecies(url: string) {
    return this.apiCommunication.getSpecies(url);
  }

  getName(species: Species, pokemonName: string) {
    const name = species.names.find((nm) =>
      this.language().includes(nm.language.name)
    )?.name;
    const text = pokemonName
      .split('-')
      .filter((word) => !species?.name.includes(word))
      .join('-');
    if (text) {
      return this.apiTranslateService
        .getTranslation(text, 'en')
        .pipe(map((translation) => `${name}-${translation}`));
    }
    return of(name);
  }

  getGenus(genuses: Species['genera']) {
    console.log(genuses);
    let genus = genuses.find(
      (genus) =>
        this.language().includes(genus.language.name) ||
        genus.language.name === 'en'
    )?.genus;
    const translation = this.settingsService.translations.find((t) =>
      genus?.includes(t)
    );
    if (translation)
      genus = genus
        ?.split(translation)
        .filter((w) => w !== translation)
        .join('')
        .trim();
    return genus;
  }

  getAbility(ability: Pokemon['abilities'][number]) {
    const url = ability.ability.url;
    return this.apiCommunication.getAbility(url).pipe(
      map((res) => ({
        name:
          res.names.find((name) => this.language().includes(name.language.name))
            ?.name || res.name,
        description: res.flavor_text_entries
          .filter((desc) => this.language().includes(desc.language.name))
          .slice(-1)[0].flavor_text,
        is_hidden: ability.is_hidden,
      }))
    );
  }

  getType(url: string) {
    return this.apiCommunication.getType(url);
  }

  getEvolutionChain(url: string) {
    return this.apiCommunication.getEvolutionChain(url).pipe(
      map((res) => {
        const chain = [];
        const baseStages = {
          details: res.chain.evolution_details,
          species: res.chain.species,
        };
        chain.push([baseStages]);
        if (res.chain.evolves_to.length > 0) {
          const firstStages = res.chain.evolves_to.map((e) => ({
            details: e.evolution_details,
            species: e.species,
          }));
          chain.push(firstStages);
        }
        if (res.chain.evolves_to.some((e) => e.evolves_to.length > 0)) {
          const secondStages = res.chain.evolves_to
            .map((e) =>
              e.evolves_to.map((ev) => ({
                details: ev.evolution_details,
                species: ev.species,
              }))
            )
            .reduce((acc, val) => acc.concat(val), []);
          chain.push(secondStages);
        }
        return {
          pokemonEvolution: res,
          chain: chain.reduce((acc, val) => acc.concat(val), []),
        };
      }),
      concatMap((res) => {
        return forkJoin(
          res.chain.map((e) =>
            this.apiCommunication.getSpecies(e.species.url).pipe(
              concatMap((species) => {
                const evolutions = forkJoin({
                  details: of(e.details) /* forkJoin({
                    details: e.details
                      .map((dtl) =>
                        Object.entries(dtl).filter(
                          ([key, value]) => key !== 'trigger' && value
                        )
                      )
                      .map((dt) => {
                        return dt.map(([key, value]) =>
                          Object.entries(value).map(([k, v]) => {
                            return k === 'url'
                              ? this.apiCommunication
                                  .getItem(v as Item[keyof Item])
                                  .pipe(map((item) => item.sprites.default))
                              : of(null);
                          })
                        );
                      }),
                  }) */,
                  species: of({
                    ...species,
                  }),
                  sprites: of(
                    this.apiDataManager.getPokemon(species.id.toString())
                      ?.sprites!
                  ),
                });

                const varieties = forkJoin(
                  species.varieties.map((vrt) => {
                    const pokemonUrl = vrt.pokemon.url.split('/');
                    return !vrt.is_default
                      ? this.apiCommunication
                          .getPokemon(
                            pokemonUrl[pokemonUrl.length - 1] ||
                              pokemonUrl[pokemonUrl.length - 2]
                          )
                          .pipe(
                            concatMap((pokemon) =>
                              this.apiCommunication
                                .getSpecies(pokemon.species.url)
                                .pipe(
                                  concatMap((spec) => {
                                    let pokemonName = spec.names.find((name) =>
                                      this.language().includes(
                                        name.language.name
                                      )
                                    )?.name;
                                    return this.apiTranslateService
                                      .getTranslation(pokemon.name, 'en')
                                      .pipe(
                                        map((translation) => ({
                                          ...pokemon,
                                          name: `${pokemonName}-${translation
                                            .split('-')
                                            .filter(
                                              (word) =>
                                                !species?.name.includes(word)
                                            )
                                            .join('-')}`,
                                        }))
                                      );
                                  })
                                )
                            )
                          )
                      : of(vrt);
                  })
                ).pipe(
                  map((res) => res.filter((v) => !v.is_default) as Pokemon[])
                );

                return forkJoin({
                  evolutions,
                  varieties,
                });
              })
            )
          )
        );
      }),
      concatMap((res) => {
        return forkJoin(
          res.map((evo) =>
            this.apiCommunication
              .getPokemon(evo.evolutions.species.id.toString())
              .pipe(
                concatMap((pokemon) => {
                  const pokemonName = pokemon.name;
                  const translatedName =
                    evo.evolutions.species.names.find((name) =>
                      this.language().includes(name.language.name)
                    )?.name || evo.evolutions.species.name;
                  console.log(pokemonName, ' | ', translatedName);
                  const text = pokemonName.split('-').slice(1).join('-');
                  console.log(text);
                  if (text) {
                    return this.apiTranslateService
                      .getTranslation(text, 'en')
                      .pipe(
                        map((translation) => ({
                          ...evo,
                          evolutions: {
                            ...evo.evolutions,
                            species: {
                              ...evo.evolutions.species,
                              name: `${translatedName}-${translation}`,
                            },
                          },
                        }))
                      );
                  }
                  return of(evo);
                })
              )
          )
        );
      })
      /*       map((res) => {
        const details = res
          .map((e) =>
            e.evolutions.details.map((dtl) =>
              Object.entries(dtl)
                .filter(([key, value]) => key !== 'trigger' && value)
                .map((dt) => {
                  const url = dt[1].url;
                  if (url) {
                    return [dt[0], url];
                  }
                  return dt;
                })
            )
          )
          .reduce((acc, val) => acc.concat(val), [])
          .reduce((acc, val) => acc.concat(val), []);

        console.log({
          ...res.map((evo) => ({
            ...evo,
            evolutions: { ...evo.evolutions, details },
          })),
        });
        return {
          ...res.map((evo) => ({
            ...evo,
            evolutions: { ...evo.evolutions, details },
          })),
        };
      }) */
      /*  concatMap((res) =>
        res.map((evo) => evo.evolutions.details.map((dt) => console.log(dt)))
      ) */
    );
  }

  getMove(move: Pokemon['moves'][number]) {
    const url = move.move.url;
    return this.apiCommunication.getMove(url).pipe(
      map((res) => ({
        name:
          res.names.find((name) => this.language().includes(name.language.name))
            ?.name || move.move.name,
        accuracy: res.accuracy,
        type: res.type.name,
        power: res.power,
        pp: res.pp,
        damage_class: res.damage_class.name,
        level_learned_at:
          move.version_group_details.slice(-1)[0].level_learned_at,
        learn_method:
          move.version_group_details.slice(-1)[0].move_learn_method.name,
        description: res.flavor_text_entries
          .filter((desc) => this.language().includes(desc.language.name))
          .map((d) => d.flavor_text)
          .slice(-1)[0],
      }))
    );
  }
}
