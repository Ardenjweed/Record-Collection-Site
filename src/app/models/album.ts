export interface Album {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  coverUrl: string;
  compilation: boolean;
  gift: boolean;
  label?: string;
  notes?: string;
}