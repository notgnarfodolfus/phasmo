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

    // Setup default values
    this.group.tags
      .filter(opt => this.states[opt.id] == null)
      .forEach(opt => this.states[opt.id] = TagState.off);

    // Ensure a value is checked if required
    if (this.group.required && this.group.tags.length > 0 && Object.values(this.states).every(v => v !== TagState.checked)) {
      this.states[this.group.tags[0].id] = TagState.checked;
    }
  }

  public onChange(tag: Tag, value: TagState) {
    if (!this.group || !this.states) return;

    if (value !== TagState.off && !this.multi) {
      // Multi selection is disabled: Reset all except the current selection
      this.group.tags.filter(opt => opt.id !== tag.id).forEach(opt => this.states[opt.id] = TagState.off);
    } else if ((value === TagState.checked && !this.multiChecked) || (value === TagState.striked && !this.multiStriked)) {
      // Multi selection is partially disabled: Reset either checked or striped except the current selection
      this.group.tags
        .filter(opt => opt.id !== tag.id && this.states[opt.id] === value)
        .forEach(opt => this.states[opt.id] = TagState.off);
    }

    // Inject inverse tag if any is specified
    const inverseTag = (tag.inverse === true) ? null : tag.inverse as TagId;
    if (inverseTag) {
      this.states[inverseTag] = TagSelectorComponent.inverse(value);
    }

    // Ensure a value is checked if required
    if (this.group.required && this.group.tags.length > 0 && Object.values(this.states).every(v => v !== TagState.checked)) {
      this.states[this.group.tags[0].id] = TagState.checked;
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
