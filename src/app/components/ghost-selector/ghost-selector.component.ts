import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Evidence, Ghost, Ghosts } from 'src/app/services/ghost';

@Component({
  selector: 'app-ghost-selector',
  templateUrl: './ghost-selector.component.html',
  styleUrls: ['./ghost-selector.component.scss']
})
export class GhostSelectorComponent implements OnInit, OnChanges {

  public readonly ghosts: Ghost[] = Ghosts;
  public readonly evidence: Evidence[] = Object.values(Evidence);

  // --- Component Parameter ---
  @Input() public disable?: string[];

  // --- User Inputs ---
  public ghostConfirm: Ghost | null = null;
  public ghostExclude: Set<Ghost> = new Set<Ghost>();
  public evidenceConfirm: Set<Evidence> = new Set<Evidence>();
  public evidenceExclude: Set<Evidence> = new Set<Evidence>();

  // --- Computed Values ---
  public ghostEnabled: Set<Ghost> = new Set<Ghost>();
  public evidenceEnabled: Set<Evidence> = new Set<Evidence>();

  public ngOnInit(): void {
    this.ghosts.sort((a, b) => a.order - b.order); // (a, b) => a.name.localeCompare(b.name)
    this.reset();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.compute();
  }

  public reset() {
    this.ghostConfirm = null;
    this.ghostExclude.clear();
    this.evidenceConfirm.clear();
    this.evidenceExclude.clear();

    this.ghosts.forEach(ghost => this.ghostEnabled.add(ghost));
    this.evidence.forEach(evidence => this.evidenceEnabled.add(evidence));

    this.compute();
  }

  private compute() {
    this.findPossibleGhosts();
    this.findPossibleEvidence();
    if (this.ghostConfirm && !this.isPossible(this.ghostConfirm)) {
      // Reset selected ghost
      this.ghostConfirm = null;
    }
  }

  public onGhostUpdate(g: Ghost, pos: boolean, neg: boolean): void {
    if (pos) this.ghostConfirm = g;
    else this.ghostConfirm = null;
    if (neg) this.ghostExclude.add(g);
    else this.ghostExclude.delete(g);
    this.compute();
  }

  public onEvidenceUpdate(e: Evidence, pos: boolean, neg: boolean): void {
    if (pos) this.evidenceConfirm.add(e);
    else this.evidenceConfirm.delete(e);
    if (neg) this.evidenceExclude.add(e);
    else this.evidenceExclude.delete(e);
    this.compute();
  }

  private findPossibleGhosts(): void {
    this.ghostEnabled.clear();
    this.ghosts
      .filter(ghost => this.isPossible(ghost))
      .forEach(ghost => this.ghostEnabled.add(ghost));
  }

  private findPossibleEvidence(): void {
    // ghostEnabled has to be computed first!
    this.evidenceEnabled.clear();
    if (this.ghostConfirm) {
      this.ghostConfirm.evidence.forEach(evidence => this.evidenceEnabled.add(evidence));
      return;
    }
    // this.evidenceConfirm.forEach(evidence => this.evidenceEnabled.add(evidence));
    this.evidenceExclude.forEach(evidence => this.evidenceEnabled.add(evidence));
    [...this.ghostEnabled]
      .filter(ghost => !this.ghostExclude.has(ghost))
      .forEach(ghost => ghost.evidence.forEach(evidence => this.evidenceEnabled.add(evidence)));
  }

  private isPossible(ghost: Ghost): boolean {
    if (this.disable?.includes(ghost.name)) return false;
    if (ghost.evidence.some(e => this.evidenceExclude.has(e))) return false;
    if ([...this.evidenceConfirm].some(e => !ghost.evidence.includes(e))) return false;
    return true;
  }
}
