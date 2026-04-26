import { Component, inject, Input } from '@angular/core';
import { RightService } from '../rightComponent/rightService';

@Component({
  selector: 'app-left',
  template: `
    <div class="left-box">
      <h2>Left Box</h2>
      <p>This is the left child component.</p>
      <p>Home Value In Left: {{ parentHomeCount }}</p>
      <p>Right Component Value is: {{ rightButtonClickCount }}</p>
      <button (click)="updateRightValue()">Update the Right Component Value</button>
    </div>
  `,
  styleUrl: './leftComponent.css'
})
export class LeftComponent {
    @Input() parentHomeCount = 0;

    private readonly rightService = inject(RightService);

    get rightButtonClickCount() {
        return this.rightService.rightButtonClickCount;
    }

    updateRightValue() {
        this.rightService.increaseCount();
    }
}
