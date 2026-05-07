import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LocationSelectorComponent } from './location-selector/location-selector.component';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { ConfirmationService } from './confirmation-popup/confirmation.service';

@NgModule({
  declarations: [
    AppComponent,
    LocationSelectorComponent,
    ConfirmationPopupComponent
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
