import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { AccountQueryComponent } from './account-query/account-query.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    AccountQueryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
