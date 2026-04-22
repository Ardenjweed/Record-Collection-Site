import { Component, inject, computed, signal } from '@angular/core';
import { AlbumService } from '../../services/album';
import { AudioService } from '../../services/audio';
import { DiscogsService, DiscogsAlbum } from '../../services/discogs';
import { DeezerService } from '../../services/deezer';
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
  audioService = inject(AudioService);
  deezerService = inject(DeezerService);

  selectedAlbum = signal<Album | null>(null);
  showDetails = signal<boolean>(false);
  discogsData = signal<DiscogsAlbum | null>(null);
  loadingDiscogs = signal<boolean>(false);
  playingTrackKey = signal<string | null>(null);
  trackPreviews = signal<Map<string, string | null>>(new Map());
  loadingPreviews = signal<boolean>(false);

  async openAlbum(album: Album) {
    this.selectedAlbum.set(album);
    this.showDetails.set(false);
    this.discogsData.set(null);
    this.trackPreviews.set(new Map());
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

        // Pre-fetch previews after tracklist loads
        if (data?.tracks?.length) {
          this.loadingPreviews.set(true);
          const artist = data.artist || album.artist;
          const previews = await this.deezerService.prefetchAlbumPreviews(artist, data.tracks);
          this.trackPreviews.set(previews);
          this.loadingPreviews.set(false);
        }
      }
    }
  }

  closeOverlay() {
    this.selectedAlbum.set(null);
    this.showDetails.set(false);
    this.discogsData.set(null);
    this.trackPreviews.set(new Map());
  }

  playPreview(track: any) {
    const artist = this.discogsData()?.artist || this.selectedAlbum()!.artist;
    const key = `${artist}-${track.name}`;

    if (this.playingTrackKey() === key && this.audioService.isPlaying()) {
      this.audioService.pause();
      return;
    }

    const previewUrl = this.trackPreviews().get(track.name);
    if (!previewUrl) return;

    this.playingTrackKey.set(key);
    this.audioService.toggle(previewUrl);

    this.audioService.audio.addEventListener('ended', () => {
      this.playingTrackKey.set(null);
    }, { once: true });
  }

  colSize = computed(() => {
    const size = this.albumService.displaySize();
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return size === 'small' ? 'calc(50% - 8px)' : '90vw';
    }

    const sizes = { large: '350px', medium: '250px', small: '150px' };
    return sizes[size];
  });
}