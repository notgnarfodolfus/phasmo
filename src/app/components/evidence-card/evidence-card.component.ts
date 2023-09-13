import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Evidence, GhostFilters, GhostName, saveConfig } from 'src/app/services/models';
import { CheckState } from '../check/check-base/check-base.component';

@Component({
  selector: 'app-evidence-card',
  templateUrl: './evidence-card.component.html',
  styleUrls: ['./evidence-card.component.scss'],
  animations: [
    trigger('moveIn', [
      state('open', style({ opacity: 1, height: '*' })),
      transition(':enter', [style({ opacity: 0, height: '0px' }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: '0px' })))
    ])
  ]
})
export class EvidenceCardComponent {
  public readonly evidenceOptions = [
    { title: 'All Evidence', value: 0 },
    { title: 'One Hidden (Nightmare)', value: 1 },
    { title: 'Two Hidden (Insanity)', value: 2 },
    { title: 'No Evidence (Custom)', value: 3 }
  ];

  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  @Input() public ghostsDisabled = new Set<GhostName>();
  @Input() public evidenceDisabled = new Set<Evidence>();

  public showConfig: boolean = false;

  public get title(): string {
    switch (this.evidenceHidden) {
      default:
      case 0:
        return 'Evidence';
      case 1:
        return 'Evidence (one hidden)';
      case 2:
        return 'Evidence (two hidden)';
      case 3:
        return 'Zero Evidence';
    }
  }

  public get evidenceHidden(): number | null {
    return this.filters.config.evidenceHidden;
  }

  public set evidenceHidden(value: number | null) {
    this.filters.config.evidenceHidden = value ?? 0;
    saveConfig(this.filters.config);
    this.onChange();
  }

  public get showTipsState(): CheckState {
    return this.filters.config.showTips ? CheckState.checked : CheckState.off;
  }

  public set showTipsState(state: CheckState) {
    this.filters.config.showTips = state === CheckState.checked;
    saveConfig(this.filters.config);
    this.onChange();
  }

  public reset() {
    const conf = { ...this.filters.config }; // keep configuration
    this.filters = new GhostFilters();
    this.filters.config = conf;
    this.onChange();
  }

  public onChange() {
    this.filtersChange.emit(this.filters);
  }
}
