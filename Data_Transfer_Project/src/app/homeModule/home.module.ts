import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeftComponent } from '../leftComponent/leftComponent';
import { RightComponent } from '../rightComponent/rightComponent';
import { RoundModule } from '../roundModule/round.module';
import { HomeComponent } from './homeComponent';

@NgModule({
  declarations: [HomeComponent, LeftComponent, RightComponent],
  imports: [CommonModule, RoundModule],
  exports: [HomeComponent]
})
export class HomeModule {}
