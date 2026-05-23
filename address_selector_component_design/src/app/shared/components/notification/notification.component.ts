import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  public isNotificationVisible = true;
  public isError = false;
  public title: string = 'Welcome';
  public message: string = 'Thank you for visiting our website!';

  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$
      .subscribe(notification => {
        this.handleNotification(notification);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onCancel(): void {
    this.notificationService.clearNotification();
  }

  private handleNotification(notification: { message: string, isError: boolean } | null): void {
    if (notification) {
      this.message = notification.message;
      this.isError = notification.isError;
      this.title = this.isError ? 'Error' : 'Success';
      this.isNotificationVisible = true;
    } else {
      setTimeout(() => {
        this.isNotificationVisible = false;
      }, 3000);
    }
  }
}
