import { Injectable, signal, computed } from '@angular/core';
import type { Album } from '../models/album';
import { ALBUMS } from '../data/albums.data';

export type DisplaySize = 'large' | 'medium' | 'small';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private albums: Album[] = ALBUMS;

  readonly sortField = signal<keyof Album>('title');
  readonly filterGenre = signal<string>('');
  readonly displaySize = signal<DisplaySize>('large');
  readonly showCompilations = signal<boolean>(false);
  readonly showGifted = signal<boolean>(true);

  readonly showSoundtracks = signal<boolean>(true);

readonly filtered = computed(() => {
  let list = [...this.albums];

  if (this.filterGenre()) {
    list = list.filter(a => a.genre === this.filterGenre());
  }

  if (!this.showCompilations()) {
    list = list.filter(a => !a.compilation);
  }

  if (!this.showGifted()) {
    list = list.filter(a => !a.gift);
  }

  if (!this.showSoundtracks()) {
    list = list.filter(a => !a.soundtrack);
  }

  const field = this.sortField();

  return list.sort((a, b) => {
    const aVal = a[field] ?? '';
    const bVal = b[field] ?? '';

    return aVal > bVal ? 1 : -1;
  });
});

  get genres(): string[] {
    return [...new Set(this.albums.map(a => a.genre))];
  }
}