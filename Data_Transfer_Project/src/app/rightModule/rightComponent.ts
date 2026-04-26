import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RightService } from './rightService';

@Component({
    selector: 'app-right',
    standalone: true,
    template: `
    <div class="right-box">
      <h2>Right Box</h2>
      <p>This is the right child component.</p>
      <button (click)="increaseCount()">{{ rightButtonClickCount }}</button>
    </div>
  `,
    styleUrl: './rightComponent.css'
})

export class RightComponent {
    @Output() rightCountChange = new EventEmitter<number>();

    private readonly rightService = inject(RightService);

    get rightButtonClickCount() {
        return this.rightService.rightButtonClickCount;
    }

    increaseCount() {
        this.rightService.increaseCount();
        this.rightCountChange.emit(this.rightButtonClickCount);
    }
}
