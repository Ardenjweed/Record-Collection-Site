import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './home/home';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Header],
  template: `
    <app-header></app-header>
    <app-home></app-home>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('record-collection');
}
