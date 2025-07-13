import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import init, { greet } from '../../../cgol-rust/pkg'
import { UniverseView } from './universe-view/universe-view';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UniverseView],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  ngOnInit(): void {
    init();
  }

  protected title = 'cgol-web';

  onGreetClick() {
    greet();
  }
}
