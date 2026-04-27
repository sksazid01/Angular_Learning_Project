import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RoundComponent } from './round.component';

@NgModule({
  declarations: [RoundComponent],
  imports: [CommonModule],
  exports: [RoundComponent]
})
export class RoundModule { }