export interface Species {
  base_happiness: number;
  capture_rate: number;
  color: Color;
  egg_groups: any[];
  evolution_chain: Evolutionchain;
  evolves_from_species?: any;
  flavor_text_entries: Flavortextentry[];
  form_descriptions: any[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: Genus[];
  generation: Color;
  growth_rate: Color;
  habitat?: any;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: Name[];
  order: number;
  pal_park_encounters: any[];
  pokedex_numbers: Pokedexnumber[];
  shape: Color;
  varieties: Variety[];
}

interface Variety {
  is_default: boolean;
  pokemon: Color;
}

interface Pokedexnumber {
  entry_number: number;
  pokedex: Color;
}

interface Name {
  language: Color;
  name: string;
}

interface Genus {
  genus: string;
  language: Color;
}

interface Flavortextentry {
  flavor_text: string;
  language: Color;
  version: Color;
}

interface Evolutionchain {
  url: string;
}

export interface SpeciesResponse {
  name: string;
  url: string;
}

interface Color {
  name: string;
  url: string;
}
