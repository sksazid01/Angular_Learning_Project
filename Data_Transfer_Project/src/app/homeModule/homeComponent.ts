import { Component, inject } from '@angular/core';
import { LeftComponent } from '../leftMolude/leftComponent';
import { RightComponent } from '../rightModule/rightComponent';
import { RightService } from '../rightModule/rightService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LeftComponent, RightComponent],
  template: `
    <section class="home-box">
      <h1>Home Component</h1>
      <p>Home Count: {{ homeCount }}</p>
      <button (click)="increaseHomeCount()">Increase Home Count</button>
      <p>Right Value Received In Home: {{ rightValueFromChild }}</p>
      <div class="child-boxes">
        <app-left [parentHomeCount]="homeCount"></app-left>
        <app-right (rightCountChange)="onRightCountChange($event)"></app-right>
      </div>
    </section>
  `,
  styleUrl: './homeComponent.css'
})
export class HomeComponent {
  private readonly rightService = inject(RightService);

  homeCount = 0;

  increaseHomeCount() {
    this.homeCount += 1;
  }

  get rightValueFromChild() {
    return this.rightService.rightButtonClickCount;
  }

  onRightCountChange(value: number) {
    this.rightService.rightButtonClickCount = value;
  }
}
