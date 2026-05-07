import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationConfig } from './confirmation.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private configSubject = new BehaviorSubject<ConfirmationConfig | null>(null);
  config$ = this.configSubject.asObservable();
  
  private resolveFn: ((value: boolean) => void) | null = null;
  
  // 1. Create class properties to store the functions
  private confirmCallback: Function | null = null;
  private declineCallback: Function | null = null;

  confirm(
    confirmFn: Function,
    declineFn?: Function,
    message: string = "Are you sure to submit?",
    title: string = 'Submit Application',
    config?: Partial<ConfirmationConfig> // 2. Added this back so finalConfig doesn't throw an error
  ): Promise<boolean> {
    
    // 3. Save the functions so the close() method can use them later
    this.confirmCallback = confirmFn;
    this.declineCallback = declineFn;

    const finalConfig: ConfirmationConfig = {
      message: message,
      title: title,
      confirmText: (config && config.confirmText) ? config.confirmText : 'Yes',
      cancelText: (config && config.cancelText) ? config.cancelText : 'No'
    };
    
    this.configSubject.next(finalConfig);

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  close(result: boolean): void {
    // 1. Resolve the promise
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }

    // 2. Call the correct function based on the user's choice
    if (result === true && this.confirmCallback) {
      this.confirmCallback();
    } else if (result === false && this.declineCallback) {
      this.declineCallback();
    }

    // 3. Clean up the functions from memory
    this.confirmCallback = null;
    this.declineCallback = null;

    // 4. Close the popup
    this.configSubject.next(null); 
  }
}