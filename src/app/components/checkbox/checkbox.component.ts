import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input() public label: string | null = null;
  @Input() public checked: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public strike: boolean | null = false; // null => disable stikethrough

  @Output() public checkedChanged = new EventEmitter<boolean>();
  @Output() public strikeChanged = new EventEmitter<boolean>();
  @Output() public changed = new EventEmitter<{ checked: boolean, strike: boolean }>();

  public get imgsrc(): string {
    return `/assets/${this.imgfile}.png`;
  }

  public get imgfile(): string {
    if (this.checked) return 'square_check';
    else if (this.strike && !this.label) return 'square_line';
    else return 'square';
  }

  public toggle(): void {
    if (!this.disabled) {
      const wasChecked = this.checked;
      const wasStrike = this.strike;
      if (this.strike === null) {
        this.checked = !this.checked; // simple toggle
      } else if (this.strike) {
        this.checked = false;
        this.strike = false;
      } else if (this.checked) {
        this.checked = false;
        this.strike = true;
      } else {
        this.checked = true;
        this.strike = false;
      }
      if (this.checked !== wasChecked) this.checkedChanged.emit(this.checked);
      if (this.strike !== wasStrike) this.strikeChanged.emit(this.strike!);
      this.changed.emit({ checked: this.checked, strike: this.strike ?? false });
    }
  }
}
