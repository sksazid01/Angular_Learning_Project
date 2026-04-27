import { Component, Input } from '@angular/core';

import { RightService } from '../right/right.service';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent {
  @Input() parentHomeCount = 0;

  readonly rightButtonClickCount$ = this.rightService.rightButtonClickCount$;

  constructor(private rightService: RightService) { }

  updateRightValue() {
    this.rightService.increaseCount();
  }
}