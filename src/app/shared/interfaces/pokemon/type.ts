///TYPES///
export interface Type {
  damage_relations: Damagerelations;
  game_indices: Gameindex[];
  generation: Doubledamagefrom;
  id: number;
  move_damage_class: Doubledamagefrom;
  moves: Doubledamagefrom[];
  name: string;
  names: Name[];
  past_damage_relations: any[];
  pokemon: Pokemon[];
  sprites: Sprites;
}

interface Sprites {
  'generation-iii': Generationiii;
  'generation-iv': Generationiv;
  'generation-ix': Generationix;
  'generation-v': Generationv;
  'generation-vi': Generationvi;
  'generation-vii': Generationvii;
  'generation-viii': Generationviii;
}

interface Generationviii {
  'brilliant-diamond-and-shining-pearl': Colosseum;
  'legends-arceus': Colosseum;
  'sword-shield': Colosseum;
}

interface Generationvii {
  'lets-go-pikachu-lets-go-eevee': Colosseum;
  'sun-moon': Colosseum;
  'ultra-sun-ultra-moon': Colosseum;
}

interface Generationvi {
  'omega-ruby-alpha-sapphire': Colosseum;
  'x-y': Colosseum;
}

interface Generationv {
  'black-2-white-2': Colosseum;
  'black-white': Colosseum;
}

interface Generationix {
  'scarlet-violet': Colosseum;
}

interface Generationiv {
  'diamond-pearl': Colosseum;
  'heartgold-soulsilver': Colosseum;
  platinum: Colosseum;
}

interface Generationiii {
  colosseum: Colosseum;
  emerald: Colosseum;
  'firered-leafgreen': Colosseum;
  'ruby-saphire': Colosseum;
  xd: Colosseum;
}

interface Colosseum {
  name_icon: string;
}

interface Pokemon {
  pokemon: Doubledamagefrom;
  slot: number;
}

interface Name {
  language: Doubledamagefrom;
  name: string;
}

interface Gameindex {
  game_index: number;
  generation: Doubledamagefrom;
}

interface Damagerelations {
  double_damage_from: Doubledamagefrom[];
  double_damage_to: Doubledamagefrom[];
  half_damage_from: Doubledamagefrom[];
  half_damage_to: Doubledamagefrom[];
  no_damage_from: Doubledamagefrom[];
  no_damage_to: Doubledamagefrom[];
}

interface Doubledamagefrom {
  name: string;
  url: string;
}
