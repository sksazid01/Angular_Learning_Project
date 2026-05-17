import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { ConfirmationPopupService } from './confirmation-popup/confirmation-popup.service';
import { LocationListComponent } from './location-lists/location-lists.component';
import { NotificationComponent } from './notification/notification.component';
import { LoadingComponent } from './loading/loading.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './supplier-info-update/supplier-info-update.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LocationFormComponent,
    ConfirmationPopupComponent,
    LocationListComponent,
    NotificationComponent,
    LoadingComponent,
    SupplierListComponent,
    SupplierDetailsComponent,
    SupplierInfoUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    ConfirmationPopupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
