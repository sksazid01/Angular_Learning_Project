import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConfirmationPopupService } from './confirmation-popup.service';
import { ConfirmationConfig } from './confirmation-popup.model';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent implements OnInit {
  public isOpen = false;
  public config: ConfirmationConfig | null = null;

  constructor(
    private confirmationPopupService: ConfirmationPopupService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listenToConfirmationConfig();
  }

  public onConfirm(): void {
    this.confirmationPopupService.close(true);
  }

  public onCancel(): void {
    this.confirmationPopupService.close(false);
  }

  private listenToConfirmationConfig(): void {
    this.confirmationPopupService.config$
      .subscribe(config => {
        this.config = config;
        this.isOpen = !!config;

        // Trigger change detection: very important to update the view when config changes
        this.changeDetectorRef.detectChanges();
      });
  }
}
