export type Tag =
  'speed_slow' | 'speed_medium' | 'speed_fast' |
  'los_accelerate' | 'los_constant';

export interface TagInfo {
  name: string;
  options: { tag: Tag, name: string }[];
}

export const Tags: TagInfo[] = [
  {
    name: 'Speed',
    options: [
      { tag: 'speed_slow', name: 'slow' },
      { tag: 'speed_medium', name: 'medium' },
      { tag: 'speed_fast', name: 'fast' }
    ]
  },
  {
    name: 'Line of Sight',
    options: [
      { tag: 'los_accelerate', name: 'accelerate' },
      { tag: 'los_constant', name: 'constant' }
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
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 10,
    name: 'Demon',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostWriting],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 23,
    name: 'Deogen',
    evidence: [Evidence.DotsProjector, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: ['speed_slow', 'speed_fast', 'los_constant']
  },
  {
    order: 15,
    name: 'Goryo',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.Ultraviolett],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 14,
    name: 'Hantu',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb],
    tags: ['speed_slow', 'speed_medium', 'speed_fast', 'los_constant'],
    hints: { speed: 'Speed depends on temperature: 1.4m/s (15°C+) to 2.7m/s (0°C)' }
  },
  {
    order: 6,
    name: 'Jinn',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.FreezingTemperature],
    tags: ['speed_medium', 'speed_fast', 'los_accelerate', 'los_constant'],
    hints: { speed: 'Constant speed of 2.5m/s if breaker is on, LoS and 3m+ distance' }
  },
  {
    order: 7,
    name: 'Mare',
    evidence: [Evidence.GhostOrb, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 22,
    name: 'Moroi',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: ['speed_slow', 'speed_medium', 'speed_fast', 'los_accelerate'],
    hints: { speed: 'Speed depends on team sanity: 1.4m/s (45%+) to 2.1m/s (0%), accelerates (up to 3.7m/s)' }
  },
  {
    order: 16,
    name: 'Myling',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostWriting],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 20,
    name: 'Obake',
    evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostOrb],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 12,
    name: 'Oni',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.FreezingTemperature],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 17,
    name: 'Onryo',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 3,
    name: 'Phantom',
    evidence: [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 4,
    name: 'Poltergeist',
    evidence: [Evidence.Ultraviolett, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 19,
    name: 'Raiju',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.GhostOrb],
    tags: ['speed_medium', 'speed_fast', 'los_accelerate', 'los_constant'],
    hints: { speed: 'Speed when close electrical equipment: 2.5m/s' }
  },
  {
    order: 8,
    name: 'Revenant',
    evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.GhostWriting],
    tags: ['speed_slow', 'speed_fast', 'los_constant'],
    hints: { speed: 'Speed while chasing: 3m/s; Speed while roaming: 1m/s' }
  },
  {
    order: 9,
    name: 'Shade',
    evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.GhostWriting],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 1,
    name: 'Spirit',
    evidence: [Evidence.Emf5, Evidence.GhostWriting, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 24,
    name: 'Thaye',
    evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.GhostWriting],
    tags: ['speed_slow', 'speed_medium', 'speed_fast', 'los_constant'],
    hints: { speed: 'Speed while chasing: 3m/s; Speed while roaming: 1m/s' }
  },
  {
    order: 21,
    name: 'The Mimic',
    evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: ['speed_slow', 'speed_medium', 'speed_fast', 'los_accelerate', 'los_constant'],
    hints: { speed: 'Speed depends on mimicked ghost' }
  },
  {
    order: 18,
    name: 'The Twins',
    evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.SpiritBox],
    tags: ['speed_slow', 'speed_medium', 'speed_fast', 'los_accelerate'],
    hints: { speed: 'Main twin speed: 1.5 m/s; Decoy twin speed: 1.9m/s' }
  },
  {
    order: 2,
    name: 'Wraith',
    evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 13,
    name: 'Yokai',
    evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.SpiritBox],
    tags: ['speed_medium', 'los_accelerate']
  },
  {
    order: 11,
    name: 'Yurei',
    evidence: [Evidence.DotsProjector, Evidence.FreezingTemperature, Evidence.GhostOrb],
    tags: ['speed_medium', 'los_accelerate']
  }
];