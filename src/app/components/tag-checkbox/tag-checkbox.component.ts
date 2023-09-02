import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag, TagState } from 'src/app/services/ghost';

@Component({
  selector: 'app-tag-checkbox',
  templateUrl: './tag-checkbox.component.html',
  styleUrls: ['./tag-checkbox.component.scss']
})
export class TagCheckboxComponent {

  public readonly GhostTagState = TagState;

  @Input() public tag?: Tag;
  @Input() public state: TagState = TagState.off;
  @Input() public disabled: boolean = false;

  @Output() public stateChange = new EventEmitter<TagState>();

  public get imgsrc(): string {
    switch (this.state) {
      default:
      case TagState.off: return 'assets/square.png';
      case TagState.checked: return 'assets/square_check.png';
      case TagState.striked: return 'assets/square_line.png';
    }
  }

  public toggle(): void {
    if (this.disabled || !this.tag) {
      return;
    }
    switch (this.state) {
      default:
      case TagState.off:
        this.state = TagState.checked;
        break;
      case TagState.checked:
        const canStrike = this.tag.inverse != null;
        this.state = canStrike ? TagState.striked : TagState.off;
        break;
      case TagState.striked:
        this.state = TagState.off;
        break;
    }
    this.stateChange.emit(this.state);
  }
}
