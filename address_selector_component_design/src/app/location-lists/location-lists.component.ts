import { Component, Input, ViewChild } from '@angular/core';
import { LocationListsService } from './address.service';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-form/location.model';
import { OnInit } from '@angular/core';
import { LocationFormComponent } from '../location-form/location-form.component';

@Component({
  selector: 'app-location-lists',
  templateUrl: './location-lists.component.html',
  styleUrls: ['./location-lists.component.css']
})
export class LocationListsComponent implements OnInit {
  entries: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>(); // Initialize as an empty Observable
  
  // @ViewChild('locationSelector') locationSelector!: LocationFormComponent;
  @Input() locationSelector!: LocationFormComponent; // Accept LocationFormComponent as an input from the parent component

  constructor(private locationEntriesService: LocationListsService) { }

  ngOnInit(): void {
    console.log('LocationListsComponent initialized. Fetching entries...');
    this.entries = this.locationEntriesService.getEntries();
  }
  
  // Method to start edit mode via view child reference
  editEntry(entry: SelectedAddress): void {
    this.locationSelector.startEdit(entry);
  }

  onAddressSubmit(entry: SelectedAddress): void {
    console.log('Form Submitted & Handled inside LocationLists component!', entry);
  }

  addEntry(entry: SelectedAddress): void {
    this.locationEntriesService.postEntry(entry).subscribe(() => {
      // After adding a new entry, refresh the list of entries
      this.entries = this.locationEntriesService.getEntries();
    });
  }
}
