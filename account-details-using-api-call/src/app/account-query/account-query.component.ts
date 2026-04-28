import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-query',
  templateUrl: './account-query.component.html',
  styleUrls: ['./account-query.component.css']
})
export class AccountQueryComponent implements OnInit {
  selectedAccountId = '';

  constructor() { }

  ngOnInit() {
  }

  onSearch(id: string): void {
    this.selectedAccountId = (id || '').trim();
  }

}
