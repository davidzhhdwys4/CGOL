import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import init, { greet } from '../../../cgol-rust/pkg'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
