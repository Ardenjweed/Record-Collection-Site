export interface Album {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  month: number;
  day: number;
  coverUrl: string;
  color: string;
  compilation: boolean;
  gift: boolean;
  soundtrack: boolean;
  spotifyArtist?: string;
  discogsId?: number;
  discogsType?: 'release' | 'master'; 
}