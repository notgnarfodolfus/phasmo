import { Component } from "@angular/core";
import {
  EvidenceGroup,
  GhostGroup,
  TagGroup,
  TagId,
  TagState,
  TagStates,
  Ghosts,
  SelectorGroups,
  AllGroups,
  AllTagsById,
  ConfigEvidence,
  GhostEvidence,
  Ghost,
  ConfigSorting,
  GhostGroupAlphabetical
} from "src/app/services/ghost";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {

  public disabled: Set<TagId> = new Set<TagId>();
  public states: TagStates = {};
  public config: TagStates = {};

  public ghosts: TagGroup = GhostGroup;
  public evidence: TagGroup = EvidenceGroup;
  public selectors: TagGroup[] = SelectorGroups;

  public hints: { key: string, value: string }[] = [];

  public showConfig: boolean = false;
  public evidenceConfig: TagGroup = ConfigEvidence;
  public sortConfig: TagGroup = ConfigSorting;

  public get showHints(): boolean {
    const count = Object.keys(this.hints).length;
    return count > 0 && count <= 10;
  }

  public get title(): string {
    if (!this.showConfig) {
      const opt = ConfigEvidence.tags.find(opt => this.config[opt.id] === TagState.checked);
      if (opt != null && opt.id !== 'config_evidence_hidden_0') {
        return 'Evidence - ' + opt.name;
      }
    }
    return 'Evidence';
  }

  public reset() {
    this.states = {};
    this.update();
  }

  public update(): void {
    const evidenceHidden = this.getEvidenceHidden();

    // Find ghosts and selectors that are still available in this configuration
    const enabled = new Set<TagId>();
    Ghosts.filter(ghost => ghost.isPossible(this.states, evidenceHidden)).forEach(ghost => {
      enabled.add(ghost.name);
      if (this.states[ghost.name] !== TagState.striked) {
        ghost.evidence.forEach(e => enabled.add(e));
        ghost.selectors.forEach(s => enabled.add(s));
      }
    });

    // Disable impossible evidence options depending on hidden settings
    this.impossibleEvidence(this.states, evidenceHidden).forEach(e => enabled.delete(e))

    // Generate hints
    const ghostHints = Ghosts.filter(g => this.states[g.name] === TagState.checked)
      .flatMap(g => Object.entries(g.config.hints ?? {})
        .map(e => { return { key: g.name + ' ' + e[0], value: e[1] }; }));
    const tagHints = Object.entries(this.states)
      .map(s => {
        const tag = AllTagsById[s[0]];
        const hint = tag?.getHint(s[1]);
        return hint ? { key: tag.name, value: hint } : null;
      })
      .filter(t => !!t)
      .map(t => t!);
    this.hints = [...ghostHints, ...tagHints];

    // Ensure active elements (except ghosts) are clickable/enabled
    [EvidenceGroup, ...SelectorGroups]
      .flatMap(g => g.tags)
      .filter(t => this.states[t.id] !== TagState.off)
      .forEach(t => enabled.add(t.id));

    // Map enabled -> disabled
    this.disabled.clear();
    AllGroups.forEach(grp => grp.tags.filter(opt => !enabled.has(opt.id)).forEach(opt => this.disabled.add(opt.id)));
  }

  public updateSorting() {
    const sortByName = this.config['config_sort_ghosts_by_name'] === TagState.checked;
    this.ghosts = sortByName ? GhostGroupAlphabetical : GhostGroup;
  }

  private getEvidenceHidden(): number {
    const opt = ConfigEvidence.tags.find(opt => this.config[opt.id] === TagState.checked);
    switch (opt?.id) {
      default:
      case 'config_evidence_hidden_0': return 0;
      case 'config_evidence_hidden_1': return 1;
      case 'config_evidence_hidden_2': return 2;
      case 'config_evidence_hidden_3': return 3;
    }
  }

  private readonly mimic: Ghost = Ghosts.find(g => g.name === 'The Mimic')!;

  private impossibleEvidence(states: TagStates, evidenceHidden: number): GhostEvidence[] {
    const evidenceSelected = Object.values(GhostEvidence).filter(e => states[e] === TagState.checked);
    const evidenceOff = Object.values(GhostEvidence).filter(e => states[e] !== TagState.checked && states[e] !== TagState.striked);
    const evidenceRemain = 3 - evidenceSelected.length - evidenceHidden;
    if (evidenceRemain > 0) {
      // All evidence is possible
      return [];
    } else if (evidenceRemain <= -1 || !this.mimic.isPossible(states, evidenceHidden)) {
      // No more evidence is possible
      return evidenceOff;
    } else {
      // Only mimic evidence is possible
      const orbChecked = states[GhostEvidence.GhostOrb] === TagState.checked;
      return evidenceOff.filter(e => e !== GhostEvidence.GhostOrb && !(orbChecked && this.mimic.evidence.includes(e)));
    }
  }
}