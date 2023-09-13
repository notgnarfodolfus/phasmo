import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() public value: number = 0;
  @Input() public min: number = 0;
  @Input() public max: number = 100;
  @Input() public step: number = 1;
  @Input() public format: string = '1.0-0';
  @Input() public unit: string = '';
  @Input() public disabled: boolean = false;

  @Output() public valueChange = new EventEmitter<number>();
  @Output() public change = new EventEmitter<number>();

  public ngOnInit(): void {
    // Workaround, for some values the initial slider position is not applied correctly otherwise
    const v = this.value;
    this.value = this.min;
    setTimeout(() => this.value = v);
  }

  public onChange() {
    this.change.emit(this.value);
  }

  public onValueChanged(event: any): void {
    this.value = Number(event.target.value);
    this.valueChange.emit(this.value);
  }
}
