import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from '../service/dark-mode.service'; 
import { faSun, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faSun = faSun;
  faMoon = faMoon;
  faBars = faBars;
  faTimes = faTimes;
  menuOpen: boolean = false;
  isDarkMode: boolean = false;
  constructor(private darkModeService: DarkModeService) {} 

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${sectionId}`);
    }
    this.menuOpen = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.darkModeService.toggleDarkMode();
  }
}
