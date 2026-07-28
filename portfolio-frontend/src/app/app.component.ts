import { Component, OnInit  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  originalTitle = 'Abhijeet Mohite | Portfolio';

  ngOnInit(): void {

    // document.addEventListener('contextmenu', (event) => {
    //   event.preventDefault();
    // });

    // document.addEventListener('keydown', (event) => {
    //   if (
    //     event.key === "F12" ||
    //     (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "C")) ||
    //     (event.ctrlKey && event.key === "U")
    //   ) {
    //     event.preventDefault();
    //   }
    // });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        document.title = 'Come back to Portfolio 😃';
      } else {
        document.title = this.originalTitle;
      }
    });

    window.addEventListener('beforeunload', () => {
      document.title = "See Abhijeet's Portfolio Again 🥺";
    });
  }

  

  
}
