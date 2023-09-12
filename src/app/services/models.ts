export enum GhostName {
  Banshee = 'Banshee',
  Demon = 'Demon',
  Deogen = 'Deogen',
  Goryo = 'Goryo',
  Hantu = 'Hantu',
  Jinn = 'Jinn',
  Mare = 'Mare',
  Mimic = 'The Mimic',
  Moroi = 'Moroi',
  Myling = 'Myling',
  Obake = 'Obake',
  Oni = 'Oni',
  Onryo = 'Onryo',
  Phantom = 'Phantom',
  Poltergeist = 'Poltergeist',
  Raiju = 'Raiju',
  Revenant = 'Revenant',
  Shade = 'Shade',
  Spirit = 'Spirit',
  Thaye = 'Thaye',
  Twins = 'The Twins',
  Wraith = 'Wraith',
  Yokai = 'Yokai',
  Yurei = 'Yurey'
}

export enum Evidence {
  EmfLevel5 = 'EMF Level 5',
  DotsProjector = 'D.O.T.S Projector',
  Ultraviolett = 'Ultraviolett',
  GhostOrb = 'Ghost Orb',
  GhostWriting = 'Ghost Writing',
  SpiritBox = 'Spirit Box',
  Freezing = 'Freezing Temperatures'
}

export type Tag = string;

export type HuntAbilityName = string;

export class GhostFilters {

  // Optional ghost speed estimation in m/s, cleaned of difficulty setting mulipliers (mapped to 100%)
  public speedEstimation: number | null;

  // Optional hunt threshold sanity estimation (the maximum average player sanity when the ghost started a regular hunt)
  public thresholdEstimation: number;

  public ghostSelected: GhostName | null;

  public ghostEliminated: Set<GhostName>;
  public evidenceSelected: Set<Evidence>;
  public evidenceEliminated: Set<Evidence>;
  public huntAbiliesFlipped: Set<HuntAbilityName>;
  public tagsSelected: Set<Tag>;
  public tagsEliminated: Set<Tag>;
  public config: GhostFilterConfig;

  constructor() {
    this.speedEstimation = null;
    this.thresholdEstimation = 0;
    this.ghostSelected = null;

    this.ghostEliminated = new Set<GhostName>();
    this.evidenceSelected = new Set<Evidence>();
    this.evidenceEliminated = new Set<Evidence>();
    this.huntAbiliesFlipped = new Set<Evidence>();
    this.tagsSelected = new Set<Tag>();
    this.tagsEliminated = new Set<Tag>();
    this.config = {
      evidenceHidden: 0,
      ghostSpeedAccuracy: 0.1
    };
  }
}

export interface GhostFilterConfig {

  evidenceHidden: number;
  ghostSpeedAccuracy: number; // % allowed difference to actual speed
}

/**
 * For serialization.
 * Additional fields can be added per ghost.
 */
export interface GhostModel {
  order: number;
  evidence: string[];
  forced?: string;
  speed?: number;
  threshold?: number;
  hunts?: HuntAbilityModel[];
};

/**
* For serialization.
*/
export interface TagModel {
  name: string
};

/**
 * Optional ghost abilitiy that can trigger or prevent a hunt.
 * Ghosts that have such abilities are Demon, Mare, Onryo, Raiju, Shade (prevent), 
 */
export interface HuntAbilityModel {
  name: string;
  description: string;
  threshold: number;
  enabled?: boolean;
  prevent?: boolean;
  order?: number;
}

/**
 * Optional ghost abilitiy that can trigger or prevent a hunt.
 * Ghosts that have such abilities are Demon, Mare, Onryo, Raiju, Shade (prevent), 
 */
export class HuntAbility {

  public readonly name: HuntAbilityName; // condition to trigger the hunt ability
  public readonly description: string;
  public readonly threshold: number; // sanity required
  public readonly enabled: boolean; // enabled by default?
  public readonly prevent: boolean; // ability prevents the hunt instead of triggering one
  public readonly order: number; // sorting priority

  constructor(data: HuntAbilityModel) {
    this.name = data.name;
    this.description = data.description;
    this.threshold = data.threshold;
    this.enabled = data.enabled ?? false;
    this.prevent = data.prevent ?? false;
    this.order = data.order ?? 0;
  }
}

export class TagData {

  public readonly key: Tag;
  public readonly name: string;

  constructor(key: Tag, data: TagModel) {
    this.key = key;
    this.name = data.name;
  }
}

/**
 * Common base class for all ghosts and concrete implementation for most.
 * Some ghosts have custom classes that inherit from this base class to verify their plausibility in specific circumstances.
 * Overriding classes have to be registered in the GhostImplementations lookup in ghosts.ts to be generated correctly!
 */
export class Ghost {

  public readonly name: GhostName;
  public readonly order: number; // In game number for sorting
  public readonly evidence: Evidence[];
  public readonly forced: Evidence | null;
  public readonly tags: Set<Tag>;
  public readonly threshold: number; // The maximum sanity threshold at which the ghost can hunt including all abilities
  public readonly speed: number; // Ghost specific classes may ignore this value
  public readonly hunts: HuntAbility[];

  constructor(name: GhostName, data: GhostModel) {
    this.name = name;
    this.order = data.order;
    this.evidence = data.evidence.map(e => Evidence[e as keyof typeof Evidence]);
    this.forced = data.forced ? Evidence[data.forced as keyof typeof Evidence] : null;
    this.tags = new Set<Tag>();
    this.threshold = data.threshold ?? 50; // Setup to default sanity threshold
    this.speed = data.speed ?? 1.7; // Setup to default speed
    this.hunts = data.hunts ? data.hunts.map(h => new HuntAbility(h)) : [];
  }

  public isPossible(filters: GhostFilters): boolean {
    if (this.isGhostMismatch(filters)) return false;
    if (this.isEvidenceExcluded(filters)) return false;
    if (this.isEvidenceMismatch(filters)) return false;
    if (this.isForcedEvidenceMismatch(filters)) return false;
    if (this.isTagExcluded(filters)) return false;
    if (this.isTagMismatch(filters)) return false;
    if (!this.isThresholdPossible(filters)) return false;
    if (!this.isSpeedPossible(filters)) return false;
    return true;
  }

  // Is any other ghost selected?
  // We do NOT check whether this ghost has explicitly excluded, otherwise it would be disabled and cannot be toggled back!
  public isGhostMismatch(filters: GhostFilters): boolean {
    return filters.ghostSelected !== null && filters.ghostSelected !== this.name;
  }

  // Has any required evidence of this ghost been eliminated?
  public isEvidenceExcluded(filters: GhostFilters): boolean {
    const excluded = this.evidence.filter(e => filters.evidenceEliminated.has(e));
    return excluded.length > filters.config.evidenceHidden;
  }

  // Does the selected evidence not match the ghost evidence?
  public isEvidenceMismatch(filters: GhostFilters): boolean {
    const total = (filters.evidenceSelected.size + filters.config.evidenceHidden);
    if (total > this.evidence.length) return true; // More evidence selected than expected
    return [...filters.evidenceSelected].some(s => !this.evidence.includes(s)); // Mismatch?
  }

  // Was the forced evidence eliminated or cannot be selected anymore?
  public isForcedEvidenceMismatch(filters: GhostFilters): boolean {
    if (this.forced == null || filters.evidenceSelected.has(this.forced)) return false; // This is fine
    return filters.evidenceEliminated.has(this.forced) || filters.evidenceSelected.size + filters.config.evidenceHidden > this.evidence.length;
  }

  // Has any required evidence of this ghost been eliminated?
  public isTagExcluded(filters: GhostFilters): boolean {
    return [...this.tags].some(t => filters.tagsEliminated.has(t));
  }

  // Is any tag selected that this ghost does not have?
  public isTagMismatch(filters: GhostFilters): boolean {
    return [...filters.tagsSelected].some(t => !this.tags.has(t));
  }

  // Can the ghost even hunt at this point?
  public isThresholdPossible(filters: GhostFilters): boolean {
    const current = filters.thresholdEstimation ?? 0;
    const abilities = this.getActiveHuntAbilities(filters);
    // Check whether a hunt is prevented due to an ability
    if (abilities.some(a => a.prevent && a.threshold < current)) return false;
    // Check whether a hunt is positive due to an ability
    if (abilities.some(a => !a.prevent && a.threshold >= current)) return true;
    return this.threshold >= current;
  }

  // Does the selected ghost speed configuration match on this ghost?
  // This method might be overwritten by specific ghost implementations.
  public isSpeedPossible(filters: GhostFilters): boolean {
    return Ghost.speedInRange(filters, this.speed);
  }

  // Assuming this ghost is shortlisted (isPossible returned true) this provide evidence that may still be selected.
  // This includes already selected evidence (which must be selectable because it IS selected and this ghost is possible).
  public getPossibleEvidence(filters: GhostFilters): Evidence[] {
    const remaining = this.evidence.length - filters.evidenceSelected.size - filters.config.evidenceHidden;
    if (remaining <= 0) return [];
    if (remaining > 1 || this.forced === null || filters.evidenceSelected.has(this.forced)) return this.evidence;
    else return [this.forced]; // The only valid remaining option is the forced evidence
  }

  // Return all hunt abilities of this ghost that are current enabled
  protected getActiveHuntAbilities(filters: GhostFilters): HuntAbility[] {
    return this.hunts.filter(h => h.enabled !== filters.huntAbiliesFlipped.has(h.name));
  }

  protected static speedInRange(filters: GhostFilters, min: number, max: number = min): boolean {
    const value = filters.speedEstimation;
    if (value == null)
      return true; // C: Can't say
    const margin = filters.config.ghostSpeedAccuracy;
    return value >= min * (1 - margin) && value <= max * (1 + margin);
  }
}