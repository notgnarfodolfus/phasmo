
export type GhostName =
  'Banshee' | 'Demon' | 'Deogen' | 'Goryo' | 'Hantu' | 'Jinn' | 'Mare' | 'Moroi' | 'Myling' | 'Obake' | 'Oni' | 'Onryo' | 'Phantom' |
  'Poltergeist' | 'Raiju' | 'Revenant' | 'Shade' | 'Spirit' | 'Thaye' | 'The Mimic' | 'The Twins' | 'Wraith' | 'Yokai' | 'Yurei';

export enum GhostEvidence {
  EmfLevel5 = 'EMF Level 5',
  DotsProjector = 'D.O.T.S Projector',
  Ultraviolett = 'Ultraviolett',
  GhostOrb = 'Ghost Orb',
  GhostWriting = 'Ghost Writing',
  SpiritBox = 'Spirit Box',
  FreezingTemperatures = 'Freezing Temperatures'
}

const GhostEvidenceReverse = Object.entries(GhostEvidence)
  .reduce((map, e) => { map[e[1]] = e[1]; return map; }, {} as { [key: string]: GhostEvidence });

export type GhostSelector =
  'speed_slow' | 'speed_medium' | 'speed_fast' |
  'movement_normal' | 'movement_fuzzy' | 'movement_special' |
  'los_accelerate' | 'los_constant' |
  'threshold_low' | 'threshold_medium' | 'threshold_high' | 'threshold_very_high' |
  'sanity_below_40' | 'sanity_below_50' | 'sanity_below_60' | 'sanity_below_70' | 'sanity_below_80' |
  'ability_mist_event' | 'ability_footprints' | 'ability_analog_dots' | 'ability_digital_dots' |
  'hunt_ability_deogen' | 'hunt_ability_hantu' | 'hunt_ability_myling' | 'hunt_ability_obake' | 'hunt_ability_oni' | 'hunt_ability_phantom' | 'hunt_ability_poltergeist' | 'hunt_ability_yokai';

export type Config =
  'config_evidence_hidden_0' | 'config_evidence_hidden_1' | 'config_evidence_hidden_2' | 'config_evidence_hidden_3' |
  'config_sort_ghosts_default' | 'config_sort_ghosts_by_name';

export type TagId = GhostName | GhostEvidence | GhostSelector | Config;

export class Tag {

  public readonly id: TagId;
  public readonly name: string;
  public readonly hint: string | null;
  public readonly hintStriked: string | null;

  /**
   * Determines whether this tag can be negated. This can be used to negate the filter.
   * E.g. you can cross out an evidence, but it makes little sense to cross out a speed hint (because you select another hint instead).
   * If set to true the original ghost tag is used for a negative filter (deny list).
   * If set to another tag that tag is added to the positive filter list instead.
   */
  public readonly inverse: TagId | true | null;

  constructor(id: TagId, name: string, inverse: TagId | true | null = null, hint: string | null = null, hintStriked: string | true | null = null) {
    this.id = id;
    this.name = name;
    this.inverse = inverse;
    this.hint = hint;
    this.hintStriked = (hintStriked === true) ? hint : hintStriked;
  }

  public getHint(state: TagState): string | null {
    switch (state) {
      default:
      case TagState.off: return null;
      case TagState.checked: return this.hint;
      case TagState.striked: return this.hintStriked;
    }
  }
}

export class TagGroup {

  public readonly id: string;
  public readonly name: string;
  /**
   * Determines whether multiple tags in the group can be selected or crossed out.
   * If set to null there can only be a single element selected or crossed out.
   * Otherwise the positive and negative entries determine for both options whether multiple entries can be selected.
   */
  public readonly multiple: { positive: boolean, negative: boolean } | null;
  public readonly tags: Tag[];
  public readonly required: boolean;

  constructor(id: string, name: string, multiple: { positive: boolean, negative: boolean } | true | false | null, tags: Tag[], required: boolean = false) {
    this.id = id;
    this.name = name;
    this.multiple = (multiple === true) ? { positive: true, negative: true }
      : (multiple === false) ? { positive: false, negative: false }
        : multiple;
    this.tags = tags;
    this.required = required;
  }
}

export enum TagState { off, checked, striked };

export type TagStates = { [tagId: string]: TagState };

export interface GhostOptions {
  hints?: { [tag: string]: string };
  forcedEvidence?: GhostEvidence;
}

export class Ghost {

  public readonly name: GhostName;
  public readonly order: number;
  public readonly evidence: GhostEvidence[];
  public readonly selectors: GhostSelector[];
  public readonly config: GhostOptions;
  public readonly tags: Set<TagId>;

  constructor(name: GhostName, order: number, evidence: GhostEvidence[], selectors: GhostSelector[], config: GhostOptions = {}) {
    this.name = name;
    this.order = order;
    this.evidence = evidence;
    this.selectors = selectors;
    this.config = config;
    this.tags = new Set<TagId>([name, ...evidence, ...selectors]);
  }

  public isPossible(states: TagStates, evidenceHidden: number): boolean {
    // Ensure the Ghost is not automatically disabled when striked through
    const entries = Object.entries(states).filter(e => e[0] !== this.name);

    // In case a mismatching tag is CHECKED the ghost can be ruled out instantly
    if (entries.some(e => e[1] === TagState.checked && !this.tags.has(e[0] as TagId) && e[0] !== this.name)) {
      return false;
    }

    // In case we got more evidence than expected the ghost can be ruled out as well
    const evidenceStates = entries.filter(e => !!GhostEvidenceReverse[e[0]]);
    const evidenceChecked = evidenceStates.filter(e => e[1] === TagState.checked);
    if (evidenceChecked.length + evidenceHidden > this.evidence.length) {
      return false;
    }

    // In case a matching tag is STRIKED we need some aditional checks for hidden evidence
    const strikeMismatch = entries.filter(e => e[1] === TagState.striked && this.tags.has(e[0] as TagId));

    // Rule out ghosts whith forced evidence
    if (strikeMismatch.some(e => e[0] === this.config.forcedEvidence)) {
      return false;
    }

    // If some strike mismatch is not related to evidence but has another reason the ghost can be ruled out
    if (strikeMismatch.some(e => !GhostEvidenceReverse[e[0]])) {
      return false;
    }

    // If there are more evidence striked than hidden the ghost can be ruled out as well
    if (strikeMismatch.length > evidenceHidden) {
      return false;
    }

    return true;
  }
}

export const Ghosts: Ghost[] = [
  new Ghost('Banshee', 5,
    [GhostEvidence.DotsProjector, GhostEvidence.Ultraviolett, GhostEvidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots',
    ],
    {
      hints: {
        'Threshold': 'Hunts at 50% sanity of the <strong>targeted</strong> player'
      }
    }
  ),
  new Ghost('Demon', 10,
    [GhostEvidence.Ultraviolett, GhostEvidence.FreezingTemperatures, GhostEvidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_very_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Threshold': 'Hunts at 70% sanity or any time via ability'
      }
    }
  ),
  new Ghost('Deogen', 23,
    [GhostEvidence.DotsProjector, GhostEvidence.GhostWriting, GhostEvidence.SpiritBox],
    [
      'speed_slow', 'speed_fast', 'movement_special', 'los_constant',
      'threshold_low', 'sanity_below_40', 'hunt_ability_deogen',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ],
    {
      hints: {
        'Speed': 'Speed when far: 3m/s; close: 0.4m/s',
        'Threshold': 'Hunts at 40% sanity', 'Ability': 'Always finds player'
      }
    }
  ),
  new Ghost('Goryo', 15,
    [GhostEvidence.DotsProjector, GhostEvidence.EmfLevel5, GhostEvidence.Ultraviolett],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60',
      'ability_mist_event', 'ability_footprints', 'ability_digital_dots'
    ],
    {
      forcedEvidence: GhostEvidence.DotsProjector,
      hints: {
        'Ability': 'D.O.T.S only visible on video'
      }
    }
  ),
  new Ghost('Hantu', 14,
    [GhostEvidence.Ultraviolett, GhostEvidence.FreezingTemperatures, GhostEvidence.GhostOrb],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_constant',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_hantu',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      forcedEvidence: GhostEvidence.FreezingTemperatures,
      hints: {
        'Speed': 'Speed depends on temperature: 1.4m/s (15°C) to 2.7m/s (0°C)',
        'Ability': 'Breath visible when breaker is off'
      }
    }
  ),
  new Ghost('Jinn', 6,
    [GhostEvidence.EmfLevel5, GhostEvidence.Ultraviolett, GhostEvidence.FreezingTemperatures],
    [
      'speed_medium', 'speed_fast', 'los_accelerate', 'movement_fuzzy', 'movement_special', 'los_constant',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Speed': 'Constant speed of 2.5m/s if breaker is on, LoS and 3m+ distance'
      }
    }
  ),
  new Ghost('Mare', 7,
    [GhostEvidence.GhostOrb, GhostEvidence.GhostWriting, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_low', 'threshold_high', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Threshold': 'Hunts at 40% sanity if light is on or 60% if light is off'
      }
    }
  ),
  new Ghost('Moroi', 22,
    [GhostEvidence.FreezingTemperatures, GhostEvidence.GhostWriting, GhostEvidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      forcedEvidence: GhostEvidence.SpiritBox,
      hints: {
        'Speed': 'Speed depends on team sanity: 1.4m/s (45%+) to 2.1m/s (0%), accelerates (up to 3.7m/s)'
      }
    }
  ),
  new Ghost('Myling', 16,
    [GhostEvidence.EmfLevel5, GhostEvidence.Ultraviolett, GhostEvidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_myling',
      'ability_mist_event', 'ability_footprints'
    ]
  ),
  new Ghost('Obake', 20,
    [GhostEvidence.EmfLevel5, GhostEvidence.Ultraviolett, GhostEvidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_obake',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      forcedEvidence: GhostEvidence.Ultraviolett
    }
  ),
  new Ghost('Oni', 12,
    [GhostEvidence.DotsProjector, GhostEvidence.EmfLevel5, GhostEvidence.FreezingTemperatures],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_oni',
      'ability_footprints', 'ability_analog_dots'
    ]
  ),
  new Ghost('Onryo', 17,
    [GhostEvidence.FreezingTemperatures, GhostEvidence.GhostOrb, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Threshold': 'Hunts at 60% sanity or if 3 candles are blown out',
        'Ability': 'Lit candles act as crucifixes'
      }
    }
  ),
  new Ghost('Phantom', 3,
    [GhostEvidence.DotsProjector, GhostEvidence.Ultraviolett, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_phantom',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ]
  ),
  new Ghost('Poltergeist', 4,
    [GhostEvidence.Ultraviolett, GhostEvidence.GhostWriting, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50', 'hunt_ability_poltergeist',
      'ability_mist_event', 'ability_footprints'
    ]
  ),
  new Ghost('Raiju', 19,
    [GhostEvidence.DotsProjector, GhostEvidence.EmfLevel5, GhostEvidence.GhostOrb],
    [
      'speed_medium', 'speed_fast', 'movement_normal', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'los_constant',
      'threshold_medium', 'threshold_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ],
    {
      hints: {
        'Speed': 'Speed when close electrical equipment: 2.5m/s',
        'Threshold': 'Hunts at 65% in the presence of active electronics'
      }
    }
  ),
  new Ghost('Revenant', 8,
    [GhostEvidence.FreezingTemperatures, GhostEvidence.GhostOrb, GhostEvidence.GhostWriting],
    [
      'speed_slow', 'speed_fast', 'movement_special', 'los_constant',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Speed': 'Speed while chasing: 3m/s; Speed while roaming: 1m/s'
      }
    }
  ),
  new Ghost('Shade', 9,
    [GhostEvidence.EmfLevel5, GhostEvidence.FreezingTemperatures, GhostEvidence.GhostWriting],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_low',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      hints: {
        'Threshold': 'Hunts at 35% sanity'
      }
    }
  ),
  new Ghost('Spirit', 1,
    [GhostEvidence.EmfLevel5, GhostEvidence.GhostWriting, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints'
    ]
  ),
  new Ghost('Thaye', 24,
    [GhostEvidence.DotsProjector, GhostEvidence.GhostOrb, GhostEvidence.GhostWriting],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_special', 'los_constant',
      'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ],
    {
      hints: {
        'Speed': 'Speed at start: 2.75m/s; Speed at max age: 1m/s',
        'Threshold': 'Hunts at 75% to 15% sanity depending on age'
      }
    }
  ),
  new Ghost('The Mimic', 21,
    [GhostEvidence.Ultraviolett, GhostEvidence.FreezingTemperatures, GhostEvidence.GhostOrb, GhostEvidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_normal', 'movement_fuzzy', 'movement_special', 'los_accelerate', 'los_constant',
      'threshold_low', 'threshold_medium', 'threshold_high', 'threshold_very_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80',
      'ability_mist_event', 'ability_footprints'
    ],
    {
      forcedEvidence: GhostEvidence.GhostOrb,
      hints: {
        'Speed': 'Speed depends on mimicked ghost',
        'Threshold': 'Hunt threshold depends on mimicked ghost'
      }
    }
  ),
  new Ghost('The Twins', 18,
    [GhostEvidence.EmfLevel5, GhostEvidence.FreezingTemperatures, GhostEvidence.SpiritBox],
    [
      'speed_slow', 'speed_medium', 'speed_fast', 'movement_fuzzy', 'movement_special', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints',
    ],
    {
      hints: {
        'Speed': 'Main twin speed: 1.5 m/s; Decoy twin speed: 1.9m/s'
      }
    }
  ),
  new Ghost('Wraith', 2,
    [GhostEvidence.DotsProjector, GhostEvidence.EmfLevel5, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_analog_dots'
    ]
  ),
  new Ghost('Yokai', 13,
    [GhostEvidence.DotsProjector, GhostEvidence.GhostOrb, GhostEvidence.SpiritBox],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'threshold_very_high', 'sanity_below_40', 'sanity_below_50', 'sanity_below_60', 'sanity_below_70', 'sanity_below_80', 'hunt_ability_yokai',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ],
    {
      hints: {
        'Threshold': 'Hunts at 80% if a player is talking in its ghost room',
        'Ability': 'Hears sounds and senses electroincs in a radius of 2.5m (instead of 9m and 7m)'
      }
    }
  ),
  new Ghost('Yurei', 11,
    [GhostEvidence.DotsProjector, GhostEvidence.FreezingTemperatures, GhostEvidence.GhostOrb],
    [
      'speed_medium', 'movement_normal', 'los_accelerate',
      'threshold_medium', 'sanity_below_40', 'sanity_below_50',
      'ability_mist_event', 'ability_footprints', 'ability_analog_dots'
    ]
  )
];

export const GhostGroupAlphabetical: TagGroup = new TagGroup(
  'ghosts_alphabetical',
  'Ghosts',
  { positive: false, negative: true },
  Ghosts.map((g) => new Tag(g.name, g.name, true))
);

export const GhostGroup: TagGroup = new TagGroup(
  'ghosts',
  'Ghosts',
  { positive: false, negative: true },
  Ghosts.sort((a, b) => a.order - b.order).map((g) => new Tag(g.name, g.name, true))
);

export const EvidenceGroup: TagGroup = new TagGroup(
  'evidence',
  'Evidence',
  true,
  Object.values(GhostEvidence).map((v) => new Tag(v, v, true))
);

export const SelectorGroups: TagGroup[] = [
  new TagGroup('speed', 'Speed', true, [
    new Tag('speed_slow', 'Slow'),
    new Tag('speed_medium', 'Medium'),
    new Tag('speed_fast', 'Fast')
  ]),
  new TagGroup('los', 'Line of Sight', true, [
    new Tag('los_accelerate', 'Accelerate', null, 'The ghost accelerates by 65% over 13sec when seeing a player'),
    new Tag('los_constant', 'Constant / Special', null, 'The ghost has constant speed or special speed rules while chasing the player')
  ]),
  new TagGroup('sanity', 'Hunt Sanity', null, [
    new Tag('sanity_below_40', '40%'),
    new Tag('sanity_below_50', '50%'),
    new Tag('sanity_below_60', '60%'),
    new Tag('sanity_below_70', '70%'),
    new Tag('sanity_below_80', '80%')
  ]),
  new TagGroup('threshold', 'Threshold', null, [
    new Tag('threshold_low', '< 50%'),
    new Tag('threshold_medium', '50%'),
    new Tag('threshold_high', '> 50%'),
    new Tag('threshold_very_high', '> 65%')
  ]),
  new TagGroup('hunt_abilities', 'Hunt Abilites', { positive: false, negative: true }, [
    new Tag('hunt_ability_phantom', 'Shorter visible', true, '<strong>Phantom</strong>s are only visible every 1 to 2 sec (instead of 0.3 to 1s) during hunts'),
    new Tag('hunt_ability_oni', 'Longer visible', true, '<strong>Oni</strong>s have shorter invisibility phases during hunts and are better visible'),
    new Tag('hunt_ability_obake', 'Shapeshift', true, '<strong>Obake</strong> can temporary shapeshift to another ghost model on each blink during hunts (6.67%)'),
    new Tag('hunt_ability_hantu', 'Visible breath', true, 'On <strong>Hantu</strong> models the breath is visible when the breaker is off'),
    new Tag('hunt_ability_yokai', 'Less audition', true, '<strong>Yokai</strong>s can hear players and sense electronics within 2.5m (instead of 9 and 7m)'),
    new Tag('hunt_ability_myling', 'Low audible range', true, '<strong>Myling</strong> footsteps can be heard within 12m (instead of 20m)'),
    new Tag('hunt_ability_poltergeist', 'Frequent throws', true, 'A <strong>Poltergeist</strong> always throws available nearby items during hunts (instead of 50%)'),
    new Tag('hunt_ability_deogen', 'Finds players', true, '<strong>Deogen</strong>s always know where the players are and aproach rapidly before slowing down')
  ]),
  new TagGroup('ghost_abilities', 'Ghost Abilites', true, [
    new Tag('ability_mist_event', 'Mist Orb', true, '<strong>Oni</strong>s are unable to perform the mist orb ghost event', true),
    new Tag('ability_footprints', 'Footprints', true, '<strong>Wraith</strong>es will never step into salt', true),
    new Tag('ability_digital_dots', 'Digital D.O.T.S.', 'ability_analog_dots', '<strong>Goryo</strong> D.O.T.S can only be seen through a video camera', true)
  ]),
];

export const ConfigEvidence: TagGroup = new TagGroup(
  'config_evidence_hidden', 'Evidence', null,
  [
    new Tag('config_evidence_hidden_0', 'All Evidence'),
    new Tag('config_evidence_hidden_1', 'One Hidden (Nightmare)'),
    new Tag('config_evidence_hidden_2', 'Two Hidden (Insanity)'),
    new Tag('config_evidence_hidden_3', 'No Evidence (Custom)')
  ], true);

export const ConfigSorting: TagGroup = new TagGroup(
  'config_ghost_sorting', 'Sort Ghosts', null,
  [
    new Tag('config_sort_ghosts_default', 'Regular Order'),
    new Tag('config_sort_ghosts_by_name', 'Sort by Name')
  ], true);

export const AllGroups: TagGroup[] = [GhostGroup, EvidenceGroup, ...SelectorGroups];
export const AllTagsById: { [key: string]: Tag } = AllGroups.flatMap(grp => grp.tags).reduce((tags, tag) => { tags[tag.id] = tag; return tags }, {} as { [key: string]: Tag });
