export enum Evidence {
  Emf5 = 'EMF 5',
  DotsProjector = 'D.O.T.S Projector',
  Ultraviolett = 'Ultraviolett',
  GhostOrb = 'Ghost Orb',
  GhostWriting = 'Ghost Writing',
  SpiritBox = 'Spirit Box',
  FreezingTemperature = 'Freezing Temperature'
}

export type GhostName =
  'Banshee' | 'Demon' | 'Deogen' | 'Goryo' | 'Hantu' | 'Jinn' | 'Mare' | 'Moroi' | 'Myling' | 'Obake' | 'Oni' | 'Onryo' | 'Phantom' |
  'Poltergeist' | 'Raiju' | 'Revenant' | 'Shade' | 'Spirit' | 'Thaye' | 'The Mimic' | 'The Twins' | 'Wraith' | 'Yokai' | 'Yurei';

export type Tag =
  GhostName |
  'speed_slow' | 'speed_medium' | 'speed_fast' |
  'movement_normal' | 'movement_fuzzy' | 'movement_special' |
  'los_accelerate' | 'los_constant' |
  'threshold_low' | 'threshold_medium' | 'threshold_high' | 'threshold_very_high' |
  'sanity_below_40' | 'sanity_below_50' | 'sanity_below_60' | 'sanity_below_70' | 'sanity_below_80' |
  'ability_mist_event' | 'ability_footprints' | 'ability_analog_dots' | 'ability_digital_dots'
  ;

export interface TagOption {
  tag: Tag,
  name: string,
  hint?: string,
  negative?: boolean | Tag
}

export interface TagInfo {
  key?: string; // for hints
  name: string;
  exclusive: boolean;
  options: TagOption[];
}

export const Tags: TagInfo[] = [
  {
    key: 'speed',
    name: 'Speed',
    exclusive: false,
    options: [
      { tag: 'speed_slow', name: 'slow' },
      { tag: 'speed_medium', name: 'medium' },
      { tag: 'speed_fast', name: 'fast' }
    ]
  },
  {
    name: 'Line of Sight',
    exclusive: false,
    options: [
      { tag: 'los_accelerate', name: 'accelerate', hint: 'The ghost accelerates by 65% over 13sec when seeing a player' },
      { tag: 'los_constant', name: 'constant/special', hint: 'The ghost has constent speed or special speed rules while chasing the player' },
    ]
  },
  {
    key: 'hunt_sanity',
    name: 'Sanity',
    exclusive: true,
    options: [
      { tag: 'sanity_below_40', name: '40%' },
      { tag: 'sanity_below_50', name: '50%' },
      { tag: 'sanity_below_60', name: '60%' },
      { tag: 'sanity_below_70', name: '70%' },
      { tag: 'sanity_below_80', name: '80%' }
    ]
  }, {
    key: 'hunt_threshold',
    name: 'Threshold',
    exclusive: true,
    options: [
      { tag: 'threshold_low', name: '< 50%' },
      { tag: 'threshold_medium', name: '50%' },
      { tag: 'threshold_high', name: '> 50' },
      { tag: 'threshold_very_high', name: '> 65%' }
    ]
  },
  {
    key: 'hunt_abilties',
    name: 'Hunt Abilites',
    exclusive: true,
    options: [
      { tag: 'Phantom', name: 'Shorter visible', negative: true, hint: 'A Phantom is only visible every 1 to 2 sec (instead of 0.3 to 1s) during hunts' },
      { tag: 'Oni', name: 'Longer visible', negative: true, hint: 'Oni has shorter invisibility phases during hunt and is better visible' },
      { tag: 'Obake', name: 'Shapeshift', negative: true, hint: 'Obake can temporary shapeshift to another ghost model on each blink during hunts (6.67%)' },
      { tag: 'Hantu', name: 'Visible breath', negative: true, hint: 'The breath is visible on Hantu models when the breaker is off' },
      { tag: 'Yokai', name: 'Short hearing range', negative: true, hint: 'A Yokai can only hear players and sense electronics within 2.5m (insted of 9 and 7m)' },
      { tag: 'Myling', name: 'Less audible', negative: true, hint: 'Myling footsteps can be heared within 12m (instead of 20m)' },
      { tag: 'Poltergeist', name: 'Frequent throws', negative: true, hint: 'During hunts a Poltergeist always throws a nearby item (instead of 50%)' },
      { tag: 'Deogen', name: 'Finds player', negative: true, hint: 'Deogens always know where the players are' }
    ]
  },
  {
    key: 'abilities',
    name: 'Other Abilities',
    exclusive: false,
    options: [
      { tag: 'ability_mist_event', name: 'Mist Orb', negative: true, hint: 'Oni is unable to perform the mist orb ghost event' },
      { tag: 'ability_footprints', name: 'Footprints', negative: true, hint: 'Wraithes will never step into salt' },
      { tag: 'ability_analog_dots', name: 'Analog D.O.T.S.', negative: 'ability_digital_dots', hint: 'D.O.T.S of Goryos can only be seen through a video camera' }
    ]
  }
];

export class Ghost {

  public readonly name: GhostName;
  public readonly order: number;
  public readonly evidence: Evidence[];
  public readonly secondary: Tag[];
  public readonly tags: Tag[];
  public readonly hints: { [tag: string]: string };

  constructor(name: GhostName, order: number, evidence: Evidence[], secondary: Tag[], hints: { [tag: string]: string }) {
    this.name = name;
    this.order = order;
    this.evidence = evidence;
    this.secondary = secondary;
    this.tags = [name, ...secondary];
    this.hints = hints;
  }
}

export const Ghosts: Ghost[] = [
  new Ghost('Banshee', 5,
    [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      threshold: 'Hunts at 50% sanity of the targeted player'
    }
  ),
  new Ghost('Demon', 10,
    [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_very_high', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80'
    ],
    {
      threshold: "Hunts at 70% sanity or any time via ability"
    }
  ),
  new Ghost('Deogen', 23,
    [Evidence.DotsProjector, Evidence.GhostWriting, Evidence.SpiritBox],
    [
      'speed_slow', 'speed_fast', 'movement_special', 'los_constant', 'threshold_low', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40'
    ],
    {
      speed: "Speed when far: 3m/s; close: 0.4m/s", threshold: "Hunts at 40% sanity", special: "Always finds player"
    }
  ),
  new Ghost('Goryo', 15,
    [Evidence.DotsProjector, Evidence.Emf5, Evidence.Ultraviolett],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints', 'ability_analog_dots',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60'
    ],
    {
      special: "D.O.T.S only visible on video"
    }
  ),
  new Ghost('Hantu', 14,
    [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_constant', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      speed: "Speed depends on temperature: 1.4m/s (15°C) to 2.7m/s (0°C)", special: "Breath visible when breaker is off"
    }
  ),
  new Ghost('Jinn', 6,
    [Evidence.Emf5, Evidence.Ultraviolett, Evidence.FreezingTemperature],
    [
      'speed_medium', 'speed_fast', 'los_accelerate', 'movement_fuzzy', 'movement_special', 'los_constant', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      speed: "Constant speed of 2.5m/s if breaker is on, LoS and 3m+ distance"
    }
  ),
  new Ghost('Mare', 7,
    [Evidence.GhostOrb, Evidence.GhostWriting, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_low', 'threshold_high', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      threshold: "Hunts at 40% sanity if light is on or 60% if light is off"
    }
  ),
  new Ghost('Moroi', 22,
    [Evidence.FreezingTemperature, Evidence.GhostWriting, Evidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      speed: "Speed depends on team sanity: 1.4m/s (45%+) to 2.1m/s (0%), accelerates (up to 3.7m/s)"
    }
  ),
  new Ghost('Myling', 16,
    [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Obake', 20,
    [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Oni', 12,
    [Evidence.DotsProjector, Evidence.Emf5, Evidence.FreezingTemperature],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Onryo', 17,
    [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_high', 'threshold_very_high', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60'
    ],
    {
      threshold: "Hunts at 60% sanity or if 3 candles are blown out", special: "Lit candles act as crucifixes"
    }
  ),
  new Ghost('Phantom', 3,
    [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Poltergeist', 4,
    [Evidence.Ultraviolett, Evidence.GhostWriting, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Raiju', 19,
    [Evidence.DotsProjector, Evidence.Emf5, Evidence.GhostOrb],
    [
      'speed_medium', 'speed_fast', 'movement_normal', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'los_constant', 'threshold_medium', 'threshold_high', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60'
    ],
    {
      speed: "Speed when close electrical equipment: 2.5m/s", threshold: "Hunts at 65% in the presence of active electronics"
    }
  ),
  new Ghost('Revenant', 8,
    [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.GhostWriting],
    [
      'speed_slow', 'speed_fast', 'movement_special', 'los_constant', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      speed: "Speed while chasing: 3m/s; Speed while roaming: 1m/s"
    }
  ),
  new Ghost('Shade', 9,
    [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_low', 'ability_mist_event', 'ability_footprints'
    ],
    {
      threshold: "Hunts at 35% sanity"
    }
  ),
  new Ghost('Spirit', 1,
    [Evidence.Emf5, Evidence.GhostWriting, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Thaye', 24,
    [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.GhostWriting],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_special', 'los_constant', 'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70'
    ],
    {
      speed: "Speed at start: 2.75m/s; Speed at max age: 1m/s", threshold: "Hunts at 75% to 15% sanity depending on age"
    }
  ),
  new Ghost('The Mimic', 21,
    [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_normal', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'los_constant', 'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80'
    ],
    {
      speed: "Speed depends on mimicked ghost", threshold: "Hunt threshold depends on mimicked ghost"
    }
  ),
  new Ghost('The Twins', 18,
    [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
      speed: "Main twin speed: 1.5 m/s; Decoy twin speed: 1.9m/s"
    }
  ),
  new Ghost('Wraith', 2,
    [Evidence.DotsProjector, Evidence.Emf5, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  ),
  new Ghost('Yokai', 13,
    [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'threshold_very_high', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80'
    ],
    {
      threshold: "Hunts at 80% if a player is talking in its ghost room", special: "Hears sounds and senses electroincs in a radius of 2.5m (instead of 9m and 7m)"
    }
  ),
  new Ghost('Yurei', 11,
    [Evidence.DotsProjector, Evidence.FreezingTemperature, Evidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate', 'threshold_medium', 'ability_mist_event', 'ability_footprints', 'ability_digital_dots',
      'sanity_below_40', 'sanity_below_50'
    ],
    {
    }
  )
];