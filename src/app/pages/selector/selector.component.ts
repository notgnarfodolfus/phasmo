import { Component, OnInit } from '@angular/core';
import { Evidence, Ghost, Ghosts } from 'src/app/services/ghost.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  public readonly evidence: Evidence[] = Object.values(Evidence);
  public readonly ghosts: Ghost[] = Ghosts;

  public evidencePositive: Set<Evidence> = new Set<Evidence>(); // Confirmed evidence
  public evidenceNegative: Set<Evidence> = new Set<Evidence>(); // Excluded evidence
  public evidencePossible: Set<Evidence> = new Set<Evidence>(); // Computed remaining possible evidence

  public ghostPositive: Ghost | null = null; // Confirmed ghost (max 1)
  public ghostNegative: Set<Ghost> = new Set<Ghost>; // Excluded ghosts
  public ghostPossible: Set<Ghost> = new Set<Ghost>(); // Computed remaining possible ghosts
  public ghostExcludedEvidence: Set<Evidence> = new Set<Evidence>();

  public ngOnInit(): void {
    this.reset();
  }

  public reset() {
    this.ghostPositive = null;
    this.ghostNegative.clear();
    this.evidencePositive.clear();
    this.evidenceNegative.clear();
    this.ghostExcludedEvidence.clear();
    this.findPossibleGhosts();
    this.findPossibleEvidence();
  }

  public onEvidenceUpdate(e: Evidence, pos: boolean, neg: boolean): void {
    if (pos) this.evidencePositive.add(e);
    else this.evidencePositive.delete(e);
    if (neg) this.evidenceNegative.add(e);
    else this.evidenceNegative.delete(e);

    if (neg) this.ghostExcludedEvidence.clear();

    this.findPossibleGhosts();
    this.findPossibleEvidence();
  }

  public onGhostUpdate(g: Ghost, pos: boolean, neg: boolean): void {
    this.ghostPositive = pos ? g : null;
    if (neg) this.ghostNegative.add(g);
    else this.ghostNegative.delete(g);

    this.ghostExcludedEvidence.clear();
    if (pos) {
      this.evidence.filter(e => !g.evidence.includes(e)).forEach(e => this.ghostExcludedEvidence.add(e));
    } else {
      this.findPossibleEvidence();
    }
  }

  private findPossibleGhosts(): void {
    this.ghostPossible.clear();
    this.ghosts
      .filter(ghost => this.isPossible(ghost))
      .forEach(ghost => this.ghostPossible.add(ghost));

    if (this.ghostPositive && !this.ghostPossible.has(this.ghostPositive)) {
      this.ghostPositive = null;
    }
  }

  private findPossibleEvidence(): void {
    this.evidencePossible.clear();
    this.evidencePositive.forEach(evidence => this.evidencePossible.add(evidence));
    this.evidenceNegative.forEach(evidence => this.evidencePossible.add(evidence));
    this.ghostPossible.forEach(ghost => ghost.evidence.forEach(evidence => this.evidencePossible.add(evidence)));
  }

  private isPossible(ghost: Ghost): boolean {
    if (this.ghostNegative.has(ghost)) return false;
    if (ghost.evidence.some(e => this.evidenceNegative.has(e))) return false;
    if ([...this.evidencePositive].some(e => !ghost.evidence.includes(e))) return false;
    return true;
  }
}
