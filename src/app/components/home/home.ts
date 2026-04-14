import { Component, inject, computed, signal } from '@angular/core';
import { AlbumService } from '../../services/album';
import { SpotifyService, SpotifyAlbum } from '../../services/spotify';
import { AlbumCard } from '../album-card/album-card';
import { Album } from '../../models/album';
import { TRACKLIST_OVERRIDES } from '../../data/tracklists.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AlbumCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  albumService = inject(AlbumService);
  spotifyService = inject(SpotifyService);

  selectedAlbum = signal<Album | null>(null);
  showDetails = signal<boolean>(false);
  spotifyData = signal<SpotifyAlbum | null>(null);
  loadingSpotify = signal<boolean>(false);

  async openAlbum(album: Album) {
    this.selectedAlbum.set(album);
    this.showDetails.set(false);
    this.spotifyData.set(null);
  }

  async toggleDetails() {
    const show = !this.showDetails();
    this.showDetails.set(show);

    if (show && !this.spotifyData()) {
      const album = this.selectedAlbum()!;
      const overrideKey = `${album.artist}|||${album.title}`;
      const override = TRACKLIST_OVERRIDES[overrideKey];

      if (override) {
        this.spotifyData.set({
          title: album.title,
          artist: album.artist,
          year: String(album.year),
          totalTracks: override.tracks.length,
          totalDuration: override.totalDuration,
          tracks: override.tracks,
        });
      } else {
        this.loadingSpotify.set(true);
        const data = await this.spotifyService.getAlbumDetails(album.artist, album.title);
        this.spotifyData.set(data);
        this.loadingSpotify.set(false);
      }
    }
  }

  closeOverlay() {
    this.selectedAlbum.set(null);
    this.showDetails.set(false);
    this.spotifyData.set(null);
  }

  colSize = computed(() => {
    const sizes = { large: '350px', medium: '250px', small: '150px' };
    return sizes[this.albumService.displaySize()];
  });
}