import { Component } from '@angular/core';

@Component({
  selector: 'app-right',
  standalone: true,
  template: `
    <div class="right-box">
      <h2>Right Box</h2>
      <p>This is the right child component.</p>
    </div>
  `,
  styleUrl: './rightComponent.css'
})
export class RightComponent {}
