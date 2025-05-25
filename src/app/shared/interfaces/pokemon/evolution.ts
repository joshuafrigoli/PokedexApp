export interface Evolution {
  baby_trigger_item?: any;
  chain: Chain;
  id: number;
}

interface Chain {
  evolution_details: Evolutiondetail[];
  evolves_to: Evolvesto2[];
  is_baby: boolean;
  species: Species;
}

interface Evolvesto2 {
  evolution_details: Evolutiondetail[];
  evolves_to: Evolvesto[];
  is_baby: boolean;
  species: Species;
}

interface Evolvesto {
  evolution_details: Evolutiondetail[];
  evolves_to: any[];
  is_baby: boolean;
  species: Species;
}

interface Evolutiondetail {
  gender?: any;
  held_item?: any;
  item?: any;
  known_move?: any;
  known_move_type?: any;
  location?: any;
  min_affection?: any;
  min_beauty?: any;
  min_happiness?: any;
  min_level: number;
  needs_overworld_rain: boolean;
  party_species?: any;
  party_type?: any;
  relative_physical_stats?: any;
  time_of_day: string;
  trade_species?: any;
  trigger: Trigger;
  turn_upside_down: boolean;
}

interface Species {
  name: string;
  url: string;
}

interface Trigger {
  name: string;
  url: string;
}
