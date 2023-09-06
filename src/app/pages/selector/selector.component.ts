import { Component } from "@angular/core";
import { EvidenceGroup, GhostGroup, TagGroup, TagId, TagState, TagStates, Ghosts, SelectorGroups, AllGroups, AllTagsById, ConfigEvidence, GhostEvidence, Ghost } from "src/app/services/ghost";

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

  public get showHints(): boolean {
    const count = Object.keys(this.hints).length;
    return count > 0 && count <= 10;
  }

  public get title(): string {
    if (!this.showConfig) {
      const opt = ConfigEvidence.tags.find(opt => this.config[opt.id] === TagState.checked);
      if (opt != null && opt.id != 'config_evidence_hidden_0') {
        return 'Evidence - ' + opt.name;
      }
    }
    return 'Evidence';
  }

  public reset() {
    this.states = {};
    this.update({});
  }

  public update(value: TagStates): void {

    // Merge new value into full states tracker
    Object.assign(this.states, value);

    const evidenceHidden = this.getEvidenceHidden();

    // Find ghosts and selectors that are still available in this configuration
    const enabled = new Set<TagId>();
    Ghosts.filter(ghost => ghost.isPossible(this.states, evidenceHidden)).forEach(ghost => {
      enabled.add(ghost.name);
      ghost.evidence.forEach(e => enabled.add(e));
      ghost.selectors.forEach(s => enabled.add(s));
    });

    // Disable impossible evidence options depending on hidden settings
    this.impossibleEvidence(this.states, evidenceHidden).forEach(e => enabled.delete(e))

    // Generate hints
    const ghostHints = Ghosts.filter(g => this.states[g.name] === TagState.checked)
      .flatMap(g => Object.entries(g.config.hints ?? {})
        .map(e => { return { key: g.name + ' ' + e[0], value: e[1] }; }));
    const tagHints = Object.entries(this.states)
      .filter(s => s[1] === TagState.checked)
      .map(s => AllTagsById[s[0]])
      .filter(t => !!t?.hint)
      .map(t => { return { key: t.name, value: t.hint! } });
    this.hints = ghostHints.concat(tagHints);

    // Ensure toggled elements are clickable (enabled)
    Object.entries(this.states)
      .filter(e => e[1] !== TagState.off)
      .forEach(e => enabled.add(e[0] as TagId));

    // Map enabled -> disabled
    this.disabled.clear();
    AllGroups.forEach(grp => grp.tags.filter(opt => !enabled.has(opt.id)).forEach(opt => this.disabled.add(opt.id)));
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