import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AccountInfo } from './account.interface';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnChanges {
  @Input() accountId = '';
  accountInfo: AccountInfo | null = null;
  isLoading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountId) {
      this.fetchAccountInfo();
    }
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
