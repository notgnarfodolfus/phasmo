import { Component } from "@angular/core";
import { EvidenceGroup, GhostGroup, TagGroup, TagId, TagState, TagStates, Ghosts, SelectorGroups, AllGroups, AllTagsById } from "src/app/services/ghost";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {

  public disabled: Set<TagId> = new Set<TagId>();
  public states: TagStates = {};

  public ghosts: TagGroup = GhostGroup;
  public evidence: TagGroup = EvidenceGroup;
  public groups: TagGroup[] = SelectorGroups;

  public hints: { [tag: string]: string } = {};

  public get showHints(): boolean {
    const count = Object.keys(this.hints).length;
    return count > 0 && count <= 10;
  }

  public reset() {
    this.hints = {};
    this.states = {};
    this.disabled.clear();
  }

  public update(value: TagStates): void {
    // Merge new value into full states tracker
    Object.assign(this.states, value);

    // Find ghosts and selectors that are still available in this configuration
    const enabled = new Set<TagId>();
    Ghosts.filter(ghost => ghost.isPossible(this.states, 0)).forEach(ghost => {
      enabled.add(ghost.name);
      ghost.evidence.forEach(e => enabled.add(e));
      ghost.selectors.forEach(s => enabled.add(s));
    });

    // Generate hints
    this.hints = Object.entries(this.states)
      .filter(s => s[1] === TagState.checked)
      .map(s => AllTagsById[s[0]])
      .filter(t => !!t.hint)
      .reduce((all, tag) => { all[tag.name] = tag.hint!; return all; }, {} as { [tag: string]: string });

    // Ensure toggled elements are clickable (enabled)
    Object.entries(this.states).filter(e => e[1] !== TagState.off).forEach(e => enabled.add(e[0] as TagId));

    // Map enabled -> disabled
    this.disabled.clear();
    AllGroups.forEach(grp => grp.options.filter(opt => !enabled.has(opt.tag)).forEach(opt => this.disabled.add(opt.tag)));
  }
}