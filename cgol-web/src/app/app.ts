import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UniverseView } from './universe-view/universe-view';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UniverseView],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'cgol-web';
}
