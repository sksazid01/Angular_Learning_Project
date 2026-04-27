import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountQueryComponent } from './account-query.component';

describe('AccountQueryComponent', () => {
  let component: AccountQueryComponent;
  let fixture: ComponentFixture<AccountQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
