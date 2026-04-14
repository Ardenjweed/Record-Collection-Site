import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SpotifyTrack {
  trackNumber: number;
  name: string;
  duration: string;
}

export interface SpotifyAlbum {
  title: string;
  artist: string;
  year: string;
  totalTracks: number;
  totalDuration: string;
  tracks: SpotifyTrack[];
}

@Injectable({ providedIn: 'root' })
export class SpotifyService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async getAlbumDetails(artist: string, title: string): Promise<SpotifyAlbum | null> {
    try {
      return await firstValueFrom(
        this.http.get<SpotifyAlbum>(`${this.baseUrl}/api/spotify/album`, {
          params: { artist, title }
        })
      );
    } catch {
      return null;
    }
  }
}