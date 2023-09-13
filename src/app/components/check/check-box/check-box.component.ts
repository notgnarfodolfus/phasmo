import { Component } from '@angular/core';
import { CheckState, CheckBaseComponent } from '../check-base/check-base.component';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent extends CheckBaseComponent {
  public get checkboxImage(): string {
    switch (this.state) {
      default:
      case CheckState.off:
        return 'assets/img/square.png';
      case CheckState.checked:
        return 'assets/img/square_check.png';
      case CheckState.striked:
        return 'assets/img/square_line.png';
    }
  }
}
