import { Component, ViewChild } from '@angular/core';
import { ShowEntriesService } from './address.service';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-selector/location.model';
import { OnInit } from '@angular/core';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';

@Component({
  selector: 'app-show-entries',
  templateUrl: './show-entries.component.html',
  styleUrls: ['./show-entries.component.css']
})
export class ShowEntriesComponent implements OnInit {
  entries: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>(); // Initialize as an empty Observable
  
  @ViewChild('locationSelector') locationSelector!: LocationSelectorComponent;

  constructor(private showEntriesService: ShowEntriesService) { }

  ngOnInit(): void {
    console.log('ShowEntriesComponent initialized. Fetching entries...');
    this.entries = this.showEntriesService.getEntries();
  }
  
  // Method to start edit mode via view child reference
  editEntry(entry: SelectedAddress): void {
    this.locationSelector.startEdit(entry);
  }

  onAddressSubmit(entry: SelectedAddress): void {
    console.log('Form Submitted & Handled inside ShowEntries component!', entry);
  }

  addEntry(entry: SelectedAddress): void {
    this.showEntriesService.postEntry(entry).subscribe(() => {
      // After adding a new entry, refresh the list of entries
      this.entries = this.showEntriesService.getEntries();
    });
  }
}
