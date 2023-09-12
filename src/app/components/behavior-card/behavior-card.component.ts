import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GhostFilters } from "src/app/services/models";

@Component({
  selector: 'app-behavior-card',
  templateUrl: './behavior-card.component.html',
  styleUrls: ['./behavior-card.component.scss']
})
export class BehaviorCardComponent implements OnInit {

  @Input() public filters = new GhostFilters();
  @Output() public filtersChange = new EventEmitter<GhostFilters>();

  public ngOnInit(): void {
  }

  public onChange() {
    this.filtersChange.emit(this.filters);
  }
}