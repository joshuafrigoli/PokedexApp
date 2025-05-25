export interface Item {
  attributes: Attribute[];
  baby_trigger_for?: any;
  category: Attribute;
  cost: number;
  effect_entries: Effectentry[];
  flavor_text_entries: Flavortextentry[];
  fling_effect?: any;
  fling_power: number;
  game_indices: Gameindex[];
  held_by_pokemon: Heldbypokemon[];
  id: number;
  machines: any[];
  name: string;
  names: Name[];
  sprites: Sprites;
}

interface Sprites {
  default: string;
}

interface Name {
  language: Attribute;
  name: string;
}

interface Heldbypokemon {
  pokemon: Attribute;
  version_details: Versiondetail[];
}

interface Versiondetail {
  rarity: number;
  version: Attribute;
}

interface Gameindex {
  game_index: number;
  generation: Attribute;
}

interface Flavortextentry {
  language: Attribute;
  text: string;
  version_group: Attribute;
}

interface Effectentry {
  effect: string;
  language: Attribute;
  short_effect: string;
}

interface Attribute {
  name: string;
  url: string;
}
