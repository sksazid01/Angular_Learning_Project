import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInfoUpdateComponent } from './supplier-info-update.component';

describe('SupplierInfoUpdateComponent', () => {
  let component: SupplierInfoUpdateComponent;
  let fixture: ComponentFixture<SupplierInfoUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInfoUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInfoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
