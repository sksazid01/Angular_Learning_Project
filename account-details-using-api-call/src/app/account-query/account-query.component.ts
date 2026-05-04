import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AccountComponent } from '../account/account.component';

@Component({
  selector: 'app-account-query',
  templateUrl: './account-query.component.html',
  styleUrls: ['./account-query.component.css']
})
export class AccountQueryComponent implements AfterViewInit {
  
  @ViewChild(AccountComponent) accountComponent!: AccountComponent;

  // constructor() { }

  // ngAfterViewInit(): void {}

  onSearch(id: string): void {
    if (!this.accountComponent) {
      return;
    }

    this.accountComponent.setAccountId(id); // It calls the child method and passes the ID data
  }

}
