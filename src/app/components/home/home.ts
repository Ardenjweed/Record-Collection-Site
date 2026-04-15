import { Component, inject, computed, signal } from '@angular/core';
import { AlbumService } from '../../services/album';
import { DiscogsService, DiscogsAlbum } from '../../services/discogs';
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
  discogsService = inject(DiscogsService);

  selectedAlbum = signal<Album | null>(null);
  showDetails = signal<boolean>(false);
  discogsData = signal<DiscogsAlbum | null>(null);
  loadingDiscogs = signal<boolean>(false);

  

  async openAlbum(album: Album) {
    this.selectedAlbum.set(album);
    this.showDetails.set(false);
    this.discogsData.set(null);
  }

  async toggleDetails() {
    const show = !this.showDetails();
    this.showDetails.set(show);

    if (show && !this.discogsData()) {
      const album = this.selectedAlbum()!;

      if (album.discogsId) {
        this.loadingDiscogs.set(true);

        const data = await this.discogsService.getAlbumDetailsById(
          album.discogsId,
          album.discogsType ?? 'release'
        );

        this.discogsData.set(data);
        this.loadingDiscogs.set(false);
      } else {
        this.discogsData.set(null);
      }
    }
  }

  closeOverlay() {
    this.selectedAlbum.set(null);
    this.showDetails.set(false);
    this.discogsData.set(null);
  }

  colSize = computed(() => {
    const sizes = { large: '350px', medium: '250px', small: '150px' };
    return sizes[this.albumService.displaySize()];
  });
}

