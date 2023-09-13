import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum CheckState {
  off,
  checked,
  striked
}

@Component({
  selector: 'app-check-base',
  templateUrl: './check-base.component.html',
  styleUrls: ['./check-base.component.scss']
})
export abstract class CheckBaseComponent {

  public readonly CheckState = CheckState;

  @Input() public label?: string = '\xa0'; // nbsp - arguably a stupid hack, but helps to keep the element height
  @Input() public locked: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public strikeable: boolean = false;
  @Input() public state: CheckState = CheckState.off;
  @Output() public stateChange = new EventEmitter<CheckState>();

  public toggle(): void {
    if (this.locked || this.disabled) return;
    switch (this.state) {
      default:
      case CheckState.off: this.state = CheckState.checked; break;
      case CheckState.checked: this.state = this.strikeable ? CheckState.striked : CheckState.off; break;
      case CheckState.striked: this.state = CheckState.off; break;
    }
    this.stateChange.emit(this.state);
  }
}
