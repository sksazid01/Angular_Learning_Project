import { Component } from '@angular/core';
import { ShowEntriesService } from './show-entries.service';
import { Observable } from 'rxjs';
import { SelectedAddress } from '../location-selector/location.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-show-entries',
  templateUrl: './show-entries.component.html',
  styleUrls: ['./show-entries.component.css']
})
export class ShowEntriesComponent implements OnInit {
  entries: Observable<SelectedAddress[]> = new Observable<SelectedAddress[]>(); // Initialize as an empty Observable

  constructor(private showEntriesService: ShowEntriesService) { }

  ngOnInit(): void {
    console.log('ShowEntriesComponent initialized. Fetching entries...');
    this.entries = this.showEntriesService.getEntries();
  }
  // Method to set the entry to be edited(turn on edit mode)
  editEntry(entry: SelectedAddress): void {
    this.showEntriesService.setEditingEntry(entry);
  }

  addEntry(entry: SelectedAddress): void {
    this.showEntriesService.postEntry(entry).subscribe(() => {
      // After adding a new entry, refresh the list of entries
      this.entries = this.showEntriesService.getEntries();
    });
  }
}
