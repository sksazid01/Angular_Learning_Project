import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { ConfirmationPopupService } from './confirmation-popup/confirmation-popup.service';
import { AddressListComponent } from './address-lists/address-lists.component';
import { NotificationComponent } from './notification/notification.component';
import { LoadingComponent } from './loading/loading.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { SupplierInfoUpdateComponent } from './supplier-info-update/supplier-info-update.component';
import { AppRoutingModule } from './app-routing.module';
import { AddressPreviewComponent } from './address-preview/address-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    AddressFormComponent,
    ConfirmationPopupComponent,
    AddressListComponent,
    NotificationComponent,
    LoadingComponent,
    SupplierListComponent,
    SupplierDetailsComponent,
    SupplierInfoUpdateComponent,
    AddressPreviewComponent
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
