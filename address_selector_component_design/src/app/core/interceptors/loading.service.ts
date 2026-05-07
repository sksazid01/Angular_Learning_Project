import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequestCount = 0;

  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  show(): void {
    this.activeRequestCount++;

    if (this.activeRequestCount === 1) {
      this.isLoadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.activeRequestCount > 0) {
      this.activeRequestCount--;
    }

    if (this.activeRequestCount === 0) {
      this.isLoadingSubject.next(false);
    }
  }
}