import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RightService {
	public readonly rightCountSubject = new BehaviorSubject<number>(0);

	readonly rightButtonClickCount$ = this.rightCountSubject.asObservable();

	get rightButtonClickCount() {
		return this.rightCountSubject.value;
	}

	set rightButtonClickCount(value: number) {
		this.rightCountSubject.next(value);
	}

	setCount(value: number) {
		this.rightCountSubject.next(value);
	}

	increaseCount() {
		this.rightCountSubject.next(this.rightCountSubject.value + 1);
	}
}
