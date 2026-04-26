import { Component, EventEmitter, Output, inject } from '@angular/core';
import { LeftService } from '../leftComponent/leftService';
import { RightService } from './rightService';

@Component({
    selector: 'app-right',
    template: `
    <div class="right-box">
      <h2>Right Box</h2>
      <p>This is the right child component.</p>
      <button (click)="increaseCount()">{{ rightButtonClickCount }}</button>
      <button (click)="updateLeftCount()">Update Left Count</button>
    </div>
  `,
    styleUrl: './rightComponent.css'
})

export class RightComponent {
    private readonly leftService = inject(LeftService);
    private readonly rightService = inject(RightService);

    @Output() rightCountChange = new EventEmitter<number>();

    get rightButtonClickCount() {
        return this.rightService.rightButtonClickCount;
    }

    increaseCount() {
        this.rightService.increaseCount();
        this.rightCountChange.emit(this.rightButtonClickCount);
    }

    updateLeftCount() {
        this.leftService.increaseLeftCount();
    }
}
