import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ghosts } from 'src/app/services/ghosts';
import { GhostName } from 'src/app/services/models';
import { CheckState } from '../check/check-base/check-base.component';

@Component({
  selector: 'app-ghost-select',
  templateUrl: './ghost-select.component.html',
  styleUrls: ['./ghost-select.component.scss']
})
export class GhostSelectComponent implements OnInit {

  @Input() public selected: GhostName | null = null;
  @Input() public eliminated: Set<GhostName> = new Set<GhostName>();
  @Input() public disabled: Set<GhostName> = new Set<GhostName>();

  @Output() public selectedChange = new EventEmitter<GhostName | null>();
  @Output() public eliminatedChange = new EventEmitter<Set<GhostName>>();
  @Output() public change = new EventEmitter<void>();

  public ghosts: GhostName[] = [];

  public ngOnInit(): void {
    this.ghosts = Object.values(Ghosts).sort((a, b) => a.order - b.order).map(g => g.name);
  }

  public getState(ghost: GhostName): CheckState {
    if (ghost === this.selected) return CheckState.checked;
    else if (this.eliminated.has(ghost)) return CheckState.striked;
    else return CheckState.off;
  }

  public setState(ghost: GhostName, state: CheckState) {
    if (state === CheckState.checked) {
      this.selected = ghost;
      this.selectedChange.emit(ghost);
    } else if (this.selected === ghost) {
      this.selected = null;
      this.selectedChange.emit(null);
    }
    if ((state === CheckState.striked && this.eliminated.add(ghost)) || this.eliminated.delete(ghost)) {
      this.eliminatedChange.emit(this.eliminated);
    }
    this.change.emit();
  }
}
