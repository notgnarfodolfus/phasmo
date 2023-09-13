import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  @Input() public value: number = 0;
  @Input() public min: number = 0;
  @Input() public max: number = 100;
  @Input() public step: number = 1;
  @Input() public format: string = '1.0-0';
  @Input() public unit: string = '';
  @Input() public disabled: boolean = false;

  @Output() public valueChange = new EventEmitter<number>();
  @Output() public change = new EventEmitter<number>();

  public onChange() {
    this.change.emit(this.value);
  }

  public onValueChanged(event: any): void {
    this.value = Number(event.target.value);
    this.valueChange.emit(this.value);
  }
}
