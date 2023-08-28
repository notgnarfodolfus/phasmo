import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ghost, Tag, TagInfo, Tags } from "src/app/services/ghost";

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent {

  public readonly tags: TagInfo[] = Tags;

  public active: Set<Tag> = new Set<Tag>();

  @Input() public ghosts: Ghost[] = [];
  @Output() public valueChange = new EventEmitter<Tag[]>();

  public reset(): void {
    if (this.active.size > 0) {
      this.active.clear();
      this.valueChange.emit([]);
    }
  }

  public onTagUpdate(info: TagInfo, tag: Tag, active: boolean): void {
    if (info.exclusive) info.options.forEach(opt => this.active.delete(opt.tag));

    if (active) this.active.add(tag);
    else this.active.delete(tag);

    this.valueChange.emit([...this.active]);
  }
}
