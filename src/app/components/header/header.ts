import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlbumService } from '../../services/album';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSelectModule, MatCheckboxModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  albumService = inject(AlbumService);
}