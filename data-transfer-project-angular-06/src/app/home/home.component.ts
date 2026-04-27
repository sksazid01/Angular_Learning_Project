import { Component } from '@angular/core';

import { RightService } from '../right/right.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly rightValueFromChild$ = this.rightService.rightButtonClickCount$;

  homeCount = 0;
  lastRightEventValue = 0;

  constructor(private rightService: RightService) { }

  increaseHomeCount() {
    this.homeCount += 1;
  }

  onRightCountChange(value: number) {
    this.lastRightEventValue = value;
    this.rightService.setCount(value);
  }
}