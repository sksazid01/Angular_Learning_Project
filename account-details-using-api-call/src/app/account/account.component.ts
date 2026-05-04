import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { AccountInfo } from './account.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  accountId = '';
  accountInfo: AccountInfo | null = null;
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) { }

  setAccountId(id: string): void {
    this.accountId = (id || '').trim();
    this.fetchAccountInfo(); // When it receives an id, it will fetch the data
  }

  private fetchAccountInfo(): void {
    const id = (this.accountId || '').trim();

    if (!id) {
      this.accountInfo = null;
      this.errorMessage = '';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<AccountInfo>(`${this.apiUrl}/${id}`).subscribe(
      (account) => {
        this.accountInfo = account;
        this.isLoading = false;
      },
      () => {
        this.accountInfo = null;
        this.isLoading = false;
        this.errorMessage = 'Account not found.';
      }
    );
  }
}
