import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListsComponent } from './location-lists.component';

describe('LocationListsComponent', () => {
  let component: LocationListsComponent;
  let fixture: ComponentFixture<LocationListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
