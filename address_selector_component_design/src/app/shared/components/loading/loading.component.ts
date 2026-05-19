import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  // =========================
  // Properties
  // =========================
  public isLoading$ = this.loadingService.isLoading$;

  // =========================
  // Constructor
  // =========================
  constructor(private loadingService: LoadingService) { }
}
