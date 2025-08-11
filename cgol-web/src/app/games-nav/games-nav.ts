import { Component, inject, signal, WritableSignal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { AppDB } from '../db/app-db';
import { GameModel } from '../db/game-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-nav',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './games-nav.html',
  styleUrl: './games-nav.css'
})
export class GamesNav {

  private readonly dbContext = inject(AppDB);
  private readonly router = inject(Router);
  private readonly maxGamesPerPage = 10;

  private imgUrlMap = new Map<number, string>();

  protected games: WritableSignal<GameModel[]> = signal([]);


  async ngAfterContentInit(): Promise<void> {
    await this.loadGames();
  }

  protected getImageUrl(game: GameModel): string {
    if (!game.id) {
      throw new Error('Game does not exist in the database.');
    }

    if (!this.imgUrlMap.has(game.id)) {
      const imgBlob = new Blob([game.data], { type: 'image/png' });
      const url = URL.createObjectURL(imgBlob);
      this.imgUrlMap.set(game.id, url);
    }

    return this.imgUrlMap.get(game.id)!;
  }

  protected playGame(game: GameModel): void {
    if (!game.id) return;
    this.router.navigate(['/new', game.id]);
  }

  private async loadGames(): Promise<void> {
    const tmp = await this.dbContext.games.limit(this.maxGamesPerPage).toArray();
    this.games.set(tmp);
    this.imgUrlMap = new Map<number, string>();
  }
}
