import { Component } from '@angular/core';
import { LeftComponent } from '../leftMolude/leftComponent';
import { RightComponent } from '../rightModule/rightComponent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LeftComponent, RightComponent],
  template: `
    <section class="home-box">
      <h1>Home Component</h1>
      <div class="child-boxes">
        <app-left></app-left>
        <app-right></app-right>
      </div>
    </section>
  `,
  styleUrl: './homeComponent.css'
})
export class HomeComponent {}
