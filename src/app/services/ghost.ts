export type Tag =
  'movement_normal' | 'movement_fuzzy' | 'movement_special' |
  'speed_slow' | 'speed_medium' | 'speed_fast' |
  'los_accelerate' | 'los_constant' |
  'threshold_low' | 'threshold_medium' | 'threshold_high' | 'threshold_very_high' |
  'special_hunt_visible' | 'special_hunt_invisible' | 'special_hunt_shapeshift' | 'special_hunt_breath' | 'special_hunt_deaf' | 'special_hunt_silent' | 'special_hunt_throws' | 'special_hunt_navi' |
  'special_mist_event' | 'special_digital_dots'
  ;

export interface TagInfo {
  key?: string; // for hints
  name: string;
  exclusive: boolean;
  options: { tag: Tag, name: string, hint?: string }[];
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
    name: 'Movement',
    exclusive: true,
    options: [
      { tag: 'movement_normal', name: 'normal' },
      { tag: 'movement_fuzzy', name: 'unsure' },
      { tag: 'movement_special', name: 'special' }
    ]
  },
  {
    name: 'Line of Sight',
    exclusive: false,
    options: [
      { tag: 'los_accelerate', name: 'accelerate', hint: 'The ghost accelerates by 65% over 13sec when seeing a player' },
      { tag: 'los_constant', name: 'constant', hint: 'The ghost has constent speed or special speed rules while chasing the player' }
    ]
  },
  {
    key: 'threshold',
    name: 'Hunt Threshold',
    exclusive: true,
    options: [
      { tag: 'threshold_low', name: '< 50%' },
      { tag: 'threshold_medium', name: '50%' },
      { tag: 'threshold_high', name: '> 50' },
      { tag: 'threshold_very_high', name: '> 65%' }
    ]
  },
  {
    key: 'hunt_specials',
    name: 'Hunt Specials',
    exclusive: true,
    options: [
      { tag: 'special_hunt_invisible', name: 'Shorter visible', hint: 'A Phantom is only visible every 1 to 2 sec (instead of 0.3 to 1s) during hunts' },
      { tag: 'special_hunt_visible', name: 'Longer visible', hint: 'Oni has shorter invisibility phases during hunt and is better visible' },
      { tag: 'special_hunt_shapeshift', name: 'Shapeshift', hint: 'Obake can temporary shapeshift to another ghost model on each blink during hunts (6.67%)' },
      { tag: 'special_hunt_breath', name: 'Visible breath', hint: 'The breath is visible on Hantu models when the breaker is off'},
      { tag: 'special_hunt_deaf', name: 'Short hearing range', hint: 'A Yokai can only hear players and sense electronics within 2.5m (insted of 9 and 7m)' },
      { tag: 'special_hunt_silent', name: 'Less audible', hint: 'Myling footsteps can be heared within 12m (instead of 20m)' },
      { tag: 'special_hunt_throws', name: 'Strong/frequent throws', hint: 'During hunts a Poltergeist always throws a nearby item (instead of 50%)' },
      { tag: 'special_hunt_navi', name: 'Finds player', hint: 'Deogens always know where the players are' }
    ]
  },
  {
    key: 'traits',
    name: 'Unique Traits',
    exclusive: true,
    options: [
      { tag: 'special_digital_dots', name: 'DOTS only on video' }
    ]
  },
  {
    key: 'abilities',
    name: 'Abilities',
    exclusive: false,
    options: [
      { tag: 'special_mist_event', name: 'Mist Orb' }
    ]
  }
];

export enum Evidence {
  Emf5 = 'EMF 5',
  DotsProjector = 'D.O.T.S Projector',
  Ultraviolett = 'Ultraviolett',
  GhostOrb = 'Ghost Orb',
  GhostWriting = 'Ghost Writing',
  SpiritBox = 'Spirit Box',
  FreezingTemperature = 'Freezing Temperature'
}

export interface Ghost {
  name: string;
  order: number;
  evidence: Evidence[];
  tags: Tag[];
  hints?: { [tag: string]: string }
}

export const Ghosts: Ghost[] = [
  {
    order: 5,
    name: 'Banshee',
    evidence: [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.GhostOrb],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 50% sanity of the targeted player'
    }
  },
  {
    order: 10,
    name: 'Demon',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostWriting],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_very_high',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 70% sanity or any time via ability'
    }
  },
  {
    order: 23,
    name: 'Deogen',
    evidence: [Evidence.DotsProjector, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: [
      'speed_slow', 'speed_fast',
      'movement_special',
      'los_constant',
      'threshold_low',
      'special_hunt_navi',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed when far: 3m/s; close: 0.4m/s',
      threshold: 'Hunts at 40% sanity',
      special: 'Always finds player'
    }
  },
  {
    order: 15,
    name: 'Goryo',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.Ultraviolett],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event',
      'special_digital_dots'
    ],
    hints: {
      special: 'D.O.T.S only visible on video'
    }
  },
  {
    order: 14,
    name: 'Hantu',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb],
    tags: [
      'speed_slow', 'speed_medium', 'speed_fast',
      'movement_fuzzy', 'movement_special',
      'los_constant',
      'threshold_medium',
      'special_hunt_breath',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed depends on temperature: 1.4m/s (15°C) to 2.7m/s (0°C)',
      special: 'Breath visible when breaker is off'
    }
  },
  {
    order: 6,
    name: 'Jinn',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.FreezingTemperature],
    tags: [
      'speed_medium', 'speed_fast', 'los_accelerate',
      'movement_fuzzy', 'movement_special',
      'los_constant',
      'threshold_medium',
      'special_mist_event'
    ],
    hints: {
      speed: 'Constant speed of 2.5m/s if breaker is on, LoS and 3m+ distance'
    }
  },
  {
    order: 7,
    name: 'Mare',
    evidence: [Evidence.GhostOrb, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_low', 'threshold_high',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 40% sanity if light is on or 60% if light is off'
    }
  },
  {
    order: 22,
    name: 'Moroi',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: [
      'speed_slow', 'speed_medium', 'speed_fast',
      'movement_fuzzy', 'movement_special',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed depends on team sanity: 1.4m/s (45%+) to 2.1m/s (0%), accelerates (up to 3.7m/s)'
    }
  },
  {
    order: 16,
    name: 'Myling',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostWriting],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_hunt_silent',
      'special_mist_event'
    ]
  },
  {
    order: 20,
    name: 'Obake',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostOrb],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_hunt_shapeshift',
      'special_mist_event'
    ]
  },
  {
    order: 12,
    name: 'Oni',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.FreezingTemperature],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_hunt_visible'
    ]
  },
  {
    order: 17,
    name: 'Onryo',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_high', 'threshold_very_high',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 60% sanity or if 3 candles are blown out',
      special: 'Lit candles act as crucifixes'
    }
  },
  {
    order: 3,
    name: 'Phantom',
    evidence: [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_hunt_invisible',
      'special_mist_event'
    ]
  },
  {
    order: 4,
    name: 'Poltergeist',
    evidence: [Evidence.Ultraviolett, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_hunt_throws',
      'special_mist_event'
    ]
  },
  {
    order: 19,
    name: 'Raiju',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.GhostOrb],
    tags: [
      'speed_medium', 'speed_fast',
      'movement_normal', 'movement_fuzzy', 'movement_special',
      'los_accelerate', 'los_constant',
      'threshold_medium', 'threshold_high',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed when close electrical equipment: 2.5m/s',
      threshold: 'Hunts at 65% in the presence of active electronics',
    }
  },
  {
    order: 8,
    name: 'Revenant',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.GhostWriting],
    tags: [
      'speed_slow', 'speed_fast',
      'movement_special',
      'los_constant',
      'threshold_medium',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed while chasing: 3m/s; Speed while roaming: 1m/s'
    }
  },
  {
    order: 9,
    name: 'Shade',
    evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.GhostWriting],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_low',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 35% sanity'
    }
  },
  {
    order: 1,
    name: 'Spirit',
    evidence: [Evidence.Emf5, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ]
  },
  {
    order: 24,
    name: 'Thaye',
    evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.GhostWriting],
    tags: [
      'speed_slow', 'speed_medium', 'speed_fast',
      'movement_special',
      'los_constant',
      'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed at start: 2.75m/s; Speed at max age: 1m/s',
      threshold: 'Hunts at 75% to 15% sanity depending on age'
    }
  },
  {
    order: 21,
    name: 'The Mimic',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: [
      'speed_slow', 'speed_medium', 'speed_fast',
      'movement_normal', 'movement_fuzzy', 'movement_special',
      'los_accelerate', 'los_constant',
      'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high',
      'special_mist_event'
    ],
    hints: {
      speed: 'Speed depends on mimicked ghost',
      threshold: 'Hunt threshold depends on mimicked ghost'
    }
  },
  {
    order: 18,
    name: 'The Twins',
    evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.SpiritBox],
    tags: [
      'speed_slow', 'speed_medium', 'speed_fast',
      'movement_fuzzy', 'movement_special',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ],
    hints: {
      speed: 'Main twin speed: 1.5 m/s; Decoy twin speed: 1.9m/s'
    }
  },
  {
    order: 2,
    name: 'Wraith',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ]
  },
  {
    order: 13,
    name: 'Yokai',
    evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium', 'threshold_very_high',
      'special_hunt_deaf',
      'special_mist_event'
    ],
    hints: {
      threshold: 'Hunts at 80% if a player is talking in its ghost room',
      special: 'Hears sounds and senses electroincs in a radius of 2.5m (instead of 9m and 7m)'
    }
  },
  {
    order: 11,
    name: 'Yurei',
    evidence: [Evidence.DotsProjector, Evidence.FreezingTemperature, Evidence.GhostOrb],
    tags: [
      'speed_medium',
      'movement_normal',
      'los_accelerate',
      'threshold_medium',
      'special_mist_event'
    ]
  }
];