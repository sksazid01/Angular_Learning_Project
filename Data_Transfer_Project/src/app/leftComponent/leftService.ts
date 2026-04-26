import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeftService {
  leftCount = 0;

  increaseLeftCount() {
    this.leftCount += 1;
  }
}
