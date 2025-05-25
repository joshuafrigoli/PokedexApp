//POKEDEX///
export interface Pokedex {
  descriptions: Description[];
  id: number;
  is_main_series: boolean;
  name: string;
  names: Name[];
  pokemon_entries: Pokemonentry[];
  region: Language;
  version_groups: Language[];
}

interface Pokemonentry {
  entry_number: number;
  pokemon_species: Language;
}

interface Name {
  language: Language;
  name: string;
}

interface Description {
  description: string;
  language: Language;
}

interface Language {
  name: string;
  url: string;
}
