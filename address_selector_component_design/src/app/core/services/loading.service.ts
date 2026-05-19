import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // =========================
  // Properties
  // =========================
  private activeRequests = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();
  private loadingSubject = new BehaviorSubject<Map<string, boolean>>(this.loadingMap);

  // =========================
  // Public Methods
  // =========================
  public isLoading(key: string): Observable<boolean> {
    return this.loadingSubject.asObservable().pipe(
      map(stateMap => !!stateMap.get(key))
    );
  }

  public show(url: string): void {
    setTimeout(() => {
      this.activeRequests++;
      if (this.activeRequests === 1) {
        this.isLoadingSubject.next(true);
      }

      const key = this.getKeyFromUrl(url);
      if (key) {
        this.loadingMap.set(key, true);
        this.loadingSubject.next(this.loadingMap);
      }
    });
  }

  public hide(url: string): void {
    setTimeout(() => {
      if (this.activeRequests > 0) {
        this.activeRequests--;
      }
      if (this.activeRequests === 0) {
        this.isLoadingSubject.next(false);
      }

      const key = this.getKeyFromUrl(url);
      if (key) {
        this.loadingMap.set(key, false);
        this.loadingSubject.next(this.loadingMap);
      }
    });
  }
  
  // =========================
  // Private Helpers
  // =========================
  private getKeyFromUrl(url: string): string {
    if (url.includes('/countries')) return 'countries';
    if (url.includes('/divisions')) return 'divisions';
    if (url.includes('/districts')) return 'districts';
    if (url.includes('/upazilas')) return 'upazilas';
    if (url.includes('/postoffice')) return 'postOffices';
    return '';
  }
}
