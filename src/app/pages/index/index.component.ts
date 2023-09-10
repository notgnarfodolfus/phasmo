import { Component } from "@angular/core";
import { Ghosts } from "src/app/services/ghosts";
import { Evidence, GhostFilters, GhostName } from "src/app/services/models";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPageComponent {

  public readonly ghosts = Ghosts;
  public readonly filters = new GhostFilters();

  public ghostsDisabled = new Set<GhostName>();
  public evidenceDisabled = new Set<Evidence>();

  public onChange() {
    // Compute remaining options
    const possibleGhosts = Object.values(Ghosts).filter(g => g.isPossible(this.filters));
    const possibleEvidence = new Set<Evidence>();
    possibleGhosts // Evidence of eliminated ghosts is ruled out as well
      .filter(g => !this.filters.ghostEliminated.has(g.name))
      .forEach(g => g.evidence.forEach(e => possibleEvidence.add(e)));

    // Map remaining options to disabled states
    const impossibleGhosts = Object.values(Ghosts)
      .map(ghost => ghost.name)
      .filter(name => !possibleGhosts.some(p => p.name === name));
    const impossibleEvidence = Object.values(Evidence) // Ensure the user can always toggle the evidence state back
      .filter(evid => !this.filters.evidenceSelected.has(evid) && !this.filters.evidenceEliminated.has(evid))
      .filter(evid => !possibleEvidence.has(evid));
    this.ghostsDisabled = new Set<GhostName>(impossibleGhosts);
    this.evidenceDisabled = new Set<Evidence>(impossibleEvidence);
  }
}