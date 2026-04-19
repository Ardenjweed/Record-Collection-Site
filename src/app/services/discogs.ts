import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


export interface DiscogsTrack {
  trackNumber: number;
  name: string;
  duration: string;
}

export interface DiscogsAlbum {
  title: string;
  artist: string;
  year: string;
  totalTracks: number;
  totalDuration: string;
  tracks: DiscogsTrack[];
}

@Injectable({ providedIn: 'root' })
export class DiscogsService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  async getAlbumDetailsById(
    discogsId: number,
    discogsType: 'release' | 'master' = 'release'
  ): Promise<DiscogsAlbum | null> {
    try {
      return await firstValueFrom(
        this.http.get<DiscogsAlbum>(`${this.baseUrl}/api/discogs/album-by-id`, {
          params: {
            discogsId,
            discogsType,
          }
        })
      );
    } catch (err) {
      // console.error('Discogs request failed:', err);
      throw err;
    }
  }
}