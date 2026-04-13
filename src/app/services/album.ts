import { Injectable, signal, computed } from '@angular/core';
import type { Album } from '../models/album';
import { ALBUMS } from '../data/albums.data';

export type DisplaySize = 'large' | 'medium' | 'small';
export type SortOrder = 'asc' | 'desc';

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = (((g - b) / delta) % 6) * 60;
    else if (max === g) h = ((b - r) / delta + 2) * 60;
    else h = ((r - g) / delta + 4) * 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

const ACHROMATIC_THRESHOLD = 0.15;

function colorSortKey(hex: string): number {
  const { h, s, l } = hexToHSL(hex);
  const isAchromatic = s < ACHROMATIC_THRESHOLD;

  if (isAchromatic) {
    // We want white (high L) to have a smaller key than black (low L)
    // so that in a list, white comes first, then grey, then black.
    // 10000 is our "offset" to push these after all chromatic colors.
    return -(10000 + (1 - l)); 
  }

  // Chromatic: sort by hue (0-360)
  return h;
}

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private albums: Album[] = ALBUMS;

  readonly sortField = signal<keyof Album>('title');
  readonly sortOrder = signal<SortOrder>('desc');
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
    const order = this.sortOrder();

    const sorted = list.sort((a, b) => {
      if (field === 'year') {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        if (a.day !== b.day) return a.day - b.day;
        return a.artist.localeCompare(b.artist);
      }

      if (field === 'color') {
        return colorSortKey(a.color) - colorSortKey(b.color);
      }

      const aVal = String(a[field] ?? '');
      const bVal = String(b[field] ?? '');

      const primary = aVal.localeCompare(bVal);
      if (primary !== 0) return primary;

      if (field !== 'artist') {
        return a.artist.localeCompare(b.artist);
      }

      return 0;
    });

    return order === 'desc' ? sorted : [...sorted].reverse();
  });

  get genres(): string[] {
    return [...new Set(this.albums.map(a => a.genre))];
  }
}