import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
