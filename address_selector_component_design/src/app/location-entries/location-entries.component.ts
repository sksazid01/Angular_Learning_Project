import { Component, Input, ViewChild } from '@angular/core';
import { LocationEntriesService } from './address.service';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-selector/location.model';
import { OnInit } from '@angular/core';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';

@Component({
  selector: 'app-location-entries',
  templateUrl: './location-entries.component.html',
  styleUrls: ['./location-entries.component.css']
})
export class LocationEntriesComponent implements OnInit {
  entries: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>(); // Initialize as an empty Observable
  
  // @ViewChild('locationSelector') locationSelector!: LocationSelectorComponent;
  @Input() locationSelector!: LocationSelectorComponent; // Accept LocationSelectorComponent as an input from the parent component

  constructor(private locationEntriesService: LocationEntriesService) { }

  ngOnInit(): void {
    console.log('LocationEntriesComponent initialized. Fetching entries...');
    this.entries = this.locationEntriesService.getEntries();
  }
  
  // Method to start edit mode via view child reference
  editEntry(entry: SelectedAddress): void {
    this.locationSelector.startEdit(entry);
  }

  onAddressSubmit(entry: SelectedAddress): void {
    console.log('Form Submitted & Handled inside LocationEntries component!', entry);
  }

  addEntry(entry: SelectedAddress): void {
    this.locationEntriesService.postEntry(entry).subscribe(() => {
      // After adding a new entry, refresh the list of entries
      this.entries = this.locationEntriesService.getEntries();
    });
  }
}
