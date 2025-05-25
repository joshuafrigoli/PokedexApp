export interface Move {
  accuracy: number;
  contest_combos: Contestcombos;
  contest_effect: Contesteffect;
  contest_type: Useafter;
  damage_class: Useafter;
  effect_chance?: any;
  effect_changes: any[];
  effect_entries: Effectentry[];
  flavor_text_entries: Flavortextentry[];
  generation: Useafter;
  id: number;
  learned_by_pokemon: Useafter[];
  machines: any[];
  meta: Meta;
  name: string;
  names: Name[];
  past_values: Pastvalue[];
  power: number;
  pp: number;
  priority: number;
  stat_changes: any[];
  super_contest_effect: Contesteffect;
  target: Useafter;
  type: Useafter;
}

interface Pastvalue {
  accuracy?: any;
  effect_chance?: any;
  effect_entries: any[];
  power: number;
  pp?: number;
  type?: any;
  version_group: Useafter;
}

interface Name {
  language: Useafter;
  name: string;
}

interface Meta {
  ailment: Useafter;
  ailment_chance: number;
  category: Useafter;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits?: any;
  max_turns?: any;
  min_hits?: any;
  min_turns?: any;
  stat_chance: number;
}

interface Flavortextentry {
  flavor_text: string;
  language: Useafter;
  version_group: Useafter;
}

interface Effectentry {
  effect: string;
  language: Useafter;
  short_effect: string;
}

interface Contesteffect {
  url: string;
}

interface Contestcombos {
  normal: Normal;
  super: Super;
}

interface Super {
  use_after?: any;
  use_before?: any;
}

interface Normal {
  use_after: Useafter[];
  use_before?: any;
}

interface Useafter {
  name: string;
  url: string;
}
