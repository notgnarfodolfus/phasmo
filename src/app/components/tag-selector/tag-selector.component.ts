import { Component, EventEmitter, Output } from '@angular/core';
import { Tag, TagInfo, Tags } from "src/app/services/ghost";

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent {

  public readonly tags: TagInfo[] = Tags;

  public active: Set<Tag> = new Set<Tag>();

  @Output() public valueChange = new EventEmitter<Tag[]>();

  public reset(): void {
    if (this.active.size > 0) {
      this.active.clear();
      this.valueChange.emit([]);
    }
  }

  public onTagUpdate(tag: Tag, active: boolean): void {
    if (active) this.active.add(tag);
    else this.active.delete(tag);

    this.valueChange.emit([...this.active]);
  }
}
