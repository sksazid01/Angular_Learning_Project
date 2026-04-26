import { Component } from '@angular/core';
import { HomeModule } from './homeModule/home.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular: Data Transfer Project';
}
