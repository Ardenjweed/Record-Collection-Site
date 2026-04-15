import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AlbumService } from '../../services/album';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSelectModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  albumService = inject(AlbumService);
}