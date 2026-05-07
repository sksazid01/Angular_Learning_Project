import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationConfig } from './confirmation.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private configSubject = new BehaviorSubject<ConfirmationConfig | null>(null);
  config$ = this.configSubject.asObservable();
  
  //   private resolveFn: ((value: boolean) => void) | null = null;
  private resolveFn = null;

  confirm(message: string, title?: string, config?: Partial<ConfirmationConfig>): Promise<boolean> {
    const finalConfig: ConfirmationConfig = {
      message: message,
      title: title || 'Confirm Action',
      confirmText: (config && config.confirmText) ? config.confirmText : 'Yes',
      cancelText: (config && config.cancelText) ? config.cancelText : 'No'
    };
    
    this.configSubject.next(finalConfig);

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve; // A Promise requires a 'resolve function' to tell it when it's finished
    });
  }

  close(result: boolean): void {
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
    this.configSubject.next(null); // must be close the popup after resolving the promise, otherwise if we open another popup before the first one is closed, the first popup will still be open and the second popup will not be able to open because the first one is still open
  }
}
