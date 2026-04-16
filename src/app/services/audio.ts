import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  audio = new Audio();

  currentSrc = signal<string | null>(null);
  isPlaying = signal(false);

  constructor() {
    this.audio.volume = 0.2;

    this.audio.onended = () => {
      this.isPlaying.set(false);
    };
  }

  play(src: string) {
    if (this.currentSrc() !== src) {
      this.audio.src = src;
      this.currentSrc.set(src);
    }

    this.audio.play();
    this.isPlaying.set(true);
  }

  pause() {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  toggle(src: string) {
    if (this.currentSrc() === src && this.isPlaying()) {
      this.pause();
    } else {
      this.play(src);
    }
  }

  setVolume(value: number) {
    this.audio.volume = value;
  }
}