import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    ConfirmationPopupComponent,
    LoadingComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmationPopupComponent,
    LoadingComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
