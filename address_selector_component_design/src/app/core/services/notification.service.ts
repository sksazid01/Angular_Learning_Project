import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<{ message: string, isError: boolean } | null>(null);
    public notification$ = this.notificationSubject.asObservable();


    public showNotification(message: string, isError: boolean = false): void {
        this.notificationSubject.next({ message, isError });
        setTimeout(() => {
            this.clearNotification();
        }, 2000);
    }

    public clearNotification(): void {
        this.notificationSubject.next(null);
    }
}
