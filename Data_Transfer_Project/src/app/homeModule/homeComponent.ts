import { Component, inject } from '@angular/core';
import { RightService } from '../rightComponent/rightService';

@Component({
  selector: 'app-home',
  template: `
    <section class="home-box">
      <h1>Home Component</h1>
      <p>Home Count: {{ homeCount }}</p>
      <button (click)="increaseHomeCount()">Increase Home Count</button>
      <p>Right Value Received In Home: {{ rightValueFromChild }}</p>
      <p>Last Value Emitted By Right (Child -> Parent): {{ lastRightEventValue }}</p>
      <div class="child-boxes">
        <app-left [parentHomeCount]="homeCount"></app-left>
        <app-right (rightCountChange)="onRightCountChange($event)"></app-right>
      </div>
      <app-round></app-round>
    </section>
  `,
  styleUrl: './homeComponent.css'
})
export class HomeComponent {
  private readonly rightService = inject(RightService);

  homeCount = 0;
  lastRightEventValue = 0;

  increaseHomeCount() {
    this.homeCount += 1;
  }

  get rightValueFromChild() {
    return this.rightService.rightButtonClickCount;
  }

  onRightCountChange(value: number) {
    this.lastRightEventValue = value;
    this.rightService.setCount(value);
  }
}
