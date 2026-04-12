import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Home, Header],
  template: `
    <app-header></app-header>
    <app-home></app-home>
  `,
  styles: [`
  app-home {
    display: block;
    margin-top: 24px;
  }
`],
})
export class App {
  protected readonly title = signal('record-collection');
}
