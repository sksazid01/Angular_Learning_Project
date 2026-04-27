import { Component, Input, inject } from '@angular/core';
import { RightService } from '../rightComponent/rightService';

@Component({
  selector: 'app-left',
  template: `
    <div class="left-box">
      <h2>Left Box</h2>
      <p>This is the left child component.</p>
      <p>Home Count From Parent: {{ parentHomeCount }}</p>
      <p>Right Component Value is: {{ rightButtonClickCount$ | async }}</p>
      <button (click)="updateRightValue()">Update the Right Component Value</button>
    </div>
  `,
  styleUrl: './leftComponent.css'
})
export class LeftComponent {
    @Input() parentHomeCount = 0;

    private readonly rightService = inject(RightService);

  readonly rightButtonClickCount$ = this.rightService.rightButtonClickCount$;

    updateRightValue() {
        this.rightService.increaseCount();
    }
}
