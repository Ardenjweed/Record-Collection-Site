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
  trackPreviews = signal<Record<string, string | null>>({});
  loadingPreviews = signal<boolean>(false);

  async openAlbum(album: Album) {
    this.selectedAlbum.set(album);
    this.showDetails.set(false);
    this.discogsData.set(null);
    this.trackPreviews.set({});
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

        if (data?.tracks?.length) {
          this.loadingPreviews.set(true);
          const artist = data.artist || album.artist;
          console.log('Fetching previews for artist:', artist);
          console.log('Tracks:', data.tracks.map(t => t.name));

          const previews = await this.deezerService.prefetchAlbumPreviews(artist, data.tracks);
          console.log('Previews map:', Object.fromEntries(previews));

          const previewsObj: Record<string, string | null> = {};
          previews.forEach((url, name) => {
            previewsObj[name] = url;
          });

          console.log('Preview object being set:', previewsObj);
          this.trackPreviews.set(previewsObj);
          console.log('trackPreviews signal after set:', this.trackPreviews());
          this.loadingPreviews.set(false);
        }
      }
    }
  }

  playPreview(track: any) {
    const artist = this.discogsData()?.artist || this.selectedAlbum()!.artist;
    const key = `${artist}-${track.name}`;
    console.log('playPreview called for:', track.name);
    console.log('trackPreviews current value:', this.trackPreviews());
    console.log('preview URL for track:', this.trackPreviews()[track.name]);

    if (this.playingTrackKey() === key && this.audioService.isPlaying()) {
      this.audioService.pause();
      return;
    }

    const previewUrl = this.trackPreviews()[track.name];
    console.log('previewUrl:', previewUrl);
    if (!previewUrl) return;

    this.playingTrackKey.set(key);
    this.audioService.toggle(previewUrl);

    this.audioService.audio.addEventListener('ended', () => {
      this.playingTrackKey.set(null);
    }, { once: true });
  }
  
  closeOverlay() {
    this.selectedAlbum.set(null);
    this.showDetails.set(false);
    this.discogsData.set(null);
    this.trackPreviews.set({});
  }

  colSize = computed(() => {
    const sizes = { large: '350px', medium: '250px', small: '150px' };
    return sizes[this.albumService.displaySize()];
  });
}