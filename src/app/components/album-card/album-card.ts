import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Album } from '../../models/album';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './album-card.html',
  styleUrl: './album-card.css',
})
export class AlbumCard {
  album = input.required<Album>();
  albumClicked = output<Album>();
}