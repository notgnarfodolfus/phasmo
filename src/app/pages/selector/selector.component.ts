import { Component, OnInit } from "@angular/core";
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

  public onTagsUpdate(event: { checked: Tag[], striked: Tag[] }): void {
    const enable = this.ghosts
      .filter(ghost => event.checked.every(tag => ghost.tags.includes(tag)))
      .filter(ghost => event.striked.every(tag => !ghost.tags.includes(tag)))
      .map(ghost => ghost.name);
    this.disable = this.ghosts
      .map(ghost => ghost.name)
      .filter(ghost => !enable.includes(ghost));
  }
}