import { Component } from "@angular/core";
import { Ghost, Ghosts, Tag } from "src/app/services/ghost";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {

  private readonly ghosts: Ghost[] = Ghosts;

  public disable: string[] = [];
  public options: Ghost[] = [];

  public onTagsUpdate(tags: Tag[]): void {
    if (tags.length === 0) this.disable = [];
    else this.disable = this.ghosts
      .filter(ghost => !tags.every(tag => ghost.tags.includes(tag)))
      .map(ghost => ghost.name);
  }
}