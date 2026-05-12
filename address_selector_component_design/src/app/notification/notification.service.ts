import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<{ message: string, isError: boolean } | null>(null);
    notification$ = this.notificationSubject.asObservable();

    showNotification(message: string, isError: boolean = false) {
        this.notificationSubject.next({ message, isError });
        setTimeout(() => {
            this.clearNotification();
        }, 2000);
    }

    clearNotification() {
        this.notificationSubject.next(null);
    }
}               