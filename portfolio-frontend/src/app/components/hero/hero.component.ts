import { Component, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Engine, Container } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { ISourceOptions } from 'tsparticles-engine';
import { DarkModeService } from '../service/dark-mode.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  isDarkMode: boolean = false;
  private engine: Engine | undefined;

  // Getter for particlesOptions that returns the correct configuration based on isDarkMode
  get particlesOptions(): ISourceOptions {
    const baseConfig: ISourceOptions = {
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push'
          },
          onHover: {
            enable: true,
            mode: 'repulse'
          },
        },
        modes: {
          push: {
            quantity: 4
          },
          repulse: {
            distance: 200,
            duration: 0.4
          }
        }
      },
      particles: {
        color: {
          value: this.isDarkMode
            ? ['#ffffff', '#ffffff', '#ffffff']
            : ['#3d6b73', '#26514c', '#102133'],
        },
        links: {
          color: this.isDarkMode ? '#61dafb' : '#3d6b73',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: 4,
          random: true
        },
      },
      detectRetina: true,
    };

    return baseConfig;
  }

  constructor(private darkModeService: DarkModeService) { }

  async particlesInit(engine: Engine): Promise<void> {
    this.engine = engine;
    await loadSlim(engine);
  }

  refreshParticles() {
    this.isDarkMode = !this.isDarkMode;
    setTimeout(() => {
      this.isDarkMode = !this.isDarkMode;
    }, 10);
  }

  wordList: string[] = ['An Engineer.', 'Junior Software Developer.','A Learner.'];
  wordIndex: number = 0;
  charIndex: number = 0;
  isDeleting: boolean = false;
  typingSpeed: number = 150;
  erasingSpeed: number = 100;
  delayBetweenWords: number = 1000;
  displayedText: string = '';

  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @ViewChild('downloadButton') downloadButton!: ElementRef;

  ngAfterViewInit() {
    this.type();
    if (typeof this.darkModeService.isDarkMode === 'function') {
      this.isDarkMode = this.darkModeService.isDarkMode();
    }
    else {
      const darkModeObs = this.darkModeService.isDarkMode as unknown as { subscribe: (callback: (value: boolean) => void) => Subscription };
      this.darkModeSubscription = darkModeObs.subscribe((isDarkMode: boolean) => {
        this.isDarkMode = isDarkMode;
        this.refreshParticles();
      });
    }
  }

  private darkModeSubscription: Subscription = new Subscription();

  ngOnDestroy() {
    if (this.darkModeSubscription) {
      this.darkModeSubscription.unsubscribe();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.cardContainer || !this.downloadButton) return;

    const card = this.cardContainer.nativeElement.querySelector('.card');
    const button = this.downloadButton.nativeElement;

    if (card) {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (event.clientX - left - width / 2) / 40;
      const y = -(event.clientY - top - height / 2) / 40;
      card.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(30px)`;
    }

    if (button) {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (event.clientX - left - width / 2) / 40;
      const y = -(event.clientY - top - height / 2) / 40;
      button.style.transform = `rotateY(${x}deg) rotateX(${y}deg) translateZ(10px)`;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.cardContainer || !this.downloadButton) return;

    const card = this.cardContainer.nativeElement.querySelector('.card');
    const button = this.downloadButton.nativeElement;

    if (card) card.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
    if (button) button.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
  }

  type() {
    const currentWord = this.wordList[this.wordIndex];

    if (!this.isDeleting && this.charIndex < currentWord.length) {
      this.displayedText = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
      setTimeout(() => this.type(), this.typingSpeed);
    }
    else if (this.isDeleting && this.charIndex > 0) {
      this.displayedText = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
      setTimeout(() => this.type(), this.erasingSpeed);
    }
    else if (!this.isDeleting && this.charIndex === currentWord.length) {
      this.isDeleting = true;
      setTimeout(() => this.type(), this.delayBetweenWords);
    }
    else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.wordList.length;
      setTimeout(() => this.type(), this.typingSpeed);
    }
  }
}