import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent {

  showButton = false;
  private heroHeight = 0;

  @ViewChild('heroSection') heroSection!: ElementRef;

  @HostListener('window:scroll')
  checkScroll() {
    const heroComponent = document.getElementById('hero-sec');
    if (heroComponent) {
      this.heroHeight = heroComponent.offsetHeight;
      this.showButton = window.pageYOffset > this.heroHeight;
    }
  }

  scrollToTop() {
    const heroElement = document.getElementById('hero-sec');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '/'); // Reset URL fragment
    }
  }

}
