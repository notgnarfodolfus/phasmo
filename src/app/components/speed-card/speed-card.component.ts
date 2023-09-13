import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { CheckState } from "../check/check-base/check-base.component";
import { GhostFilters, GhostName, GhostSpeed } from "src/app/services/models";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Ghosts } from "src/app/services/ghosts";

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

  // Ghost speed of 1.7 m/s should be 2 steps/s or a multiplier of 1.1765.
  // But on my machine that seems to be a bit to fast.
  private multStepsPerSecond: number = 1.14;

  @Input() public ghostsDisabled = new Set<GhostName>();
  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  public showConfig: boolean = false;
  public showTipsState: CheckState = CheckState.off;
  public accelerateState: CheckState = CheckState.off;
  public filterState: CheckState = CheckState.off;
  public playState: CheckState = CheckState.off;
  public muteState: CheckState = CheckState.off;

  public ghostSpeedBase: number = 1.7;
  public ghostSpeedAccelerate: number = 0;
  public ghostSpeedPercent: number | null = 100; // Ghost speed percent depending on difficulty, cannot be null (we just need it for type safety)

  public stepLabelEntries: number[] = []; // Step, step, step
  public stepLabelActive: number = -1;

  public tips: { ghost: string, description: string }[] = [];

  private audio: HTMLAudioElement[] = [];
  private buffers: number = 16;
  private counter: number = 0;
  private interval: any;

  public get accuracyPercent(): number {
    return this.filters.config.ghostSpeedAccuracy * 100;
  }

  public set accuracyPercent(value: number) {
    this.filters.config.ghostSpeedAccuracy = value / 100.0;
  }

  public get speedAccelerationMult(): number {
    return 1 + (0.65 * this.ghostSpeedAccelerate / 13.0);
  }

  public get showAccelerateSlider(): boolean {
    return this.accelerateState === CheckState.checked;
  }

  public get sliderEnabled(): boolean {
    return this.playState === CheckState.checked || this.filterState === CheckState.checked;
  }

  public get showTips() {
    return this.showTipsState === CheckState.checked && this.tips.length > 0;
  }

  public get frequency(): number {
    return this.ghostSpeedBase * this.multStepsPerSecond * this.speedAccelerationMult * (this.ghostSpeedPercent ?? 100.0) / 100.0;
  }

  public ngOnInit(): void {
    this.filters.config.ghostSpeedAccuracy;
    this.stepLabelEntries = Array(4).fill(0).map((_, i) => i);
    this.audio = Array.from({ length: this.buffers }).map(() => new Audio('assets/sound/step.wav'));
    this.audio.forEach(a => a.load());
  }

  public reset() {
    this.accelerateState = CheckState.off;
    this.filterState = CheckState.off;
    this.playState = CheckState.off;
    this.muteState = CheckState.off;
    this.ghostSpeedBase = 1.7;
    this.onChange(true);
  }

  public onChange(reloadAudio: boolean) {
    const acc = this.accelerateState === CheckState.checked ? (1.0 / this.speedAccelerationMult) : 1.0;
    this.filters.speedEstimation = this.filterState === CheckState.checked ? this.ghostSpeedBase * acc : null;
    this.filters.speedLoSAcceleration = this.accelerateState === CheckState.off ? null : (this.accelerateState === CheckState.checked);
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
    this.tips = Object.values(Ghosts)
      .filter(g => g.speedInfo)
      .filter(g => !this.ghostsDisabled.has(g.name))
      .map(g => { return { ghost: g.name, description: g.speedInfo! } });
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
    this.stepLabelActive = ((this.stepLabelActive + 1) % this.stepLabelEntries.length);
  }

  private static isNormalSpeed(s: GhostSpeed) {
    return s.accelerate && s.condition == null && s.min === 1.7 && s.max === 1.7;
  }
}