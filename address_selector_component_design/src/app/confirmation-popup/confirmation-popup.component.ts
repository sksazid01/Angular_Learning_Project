import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationConfig } from './confirmation.model';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {
  isOpen = false;
  config: ConfirmationConfig | null = null;

  constructor(
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ConfirmationPopupComponent initialized!');
    this.confirmationService.config$.subscribe(config => {
      console.log('Popup received config:', config);
      this.config = config;
      this.isOpen = !!config;
      this.cdr.detectChanges(); // Trigger change detection !!very important to update the view when config changes
    });
  }

  onConfirm(): void {
    this.confirmationService.close(true);
  }

  onCancel(): void {
    this.confirmationService.close(false);
  }
}
