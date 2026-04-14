export interface TrackOverride {
  trackNumber: number;
  name: string;
  duration: string;
}

export interface AlbumOverride {
  totalDuration: string;
  tracks: TrackOverride[];
}

// Key is "artist|||title" to avoid any ambiguity
export const TRACKLIST_OVERRIDES: Record<string, AlbumOverride> = {
  'The Seatbelts|||Cowboy Bebop OST': {
    totalDuration: '1:16:19',
    tracks: [
      { trackNumber: 1, name: 'Tank!', duration: '3:30' },
      { trackNumber: 2, name: 'Rush', duration: '3:34' },
      { trackNumber: 3, name: 'Spokey Dokey', duration: '4:05' },
      { trackNumber: 4, name: 'Bad Dog No Biscuits', duration: '4:10' },
      { trackNumber: 5, name: 'Cat Blues', duration: '2:37' },
      { trackNumber: 6, name: 'Cosmos', duration: '1:37' },
      { trackNumber: 7, name: 'Space Lion', duration: '7:11' },
      { trackNumber: 8, name: 'Waltz for Zizi', duration: '3:29' },
      { trackNumber: 9, name: 'Piano Black', duration: '2:47' },
      { trackNumber: 10, name: 'Pot City', duration: '2:14' },
      { trackNumber: 11, name: 'Too Good Too Bad', duration: '2:34' },
      { trackNumber: 12, name: 'Car 24', duration: '2:49' },
      { trackNumber: 13, name: 'The Egg and I', duration: '2:42' },
      { trackNumber: 14, name: 'Felt Tip Pen', duration: '2:42' },
      { trackNumber: 15, name: 'Rain', duration: '3:23' },
      { trackNumber: 16, name: 'Digging My Potato', duration: '2:24' },
      { trackNumber: 17, name: 'Memory', duration: '1:31' },
      { trackNumber: 18, name: 'What Planet Is This?!', duration: '4:31' },
      { trackNumber: 19, name: 'Diamonds', duration: '4:01' },
      { trackNumber: 20, name: 'Mushroom Hunting', duration: '3:19' },
      { trackNumber: 21, name: "Einstein Groovin'", duration: '6:19' },
      { trackNumber: 22, name: 'Pearls', duration: '4:44' },
    ]
  }
};