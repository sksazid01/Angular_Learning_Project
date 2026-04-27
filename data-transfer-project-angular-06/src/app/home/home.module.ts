import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LeftComponent } from '../left/left.component';
import { RightComponent } from '../right/right.component';
import { RoundModule } from '../round/round.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, LeftComponent, RightComponent],
  imports: [CommonModule, RoundModule],
  exports: [HomeComponent]
})
export class HomeModule { }