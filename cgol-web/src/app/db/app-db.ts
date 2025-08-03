import { Injectable } from '@angular/core';
import Dexie, { type EntityTable } from 'dexie';
import { GameModel } from './game-model';

@Injectable({
  providedIn: 'root'
})
export class AppDB extends Dexie {

  games!: EntityTable<GameModel, 'id'>;

  constructor() {
    super('CgolDB');

    this.version(1).stores({
      games: '++id, name'
    });

    this.games.mapToClass(GameModel);
  }
}
