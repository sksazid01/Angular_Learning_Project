import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  isNotificationVisible = true;
  isError = false;
  title: string = 'Welcome';
  message: string = 'Thank you for visiting our website!';
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      if (notification) {
        this.message = notification.message;
        this.isError = notification.isError;
        this.title = this.isError ? 'Error' : 'Success';
        this.isNotificationVisible = true;
      }
      else {
        setTimeout(() => {
          this.isNotificationVisible = false;
        }, 3000);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCancel() {
    this.notificationService.clearNotification();
  }
}
