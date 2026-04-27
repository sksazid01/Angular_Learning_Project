import { Component, inject } from '@angular/core';
import { RightService } from '../rightComponent/rightService';

@Component({
  selector: 'app-round',
  template: `
    <div class="round-box">
      <p class="round-title">Round Component</p>
      <p class="round-value">{{ rightValue$ | async }}</p>
      <p class="round-label">Right Value</p>
    </div>
  `,
  styleUrl: './roundComponent.css'
})
export class RoundComponent {
  private readonly rightService = inject(RightService);

  readonly rightValue$ = this.rightService.rightButtonClickCount$;
}
