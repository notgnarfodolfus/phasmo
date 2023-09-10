import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckState } from '../check-base/check-base.component';

@Component({
  selector: 'app-check-box-choice',
  templateUrl: './check-box-choice.component.html',
  styleUrls: ['./check-box-choice.component.scss']
})
export class CheckBoxChoiceComponent<T> implements OnInit {

  @Input() public col: string = "col";
  @Input() public options: { title: string, value: T }[] = [];
  @Input() public selected: T | null = null;
  @Input() public default: T | null = null;
  @Output() public selectedChange = new EventEmitter<T | null>();

  public ngOnInit(): void {
    if (this.selected == null && this.default != null) {
      this.selected = this.default;
    }
  }

  public getState(opt: T): CheckState {
    return opt === this.selected ? CheckState.checked : CheckState.off;
  }

  public setState(opt: T, state: CheckState) {
    if (state === CheckState.off && opt === this.selected && opt !== this.default) {
      this.selected = this.default;
      this.selectedChange.emit(this.selected);
    }
    else if (state === CheckState.checked && opt !== this.selected) {
      this.selected = opt;
      this.selectedChange.emit(this.selected);
    }
  }
}
