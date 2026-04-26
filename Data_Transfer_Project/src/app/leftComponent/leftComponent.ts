import { Component, inject, Input } from '@angular/core';
import { RightService } from '../rightComponent/rightService';
import { LeftService } from './leftService';

@Component({
  selector: 'app-left',
  template: `
    <div class="left-box">
      <h2>Left Box</h2>
      <p>This is the left child component.</p>
      <p>Home Value In Left: {{ parentHomeCount }}</p>
      <p>Left Count Value: {{ leftCount }}</p>
      <p>Right Component Value is: {{ rightButtonClickCount }}</p>
      <button (click)="updateRightValue()">Update the Right Component Value</button>
    </div>
  `,
  styleUrl: './leftComponent.css'
})
export class LeftComponent {
    @Input() parentHomeCount = 0;

    private readonly leftService = inject(LeftService);
    private readonly rightService = inject(RightService);

    get leftCount() {
        return this.leftService.leftCount;
    }

    get rightButtonClickCount() {
        return this.rightService.rightButtonClickCount;
    }

    updateRightValue() {
        this.rightService.increaseCount();
    }
}
