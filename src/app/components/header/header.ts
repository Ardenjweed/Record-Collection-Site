import { Component, inject, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AlbumService } from '../../services/album';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  albumService = inject(AlbumService);
  audioService = inject(AudioService);
  sidebarOpen = signal<boolean>(false);

  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.audioService.setVolume(value / 100);
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}