import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Ghosts, Tags } from 'src/app/services/ghosts';
import { GhostFilters, GhostName, Tag, TagData } from 'src/app/services/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CheckState } from '../check/check-base/check-base.component';

@Component({
  selector: 'app-abilities-card',
  templateUrl: './abilities-card.component.html',
  styleUrls: ['./abilities-card.component.scss'],
  animations: [
    trigger('moveIn', [
      state('open', style({ opacity: 1, height: '*' })),
      transition(':enter', [style({ opacity: 0, height: '0px' }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: '0px' })))
    ])
  ]
})
export class AbilitiesCardComponent implements OnChanges {
  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  @Input() public showTips: boolean = false;
  @Input() public ghostsDisabled = new Set<GhostName>();

  public readonly CheckState = CheckState;

  public readonly tags: TagData[] = Object.values(Tags);
  public enabledTags: Set<string> = new Set<string>();

  public get tipTags(): TagData[] {
    return this.tags
      .filter(t => t.description != null)
      .filter(t => this.filters.tagsSelected.has(t.key) || this.filters.tagsEliminated.has(t.key));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ghostsDisabled']) {
      const tags = new Set<Tag>();
      Object.values(Ghosts)
        .filter(g => !this.ghostsDisabled.has(g.name))
        .forEach(g => g.tags.forEach(t => tags.add(t)));
      this.enabledTags = tags;
    }
  }

  public getState(tag: TagData): CheckState {
    if (this.filters.tagsSelected.has(tag.key)) return CheckState.checked;
    else if (this.filters.tagsEliminated.has(tag.key)) return CheckState.striked;
    else return CheckState.off;
  }

  public setState(tag: TagData, state: CheckState) {
    this.putState(tag.key, state);
    if (tag.opposite) {
      this.putState(tag.opposite.key, this.oppositeState(state));
    }
    this.filtersChange.emit(this.filters);
  }

  private putState(key: Tag, state: CheckState) {
    switch (state) {
      case CheckState.checked:
        this.filters.tagsSelected.add(key);
        this.filters.tagsEliminated.delete(key);
        break;
      case CheckState.striked:
        this.filters.tagsSelected.delete(key);
        this.filters.tagsEliminated.add(key);
        break;
      case CheckState.off:
        this.filters.tagsSelected.delete(key);
        this.filters.tagsEliminated.delete(key);
        break;
    }
  }

  private oppositeState(state: CheckState): CheckState {
    switch (state) {
      default:
      case CheckState.off:
        return CheckState.off;
      case CheckState.checked:
        return CheckState.striked;
      case CheckState.striked:
        return CheckState.checked;
    }
  }
}
