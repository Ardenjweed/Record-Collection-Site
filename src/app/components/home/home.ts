import { Component, inject, computed, signal } from '@angular/core';
import { AlbumService } from '../../services/album';
import { AlbumCard } from '../album-card/album-card';
import { Album } from '../../models/album';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlbumCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  albumService = inject(AlbumService);
  selectedAlbum = signal<Album | null>(null);

  colSize = computed(() => {
    const sizes = { large: '350px', medium: '250px', small: '150px' };
    return sizes[this.albumService.displaySize()];
  });
}