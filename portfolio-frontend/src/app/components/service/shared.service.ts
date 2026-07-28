import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    const currentValue = this.darkModeSubject.value;
    this.darkModeSubject.next(!currentValue);
  }

}
