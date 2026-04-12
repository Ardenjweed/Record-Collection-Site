import { TestBed } from '@angular/core/testing';
import { AlbumService } from './album';

describe('AlbumService', () => {
  let service: AlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return albums when no genre filter is set', () => {
    service.filterGenre.set('');
    expect(service.filtered().length).toBeGreaterThan(0);
  });

  it('should filter albums by genre', () => {
    service.filterGenre.set('Rock');
    const results = service.filtered();
    expect(results.every(a => a.genre === 'Rock')).toBe(true);
  });

  it('should sort albums by title', () => {
    service.sortField.set('title');
    const titles = service.filtered().map(a => a.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it('should secondary sort by artist when sorting by genre', () => {
    service.sortField.set('genre');
    const results = service.filtered();
    const rockAlbums = results.filter(a => a.genre === 'Rock').map(a => a.artist);
    expect(rockAlbums).toEqual([...rockAlbums].sort((a, b) => a.localeCompare(b)));
  });
});