import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RightService {
	private readonly rightCountSubject = new BehaviorSubject<number>(0);

	readonly rightButtonClickCount$ = this.rightCountSubject.asObservable();

	setCount(value: number) {
		this.rightCountSubject.next(value);
	}

	increaseCount() {
		const updatedCount = this.rightCountSubject.value + 1;
		this.rightCountSubject.next(updatedCount);
		return updatedCount;
	}
}
