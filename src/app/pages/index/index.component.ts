import { Component } from "@angular/core";
import { Ghosts } from "src/app/services/ghosts";
import { Evidence, GhostFilters, GhostName } from "src/app/services/models";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPageComponent {

  private _filters = new GhostFilters();

  public ghostsDisabled = new Set<GhostName>();
  public evidenceDisabled = new Set<Evidence>();
  public ghostsExcluded = new Set<GhostName>(); // disabled or striked

  public get filters(): GhostFilters {
    return this._filters;
  }

  public set filters(value: GhostFilters) {
    const filters: GhostFilters = Object.assign({}, value);

    // Compute remaining ghost and evidence options
    const possibleGhosts = Object.values(Ghosts).filter(g => g.isPossible(filters));
    const possibleEvidence = new Set<Evidence>();
    possibleGhosts
      .filter(g => !filters.ghostEliminated.has(g.name))
      .forEach(g => g.getPossibleEvidence(filters).forEach(e => possibleEvidence.add(e)));

    // Map remaining options to disabled states
    const impossibleGhosts = Object.values(Ghosts)
      .map(ghost => ghost.name)
      .filter(name => !possibleGhosts.some(p => p.name === name));
    const impossibleEvidence = Object.values(Evidence) // Ensure the user can always toggle the evidence state back
      .filter(evid => !filters.evidenceSelected.has(evid) && !filters.evidenceEliminated.has(evid))
      .filter(evid => !possibleEvidence.has(evid));
    this.ghostsDisabled = new Set<GhostName>(impossibleGhosts);
    this.evidenceDisabled = new Set<Evidence>(impossibleEvidence);
    this.ghostsExcluded = new Set<GhostName>([...impossibleGhosts, ...filters.ghostEliminated]);

    // Apply new data
    this._filters = filters;
  }
}