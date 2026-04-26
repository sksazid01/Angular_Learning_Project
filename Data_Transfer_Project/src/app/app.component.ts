import { Component } from '@angular/core';
import { HomeComponent } from './homeModule/homeComponent';
import { LeftComponent } from './leftMolude/leftComponent';
import { RightComponent } from './rightModule/rightComponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent, 
    LeftComponent, 
    RightComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular: Data Transfer Project';
}
