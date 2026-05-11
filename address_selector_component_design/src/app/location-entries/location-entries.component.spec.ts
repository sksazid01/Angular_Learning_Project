import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEntriesComponent } from './location-entries.component';

describe('LocationEntriesComponent', () => {
  let component: LocationEntriesComponent;
  let fixture: ComponentFixture<LocationEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
