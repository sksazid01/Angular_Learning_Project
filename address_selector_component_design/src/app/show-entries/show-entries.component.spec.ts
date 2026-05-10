import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEntriesComponent } from './show-entries.component';

describe('ShowEntriesComponent', () => {
  let component: ShowEntriesComponent;
  let fixture: ComponentFixture<ShowEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
