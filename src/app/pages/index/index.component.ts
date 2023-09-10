import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component } from "@angular/core";
import { Ghosts } from "src/app/services/ghosts";
import { Evidence, GhostFilters, GhostName } from "src/app/services/models";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    trigger('moveIn', [
      state('open', style({ opacity: 1, height: '*' })),
      transition(':enter', [style({ opacity: 0, height: '0px' }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: '0px' })))
    ])
  ]
})
export class IndexPageComponent {

  public readonly evidenceOptions = [
    { title: 'All Evidence', value: 0 },
    { title: 'One Hidden (Nightmare)', value: 1 },
    { title: 'Two Hidden (Insanity)', value: 2 },
    { title: 'No Evidence (Custom)', value: 3 }
  ];

  public showConfig: boolean = false;

  public readonly ghosts = Ghosts;
  public readonly filters = new GhostFilters();

  public ghostsDisabled = new Set<GhostName>();
  public evidenceDisabled = new Set<Evidence>();

  public get title(): string {
    switch (this.evidenceHidden) {
      default:
      case 0: return 'Evidence';
      case 1: return 'Evidence (one hidden)';
      case 2: return 'Evidence (two hidden)';
      case 3: return 'Zero Evidence';
    }
  }

  public get evidenceHidden(): number | null {
    return this.filters.config.evidenceHidden;
  }

  public set evidenceHidden(value: number | null) {
    this.filters.config.evidenceHidden = value ?? 0;
    this.onChange();
  }

  public reset() {
    this.filters.reset(false);
    this.onChange();
  }

  public onChange() {
    // Compute remaining ghost and evidence options
    const possibleGhosts = Object.values(Ghosts).filter(g => g.isPossible(this.filters));
    const possibleEvidence = new Set<Evidence>();
    possibleGhosts
      .filter(g => !this.filters.ghostEliminated.has(g.name))
      .forEach(g => g.getPossibleEvidence(this.filters).forEach(e => possibleEvidence.add(e)));

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