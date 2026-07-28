import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode(): void {
    this.darkModeSubject.next(!this.darkModeSubject.value);
  }

  // You might also add a getter if needed:
  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
