import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RightService } from './rightService';

@Component({
    selector: 'app-right',
    template: `
    <div class="right-box">
      <h2>Right Box</h2>
      <p>This is the right child component.</p>
      <button (click)="increaseCount()">{{ (rightButtonClickCount$ | async) ?? 0 }}</button>
    </div>
  `,
    styleUrl: './rightComponent.css'
})

export class RightComponent {
    private readonly rightService = inject(RightService);
    readonly rightButtonClickCount$ = this.rightService.rightButtonClickCount$;

    @Output() rightCountChange = new EventEmitter<number>();

    increaseCount() {
        const updatedCount = this.rightService.increaseCount();
        this.rightCountChange.emit(updatedCount);
    }
}
