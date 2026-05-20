import { Component, Input } from '@angular/core';
import { Address } from '../../domain/address.domain';

@Component({
  selector: 'app-address-preview',
  templateUrl: './address-preview.component.html',
  styleUrls: ['./address-preview.component.css']
})
export class AddressPreviewComponent {
  @Input() address: Address | null | undefined;
}
