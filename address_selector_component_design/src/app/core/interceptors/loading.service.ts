import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();
  private loadingSubject = new BehaviorSubject<Map<string, boolean>>(this.loadingMap);

  isLoading(key: string): Observable<boolean> {
    return this.loadingSubject.asObservable().pipe(
      map(stateMap => !!stateMap.get(key))
    );
  }

  show(url: string): void {
    const key = this.getKeyFromUrl(url);
    if (key) {
      this.loadingMap.set(key, true);
      this.loadingSubject.next(this.loadingMap);
    }
  }

  hide(url: string): void {
    const key = this.getKeyFromUrl(url);
    if (key) {
      this.loadingMap.set(key, false);
      this.loadingSubject.next(this.loadingMap);
    }
  }
  
  private getKeyFromUrl(url: string): string {
    if (url.includes('/countries')) return 'countries';
    if (url.includes('/divisions')) return 'divisions';
    if (url.includes('/districts')) return 'districts';
    if (url.includes('/upazilas')) return 'upazilas';
    if (url.includes('/postcodes')) return 'postCodes';
    return '';
  }
}
