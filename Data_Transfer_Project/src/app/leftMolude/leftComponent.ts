import { Component } from '@angular/core';

@Component({
  selector: 'app-left',
  standalone: true,
  template: `
    <div class="left-box">
      <h2>Left Box</h2>
      <p>This is the left child component.</p>
    </div>
  `,
  styleUrl: './leftComponent.css'
})
export class LeftComponent {}
