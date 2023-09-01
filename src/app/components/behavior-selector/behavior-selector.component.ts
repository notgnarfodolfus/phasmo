import { Component, EventEmitter, Output } from '@angular/core';
import { Tag, TagInfo, TagOption, Tags } from "src/app/services/ghost";

@Component({
  selector: 'app-behavior-selector',
  templateUrl: './behavior-selector.component.html',
  styleUrls: ['./behavior-selector.component.scss']
})
export class BehaviorSelectorComponent {

  public readonly tags: TagInfo[] = Tags;

  public checked: Set<Tag> = new Set<Tag>();
  public striked: Set<Tag> = new Set<Tag>();
  public hints: { tag: string, option: string, hint: string }[] = [];

  @Output() public valueChange = new EventEmitter<{ checked: Tag[], striked: Tag[] }>();

  public reset(): void {
    this.hints = [];
    if (this.checked.size > 0 || this.striked.size > 0) {
      this.checked.clear();
      this.striked.clear();
      this.valueChange.emit({ checked: [], striked: [] });
    }
  }

  public isStriked(option: TagOption): boolean | null {
    if (option.negative === true) return this.striked.has(option.tag);
    else if (option.negative) return this.checked.has(option.negative);
    else return null;
  }

  public onTagUpdate(info: TagInfo, option: TagOption, event: { checked: boolean, strike: boolean }): void {
    if (info.exclusive) {
      info.options.forEach(opt => {
        this.checked.delete(opt.tag);
        this.striked.delete(opt.tag);
        if (opt.negative && opt.negative !== true) {
          this.checked.delete(opt.negative);
          this.striked.delete(opt.negative);
        }
      });
    }

    if (event.checked) this.checked.add(option.tag);
    else this.checked.delete(option.tag);

    if (option.negative === true) {
      if (event.strike) this.striked.add(option.tag);
      else this.striked.delete(option.tag);
    } else if (option.negative) {
      if (event.strike) this.checked.add(option.negative);
      else this.checked.delete(option.negative);
    }

    this.hints = this.tags
      .flatMap(tag => tag.options.filter(opt => this.checked.has(opt.tag) || this.striked.has(opt.tag))
        .filter(opt => opt.hint)
        .map(opt => { return { tag: tag.name, option: opt.name, hint: opt.hint! }; }));

    this.valueChange.emit({
      checked: [...this.checked],
      striked: [...this.striked]
    });
  }
}
