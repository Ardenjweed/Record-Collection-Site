import { Component, signal, inject, OnInit } from '@angular/core';
import { Home } from './components/home/home';
import { Header } from './components/header/header';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog';

@Component({
  selector: 'app-root',
  imports: [Home, Header, MatDialogModule],
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
export class App implements OnInit {
  protected readonly title = signal('record-collection');
  dialog = inject(MatDialog);

  ngOnInit() {
    this.dialog.open(WelcomeDialogComponent, {
      width: '480px',
    });
  }
}