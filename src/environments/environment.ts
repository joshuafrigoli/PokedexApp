import { BaseEnvironment } from 'src/app/shared/interfaces/environment';

export const ENV: BaseEnvironment = {
  API: {
    BASE_URL: 'https://pokeapi.co/api/v2',
  },
  DB_URL: 'assets/data/pokedex_v4.json',
  TRANSLATE: {
    BASE_URL: 'https://api.mymemory.translated.net/get',
  },
};
