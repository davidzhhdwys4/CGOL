import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-universe-view',
  imports: [MatGridListModule],
  templateUrl: './universe-view.html',
  styleUrl: './universe-view.css'
})
export class UniverseView {
  cells: boolean[] = [];

  constructor() {
    // Initialize the cells array with a default size
    this.cells = Array.from({ length: 100 }, () => Math.random() < 0.5);
  }
}
