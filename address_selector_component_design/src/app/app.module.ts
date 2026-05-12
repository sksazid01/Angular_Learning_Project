import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddressFormComponent } from './location-form/location-form.component';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { ConfirmationService } from './confirmation-popup/confirmation.service';
import { AddressListComponent } from './location-lists/location-lists.component';
import { NotificationComponent } from './notification/notification.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    AddressFormComponent,
    ConfirmationPopupComponent,
    AddressListComponent,
    NotificationComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
