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
  public hints: { tag: string, option: string, hint: string }[] = [];

  @Input() public ghosts: Ghost[] = [];
  @Output() public valueChange = new EventEmitter<Tag[]>();

  public reset(): void {
    this.hints = [];
    if (this.active.size > 0) {
      this.active.clear();
      this.valueChange.emit([]);
    }
  }

  public onTagUpdate(info: TagInfo, tag: Tag, active: boolean): void {
    if (info.exclusive) info.options.forEach(opt => this.active.delete(opt.tag));

    if (active) this.active.add(tag);
    else this.active.delete(tag);

    this.hints = this.tags
      .filter(tag => tag.options.some(opt => this.active.has(opt.tag)))
      .flatMap(tag => tag.options.filter(opt => this.active.has(opt.tag))
        .filter(opt => opt.hint)
        .map(opt => { return { tag: tag.name, option: opt.name, hint: opt.hint! }; }));

    this.valueChange.emit([...this.active]);
  }
}
