import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class DeezerService {
  private cache = new Map<string, string | null>();
  private baseUrl = environment.apiBaseUrl;


  async getPreviewUrl(artist: string, track: string): Promise<string | null> {
    const key = `${artist}-${track}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    try {
      const url = `${this.baseUrl}/api/deezer/preview?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`;
      console.log('Fetching preview URL:', url);

      const res = await fetch(url);
      console.log('Deezer response status:', res.status);

      const data = await res.json();
      console.log('Deezer response data:', data);

      const previewUrl = data.preview ?? null;
      this.cache.set(key, previewUrl);
      return previewUrl;
    } catch (err) {
      console.error('Deezer fetch error:', err);
      this.cache.set(key, null);
      return null;
    }
  }

  // Pre-fetch all tracks for an album, returns a map of trackName -> previewUrl | null
  async prefetchAlbumPreviews(artist: string, tracks: { name: string }[]): Promise<Map<string, string | null>> {
    const results = await Promise.all(
      tracks.map(async t => {
        const url = await this.getPreviewUrl(artist, t.name);
        return [t.name, url] as [string, string | null];
      })
    );
    return new Map(results);
  }
}