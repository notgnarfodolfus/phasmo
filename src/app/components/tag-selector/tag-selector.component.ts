import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagGroup, TagState, Tag, TagStates, TagId } from 'src/app/services/ghost';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent implements OnInit {

  @Input() public group?: TagGroup;
  @Input() public states: TagStates = {};
  @Input() public disabled?: Set<TagId>;
  @Input() public col: string = 'col col-auto';

  @Output() public statesChange = new EventEmitter<TagStates>();

  private multi: boolean = false;
  private multiChecked: boolean = false;
  private multiStriked: boolean = false;

  public ngOnInit(): void {
    if (!this.group) return;

    this.multi = !!this.group.multiple;
    this.multiChecked = this.multi && (this.group.multiple?.positive ?? false);
    this.multiStriked = this.multi && (this.group.multiple?.negative ?? false);

    this.group.options
      .filter(opt => this.states[opt.tag] == null)
      .forEach(opt => this.states[opt.tag] = TagState.off);
  }

  public onChange(tag: Tag, value: TagState) {
    if (!this.group || !this.states) return;

    if (value !== TagState.off && !this.multi) {
      // Multi selection is disabled: Reset all except the current selection
      this.group.options.filter(opt => opt.tag !== tag.tag).forEach(opt => this.states[opt.tag] = TagState.off);
    } else if ((value === TagState.checked && !this.multiChecked) || (value === TagState.striked && !this.multiStriked)) {
      // Multi selection is partially disabled: Reset either checked or striped except the current selection
      this.group.options
        .filter(opt => opt.tag !== tag.tag && this.states[opt.tag] === value)
        .forEach(opt => this.states[opt.tag] = TagState.off);
    }

    // Inject inverse tag if any is specified
    const inverseTag = (tag.inverse === true) ? null : tag.inverse as TagId;
    if (inverseTag) {
      this.states[inverseTag] = TagSelectorComponent.inverse(value);
    }

    this.statesChange.emit(this.states);
  }

  private static inverse(tag: TagState): TagState {
    switch (tag) {
      default:
      case TagState.off: return TagState.off;
      case TagState.checked: return TagState.striked;
      case TagState.striked: return TagState.checked;
    }
  }
}
