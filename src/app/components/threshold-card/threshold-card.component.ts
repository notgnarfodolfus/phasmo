import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ghosts } from 'src/app/services/ghosts';
import { CheckState } from '../check/check-base/check-base.component';
import { GhostFilters, GhostName, HuntAbility } from 'src/app/services/models';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-threshold-card',
  templateUrl: './threshold-card.component.html',
  styleUrls: ['./threshold-card.component.scss'],
  animations: [
    trigger('moveIn', [
      state('open', style({ opacity: 1, height: '*' })),
      transition(':enter', [style({ opacity: 0, height: '0px' }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: '0px' })))
    ])
  ]
})
export class ThresholdCardComponent implements OnInit {
  @Input() public showTips: boolean = false;
  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  public showConfig: boolean = false;
  public abilities: HuntAbility[] = [];
  public abilityByName: { [ability: string]: HuntAbility } = {};
  public abilityToGhosts: { [ability: string]: GhostName } = {};

  // For tips
  public get activeAbilities(): HuntAbility[] {
    return Object.values(this.abilityByName).filter(a => this.isChecked(a));
  }

  public ngOnInit(): void {
    this.abilities = Object.values(Ghosts)
      .flatMap(g => g.hunts)
      .sort((a, b) => (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0));
    this.abilityByName = {};
    this.abilityToGhosts = {};
    Object.values(Ghosts).forEach(g =>
      g.hunts.forEach(h => {
        this.abilityByName[h.name] = h;
        this.abilityToGhosts[h.name] = g.name;
      })
    );
  }

  public onChange() {
    this.filtersChange.emit(this.filters);
  }

  private isChecked(ability: HuntAbility): boolean {
    return this.filters.huntAbiliesFlipped.has(ability.name) !== ability.enabled;
  }

  public getState(ability: HuntAbility): CheckState {
    if (this.isChecked(ability)) return CheckState.checked;
    else return CheckState.off;
  }

  public setState(ability: HuntAbility, state: CheckState) {
    const flipped = ability.enabled !== (state === CheckState.checked);
    if (flipped) this.filters.huntAbiliesFlipped.add(ability.name);
    else this.filters.huntAbiliesFlipped.delete(ability.name);
    this.onChange();
  }
}
