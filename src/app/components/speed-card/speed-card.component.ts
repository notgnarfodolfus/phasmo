import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CheckState } from '../check/check-base/check-base.component';
import { GhostFilters, GhostName, saveConfig } from 'src/app/services/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Ghosts } from 'src/app/services/ghosts';

@Component({
  selector: 'app-speed-card',
  templateUrl: './speed-card.component.html',
  styleUrls: ['./speed-card.component.scss'],
  animations: [
    trigger('moveIn', [
      state('open', style({ opacity: 1, height: '*' })),
      transition(':enter', [style({ opacity: 0, height: '0px' }), animate(200)]),
      transition(':leave', animate(200, style({ opacity: 0, height: '0px' })))
    ])
  ]
})
export class SpeedCardComponent implements OnInit, OnChanges {
  public readonly CheckState = CheckState;

  public readonly speedOptions = [
    { title: '50%', value: 50 },
    { title: '75%', value: 75 },
    { title: '100%', value: 100 },
    { title: '125%', value: 125 },
    { title: '150%', value: 150 }
  ];

  // Any ghost with default speed, lets take the most basic of them all
  private readonly basicGhost = Ghosts.Spirit;

  // Ghost speed of 1.7 m/s should be 2 steps/s or a multiplier of 1.1765.
  // But on my machine that seems to be a bit to fast.
  private readonly multStepsPerSecond: number = 1.14;

  @Input() public ghostsDisabled = new Set<GhostName>();
  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  public showConfig: boolean = false;
  public accelerateState: CheckState = CheckState.off;
  public filterState: CheckState = CheckState.off;
  public playState: CheckState = CheckState.off;
  public muteState: CheckState = CheckState.off;

  public ghostSpeedBase: number = 1.7;
  public ghostSpeedAccelerate: number = 0;

  public stepLabelEntries: number[] = []; // Step, step, step
  public stepLabelActive: number = -1;

  public tips: { ghost: string; description: string }[] = [];

  private audio: HTMLAudioElement[] = [];
  private buffers: number = 16;
  private counter: number = 0;
  private interval: any;

  public get speedPercent(): number {
    return this.filters.config.ghostSpeedPercent;
  }

  public set speedPercent(value: number | null) {
    this.filters.config.ghostSpeedPercent = value ?? 100;
    saveConfig(this.filters.config);
  }

  public get accuracyPercent(): number {
    return this.filters.config.ghostSpeedAccuracy * 100;
  }

  public set accuracyPercent(value: number) {
    this.filters.config.ghostSpeedAccuracy = value / 100.0;
    saveConfig(this.filters.config);
  }

  public get speedAccelerationMult(): number {
    return 1 + (0.65 * this.ghostSpeedAccelerate) / 13.0;
  }

  public get showAccelerateSlider(): boolean {
    return this.accelerateState === CheckState.checked;
  }

  public get frequency(): number {
    return this.ghostSpeedBase * this.multStepsPerSecond * this.speedAccelerationMult * (this.speedPercent / 100.0);
  }

  public get showTips(): boolean {
    return this.filters.config.showTips && this.tips.length > 0;
  }

  public get adjustedGhostSpeed(): number {
    const acceleration = this.accelerateState === CheckState.checked ? 1.0 / this.speedAccelerationMult : 1.0;
    return this.ghostSpeedBase * acceleration;
  }

  public get isAccelerate(): boolean | null {
    return this.accelerateState === CheckState.off ? null : this.accelerateState === CheckState.checked;
  }

  public ngOnInit(): void {
    this.stepLabelEntries = Array(4)
      .fill(0)
      .map((_, i) => i);
    this.audio = Array.from({ length: this.buffers }).map(() => new Audio('assets/sound/step.wav'));
    this.audio.forEach(a => a.load());
  }

  public reset() {
    this.accelerateState = CheckState.off;
    this.filterState = CheckState.off;
    this.playState = CheckState.off;
    this.muteState = CheckState.off;
    this.ghostSpeedBase = 1.7;
    this.filters.config.ghostSpeedAccuracy = 0.95;
    this.filters.config.ghostSpeedPercent = 100;
    saveConfig(this.filters.config);
    this.onChange(true);
  }

  public onChange(reloadAudio: boolean): void {
    this.filters.speedEstimation = this.filterState === CheckState.checked ? this.adjustedGhostSpeed : null;
    this.filters.speedLoSAcceleration = this.isAccelerate;
    if (reloadAudio) {
      this.ensure();
    }
    this.filtersChange.emit(this.filters);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ghostsDisabled']) {
      this.generateTips();
    }
  }

  private generateTips(): void {
    const basic = [];
    const speed = this.adjustedGhostSpeed;
    const accuracy = this.filters.config.ghostSpeedAccuracy;
    const accelerate = this.isAccelerate;
    if (this.basicGhost.isSpeedPossible(speed, accuracy, accelerate)) {
      basic.push({
        ghost: '<b>Default</b>',
        description: 'Most ghosts walk at 1.7m/s and speed up over 13 sec to 2.8m/s  when seeing the player'
      });
    }
    this.tips = [
      ...basic,
      ...Object.values(Ghosts)
        .filter(g => g.speedInfo)
        .filter(g => !this.ghostsDisabled.has(g.name))
        .filter(g => g.isSpeedPossible(speed, accuracy, accelerate))
        .map(g => {
          return { ghost: g.name, description: g.speedInfo! };
        })
    ];
  }

  private ensure() {
    if (this.playState === CheckState.checked) {
      this.ensureLoop();
    } else {
      this.stopLoop();
    }
  }

  private ensureLoop(): void {
    clearInterval(this.interval);
    const rate = 1000.0 / this.frequency;
    this.counter = 0;
    this.interval = setInterval(() => this.onStep(), rate);
  }

  private stopLoop(): void {
    this.stepLabelActive = -1;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private onStep(): void {
    if (this.muteState !== CheckState.checked) {
      this.audio[this.counter++ % this.buffers].play();
    }
    this.stepLabelActive = (this.stepLabelActive + 1) % this.stepLabelEntries.length;
  }
}
