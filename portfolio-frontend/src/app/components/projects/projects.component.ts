import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  showAll = false;
  allProjects = [
    {
      title: 'SWAYAMSEVAK',
      subtitle: 'Volunteer Management System',
      link: 'https://gitlab.com/mohiteabhi/swayamsevak',
      image: 'assets/images/logo1.png',
      coverTitle: 'Full Stack Volunteer System',
      technologies: 'Java · JavaFX · Firebase',
      tags: ['Desktop App', 'Real-time Tracking'],
    },
    {
      title: 'PHOTOGRAPHER PORTFOLIO CMS',
      subtitle: 'Full Stack Web Application',
      link: 'https://black-and-gray-media-uat.vercel.app/',
      image: 'assets/images/photography-portfolio.png',
      coverTitle: 'Admin-Controlled Image & Content Management System',
      technologies: 'Angular · NestJS · MySQL · REST API · Image Upload',
      tags: ['Full Stack', 'CMS', 'Admin Dashboard'],
    },
    {
      title: 'WEATHER APP',
      subtitle: 'Real-time Forecast',
      link: 'https://day-18-weather-app.netlify.app/',
      image: 'assets/images/weeather.png',
      coverTitle: 'Weather Forecasting System',
      technologies: 'OpenWeather API · Geolocation · 5-day Predictions',
      tags: ['Web App', 'Responsive'],
    },
    {
      title: 'CHATBOT',
      subtitle: 'Interactive Chatbot',
      link: 'https://day-16-chatbot.netlify.app/',
      image: 'assets/images/chatbot.png',
      coverTitle: 'Smart Chatbot System',
      technologies: 'Gemini API · Typing Animation · Modern UI',
      tags: ['AI', 'Frontend', 'Dynamic'],
    },
    {
      title: 'QUIZ APP',
      subtitle: 'Interactive Knowledge Tester',
      link: 'https://day-1-quiz-app.netlify.app/',
      image: 'assets/images/quiz.png',
      coverTitle: 'Quiz Application',
      technologies: 'DOM Manipulation · Event Handling · Conditional Logic',
      tags: ['Web App', 'Responsive', 'JavaScript'],
    },
    {
      title: 'Diwali Greeting',
      subtitle: 'Festive Firecracker Animation with Audio',
      link: 'https://day-11-diwali.netlify.app/',
      image: 'assets/images/diwali.png',
      coverTitle: 'Celebrate Diwali with Interactive Fireworks 🎆',
      technologies: 'JavaScript · HTML Audio · CSS Animations',
      tags: ['Festival', 'Diwali', 'Interactive UI', 'Mini Project'],
    },
    {
      title: 'CODE EDITOR',
      subtitle: 'Write & Test Code in Real Time',
      link: 'https://day-3-code-editor.netlify.app/',
      image: 'assets/images/code-editor.png',
      coverTitle: 'Interactive Code Editor',
      technologies: 'HTML · CSS · JavaScript · DOM Manipulation',
      tags: ['JavaScript', 'Code Editor', 'Real-Time', 'Frontend Practice'],
    },
    {
      title: 'MOVIE INFO FINDER',
      subtitle: 'Discover Movie Details Instantly',
      link: 'https://day-12-movie-info-finder.netlify.app/',
      image: 'assets/images/movie-guide.png',
      coverTitle: 'Movie Search Tool',
      technologies: 'OMDB API · Fetch API · Conditional Rendering',
      tags: ['JavaScript', 'API Integration', 'Movies', 'Real-Time Data'],
    },
    {
      title: 'VIRTUAL PIANO',
      subtitle: 'Play Music with JavaScript',
      link: 'https://day-20-pianio.netlify.app/',
      image: 'assets/images/pianio.png',
      coverTitle: 'JavaScript Piano',
      technologies: 'DOM Manipulation · Event Handling · Audio Integration',
      tags: ['JavaScript', 'Music', 'Interactive', 'Mini-Project'],
    },
    {
      title: 'To-Do List',
      subtitle: 'Track Your Daily Tasks',
      link: 'https://lnkd.in/dQrvAnnM',
      image: 'assets/images/todo-list.png',
      coverTitle: 'Task Management App',
      technologies: 'Local Storage · DOM Manipulation · Event Handling',
      tags: ['JavaScript', 'Productivity', 'Beginner Project', 'To-Do'],
    },
    {
      title: 'CSS Changer App',
      subtitle: 'Live Style Customizer',
      link: 'assets/images/css-changer.png',
      image: 'assets/images/css-changer.png',
      coverTitle: 'Dynamic CSS Editor',
      technologies: 'DOM Manipulation · Event Handling · CSS Variables',
      tags: ['JavaScript', 'Styling', 'Interactive', 'UI Enhancer'],
    },
    {
      title: 'Form Validator',
      subtitle: 'Client-Side Input Validation',
      link: 'https://day-4-form-validation.netlify.app/',
      image: 'assets/images/form-validation.png',
      coverTitle: 'JavaScript Form Validation',
      technologies: 'Regex · DOM Manipulation · Event Listeners',
      tags: ['JavaScript', 'Validation', 'Form', 'Regex'],
    },
    {
      title: 'Custom Cursor',
      subtitle: 'Animated Mouse Tracker',
      link: 'https://lnkd.in/dx86zN4z',
      image: 'assets/images/custom-cursor.png',
      coverTitle: 'Interactive Cursor Animation',
      technologies: 'JavaScript · CSS Animations · DOM Events',
      tags: ['UI Effects', 'JavaScript', 'Animation', 'Mini Project'],
    },
    {
      title: 'Accordion',
      subtitle: 'JavaScript Concepts Explained',
      link: 'https://lnkd.in/duM5mwUi',
      image: 'assets/images/accordion.png',
      coverTitle: 'Interactive Accordion for JS Topics',
      technologies: 'JavaScript · CSS Transitions · Event Delegation',
      tags: ['UI Component', 'JavaScript', 'Accordion', 'Mini Project'],
    },
    {
      title: 'Auto-Typing Effect',
      subtitle: 'Dynamic Role Display Animation',
      link: 'https://day-13-auto-typing.netlify.app/',
      image: 'assets/images/auto-typing.png',
      coverTitle: 'Type. Delete. Repeat. 🚀',
      technologies: 'JavaScript · CSS Animations · setInterval()',
      tags: ['Portfolio', 'Typing Effect', 'Mini Project', 'UI Animation'],
    },
    {
      title: 'Music Player 🎶',
      subtitle: 'Interactive Audio Player with Dynamic Song',
      link: 'https://day-14-music-player.netlify.app/',
      image: 'assets/images/music-player.png',
      coverTitle: 'Play, Pause, Repeat. 🎧',
      technologies: 'JavaScript · HTML5 Audio API · CSS · DOM Manipulation',
      tags: ['Audio Player', 'Media', 'UI Interaction', 'JavaScript Projects'],
    },
    {
      title: 'News App 📰',
      subtitle: 'Live News Feed with Search and Dark Mode',
      link: 'https://www.linkedin.com/posts/abhijeet-mohite-768829220_day15-20day-javascript-activity-7259212348995846145-axRR?utm_source=share&utm_medium=member_desktop&rcm=ACoAADemwwABVidkEP8cyZ1rRXbGIZJuaYZtaLs',
      image: 'assets/images/news-app.png',
      coverTitle: 'Stay Updated in Real-Time 🗞️',
      technologies:
        'JavaScript · Fetch API · Async/Await · JSON · CSS · DOM Manipulation',
      tags: [
        'News API',
        'Live Data',
        'Search Feature',
        'Dark Mode',
        'JavaScript Projects',
      ],
    },
    {
      title: 'Random Joke Generator 🤣',
      subtitle: 'Laugh with a Click!',
      link: 'https://day-17-jokes-generator.netlify.app/',
      image: 'assets/images/joke-generator.png',
      coverTitle: 'Fresh Jokes Every Time!',
      technologies:
        'JavaScript · Fetch API · DOM Manipulation · Error Handling',
      tags: ['API Integration', 'Fun Projects', 'Joke API', 'Social Sharing'],
    },
    {
      title: 'Dictionary App 📚',
      subtitle: 'Learn Words with Meaning & Audio',
      link: 'https://day-19-dictionary.netlify.app/', // Replace with actual project link
      image: 'assets/images/dictionary-app.png',
      coverTitle: 'Define, Learn, Listen!',
      technologies:
        'JavaScript · Dictionary API · Audio Playback · DOM Manipulation',
      tags: [
        'Educational',
        'API Integration',
        'Search Functionality',
        'Pronunciation',
      ],
    },
  ];

  get visibleProjects() {
    return this.showAll ? this.allProjects : this.allProjects.slice(0, 3);
  }

  toggleProjects() {
    this.showAll = !this.showAll;
  }
}
