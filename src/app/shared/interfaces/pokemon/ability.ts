export interface Ability {
  effect_changes: Effectchange[];
  effect_entries: Effectentry2[];
  flavor_text_entries: Flavortextentry[];
  generation: Language;
  id: number;
  is_main_series: boolean;
  name: string;
  names: Name[];
  pokemon: Pokemon[];
}

interface Pokemon {
  is_hidden: boolean;
  pokemon: Language;
  slot: number;
}

interface Name {
  language: Language;
  name: string;
}

interface Flavortextentry {
  flavor_text: string;
  language: Language;
  version_group: Language;
}

interface Effectentry2 {
  effect: string;
  language: Language;
  short_effect: string;
}

interface Effectchange {
  effect_entries: Effectentry[];
  version_group: Language;
}

interface Effectentry {
  effect: string;
  language: Language;
}

interface Language {
  name: string;
  url: string;
}
