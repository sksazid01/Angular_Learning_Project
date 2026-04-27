import { Component } from '@angular/core';

import { RightService } from '../right/right.service';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent {
  readonly rightValue$ = this.rightService.rightButtonClickCount$;

  constructor(private rightService: RightService) { }
}