import { Component } from '@angular/core';
import { CheckBaseComponent } from '../check-base/check-base.component';

@Component({
  selector: 'app-check-label',
  templateUrl: './check-label.component.html',
  styleUrls: ['./check-label.component.scss']
})
export class CheckLabelComponent extends CheckBaseComponent {
  public get width(): number {
    // Hack: Calculate circle image width depending on char count
    // Clamp between 50 and 100% for 4 to 9 chars
    const chars = this.label?.length ?? 0;
    return Math.min(Math.max(chars, 4), 9) * 10 + 10;
  }
}
