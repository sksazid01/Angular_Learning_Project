import { Component, EventEmitter, Output } from '@angular/core';

import { RightService } from './right.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent {
  readonly rightButtonClickCount$ = this.rightService.rightButtonClickCount$;

  @Output() rightCountChange = new EventEmitter<number>();

  constructor(private rightService: RightService) { }

  increaseCount() {
    const updatedCount = this.rightService.increaseCount();
    this.rightCountChange.emit(updatedCount);
  }
}