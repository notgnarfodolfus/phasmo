import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Evidence } from 'src/app/services/models';
import { CheckState } from '../check/check-base/check-base.component';

@Component({
  selector: 'app-evidence-select',
  templateUrl: './evidence-select.component.html',
  styleUrls: ['./evidence-select.component.scss']
})
export class EvidenceSelectComponent implements OnInit {

  @Input() public selected: Set<Evidence> = new Set<Evidence>();
  @Input() public eliminated: Set<Evidence> = new Set<Evidence>();
  @Input() public disabled: Set<Evidence> = new Set<Evidence>();

  @Output() public selectedChange = new EventEmitter<Set<Evidence>>();
  @Output() public eliminatedChange = new EventEmitter<Set<Evidence>>();
  @Output() public change = new EventEmitter<void>();

  public evidence: Evidence[] = [];

  public ngOnInit(): void {
    this.evidence = Object.values(Evidence);
  }

  public getState(evid: Evidence): CheckState {
    if (this.selected.has(evid)) return CheckState.checked;
    else if (this.eliminated.has(evid)) return CheckState.striked;
    else return CheckState.off;
  }

  public setState(evid: Evidence, state: CheckState) {
    if ((state === CheckState.checked && this.selected.add(evid)) || this.selected.delete(evid)) {
      this.selectedChange.emit(this.selected);
    }
    if ((state === CheckState.striked && this.eliminated.add(evid)) || this.eliminated.delete(evid)) {
      this.eliminatedChange.emit(this.eliminated);
    }
    this.change.emit();
  }
}
