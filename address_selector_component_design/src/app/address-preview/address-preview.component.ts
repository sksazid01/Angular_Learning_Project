import { Component, Input } from '@angular/core';
import { Address } from '../address-form/address-form.model';

@Component({
  selector: 'app-address-preview',
  templateUrl: './address-preview.component.html',
  styleUrls: ['./address-preview.component.css']
})
export class AddressPreviewComponent {
  @Input() address: Address | undefined;
}
